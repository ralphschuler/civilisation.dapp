// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {StarterPackConfig} from "./StarterPackConfig.sol";
import {ResourcesLib, ResourceIds} from "../Resources/ResourcesLib.sol";

/// @title StarterPackLib
/// @notice Handles minting of starter packs
library StarterPackLib {
    function giveStarterPack(address player) internal {
        require(
            !StarterPackConfig.hasClaimed(player),
            "StarterPack: already claimed"
        );

        (
            uint256 gold,
            uint256 wood,
            uint256 stone,
            uint256 iron
        ) = StarterPackConfig.getStarterPack();

        if (gold > 0) ResourcesLib._mint(player, ResourceIds.GOLD, gold);
        if (wood > 0) ResourcesLib._mint(player, ResourceIds.WOOD, wood);
        if (stone > 0) ResourcesLib._mint(player, ResourceIds.STONE, stone);
        if (iron > 0) ResourcesLib._mint(player, ResourceIds.IRON, iron);

        StarterPackConfig.markClaimed(player);
    }
}
