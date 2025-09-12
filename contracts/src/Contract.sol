// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";

/// @title WorldID Upgradeable Contract
/// @notice Demonstrates an upgradable WorldID integration
contract Contract is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using ByteHasher for bytes;

    /// @notice Error thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal constant GROUP_ID = 1;

    /// @dev Nullifier hash mapping
    mapping(uint256 => bool) internal nullifierHashes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializer (replaces constructor)
    /// @param _worldId The WorldID instance
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    function initialize(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    /// @notice Verifies a proof and executes logic
    function verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        worldId.verifyProof(
            root,
            GROUP_ID,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifierHash] = true;

        emit Executed(signal);
    }

    /// @notice Example event
    event Executed(address indexed signal);

    /// @dev Required by UUPSUpgradeable
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
