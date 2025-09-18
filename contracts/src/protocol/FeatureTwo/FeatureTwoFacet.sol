// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {FeatureTwoLib} from "./FeatureTwoLib.sol";

/// @title FeatureTwoFacet
/// @notice Example facet demonstrating a second feature with public and owner-only functions.
/// @dev Uses `FeatureTwoLib` for computation logic and `ERC173` for access control.
contract FeatureTwoFacet is ERC173 {
    /// @notice Executes a math operation with the provided input.
    /// @dev Publicly callable by any account.
    /// @param _c The input value for the computation.
    function c(uint256 _c) external {
        FeatureTwoLib.doComplexeMath(_c);
    }

    /// @notice Executes a math operation restricted to the contract owner.
    /// @dev Uses the `onlyOwner` modifier to restrict execution.
    /// @param _d The input value for the computation.
    function d(uint256 _d) external onlyOwner {
        FeatureTwoLib.doComplexeMath(_d);
    }
}
