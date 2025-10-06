// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ResourceIds} from "../../constants/ResourceIds.sol";

/// @title ResourceGenerationLib
/// @notice Handles storage and production logic for automatic resource generation
library ResourceGenerationLib {
    // --- Storage Slot ---
    bytes32 internal constant STORAGE_POSITION = keccak256("civilisation.resource.generation");

    // --- Production Configuration ---
    uint256 internal constant SECONDS_PER_HOUR = 3600;
    uint256 internal constant PRODUCTION_PER_HOUR = 100;
    uint256 internal constant SECONDS_PER_UNIT = SECONDS_PER_HOUR / PRODUCTION_PER_HOUR; // 36 seconds per unit
    uint256 internal constant RESOURCE_COUNT = uint256(uint8(type(ResourceIds).max)) + 1;

    // --- Storage Layout ---
    struct PlayerResourceState {
        mapping(uint256 => uint256) uncollected; // resourceId => amount waiting to be collected
        uint64 lastUpdate; // timestamp of the last production update
        uint32 remainderSeconds; // accumulated seconds that didn't produce a full unit yet
        bool initialized; // whether the state has been initialized
    }

    struct ResourceStorage {
        mapping(address => PlayerResourceState) players;
    }

    // --- Accessor ---
    function s() internal pure returns (ResourceStorage storage rs) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            rs.slot := position
        }
    }

    function player(address account) internal pure returns (PlayerResourceState storage state) {
        state = s().players[account];
    }

    // --- Configuration Helpers ---
    function resourceCount() internal pure returns (uint256) {
        return RESOURCE_COUNT;
    }

    function productionPerHour() internal pure returns (uint256) {
        return PRODUCTION_PER_HOUR;
    }

    function secondsPerUnit() internal pure returns (uint256) {
        return SECONDS_PER_UNIT;
    }

    // --- Production Logic ---
    function sync(address account) internal returns (uint256 producedPerResource) {
        PlayerResourceState storage state = player(account);

        if (!state.initialized) {
            state.initialized = true;
            state.lastUpdate = uint64(block.timestamp);
            state.remainderSeconds = 0;
            return 0;
        }

        uint256 elapsed = block.timestamp - state.lastUpdate;
        if (elapsed == 0 && state.remainderSeconds == 0) {
            return 0;
        }

        uint256 totalSeconds = elapsed + state.remainderSeconds;
        if (totalSeconds < SECONDS_PER_UNIT) {
            state.remainderSeconds = uint32(totalSeconds);
            state.lastUpdate = uint64(block.timestamp);
            return 0;
        }

        producedPerResource = totalSeconds / SECONDS_PER_UNIT;
        state.remainderSeconds = uint32(totalSeconds % SECONDS_PER_UNIT);
        state.lastUpdate = uint64(block.timestamp);

        if (producedPerResource == 0) {
            return 0;
        }

        uint256 count = RESOURCE_COUNT;
        for (uint256 i = 0; i < count; ) {
            state.uncollected[i] += producedPerResource;
            unchecked {
                ++i;
            }
        }
    }
}
