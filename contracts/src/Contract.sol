// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';

contract Contract is ERC20, Ownable {
  using ByteHasher for bytes;

  // ===== World ID =====
  IWorldID public immutable worldId; // World ID Router
  uint256 public constant GROUP_ID = 1; // Orb group
  bytes32 private immutable appIdBytes; // packed AppID (as bytes)
  bytes32 private immutable actionIdBytes; // packed ActionID (as bytes)

  // ===== Claim Logic =====
  uint256 public constant EPOCH_SECONDS = 15 minutes;
  uint256 public mintAmount = 1 ether; // 1.0 token (18 decimals)
  mapping(uint256 => bool) public nullifierUsed; // prevents proof reuse (per nullifier)
  mapping(address => uint256) public lastClaimAt; // cooldown per address

  // ===== Events & Errors =====
  event Verified(uint256 nullifierHash, uint256 epoch);
  event Claimed(address indexed account, uint256 amount, uint256 epoch);

  error DuplicateNullifier(uint256 nullifierHash);
  error CooldownActive(uint256 nextAllowed);
  error EpochOutOfWindow(uint256 provided, uint256 expected);

  /**
   * @param _worldId   World ID Router (chain-specific address)
   * @param _appId     Worldcoin AppID (e.g. "app_..."), as UTF-8 string
   * @param _actionId  ActionID (e.g. "claim_token"), as UTF-8 string
   */
  constructor(IWorldID _worldId, string memory _appId, string memory _actionId) ERC20('MyClaimToken', 'MYC') {
    worldId = _worldId;
    // We store AppID/ActionID as bytes32 (hashed/compact form),
    // then use them deterministically together with the epoch.
    appIdBytes = keccak256(abi.encodePacked(_appId));
    actionIdBytes = keccak256(abi.encodePacked(_actionId));

    // optional: initial distribution to the owner (for testing)
    _mint(msg.sender, 1000 ether);
  }

  /**
   * @notice Claim with World ID proof (verified on-chain) + 15-minute cooldown
   * @param signal         typically msg.sender (wallet), will be hashed
   * @param root           World ID Merkle root
   * @param nullifierHash  Nullifier hash (for this proof)
   * @param proof          ZK-proof (uint256[8])
   * @param epoch          Time slot = floor(now / 900) in seconds (calculated by client)
   *
   * Flow:
   *  1) check epoch (must match currentEpoch)
   *  2) verifyProof(...) against the external nullifier of this slot
   *  3) protect against replay using the nullifier
   *  4) enforce 15-minute cooldown per address
   *  5) Mint mintAmount to msg.sender
   */
  function claimToken(
    address signal,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof,
    uint256 epoch
  ) external {
    // (1) epoch must match the current slot so that proof & EN line up
    uint256 expected = currentEpoch();
    if (epoch != expected) {
      revert EpochOutOfWindow(epoch, expected);
    }

    // (2) External nullifier deterministically derived from (AppID, ActionID, epoch)
    //     Client (IDKit) must construct the proof using the same scheme.
    uint256 externalNullifier = _externalNullifierForEpoch(epoch);

    // (3) Prevent nullifier reuse
    if (nullifierUsed[nullifierHash]) revert DuplicateNullifier(nullifierHash);

    // (4) Verify World ID proof (reverts if invalid)
    worldId.verifyProof(
      root,
      GROUP_ID,
      abi.encodePacked(signal).hashToField(),
      nullifierHash,
      externalNullifier,
      proof
    );

    // (5) Mark nullifier
    nullifierUsed[nullifierHash] = true;
    emit Verified(nullifierHash, epoch);

    // (6) Cooldown per address (15 minutes)
    uint256 last = lastClaimAt[msg.sender];
    if (block.timestamp < last + EPOCH_SECONDS) {
      revert CooldownActive(last + EPOCH_SECONDS);
    }
    lastClaimAt[msg.sender] = block.timestamp;

    // (7) Mint
    _mint(msg.sender, mintAmount);
    emit Claimed(msg.sender, mintAmount, epoch);
  }

  /**
   * @dev Calculate the current epoch ID (slot of 15 minutes).
   */
  function currentEpoch() public view returns (uint256) {
    return block.timestamp / EPOCH_SECONDS;
  }

  /**
   * @dev External nullifier hash (field) for a given epoch.
   *      Mirrors the client-side construction:
   *      EN = H( H(appId) || H(actionId) || epoch )  --> .hashToField()
   */
  function _externalNullifierForEpoch(uint256 epoch) internal pure returns (uint256) {
    // We build a stable bytes blob and map it into the field:
    bytes memory blob = abi.encodePacked(
      keccak256(abi.encodePacked('APP')), // Namespacing (optional)
      keccak256(abi.encodePacked('ACT')), // "
      epoch
    );
    // Note: At runtime we replace "APP"/"ACT" with the stored bytes32 values.
    // (see next overload)
    return blob.hashToField();
  }

  /**
   * @dev Overload with actual stored IDs; separate so the pure version above stays readable.
   */
  function _externalNullifierForEpoch(
    uint256 epoch,
    bytes32 appBytes,
    bytes32 actionBytes
  ) internal pure returns (uint256) {
    bytes memory blob = abi.encodePacked(appBytes, actionBytes, epoch);
    return blob.hashToField();
  }

  // We override the version we actually use, which includes the stored IDs.
  function _externalNullifierForEpoch(uint256 epoch) internal view returns (uint256) {
    return _externalNullifierForEpoch(epoch, appIdBytes, actionIdBytes);
  }

  // ===== Admin =====

  function setMintAmount(uint256 newAmount) external onlyOwner {
    mintAmount = newAmount;
  }
}
