// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Contract} from "../src/Contract.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IWorldID} from "../src/interfaces/IWorldID.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Load config
        address worldIdAddr = vm.envAddress("WORLD_ID");
        string memory appId = vm.envString("WORLD_APP_ID");
        string memory actionId = vm.envString("WORLD_ACTION_ID");

        // Deploy implementation
        Contract impl = new Contract();

        // Encode initializer
        bytes memory data = abi.encodeWithSelector(
            Contract.initialize.selector,
            IWorldID(worldIdAddr),
            appId,
            actionId
        );

        // Deploy Proxy
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), data);

        console.log("Proxy deployed at:", address(proxy));
        console.log("Implementation at:", address(impl));

        vm.stopBroadcast();
    }
}
