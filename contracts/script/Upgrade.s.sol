// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {Contract} from "../src/Contract.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract Upgrade is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Proxy address
        address proxyAddr = vm.envAddress("PROXY_ADDR");

        // Deploy new implementation
        Contract newImpl = new Contract();

        // Call upgrade via proxy
        (bool success, ) = proxyAddr.call(
            abi.encodeWithSignature("upgradeTo(address)", address(newImpl))
        );
        require(success, "Upgrade failed");

        console.log("Proxy upgraded to new implementation:", address(newImpl));

        vm.stopBroadcast();
    }
}
