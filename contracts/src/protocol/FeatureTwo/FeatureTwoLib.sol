// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title FeatureTwo Storage Layout
/// @notice Defines the storage structure for the FeatureTwo facet.
/// @dev Stored in a fixed slot to avoid collisions with other facets.
struct FeatureTwoStorage {
    /// @notice Example stored value for FeatureTwo logic.
    uint256 v2;
}

/// @title FeatureTwoLib
/// @author Ralph Schuler
/// @notice Provides internal storage access and business logic for FeatureTwoFacet.
/// @dev Uses a fixed storage position (`keccak256("feature-two.storage")`) to ensure
///      compatibility inside the diamond.
library FeatureTwoLib {
    /// @dev Storage slot for FeatureTwo data.
    bytes32 constant FEATURE_TWO_STORAGE_POSITION = keccak256("feature-two.storage");

    /// @notice Performs a simple math operation and updates storage.
    /// @dev Example: increments the given value and stores it in `v2`.
    /// @param b The input value.
    function doComplexeMath(uint256 b) internal {
        s().v2 = b + 1;
    }

    /// @notice Returns a pointer to the FeatureTwo storage struct.
    /// @dev Uses inline assembly to bind the struct to the fixed storage slot.
    /// @return storageStruct The FeatureTwo storage struct (read/write access).
    function s() internal pure returns (FeatureTwoStorage storage storageStruct) {
        bytes32 position = FEATURE_TWO_STORAGE_POSITION;
        assembly {
            storageStruct.slot := position
        }
    }
}
