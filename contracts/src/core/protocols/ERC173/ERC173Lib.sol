// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ERC173 Storage Layout
/// @notice Defines the storage structure for ERC-173 Ownership Standard.
/// @dev Used by `ERC173Facet` and `ERC173` modifier for ownership checks.
struct ERC173Storage {
    /// @notice The current owner of the diamond (or contract).
    address owner;
}

/// @title ERC173 Library
/// @notice Provides access to the ERC173 storage slot for Diamonds.
/// @dev Uses a fixed storage position to ensure consistency across facets.
library ERC173Lib {
    /// @dev Storage slot for ERC173 data, derived from a unique hash.
    bytes32 constant ERC173_STORAGE_POSITION = keccak256("erc173.storage");

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        INTERNAL FUNCTIONS                                      //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /// @notice Returns a pointer to the ERC173 storage struct.
    /// @dev Uses inline assembly to bind the storage pointer to the fixed slot.
    /// @return storageStruct The ERC173 storage struct (read/write access).
    function s() internal pure returns (ERC173Storage storage storageStruct) {
        bytes32 position = ERC173_STORAGE_POSITION;
        assembly {
            storageStruct.slot := position
        }
    }
}
