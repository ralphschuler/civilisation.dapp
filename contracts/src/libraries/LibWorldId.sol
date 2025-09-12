// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IWorldID} from "../interfaces/IWorldID.sol";

/// @title WorldIdLib
/// @notice Wiederverwendbare Library für WorldID-Verification in Diamonds oder Contracts
library LibWorldId {
    bytes32 internal constant STORAGE_SLOT =
        keccak256("diamond.storage.worldid");

    struct Layout {
        IWorldID worldId; // WorldID Router Contract
        uint256 groupId; // e.g. 1 for Orb-verified humans
        string appId; // deine App ID aus dem Developer Portal
        string actionId; // deine Action ID
        mapping(uint256 => bool) nullifierHashes; // zum Schutz vor Replay-Angriffen
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    /// @notice setzt Konfiguration für WorldID
    function configure(
        IWorldID worldId_,
        uint256 groupId_,
        string memory appId_,
        string memory actionId_
    ) internal {
        Layout storage l = layout();
        l.worldId = worldId_;
        l.groupId = groupId_;
        l.appId = appId_;
        l.actionId = actionId_;
    }

    /// @notice Verifiziert einen WorldID Proof und markiert den Nullifier als benutzt
    function verifyAndConsume(
        uint256 root,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) internal {
        Layout storage l = layout();

        require(
            !l.nullifierHashes[nullifierHash],
            "WorldID: nullifier already used"
        );

        l.worldId.verifyProof(
            root,
            l.groupId,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        l.nullifierHashes[nullifierHash] = true;
    }

    /// @notice Check ob ein Nullifier bereits benutzt wurde
    function isNullifierUsed(
        uint256 nullifierHash
    ) internal view returns (bool) {
        return layout().nullifierHashes[nullifierHash];
    }
}
