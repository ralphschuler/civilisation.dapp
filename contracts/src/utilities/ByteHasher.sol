// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ByteHasher
/// @notice Utility library for hashing arbitrary byte strings into field elements.
/// @dev Provides helper functions for mapping arbitrary data into a 256-bit field.
library ByteHasher {
    /// @notice Hashes a byte string into a field element using keccak256.
    /// @dev The `>> 8` ensures the result fits within the target finite field range.
    ///      Useful when working with zkSNARKs, Merkle trees, or other cryptographic primitives.
    /// @param value The bytestring to hash.
    /// @return The resulting field element (uint256) derived from the hash.
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
