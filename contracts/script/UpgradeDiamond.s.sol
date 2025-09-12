// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {IDiamondCut} from "../src/interfaces/IDiamondCut.sol";
import {GoldFacet} from "../src/facets/GoldFacet.sol";

contract UpgradeDiamond is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address diamondAddress = vm.envAddress("DIAMOND_PROXY");

        // Neue GoldFacet Implementation
        GoldFacet newGoldFacet = new GoldFacet();

        // Selectors von GoldFacet
        bytes4;
        selectors[0] = GoldFacet.claimWithWorldId.selector;
        selectors[1] = GoldFacet.raidWithWorldId.selector;
        selectors[2] = GoldFacet.startUpgradeWithWorldId.selector;

        IDiamondCut.FacetCut;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: address(newGoldFacet),
            action: IDiamondCut.FacetCutAction.Replace, // Replace für Upgrade
            functionSelectors: selectors
        });

        // Upgrade durchführen
        IDiamondCut(diamondAddress).diamondCut(cut, address(0), "");

        console.log(
            "✅ Upgraded Diamond at",
            diamondAddress,
            "with new GoldFacet at",
            address(newGoldFacet)
        );

        vm.stopBroadcast();
    }
}
