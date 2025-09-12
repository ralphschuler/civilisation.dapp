// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibResource {
    bytes32 internal constant STORAGE_SLOT =
        keccak256("diamond.storage.resource");

    struct Player {
        uint256 level;
        uint256 lastClaim;
        uint256 upgradingUntil;
        uint256 unclaimed;
        uint256 lastRaid;
    }

    struct Layout {
        uint256 baseRatePerMinute;
        uint256 baseClaimLimit;
        uint256 baseUpgradeCost;
        uint256 ratePerMinuteModifier; // Multiplikator (100 = 1x)
        uint256 claimLimitModifier; // Multiplikator
        uint256 upgradeCostModifier; // Multiplikator
        mapping(address => Player) players;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    function effectiveRate(Layout storage ds) internal view returns (uint256) {
        return (ds.baseRatePerMinute * ds.ratePerMinuteModifier) / 100;
    }

    function effectiveClaimLimit(
        Layout storage ds
    ) internal view returns (uint256) {
        return (ds.baseClaimLimit * ds.claimLimitModifier) / 100;
    }

    function effectiveUpgradeCost(
        Layout storage ds,
        uint256 level
    ) internal view returns (uint256) {
        return
            ((ds.baseUpgradeCost * (level + 1)) * ds.upgradeCostModifier) / 100;
    }

    function pending(address user) internal view returns (uint256) {
        Layout storage ds = layout();
        Player storage p = ds.players[user];
        if (block.timestamp < p.upgradingUntil) {
            return p.unclaimed;
        }
        uint256 elapsed = block.timestamp - p.lastClaim;
        uint256 generated = (elapsed / 60) * (effectiveRate(ds) * p.level);
        return p.unclaimed + generated;
    }

    function updateUnclaimed(address user) internal {
        Layout storage ds = layout();
        Player storage p = ds.players[user];

        if (block.timestamp >= p.upgradingUntil) {
            uint256 elapsed = block.timestamp - p.lastClaim;
            uint256 generated = (elapsed / 60) * (effectiveRate(ds) * p.level);
            p.unclaimed += generated;
        }
        p.lastClaim = block.timestamp;
    }
}
