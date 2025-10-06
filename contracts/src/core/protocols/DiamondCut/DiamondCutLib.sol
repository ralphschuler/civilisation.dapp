// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Errors make cut failures more descriptive and gas efficient
error NoSelectorsGivenToAdd();
error NotContractOwner(address _user, address _contractOwner);
error NoSelectorsProvidedForFacetForCut(address _facetAddress);
error CannotAddSelectorsToZeroAddress(bytes4[] _selectors);
error NoBytecodeAtAddress(address _contractAddress, string _message);
error IncorrectFacetCutAction(uint8 _action);
error CannotAddFunctionToDiamondThatAlreadyExists(bytes4 _selector);
error CannotReplaceFunctionsFromFacetWithZeroAddress(bytes4[] _selectors);
error CannotReplaceImmutableFunction(bytes4 _selector);
error CannotReplaceFunctionWithTheSameFunctionFromTheSameFacet(bytes4 _selector);
error CannotReplaceFunctionThatDoesNotExists(bytes4 _selector);
error RemoveFacetAddressMustBeZeroAddress(address _facetAddress);
error CannotRemoveFunctionThatDoesNotExist(bytes4 _selector);
error CannotRemoveImmutableFunction(bytes4 _selector);
error InitializationFunctionReverted(address initializationContractAddress, bytes data);

/// @notice The type of diamond cut operation: add, replace or remove functions.
enum FacetCutAction {
    Add,
    Replace,
    Remove
}

/// @notice Describes a single change to the Diamond function table.
/// @param facetAddress The facet containing the implementation
/// @param action The type of cut (Add, Replace, Remove)
struct FacetCut {
    address facetAddress;
    FacetCutAction action;
    bytes4[] functionSelectors;
}

/// @notice Internal mapping from function selector → facet and selector position.
struct FacetAddressAndSelectorPosition {
    address facetAddress;
    uint16 selectorPosition;
}

/// @notice Diamond storage for managing selectors and their facet addresses.
struct DiamondCutStorage {
    mapping(bytes4 => FacetAddressAndSelectorPosition) facetAddressAndSelectorPosition;
    bytes4[] selectors;
}

