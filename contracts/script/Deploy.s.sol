// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Contract} from "../src/Contract.sol";
import {IWorldID} from "../src/interfaces/IWorldID.sol";

/// @notice Deployment script for the Contract using Foundry
contract DeployScript is Script {
    function run() external {
        // --- Load env vars ---
        // Example: set the variables in .env or GitHub Actions
        address worldId = vm.envAddress("WORLD_ID_ROUTER"); // e.g., World ID router address
        string memory appId = vm.envString("WORLD_APP_ID"); // e.g., "app_staging_xxx"
        string memory actionId = vm.envString("WORLD_ACTION"); // e.g., "vote-action"

        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        // --- Start Broadcasting ---
        vm.startBroadcast(deployerKey);

        // --- Deploy Contract ---
        Contract contractInstance = new Contract(
            IWorldID(worldId),
            appId,
            actionId
        );

        vm.stopBroadcast();

        console2.log("Contract deployed at:", address(contractInstance));
    }
}
