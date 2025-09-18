// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../../../interfaces/IERC173.sol";
import {ERC173} from "./ERC173.sol";
import {ERC173Lib} from "./ERC173Lib.sol";

/// @title ERC173Facet
/// @notice Implements the ERC-173 Ownership Standard for Diamonds.
/// @dev Exposes `owner()` and `transferOwnership()` and relies on `ERC173Lib` for storage.
contract ERC173Facet is IERC173, ERC173 {
    /// @inheritdoc IERC173
    /// @notice Returns the current owner of the diamond.
    /// @return The address of the owner.
    function owner() external view returns (address) {
        return ERC173Lib.s().owner;
    }

    /// @inheritdoc IERC173
    /// @notice Transfers ownership of the diamond to a new address.
    /// @dev Only callable by the current owner via the `onlyOwner` modifier.
    /// @param newOwner The address to transfer ownership to.
    function transferOwnership(address newOwner) external onlyOwner {
        ERC173Lib.s().owner = newOwner;
        emit OwnershipTransferred(msg.sender, newOwner);
    }
}
