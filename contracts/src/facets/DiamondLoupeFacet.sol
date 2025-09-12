// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";

/// @notice DiamondLoupeFacet – liefert Übersicht über Facets und ihre Funktionen.
///         Implementiert den Standard aus EIP-2535.
contract DiamondLoupeFacet is IDiamondLoupe {
    /// @inheritdoc IDiamondLoupe
    function facets() external view override returns (Facet[] memory facets_) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 selectorCount = ds.selectors.length;

        // Zählen, wie viele verschiedene Facet-Adressen existieren
        uint256 facetCount;
        {
            address lastFacet;
            for (uint256 i; i < selectorCount; i++) {
                address facetAddr = ds
                    .selectorToFacetAndPosition[ds.selectors[i]]
                    .facetAddress;
                if (facetAddr != lastFacet) {
                    facetCount++;
                    lastFacet = facetAddr;
                }
            }
        }

        facets_ = new Facet[](facetCount);
        uint256[] memory selectorCounts = new uint256[](facetCount);

        // Zuerst alle Facet-Adressen sammeln
        uint256 facetIndex;
        {
            address lastFacet;
            for (uint256 i; i < selectorCount; i++) {
                address facetAddr = ds
                    .selectorToFacetAndPosition[ds.selectors[i]]
                    .facetAddress;
                if (facetAddr != lastFacet) {
                    facets_[facetIndex].facetAddress = facetAddr;
                    facetIndex++;
                    lastFacet = facetAddr;
                }
            }
        }

        // Jetzt Anzahl der Selectors pro Facet zählen
        for (uint256 i; i < selectorCount; i++) {
            address facetAddr = ds
                .selectorToFacetAndPosition[ds.selectors[i]]
                .facetAddress;
            for (uint256 j; j < facets_.length; j++) {
                if (facets_[j].facetAddress == facetAddr) {
                    selectorCounts[j]++;
                }
            }
        }

        // Speicher für Function Selectors initialisieren
        for (uint256 i; i < facets_.length; i++) {
            facets_[i].functionSelectors = new bytes4[](selectorCounts[i]);
        }

        // Und die Selectors einsortieren
        uint256[] memory selectorPos = new uint256[](facets_.length);
        for (uint256 i; i < selectorCount; i++) {
            bytes4 selector = ds.selectors[i];
            address facetAddr = ds
                .selectorToFacetAndPosition[selector]
                .facetAddress;

            for (uint256 j; j < facets_.length; j++) {
                if (facets_[j].facetAddress == facetAddr) {
                    facets_[j].functionSelectors[selectorPos[j]] = selector;
                    selectorPos[j]++;
                    break;
                }
            }
        }
    }

    /// @inheritdoc IDiamondLoupe
    function facetFunctionSelectors(
        address _facet
    ) external view override returns (bytes4[] memory selectors) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 selectorCount = ds.selectors.length;

        // Anzahl zählen
        uint256 count;
        for (uint256 i; i < selectorCount; i++) {
            if (
                ds.selectorToFacetAndPosition[ds.selectors[i]].facetAddress ==
                _facet
            ) {
                count++;
            }
        }

        selectors = new bytes4[](count);
        uint256 j;
        for (uint256 i; i < selectorCount; i++) {
            if (
                ds.selectorToFacetAndPosition[ds.selectors[i]].facetAddress ==
                _facet
            ) {
                selectors[j] = ds.selectors[i];
                j++;
            }
        }
    }

    /// @inheritdoc IDiamondLoupe
    function facetAddresses()
        external
        view
        override
        returns (address[] memory facetAddresses)
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 selectorCount = ds.selectors.length;

        // Temporär sammeln
        address[] memory temp = new address[](selectorCount);
        uint256 count;
        address lastFacet;
        for (uint256 i; i < selectorCount; i++) {
            address facetAddr = ds
                .selectorToFacetAndPosition[ds.selectors[i]]
                .facetAddress;
            if (facetAddr != lastFacet) {
                temp[count] = facetAddr;
                count++;
                lastFacet = facetAddr;
            }
        }

        facetAddresses = new address[](count);
        for (uint256 i; i < count; i++) {
            facetAddresses[i] = temp[i];
        }
    }

    /// @inheritdoc IDiamondLoupe
    function facetAddress(
        bytes4 _functionSelector
    ) external view override returns (address) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.selectorToFacetAndPosition[_functionSelector].facetAddress;
    }
}
