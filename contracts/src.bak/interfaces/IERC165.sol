// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IERC165
/// @notice Interface of the ERC165 standard, as defined in EIP-165.
/// @dev Contracts implementing this interface must explicitly declare support
///      for specific interfaces and return true when queried with their IDs.
///      Consumers (e.g. tooling, other contracts) can check supported interfaces
///      without relying on off-chain assumptions.
interface IERC165 {
    /// @notice Query if a contract implements an interface.
    /// @dev Interface identification is specified in EIP-165.
    ///      This function must consume less than 30,000 gas.
    /// @param interfaceId The interface identifier, as specified in EIP-165.
    /// @return True if the contract implements `interfaceId`, false otherwise.
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
