// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../ERC173/ERC173.sol";
import {IDiamondCut} from "../../interfaces/IDiamondCut.sol";
import {DiamondCutLib, FacetCut} from "./DiamondCutLib.sol";

/// @title DiamondCutFacet for EIP-2535 Diamonds
/// @author Nick Mudge
/// @notice Implements the `diamondCut` function required by the Diamond Standard (EIP-2535).
/// @dev Inherits `ERC173` for ownership checks. Delegates cut logic to `DiamondCutLib`.
contract DiamondCutFacet is IDiamondCut, ERC173 {
	/// @notice Add, replace, or remove any number of functions and optionally execute
	///         an initialization function with `delegatecall`.
	/// @dev Restricted to the Diamond owner via `onlyOwner`.
	/// @param _diamondCut Array of FacetCut structs that define which functions to add, replace, or remove
	/// @param init Address of the contract/facet containing the initialization function to execute
	/// @param data Calldata of the initialization function to execute via `delegatecall` on `init`
	function diamondCut(
		FacetCut[] calldata _diamondCut,
		address init,
		bytes calldata data
	) external override onlyOwner {
		DiamondCutLib.diamondCut(_diamondCut, init, data);
	}
}
