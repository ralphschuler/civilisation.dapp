// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ResourceFacet.sol";
import {LibWorldId} from "../libraries/LibWorldId.sol";
import {ByteHasher} from "../helpers/ByteHasher.sol"; // falls du signals zu field hashen musst

contract GoldFacet is ResourceFacet {
    using LibWorldId for *;

    constructor() ResourceFacet("Gold", "GOLD") {}

    /// @notice Claim mit WorldID-Verification
    function claimWithWorldId(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        // Signal = msg.sender als hashToField
        uint256 signalHash = abi.encodePacked(msg.sender).hashToField();

        // External nullifier kann abgeleitet werden aus AppId+ActionId
        uint256 externalNullifier = abi
            .encodePacked(
                LibWorldId.layout().appId,
                LibWorldId.layout().actionId
            )
            .hashToField();

        // Verify Proof via Lib
        LibWorldId.verifyAndConsume(
            root,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        // Jetzt normal claim ausführen
        super.claim();
    }

    /// @notice Raid mit WorldID Proof
    function raidWithWorldId(
        address target,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        uint256 signalHash = abi.encodePacked(msg.sender).hashToField();
        uint256 externalNullifier = abi
            .encodePacked(
                LibWorldId.layout().appId,
                LibWorldId.layout().actionId
            )
            .hashToField();

        LibWorldId.verifyAndConsume(
            root,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        super.raid(target);
    }

    /// @notice Upgrade mit WorldID Proof
    function startUpgradeWithWorldId(
        uint256 duration,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        uint256 signalHash = abi.encodePacked(msg.sender).hashToField();
        uint256 externalNullifier = abi
            .encodePacked(
                LibWorldId.layout().appId,
                LibWorldId.layout().actionId
            )
            .hashToField();

        LibWorldId.verifyAndConsume(
            root,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        super.startUpgrade(duration);
    }
}
