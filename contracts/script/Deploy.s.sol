// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {Diamond, DiamondArgs} from "../src/diamond/core/Diamond.sol";
import {FacetCut, FacetCutAction} from "../src/diamond/core/DiamondCut/DiamondCutLib.sol";
import {IDiamondCut} from "../src/diamond/core/DiamondCut/IDiamondCut.sol";
import {DiamondInit} from "../src/diamond/initializers/DiamondInit.sol";
import {IDiamondInit} from "../src/diamond/initializers/IDiamondInit.sol";
import {StringUtils} from "./utils/StringUtils.sol";

// Always required
import {DiamondCutFacet} from "../src/diamond/core/DiamondCut/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "../src/diamond/core/DiamondLoupe/DiamondLoupeFacet.sol";

import {CutSelector} from "./utils/CutSelector.sol";

/// @title DeployScript for Diamond Standard
/// @author Ralph Schuler
/// @notice This deployment script automates deployment of the Diamond proxy,
///         required facets (Cut & Loupe), and dynamically discovers and deploys
///         all protocol-specific facets under `src/protocol`.
/// @dev Uses Foundry's ffi to list protocol folders and deploy facets via `vm.getCode`.
contract DeployScript is Script, CutSelector {
    using StringUtils for string;

    /// @notice Entry point for the deployment script.
    /// @dev Reads `PRIVATE_KEY` from env, deploys the Diamond, initializer, and all facets.
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // --- 1. Init + Base Facets ---
        DiamondInit diamondInit = new DiamondInit();
        DiamondCutFacet cutFacet = new DiamondCutFacet();
        DiamondLoupeFacet loupeFacet = new DiamondLoupeFacet();

        // --- 2. Prepare initial cut: only CutFacet required at constructor time
        FacetCut[] memory initialCut = new FacetCut[](1);
        {
            bytes4[] memory selectors = getCutSelector("DiamondCutFacet");
            initialCut[0] = FacetCut(
                address(cutFacet),
                FacetCutAction.Add,
                selectors
            );
        }

        // --- 3. Prepare Constructor Args
        DiamondArgs memory args = DiamondArgs(address(diamondInit), "");

        // --- 4. Deploy Diamond with CutFacet ---
        Diamond diamond = new Diamond(initialCut, args);
        console2.log("Diamond deployed:", address(diamond));

        // --- 5. Discover protocol facet *folder names* ---
        string[] memory cmd = new string[](3);
        cmd[0] = "bash";
        cmd[1] = "-lc";
        // list only folder names under src/protocol
        cmd[2] = "ls -1 src/protocol";
        bytes memory out = vm.ffi(cmd);
        string[] memory facetBaseNames = StringUtils.splitLines(string(out));

        // --- 6. Prepare arrays (LoupeFacet always included) ---
        uint256 facetCount = facetBaseNames.length + 1;
        string[] memory names = new string[](facetCount);
        address[] memory addrs = new address[](facetCount);

        names[0] = "DiamondLoupeFacet";
        addrs[0] = address(loupeFacet);

        // --- 7. Deploy each protocol facet dynamically ---
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

        // --- 8. Generate cuts ---
        /// @notice Generates the FacetCut array for all deployed facets.
        FacetCut[] memory cuts = generateCutDataBatch(names, addrs);

        // --- 9. Diamond cut + Initializer ---
        /// @dev Calls the DiamondCut with initializer calldata.
        {
            bytes memory initCalldata = abi.encodeWithSelector(
                IDiamondInit.init.selector
            );
            IDiamondCut(address(diamond)).diamondCut(
                cuts,
                address(diamondInit),
                initCalldata
            );
        }

        vm.stopBroadcast();

        console2.log("Diamond initialized with", names.length, "facets");
    }
}
