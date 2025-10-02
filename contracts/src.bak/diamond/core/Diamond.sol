// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {DiamondCutLib, DiamondCutStorage, FacetCut} from "./DiamondCut/DiamondCutLib.sol";

/// @notice Thrown when a function selector does not match any facet in the diamond.
/// @param _functionSelector The selector that was not found.
error FunctionNotFound(bytes4 _functionSelector);

/// @notice Arguments used during diamond deployment.
/// @dev Passed to the constructor to initialize facets and run optional setup.
/// @param init The address of a contract/facet to call during initialization
/// @param initCalldata Calldata to pass to the initializer contract
struct DiamondArgs {
    address init;
    bytes initCalldata;
}

/// @title Diamond Proxy Contract
/// @notice Implements the core diamond proxy pattern (EIP-2535).
/// @dev Forwards calls to facets based on function selector lookups.
///      Uses `delegatecall` to preserve storage and context.
contract Diamond {
    /// @notice Deploys a new diamond and executes the initial diamond cut.
    /// @param diamondCut Initial facet cut definitions (facets + selectors).
    /// @param args Initialization arguments (optional init call).
    constructor(FacetCut[] memory diamondCut, DiamondArgs memory args) payable {
        DiamondCutLib.diamondCut(diamondCut, args.init, args.initCalldata);
    }

    /// @notice Fallback that routes calls to the appropriate facet.
    /// @dev Uses selector-to-facet mapping in `DiamondCutStorage`.
    ///      Reverts with `FunctionNotFound` if selector is not registered.
    fallback() external payable {
        DiamondCutStorage storage ds;
        bytes32 position = DiamondCutLib.DIAMOND_CUT_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }

        // lookup facet for this selector
        address facet = ds.facetAddressAndSelectorPosition[msg.sig].facetAddress;
        if (facet == address(0)) {
            revert FunctionNotFound(msg.sig);
        }

        // Delegatecall into the facet
        assembly {
            // copy calldata
            calldatacopy(0, 0, calldatasize())

            // delegatecall into facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)

            // copy returndata
            returndatacopy(0, 0, returndatasize())

            // bubble result
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /// @notice Receive function for plain ETH transfers.
    /// @dev Required so the diamond can accept ETH.
    receive() external payable {}
}
