// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title FeatureOne Storage Layout
/// @notice Defines the storage structure for the FeatureOne facet.
/// @dev Stored in a fixed slot to ensure compatibility across facets.
struct FeatureOneStorage {
    /// @notice Example stored value for FeatureOne logic.
    uint256 v1;
}

/// @title FeatureOne Library
/// @notice Provides internal storage access and business logic for FeatureOneFacet.
/// @dev Uses a fixed storage position to avoid slot collisions inside the diamond.
library FeatureOneLib {
    /// @dev Storage slot for FeatureOne data, derived from a unique hash.
    bytes32 constant FEATURE_ONE_STORAGE_POSITION = keccak256("feature-one.storage");

    /// @notice Returns a pointer to the FeatureOne storage struct.
    /// @dev Uses inline assembly to bind the struct to the fixed storage slot.
    /// @return storageStruct The FeatureOne storage struct (read/write access).
    function s() internal pure returns (FeatureOneStorage storage storageStruct) {
        bytes32 position = FEATURE_ONE_STORAGE_POSITION;
        assembly {
            storageStruct.slot := position
        }
    }

    /// @notice Performs a simple math operation and updates storage.
    /// @dev Example function that increments the given value and stores it in `v1`.
    /// @param a The input value.
    function doComplexeMath(uint256 a) internal {
        s().v1 = a + 1;
    }
}
