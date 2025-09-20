// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library ResourceProductionConfig {
    bytes32 constant CONFIG_STORAGE_POSITION =
        keccak256("diamond.resource.production.config");

    struct ResourceConfig {
        uint256 baseRatePerMinute; // Basis-Produktion
        uint256 baseClaimLimit; // Basis-Limit pro Claim
        uint256 baseUpgradeCost; // Basis-Kosten (in Gold)
        uint256 rateModifier; // Multiplikator pro Level (z. B. 120 = +20%)
        uint256 limitModifier; // Multiplikator pro Level
        uint256 costModifier; // Multiplikator pro Level
    }

    struct ConfigStorage {
        mapping(uint256 => ResourceConfig) configs; // resourceId => config
    }

    function s() internal pure returns (ConfigStorage storage cs) {
        bytes32 pos = CONFIG_STORAGE_POSITION;
        assembly {
            cs.slot := pos
        }
    }

    /// @notice Setze die Konfiguration für eine Ressource
    function setConfig(
        uint256 resourceId,
        uint256 baseRate,
        uint256 baseLimit,
        uint256 baseCost,
        uint256 rateMod,
        uint256 limitMod,
        uint256 costMod
    ) internal {
        s().configs[resourceId] = ResourceConfig({
            baseRatePerMinute: baseRate,
            baseClaimLimit: baseLimit,
            baseUpgradeCost: baseCost,
            rateModifier: rateMod,
            limitModifier: limitMod,
            costModifier: costMod
        });
    }

    /// @notice Berechne Werte für ein bestimmtes Level
    function valuesAt(
        uint256 resourceId,
        uint256 level
    )
        internal
        view
        returns (uint256 ratePerMinute, uint256 claimLimit, uint256 upgradeCost)
    {
        ResourceConfig storage cfg = s().configs[resourceId];
        require(cfg.baseRatePerMinute > 0, "Config: not set");

        ratePerMinute =
            (cfg.baseRatePerMinute * (cfg.rateModifier ** level)) /
            (100 ** level);
        claimLimit =
            (cfg.baseClaimLimit * (cfg.limitModifier ** level)) /
            (100 ** level);
        upgradeCost =
            (cfg.baseUpgradeCost * (cfg.costModifier ** level)) /
            (100 ** level);
    }
}
