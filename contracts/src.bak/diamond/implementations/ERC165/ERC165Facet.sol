// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IERC165} from "../../../interfaces/IERC165.sol";
import {ERC165Lib} from "./ERC165Lib.sol";

/// @title ERC165Facet
/// @author Ralph Schuler
/// @notice Implements the ERC165 standard interface detection for Diamonds.
/// @dev This facet uses `ERC165Lib` to look up supported interfaces in storage.
contract ERC165Facet is IERC165 {
    /// @inheritdoc IERC165
    /// @notice Returns true if this contract implements the given interface.
    /// @param interfaceId The interface identifier, as specified in ERC-165.
    /// @return True if the interface is supported, false otherwise.
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return ERC165Lib.s().supportedInterfaces[interfaceId];
    }
}
