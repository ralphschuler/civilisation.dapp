// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ByteHasher} from "../helpers/ByteHasher.sol";
import {IWorldID} from "../interfaces/IWorldID.sol";

contract WorldIdFacet {
    using ByteHasher for bytes;

    IWorldID internal worldId;
    uint256 internal externalNullifier;
    mapping(uint256 => bool) internal nullifierHashes;
    uint256 internal constant GROUP_ID = 1;

    event Verified(address indexed user);

    function initWorldId(
        address _worldId,
        string memory _appId,
        string memory _actionId
    ) external {
        require(address(worldId) == address(0), "Already initialized");
        worldId = IWorldID(_worldId);
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(!nullifierHashes[nullifierHash], "Invalid nullifier");

        worldId.verifyProof(
            root,
            GROUP_ID,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifierHash] = true;
        emit Verified(signal);
    }
}
