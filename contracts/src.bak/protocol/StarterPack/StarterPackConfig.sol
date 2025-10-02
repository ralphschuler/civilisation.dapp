// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title StarterPackConfig
/// @notice Stores and manages starter pack amounts for new players
library StarterPackConfig {
    bytes32 constant CONFIG_STORAGE_POSITION =
        keccak256("diamond.starterpack.config");

    struct StarterConfig {
        uint256 goldAmount;
        uint256 woodAmount;
        uint256 stoneAmount;
        uint256 ironAmount;
    }

    struct ConfigStorage {
        StarterConfig config;
        mapping(address => bool) claimed; // track if player already got starter pack
    }

    function s() internal pure returns (ConfigStorage storage cs) {
        bytes32 pos = CONFIG_STORAGE_POSITION;
        assembly {
            cs.slot := pos
        }
    }

    /// @notice Set starter pack values
    function setStarterPack(
        uint256 gold,
        uint256 wood,
        uint256 stone,
        uint256 iron
    ) internal {
        s().config = StarterConfig({
            goldAmount: gold,
            woodAmount: wood,
            stoneAmount: stone,
            ironAmount: iron
        });
    }

    /// @notice Get starter pack values
    function getStarterPack()
        internal
        view
        returns (uint256 gold, uint256 wood, uint256 stone, uint256 iron)
    {
        StarterConfig storage cfg = s().config;
        return (
            cfg.goldAmount,
            cfg.woodAmount,
            cfg.stoneAmount,
            cfg.ironAmount
        );
    }

    /// @notice Mark player as claimed
    function markClaimed(address player) internal {
        s().claimed[player] = true;
    }

    /// @notice Check if player already claimed
    function hasClaimed(address player) internal view returns (bool) {
        return s().claimed[player];
    }
}
