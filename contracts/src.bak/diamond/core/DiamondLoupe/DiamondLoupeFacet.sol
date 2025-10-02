// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// The functions in DiamondLoupeFacet MUST be added to a diamond.
// The EIP-2535 Diamond standard requires these functions.

import {DiamondCutLib, DiamondCutStorage} from "../DiamondCut/DiamondCutLib.sol";
import {IDiamondLoupe} from "./IDiamondLoupe.sol";

/// @title DiamondLoupeFacet for EIP-2535 Diamonds
/// @notice Implements the Loupe functions required by the Diamond Standard (EIP-2535).
/// @dev Provides on-chain introspection of facets and function selectors.
///      Must always be added to a deployed Diamond.
contract DiamondLoupeFacet is IDiamondLoupe {
    /// @notice Gets all facets and their selectors in the diamond.
    /// @dev Returns a dynamic array of all facets, each with its selectors.
    /// @return facets_ Array of facets with facet address and function selectors.
    function facets() external view override returns (Facet[] memory facets_) {
        DiamondCutStorage storage ds = DiamondCutLib.s();
        uint256 selectorCount = ds.selectors.length;
        facets_ = new Facet[](selectorCount);
        uint16[] memory numFacetSelectors = new uint16[](selectorCount);
        uint256 numFacets;

        for (uint256 selectorIndex; selectorIndex < selectorCount; selectorIndex++) {
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress_ = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            bool continueLoop = false;

            for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
                if (facets_[facetIndex].facetAddress == facetAddress_) {
                    facets_[facetIndex].functionSelectors[numFacetSelectors[facetIndex]] = selector;
                    numFacetSelectors[facetIndex]++;
                    continueLoop = true;
                    break;
                }
            }
            if (continueLoop) {
                continueLoop = false;
                continue;
            }

            facets_[numFacets].facetAddress = facetAddress_;
            facets_[numFacets].functionSelectors = new bytes4[](selectorCount);
            facets_[numFacets].functionSelectors[0] = selector;
            numFacetSelectors[numFacets] = 1;
            numFacets++;
        }

        for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
            uint256 numSelectors = numFacetSelectors[facetIndex];
            bytes4[] memory selectors = facets_[facetIndex].functionSelectors;
            assembly {
                mstore(selectors, numSelectors)
            }
        }

        assembly {
            mstore(facets_, numFacets)
        }
    }

    /// @notice Gets all the function selectors supported by a specific facet.
    /// @param _facet The facet address to query.
    /// @return _facetFunctionSelectors Array of function selectors supported by the facet.
    function facetFunctionSelectors(
        address _facet
    ) external view override returns (bytes4[] memory _facetFunctionSelectors) {
        DiamondCutStorage storage ds = DiamondCutLib.s();
        uint256 selectorCount = ds.selectors.length;
        uint256 numSelectors;
        _facetFunctionSelectors = new bytes4[](selectorCount);

        for (uint256 selectorIndex; selectorIndex < selectorCount; selectorIndex++) {
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress_ = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            if (_facet == facetAddress_) {
                _facetFunctionSelectors[numSelectors] = selector;
                numSelectors++;
            }
        }

        assembly {
            mstore(_facetFunctionSelectors, numSelectors)
        }
    }

    /// @notice Gets all facet addresses currently used by the diamond.
    /// @return facetAddresses_ Array of facet addresses.
    function facetAddresses() external view override returns (address[] memory facetAddresses_) {
        DiamondCutStorage storage ds = DiamondCutLib.s();
        uint256 selectorCount = ds.selectors.length;
        facetAddresses_ = new address[](selectorCount);
        uint256 numFacets;

        for (uint256 selectorIndex; selectorIndex < selectorCount; selectorIndex++) {
            bytes4 selector = ds.selectors[selectorIndex];
            address facetAddress_ = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            bool continueLoop = false;

            for (uint256 facetIndex; facetIndex < numFacets; facetIndex++) {
                if (facetAddress_ == facetAddresses_[facetIndex]) {
                    continueLoop = true;
                    break;
                }
            }
            if (continueLoop) {
                continueLoop = false;
                continue;
            }

            facetAddresses_[numFacets] = facetAddress_;
            numFacets++;
        }

        assembly {
            mstore(facetAddresses_, numFacets)
        }
    }

    /// @notice Gets the facet address that supports a given function selector.
    /// @dev Returns `address(0)` if no facet implements the selector.
    /// @param _functionSelector The function selector to query.
    /// @return facetAddress_ The facet address implementing the selector.
    function facetAddress(
        bytes4 _functionSelector
    ) external view override returns (address facetAddress_) {
        DiamondCutStorage storage ds = DiamondCutLib.s();
        facetAddress_ = ds.facetAddressAndSelectorPosition[_functionSelector].facetAddress;
    }
}
