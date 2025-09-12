// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {IDiamondCut} from "../src/interfaces/IDiamondCut.sol";

contract UpgradeDiamond is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address diamondAddress = vm.envAddress("DIAMOND_PROXY");

        // Neue Facet-Adresse aus env
        address newFacet = vm.envAddress("NEW_FACET");

        // FacetCut vorbereiten
        bytes4;
        selectors[0] = bytes4(
            keccak256("verifyAndExecute(address,uint256,uint256,uint256[8])")
        );

        IDiamondCut.FacetCut;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: newFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: selectors
        });

        // Upgrade durchführen
        IDiamondCut(diamondAddress).diamondCut(cut, address(0), "");

        console.log(
            "Upgraded Diamond at",
            diamondAddress,
            "with facet",
            newFacet
        );

        vm.stopBroadcast();
    }
}
