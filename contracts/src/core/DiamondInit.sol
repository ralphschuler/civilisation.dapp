// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IERC165} from "./interfaces/IERC165.sol";
import {IERC173} from "./interfaces/IERC173.sol";

import {IDiamondCut} from "./interfaces/IDiamondCut.sol";
import {IDiamondLoupe} from "./interfaces/IDiamondLoupe.sol";

import {ERC165Lib} from "./protocols/ERC165/ERC165Lib.sol";
import {ERC173Lib} from "./protocols/ERC173/ERC173Lib.sol";

import {IDiamondInit} from "./interfaces/IDiamondInit.sol";

/// @title DiamondInit
/// @notice Initialization contract for Diamonds (EIP-2535).
/// @dev This contract is executed once during deployment to:
///      - Register ERC165, ERC173, DiamondCut, and DiamondLoupe interfaces
///      - Set the initial owner of the diamond
contract DiamondInit is IDiamondInit {

	/// @inheritdoc IDiamondInit
	/// @notice Initializes the diamond by enabling required interfaces and setting ownership.
	/// @dev Called via delegatecall from the Diamond constructor or deployment script.
	function init(address _owner) external override {

	// Add IERC165 support.
	ERC165Lib.setSupportedInterface(type(IERC165).interfaceId, true);

	// Add IERC173 (Ownership) support.
	ERC165Lib.setSupportedInterface(type(IERC173).interfaceId, true);

	// Add IDiamondCut support.
	ERC165Lib.setSupportedInterface(type(IDiamondCut).interfaceId, true);

	// Add IDiamondLoupe support.
	ERC165Lib.setSupportedInterface(type(IDiamondLoupe).interfaceId, true);

		// Register the deployer as the initial owner.
		ERC173Lib.s().owner = _owner;
	}
}
