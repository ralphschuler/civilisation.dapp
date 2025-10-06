// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IDiamondLoupe interface for EIP-2535 Diamonds
/// @notice Provides required loupe (introspection) functions for diamonds.
/// @dev A loupe is a magnifying glass used to inspect diamonds. These functions
///      allow on-chain introspection of facets and selectors. Must always be included
///      in a compliant diamond deployment.
interface IDiamondLoupe {
	/// @notice Struct representing a facet and its associated function selectors.
	/// @param facetAddress The facet contract address
	/// @param functionSelectors Array of function selectors supported by the facet
	struct Facet {
		address facetAddress;
		bytes4[] functionSelectors;
	}

	/// @notice Gets all facet addresses and their four byte function selectors.
	/// @dev This is expected to be called frequently by tools for inspection.
	/// @return facets_ Array of all facets with their addresses and selectors
	function facets() external view returns (Facet[] memory facets_);

	/// @notice Gets all the function selectors supported by a specific facet.
	/// @param _facet The facet contract address to query
	/// @return facetFunctionSelectors_ Array of function selectors supported by the facet
	function facetFunctionSelectors(
		address _facet
	) external view returns (bytes4[] memory facetFunctionSelectors_);

	/// @notice Gets all unique facet addresses used by a diamond.
	/// @return facetAddresses_ Array of facet addresses
	function facetAddresses() external view returns (address[] memory facetAddresses_);

	/// @notice Gets the facet address that supports the given selector.
	/// @dev Returns `address(0)` if no facet implements the selector.
	/// @param _functionSelector The function selector to look up
	/// @return facetAddress_ The facet address implementing the selector
	function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_);
}
