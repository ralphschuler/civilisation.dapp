// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {ResourceIds} from "../src/protocol/Resources/ResourcesLib.sol";
import {ResourceProductionConfig} from "../src/protocol/ResourceProduction/ResourceProductionConfig.sol";

/// @title InitResources Script
/// @notice Configures base game resource production/balancing values
contract ConfigureResources is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        vm.startBroadcast(pk);

        // --- Configs setzen ---
        // Gold: currency only
        ResourceProductionConfig.setConfig(
            ResourceIds.GOLD,
            0,
            0,
            0,
            100,
            100,
            100
        );

        // Wood
        ResourceProductionConfig.setConfig(
            ResourceIds.WOOD,
            1, // 1/min
            50, // claim limit
            10, // base upgrade cost
            120, // +20% rate
            120, // +20% limit
            150 // +50% cost
        );

        // Stone
        ResourceProductionConfig.setConfig(
            ResourceIds.STONE,
            1,
            30,
            15,
            115,
            115,
            140
        );

        // Iron
        ResourceProductionConfig.setConfig(
            ResourceIds.IRON,
            1,
            40,
            20,
            110,
            110,
            160
        );

        vm.stopBroadcast();
        console2.log("Resource configs initialized by", deployer);
    }
}
