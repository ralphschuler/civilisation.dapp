// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {Diamond} from "../src/diamond/Diamond.sol";
import {DiamondCutFacet} from "../src/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "../src/facets/DiamondLoupeFacet.sol";
import {OwnershipFacet} from "../src/facets/OwnershipFacet.sol";
import {DiamondInit} from "../src/diamond/DiamondInit.sol";
import {IDiamondCut} from "../src/interfaces/IDiamondCut.sol";

contract DeployDiamond is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);

        // 1. Deploy DiamondCutFacet
        DiamondCutFacet cutFacet = new DiamondCutFacet();

        // 2. Deploy Diamond Proxy
        Diamond diamond = new Diamond(deployer, address(cutFacet));

        // 3. Deploy supporting facets
        DiamondLoupeFacet loupeFacet = new DiamondLoupeFacet();
        OwnershipFacet ownerFacet = new OwnershipFacet();

        // 4. Deploy DiamondInit (führt Initialisierung durch)
        DiamondInit diamondInit = new DiamondInit();

        // 5. Prepare cut
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](3);
        bytes4[] memory loupeSelectors = new bytes4[](4);
        bytes4[] memory ownershipSelectors = new bytes4[](2);
        //noch ein platz für die cut

        // Loupe Facet
        loupeSelectors[0] = DiamondLoupeFacet.facets.selector;
        loupeSelectors[1] = DiamondLoupeFacet.facetFunctionSelectors.selector;
        loupeSelectors[2] = DiamondLoupeFacet.facetAddresses.selector;
        loupeSelectors[3] = DiamondLoupeFacet.facetAddress.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: address(loupeFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: loupeSelectors
        });

        // Ownership Facet
        ownershipSelectors[0] = OwnershipFacet.transferOwnership.selector;
        ownershipSelectors[1] = OwnershipFacet.owner.selector;
        cut[1] = IDiamondCut.FacetCut({
            facetAddress: address(ownerFacet),
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: ownershipSelectors
        });

        // 6. Perform diamondCut
        IDiamondCut(address(diamond)).diamondCut(
            cut,
            address(diamondInit),
            abi.encodeWithSelector(DiamondInit.init.selector)
        );

        console.log("Diamond deployed at:", address(diamond));
        console.log("DiamondCutFacet at:", address(cutFacet));
        console.log("DiamondLoupeFacet at:", address(loupeFacet));
        console.log("OwnershipFacet at:", address(ownerFacet));
        console.log("DiamondInit at:", address(diamondInit));

        vm.stopBroadcast();
    }
}
