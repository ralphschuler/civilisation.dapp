// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IDiamondCut} from "../../src/diamond/core/DiamondCut/IDiamondCut.sol";
import {FacetCut, FacetCutAction} from "../../src/diamond/core/DiamondCut/DiamondCutLib.sol";
import {SelectorFetcher} from "./SelectorFetcher.sol";

/// @title CutSelector
/// @author Ralph Schuler
/// @notice Utility contract to generate diamond cut data from facet names and addresses,
///         ensuring selectors are properly collected and duplicates are filtered.
/// @dev Relies on SelectorFetcher to resolve function selectors via forge.
abstract contract CutSelector is SelectorFetcher {
    /// @notice Emitted when a duplicate function selector is encountered in facet processing.
    /// @param facetName The name of the facet where the duplicate selector was found
    /// @param selector The duplicate function selector
    event DuplicateSelector(string indexed facetName, bytes4 indexed selector);

    /// @notice Generate a cut data array for a single facet
    /// @param facetName The name of the facet contract (must match the contract name)
    /// @param facetAddress The deployed address of the facet
    /// @return cut An array with a single FacetCut describing the facet's selectors
    function generateCutData(
        string memory facetName,
        address facetAddress
    ) public returns (FacetCut[] memory cut) {
        cut = new FacetCut[](1);
        bytes4[] memory cutSelectors = getCutSelector(facetName);
        cut[0] = FacetCut({
            facetAddress: facetAddress,
            action: FacetCutAction.Add,
            functionSelectors: cutSelectors
        });
    }

    /// @notice Generate cut data for multiple facets, automatically filtering duplicate selectors
    /// @param facetNames The list of facet contract names
    /// @param facetAddresses The corresponding list of deployed facet addresses
    /// @return cut An array of FacetCut structs, one per facet
    function generateCutDataBatch(
        string[] memory facetNames,
        address[] memory facetAddresses
    ) public returns (FacetCut[] memory cut) {
        require(
            facetNames.length == facetAddresses.length,
            "CutSelector: array length mismatch"
        );

        uint256 facetCount = facetNames.length;
        cut = new FacetCut[](facetCount);

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
                    seenSelectors[seenSelectorsCount] = cutSelectors[j];
                    seenSelectorsCount++;
                }
            }

            // Resize the unique selectors array to its actual size
            bytes4[] memory finalSelectors = new bytes4[](uniqueSelectorsCount);
            for (uint256 j = 0; j < uniqueSelectorsCount; j++) {
                finalSelectors[j] = uniqueSelectors[j];
            }

            cut[i] = FacetCut({
                facetAddress: facetAddresses[i],
                action: FacetCutAction.Add,
                functionSelectors: finalSelectors
            });
        }
    }

    /// @notice Get all function selectors for a given facet
    /// @param facetName The name of the facet contract
    /// @return cutSelectors The function selectors extracted from the facet
    function getCutSelector(
        string memory facetName
    ) public returns (bytes4[] memory cutSelectors) {
        cutSelectors = SelectorFetcher.selectorsFor(facetName);
    }

    /// @notice Count the number of function selectors in a facet
    /// @param facetName The name of the facet contract
    /// @return The number of selectors defined in the facet
    function getSelectorCount(
        string memory facetName
    ) public returns (uint256) {
        return selectorsFor(facetName).length;
    }
}
