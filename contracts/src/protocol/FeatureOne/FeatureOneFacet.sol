// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {FeatureOneLib} from "./FeatureOneLib.sol";

/// @title FeatureOneFacet
/// @notice Example facet demonstrating custom logic and owner-restricted functions.
/// @dev Uses `FeatureOneLib` for the actual computation logic.
///      Inherits from `ERC173` to gain the `onlyOwner` modifier.
contract FeatureOneFacet is ERC173 {
    /// @notice Executes a math operation with the provided input.
    /// @dev Public function callable by anyone.
    /// @param _a The input value for the computation.
    function a(uint256 _a) external {
        FeatureOneLib.doComplexeMath(_a);
    }

    /// @notice Executes a math operation restricted to the contract owner.
    /// @dev Uses `onlyOwner` modifier to restrict access.
    /// @param _b The input value for the computation.
    function b(uint256 _b) external onlyOwner {
        FeatureOneLib.doComplexeMath(_b);
    }
}
