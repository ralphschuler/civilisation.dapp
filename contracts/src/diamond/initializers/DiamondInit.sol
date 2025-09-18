// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IERC165} from "../../interfaces/IERC165.sol";
import {IERC173} from "../../interfaces/IERC173.sol";

import {IDiamondCut} from "../core/DiamondCut/IDiamondCut.sol";
import {IDiamondLoupe} from "../core/DiamondLoupe/IDiamondLoupe.sol";

import {ERC165Lib} from "../implementations/ERC165/ERC165Lib.sol";
import {ERC173Lib} from "../implementations/ERC173/ERC173Lib.sol";

import {IDiamondInit} from "./IDiamondInit.sol";

/// @title DiamondInit
/// @notice Initialization contract for Diamonds (EIP-2535).
/// @dev This contract is executed once during deployment to:
///      - Register ERC165, ERC173, DiamondCut, and DiamondLoupe interfaces
///      - Set the initial owner of the diamond
contract DiamondInit is IDiamondInit {
    /// @inheritdoc IDiamondInit
    /// @notice Initializes the diamond by enabling required interfaces and setting ownership.
    /// @dev Called via delegatecall from the Diamond constructor or deployment script.
    function init() external override {
        // Add IERC165 support.
        ERC165Lib.setSupportedInterface(type(IERC165).interfaceId, true);

        // Add IERC173 (Ownership) support.
        ERC165Lib.setSupportedInterface(type(IERC173).interfaceId, true);

        // Add IDiamondCut support.
        ERC165Lib.setSupportedInterface(type(IDiamondCut).interfaceId, true);

        // Add IDiamondLoupe support.
        ERC165Lib.setSupportedInterface(type(IDiamondLoupe).interfaceId, true);

        // Register the deployer as the initial owner.
        ERC173Lib.s().owner = msg.sender;
    }
}
