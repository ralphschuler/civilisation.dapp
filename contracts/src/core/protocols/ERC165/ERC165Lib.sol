// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ERC165 Storage Layout
/// @notice Defines the storage structure for ERC165 interface detection.
struct ERC165Storage {
	/// @dev Mapping of interface ID to support status (`true` if supported).
	mapping(bytes4 => bool) supportedInterfaces;
}

/// @title ERC165 Library
/// @notice Provides functions for managing ERC165 interface support in diamond storage.
/// @dev Uses a fixed storage slot to ensure consistent layout across facets.
library ERC165Lib {
	/// @dev Storage slot for ERC165 data, derived from a unique hash.
	bytes32 constant ERC165_STORAGE_POSITION = keccak256("erc165.storage");

	/// @notice Returns a pointer to the ERC165 storage struct.
	/// @dev Uses inline assembly to assign the storage slot.
	/// @return storageStruct The ERC165 storage struct.
	function s() internal pure returns (ERC165Storage storage storageStruct) {
		bytes32 position = ERC165_STORAGE_POSITION;
		assembly {
			storageStruct.slot := position
		}
	}

	/// @notice Sets or unsets support for a given interface.
	/// @dev Cannot set the invalid `0xffffffff` interface ID (reserved in ERC165).
	/// @param interfaceId The interface ID to mark as supported or unsupported.
	/// @param status Whether to enable (`true`) or disable (`false`) support.
	function setSupportedInterface(bytes4 interfaceId, bool status) internal {
		require(interfaceId != 0xffffffff, "Invalid ID");
		s().supportedInterfaces[interfaceId] = status;
	}
}
