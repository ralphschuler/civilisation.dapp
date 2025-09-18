pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {Diamond} from "../src/diamond/core/Diamond.sol";
import {IDiamondCut} from "../src/diamond/core/DiamondCut/IDiamondCut.sol";
import {DiamondInit} from "../src/diamond/initializers/DiamondInit.sol";
import {IDiamondInit} from "../src/diamond/initializers/IDiamondInit.sol";

// Always required
import {DiamondCutFacet} from "../src/diamond/core/DiamondCut/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "../src/diamond/core/DiamondLoupe/DiamondLoupeFacet.sol";

// Utils
import {CutSelector} from "./utils/CutSelector.sol";

contract DeployScript is Script, CutSelector {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);

        // --- 1. Init + Base Facets ---
        DiamondInit diamondInit = new DiamondInit();
        DiamondCutFacet cutFacet = new DiamondCutFacet();
        DiamondLoupeFacet loupeFacet = new DiamondLoupeFacet();

        // --- 2. Deploy Diamond with CutFacet ---
        Diamond diamond = new Diamond(deployer, address(cutFacet));
        console2.log("Diamond deployed:", address(diamond));

        // --- 3. Discover protocol facet *folder names* ---
        string;
        cmd[0] = "bash";
        cmd[1] = "-lc";
        // list only folder names under src/protocol
        cmd[2] = "ls -1 src/protocol";
        bytes memory out = vm.ffi(cmd);
        string[] memory facetBaseNames = vm.split(string(out), "\n");

        // --- 4. Prepare arrays (LoupeFacet always included) ---
        uint256 facetCount = facetBaseNames.length + 1;
        string[] memory names = new string[](facetCount);
        address[] memory addrs = new address[](facetCount);

        names[0] = "DiamondLoupeFacet";
        addrs[0] = address(loupeFacet);

        // --- 5. Deploy each protocol facet dynamically ---
        for (uint256 i = 0; i < facetBaseNames.length; i++) {
            string memory baseName = facetBaseNames[i];
            if (bytes(baseName).length == 0) continue;

            string memory contractName = string.concat(baseName, "Facet");
            string memory path = string.concat(
                "src/protocol/",
                baseName,
                "/",
                contractName,
                ".sol"
            );

            bytes memory bytecode = vm.getCode(path);
            address facetAddr;
            assembly {
                facetAddr := create(0, add(bytecode, 0x20), mload(bytecode))
            }
            require(facetAddr != address(0), "Facet deploy failed");

            names[i + 1] = contractName; // must match contract name for selectors
            addrs[i + 1] = facetAddr;

            console2.log("Deployed facet", contractName, facetAddr);
        }

        // --- 6. Generate cuts ---
        IDiamondCut.FacetCut[] memory cuts = generateCutDataBatch(names, addrs);

        // --- 7. Diamond cut + Initializer ---
        bytes memory initCalldata = abi.encodeWithSelector(
            IDiamondInit.init.selector
        );
        IDiamondCut(address(diamond)).diamondCut(
            cuts,
            address(diamondInit),
            initCalldata
        );

        vm.stopBroadcast();

        console2.log("Diamond initialized with", names.length, "facets");
    }
}
