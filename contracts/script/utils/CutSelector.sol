pragma solidity ^0.8.30;

import {IDiamondCut} from "../../src/diamond/core/DiamondCut/IDiamondCut.sol";
import {SelectorFetcher} from "./SelectorFetcher.sol";

abstract contract CutSelector is SelectorFetcher {
    event DuplicateSelector(string indexed facetName, bytes4 indexed selector);

    function generateCutData(
        string memory facetName,
        address facetAddress
    ) public returns (IDiamondCut.FacetCut[] memory) {
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
        bytes4[] memory cutSelectors = getCutSelector(facetName);
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: facetAddress,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: cutSelectors
        });
        return cut;
    }

    function generateCutDataBatch(
        string[] memory facetNames,
        address[] memory facetAddresses
    ) public returns (IDiamondCut.FacetCut[] memory) {
        require(
            facetNames.length == facetAddresses.length,
            "CutSelector: array length mismatch"
        );

        uint256 facetCount = facetNames.length;
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](
            facetCount
        );

        // Determine the total number of selectors to size the seenSelectors array dynamically.
        uint256 totalSelectorCount = 0;
        for (uint256 i = 0; i < facetCount; i++) {
            totalSelectorCount += getSelectorCount(facetNames[i]);
        }
        bytes4[] memory seenSelectors = new bytes4[](totalSelectorCount);
        uint256 seenSelectorsCount = 0;

        for (uint256 i = 0; i < facetCount; i++) {
            bytes4[] memory cutSelectors = getCutSelector(facetNames[i]);

            // Filter out duplicate selectors
            bytes4[] memory uniqueSelectors = new bytes4[](cutSelectors.length);
            uint256 uniqueSelectorsCount = 0;

            for (uint256 j = 0; j < cutSelectors.length; j++) {
                bool isDuplicate = false;
                for (uint256 k = 0; k < seenSelectorsCount; k++) {
                    if (seenSelectors[k] == cutSelectors[j]) {
                        isDuplicate = true;
                        emit DuplicateSelector(facetNames[i], cutSelectors[j]);
                        break;
                    }
                }

                if (!isDuplicate) {
                    uniqueSelectors[uniqueSelectorsCount] = cutSelectors[j];
                    uniqueSelectorsCount++;
                    // No need to check size now, as it's dynamically sized
                    seenSelectors[seenSelectorsCount] = cutSelectors[j];
                    seenSelectorsCount++;
                }
            }

            // Resize the unique selectors array to its actual size
            bytes4[] memory finalSelectors = new bytes4[](uniqueSelectorsCount);
            for (uint256 j = 0; j < uniqueSelectorsCount; j++) {
                finalSelectors[j] = uniqueSelectors[j];
            }

            cut[i] = IDiamondCut.FacetCut({
                facetAddress: facetAddresses[i],
                action: IDiamondCut.FacetCutAction.Add,
                functionSelectors: finalSelectors
            });
        }

        return cut;
    }

    function getCutSelector(
        string memory facetName
    ) public returns (bytes4[] memory cutSelectors) {
        cutSelectors = SelectorFetcher.selectorsFor(facetName);
    }

    function getSelectorCount(
        string memory facetName
    ) public returns (uint256) {
        return selectorsFor(facetName).length;
    }
}
