// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IERC173 – ERC-173 Contract Ownership Standard
/// @notice Standardized interface for ownership of contracts.
/// @dev ERC-165 identifier for this interface is `0x7f5828d0`.
///      Extends ERC-165 to allow on-chain discovery of contract ownership.
interface IERC173 {
    /// @notice Emitted when ownership of the contract changes.
    /// @param previousOwner The address of the previous owner.
    /// @param newOwner The address of the new owner.
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Returns the address of the current owner.
    /// @return owner_ The address of the owner.
    function owner() external view returns (address owner_);

    /// @notice Transfers ownership of the contract to a new address.
    /// @dev Setting `_newOwner` to `address(0)` renounces ownership.
    /// @param _newOwner The address of the new owner of the contract.
    function transferOwnership(address _newOwner) external;
}
