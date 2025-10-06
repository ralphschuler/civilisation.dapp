// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IDiamondInit
/// @notice Interface for the diamond initializer contract.
/// @dev The `init` function is delegatecalled during diamond deployment or upgrade
///      to set up storage, register interfaces, and assign the initial owner.
interface IDiamondInit {
	/// @notice Initializes the diamond during deployment or upgrade.
	/// @dev Must be delegatecalled by the Diamond to correctly initialize its storage.
	function init(address _owner) external;
}
