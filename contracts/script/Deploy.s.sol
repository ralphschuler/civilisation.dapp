// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Contract} from "../contracts/Contract.sol";
import {IWorldID} from "../contracts/interfaces/IWorldID.sol";

/// @notice Deployment script for the Contract using Foundry
contract DeployScript is Script {
    function run() external {
        // --- Load env vars ---
        // Beispiel: setze die Variablen in .env oder GitHub Actions
        address worldId = vm.envAddress("WORLD_ID_ADDRESS"); // z.B. Router Adresse von World ID
        string memory appId = vm.envString("WORLD_APP_ID"); // z.B. "app_staging_xxx"
        string memory actionId = vm.envString("WORLD_ACTION"); // z.B. "vote-action"

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
