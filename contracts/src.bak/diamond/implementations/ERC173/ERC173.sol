// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173Lib} from "./ERC173Lib.sol";

/// @title ERC173 Ownership Base Contract
/// @notice Provides the `onlyOwner` modifier for access control in Diamonds.
/// @dev Relies on `ERC173Lib` for persistent storage of the owner address.
abstract contract ERC173 {
    /// @notice Restricts function access to the current owner.
    /// @dev Uses `ERC173Lib.s().owner` as the authoritative storage location.
    ///      Reverts with `"UNAUTHORIZED"` if the caller is not the owner.
    modifier onlyOwner() {
        require(msg.sender == ERC173Lib.s().owner, "UNAUTHORIZED");
        _;
    }
}
