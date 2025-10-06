// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC1155Lib} from "../ERC1155/ERC1155Lib.sol";
import {ResourceGenerationLib} from "./ResourceGenerationLib.sol";

/// @title ResourceGenerationFacet
/// @notice Automatically accrues resources for players that must be collected manually
contract ResourceGenerationFacet {
    // --- Events ---
    event ResourcesGenerated(
        address indexed player,
        uint256 producedPerResource,
        uint256 timestamp
    );
    event ResourceCollected(
        address indexed player,
        uint256 indexed resourceId,
        uint256 amount
    );

    // --- Public Views ---
    function getUncollectedResources(
        address account
    ) external view returns (uint256[] memory uncollected, uint256 secondsUntilNextUnit) {
        ResourceGenerationLib.PlayerResourceState storage state = ResourceGenerationLib
            .player(account);

        uint256 count = ResourceGenerationLib.resourceCount();
        uncollected = new uint256[](count);

        if (!state.initialized) {
            secondsUntilNextUnit = ResourceGenerationLib.secondsPerUnit();
            return (uncollected, secondsUntilNextUnit);
        }

        uint256 elapsed = block.timestamp - state.lastUpdate;
        uint256 totalSeconds = elapsed + state.remainderSeconds;
        uint256 produced = totalSeconds / ResourceGenerationLib.secondsPerUnit();
        uint256 remainder = totalSeconds % ResourceGenerationLib.secondsPerUnit();

        if (remainder == 0) {
            secondsUntilNextUnit = ResourceGenerationLib.secondsPerUnit();
        } else {
            secondsUntilNextUnit = ResourceGenerationLib.secondsPerUnit() - remainder;
        }

        for (uint256 i = 0; i < count; ) {
            uint256 stored = state.uncollected[i];
            uncollected[i] = stored + produced;
            unchecked {
                ++i;
            }
        }
    }

    function getProductionConfig()
        external
        pure
        returns (uint256 productionPerHour, uint256 resourceCount, uint256 secondsPerUnit)
    {
        productionPerHour = ResourceGenerationLib.productionPerHour();
        resourceCount = ResourceGenerationLib.resourceCount();
        secondsPerUnit = ResourceGenerationLib.secondsPerUnit();
    }

    // --- Public Actions ---
    function syncMyProduction() external returns (uint256 producedPerResource) {
        producedPerResource = ResourceGenerationLib.sync(msg.sender);
        if (producedPerResource > 0) {
            emit ResourcesGenerated(msg.sender, producedPerResource, block.timestamp);
        }
    }

    function collectAllResources() external returns (uint256[] memory collected) {
        address player = msg.sender;
        uint256 produced = ResourceGenerationLib.sync(player);
        if (produced > 0) {
            emit ResourcesGenerated(player, produced, block.timestamp);
        }

        ResourceGenerationLib.PlayerResourceState storage state = ResourceGenerationLib.player(
            player
        );

        uint256 count = ResourceGenerationLib.resourceCount();
        collected = new uint256[](count);

        for (uint256 i = 0; i < count; ) {
            uint256 amount = state.uncollected[i];
            if (amount > 0) {
                state.uncollected[i] = 0;
                ERC1155Lib._mint(player, i, amount);
                emit ResourceCollected(player, i, amount);
            }
            collected[i] = amount;
            unchecked {
                ++i;
            }
        }
    }

    function collectResource(uint256 resourceId) external returns (uint256 amount) {
        require(
            resourceId < ResourceGenerationLib.resourceCount(),
            "ResourceFacet: invalid resource"
        );

        address player = msg.sender;
        uint256 produced = ResourceGenerationLib.sync(player);
        if (produced > 0) {
            emit ResourcesGenerated(player, produced, block.timestamp);
        }

        ResourceGenerationLib.PlayerResourceState storage state = ResourceGenerationLib.player(
            player
        );

        amount = state.uncollected[resourceId];
        if (amount > 0) {
            state.uncollected[resourceId] = 0;
            ERC1155Lib._mint(player, resourceId, amount);
            emit ResourceCollected(player, resourceId, amount);
        }
    }
}
