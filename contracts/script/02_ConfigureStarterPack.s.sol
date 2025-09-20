// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {StarterPackConfig} from "../src/protocol/StarterPack/StarterPackConfig.sol";

/// @title ConfigureStarterPack Script
/// @notice Configures base game starter pack values
contract ConfigureStarterPack is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        vm.startBroadcast(pk);

        StarterPackConfig.setStarterPack(
            50, // Gold
            100, // Wood
            100, // Stone
            100 // Iron
        );

        vm.stopBroadcast();
        console2.log("Resource configs initialized by", deployer);
    }
}