/// @title DiamondCutLib (internal EIP-2535 implementation)
/// @notice Provides internal functions to add, replace, or remove functions in a Diamond.
/// @dev Storage slot is fixed via keccak256("diamond-cut.storage").
library DiamondCutLib {
    bytes32 constant DIAMOND_CUT_STORAGE_POSITION = keccak256("diamond-cut.storage");

    /// @notice Accessor for diamond cut storage
    function s() internal pure returns (DiamondCutStorage storage ds) {
        bytes32 position = DIAMOND_CUT_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    /// @notice Emitted after a successful diamondCut
    event DiamondCut(FacetCut[] _diamondCut, address init, bytes data);

    /// @notice Internal diamondCut implementation
    /// @param _diamondCut Array of FacetCut structs describing changes
    /// @param init Address to call optional initialization function on
    /// @param data Calldata for initialization function
    function diamondCut(FacetCut[] memory _diamondCut, address init, bytes memory data) internal {
        for (uint256 facetIndex; facetIndex < _diamondCut.length; facetIndex++) {
            bytes4[] memory functionSelectors = _diamondCut[facetIndex].functionSelectors;
            address facetAddress = _diamondCut[facetIndex].facetAddress;

            if (functionSelectors.length == 0) {
                revert NoSelectorsProvidedForFacetForCut(facetAddress);
            }

            FacetCutAction action = _diamondCut[facetIndex].action;
            if (action == FacetCutAction.Add) {
                addFunctions(facetAddress, functionSelectors);
            } else if (action == FacetCutAction.Replace) {
                replaceFunctions(facetAddress, functionSelectors);
            } else if (action == FacetCutAction.Remove) {
                removeFunctions(facetAddress, functionSelectors);
            } else {
                revert IncorrectFacetCutAction(uint8(action));
            }
        }
        emit DiamondCut(_diamondCut, init, data);
        initializeDiamondCut(init, data);
    }

    /// @notice Adds new function selectors to the diamond
    /// @param _facetAddress The facet implementing the functions
    /// @param _functionSelectors The selectors to add
    function addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        if (_facetAddress == address(0)) {
            revert CannotAddSelectorsToZeroAddress(_functionSelectors);
        }

        DiamondCutStorage storage ds = s();
        uint16 selectorCount = uint16(ds.selectors.length);
        enforceHasContractCode(_facetAddress, "DiamondCutLib: Add facet has no code");

        for (uint256 selectorIndex; selectorIndex < _functionSelectors.length; selectorIndex++) {
            bytes4 selector = _functionSelectors[selectorIndex];
            address oldFacetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            if (oldFacetAddress != address(0)) {
                revert CannotAddFunctionToDiamondThatAlreadyExists(selector);
            }
            ds.facetAddressAndSelectorPosition[selector] = FacetAddressAndSelectorPosition(
                _facetAddress,
                selectorCount
            );
            ds.selectors.push(selector);
            selectorCount++;
        }
    }

    /// @notice Replaces existing function selectors with a new facet address
    /// @param _facetAddress The facet providing the new implementation
    /// @param _functionSelectors The selectors to replace
    function replaceFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        DiamondCutStorage storage ds = s();
        if (_facetAddress == address(0)) {
            revert CannotReplaceFunctionsFromFacetWithZeroAddress(_functionSelectors);
        }
        enforceHasContractCode(_facetAddress, "DiamondCutLib: Replace facet has no code");
        for (uint256 selectorIndex; selectorIndex < _functionSelectors.length; selectorIndex++) {
            bytes4 selector = _functionSelectors[selectorIndex];
            address oldFacetAddress = ds.facetAddressAndSelectorPosition[selector].facetAddress;
            if (oldFacetAddress == address(this)) {
                revert CannotReplaceImmutableFunction(selector);
            }
            if (oldFacetAddress == _facetAddress) {
                revert CannotReplaceFunctionWithTheSameFunctionFromTheSameFacet(selector);
            }
            if (oldFacetAddress == address(0)) {
                revert CannotReplaceFunctionThatDoesNotExists(selector);
            }
            ds.facetAddressAndSelectorPosition[selector].facetAddress = _facetAddress;
        }
    }

    /// @notice Removes function selectors from the diamond
    /// @param _facetAddress Must be address(0) when removing
    /// @param _functionSelectors The selectors to remove
    function removeFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        DiamondCutStorage storage ds = s();
        uint256 selectorCount = ds.selectors.length;
        if (_facetAddress != address(0)) {
            revert RemoveFacetAddressMustBeZeroAddress(_facetAddress);
        }
        for (uint256 selectorIndex; selectorIndex < _functionSelectors.length; selectorIndex++) {
            bytes4 selector = _functionSelectors[selectorIndex];
            FacetAddressAndSelectorPosition memory oldFacetAddressAndSelectorPosition = ds
                .facetAddressAndSelectorPosition[selector];
            if (oldFacetAddressAndSelectorPosition.facetAddress == address(0)) {
                revert CannotRemoveFunctionThatDoesNotExist(selector);
            }
            if (oldFacetAddressAndSelectorPosition.facetAddress == address(this)) {
                revert CannotRemoveImmutableFunction(selector);
            }
            selectorCount--;
            if (oldFacetAddressAndSelectorPosition.selectorPosition != selectorCount) {
                bytes4 lastSelector = ds.selectors[selectorCount];
                ds.selectors[oldFacetAddressAndSelectorPosition.selectorPosition] = lastSelector;
                ds
                    .facetAddressAndSelectorPosition[lastSelector]
                    .selectorPosition = oldFacetAddressAndSelectorPosition.selectorPosition;
            }
            ds.selectors.pop();
            delete ds.facetAddressAndSelectorPosition[selector];
        }
    }

    /// @notice Executes optional initialization after a cut
    /// @param init Address of the contract to delegatecall
    /// @param data Initialization calldata
    function initializeDiamondCut(address init, bytes memory data) internal {
        if (init == address(0)) {
            return;
        }
        enforceHasContractCode(init, "DiamondCutLib: init address has no code");
        (bool success, bytes memory error) = init.delegatecall(data);
        if (!success) {
            if (error.length > 0) {
                /// @solidity memory-safe-assembly
                assembly {
                    let returndata_size := mload(error)
                    revert(add(32, error), returndata_size)
                }
            } else {
                revert InitializationFunctionReverted(init, data);
            }
        }
    }

    /// @notice Ensures a given address contains contract code
    /// @param _contract The address to check
    /// @param _errorMessage Custom revert message if no code is found
    function enforceHasContractCode(address _contract, string memory _errorMessage) internal view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(_contract)
        }
        if (contractSize == 0) {
            revert NoBytecodeAtAddress(_contract, _errorMessage);
        }
    }
}
