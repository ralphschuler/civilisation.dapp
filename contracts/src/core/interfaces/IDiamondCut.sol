// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {FacetCut} from "../protocols/DiamondCut/DiamondCutLib.sol";

/// @title IDiamondCut interface for EIP-2535 Diamonds
/// @notice Standard interface that defines the `diamondCut` function required
///         by the Diamond Standard to add, replace, or remove functions.
/// @dev Must be implemented by the DiamondCutFacet.
interface IDiamondCut {
    /// @notice Emitted when a diamond cut (add, replace, or remove) is executed
    /// @param _diamondCut Array of facet cuts describing function selector modifications
    /// @param _init Address of the initialization contract or facet
    /// @param _calldata Initialization calldata executed via delegatecall on `_init`
    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);

    /// @notice Add, replace, or remove any number of functions and optionally execute
    ///         an initialization function with delegatecall.
    /// @dev Required by the EIP-2535 standard. Typically only callable by the contract owner.
    /// @param _diamondCut Array of facet cuts (address, action, selectors) describing modifications
    /// @param _init Address of the contract or facet to delegatecall for initialization
    /// @param _calldata Encoded function call (selector + arguments) for `_init` delegatecall
    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external;
}
