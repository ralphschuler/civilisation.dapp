// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library ResourceProductionLib {
    bytes32 constant PROD_STORAGE_POSITION =
        keccak256("diamond.resource.production");

    struct Production {
        uint256 ratePerMinute; // Menge pro Minute
        uint256 claimLimit; // Maximaler Claim
        uint256 lastClaim; // Timestamp des letzten Claims
        uint256 upgradeEndsAt; // Zeit bis Upgrade fertig ist
        uint256 level; // Upgrade-Level
    }

    struct ProductionStorage {
        mapping(address => mapping(uint256 => Production)) productions;
        // player => resourceId => Production
    }

    function s() internal pure returns (ProductionStorage storage ps) {
        bytes32 pos = PROD_STORAGE_POSITION;
        assembly {
            ps.slot := pos
        }
    }

    function pending(
        address player,
        uint256 resourceId
    ) internal view returns (uint256) {
        Production storage p = s().productions[player][resourceId];
        if (p.lastClaim == 0 || block.timestamp <= p.lastClaim) return 0;
        if (block.timestamp < p.upgradeEndsAt) return 0; // während Upgrade nichts

        uint256 minutesPassed = (block.timestamp - p.lastClaim) / 60;
        uint256 amount = minutesPassed * p.ratePerMinute;
        if (amount > p.claimLimit) {
            amount = p.claimLimit;
        }
        return amount;
    }

    function _applyClaim(
        address player,
        uint256 resourceId
    ) internal returns (uint256 amount) {
        amount = pending(player, resourceId);
        if (amount > 0) {
            s().productions[player][resourceId].lastClaim = block.timestamp;
        }
    }
}
