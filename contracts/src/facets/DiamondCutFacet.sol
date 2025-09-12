// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {LibDiamond} from "../diamond/libraries/LibDiamond.sol";

contract DiamondCutFacet is IDiamondCut {
    function diamondCut(
        FacetCut[] calldata _cut,
        address _init,
        bytes calldata _calldata
    ) external override {
        LibDiamond.enforceIsContractOwner();
        for (uint i; i < _cut.length; i++) {
            // (hier: Facet hinzufügen/entfernen/updaten – implementiert wie in EIP2535 Reference)
        }

        if (_init != address(0)) {
            (bool success, bytes memory error) = _init.delegatecall(_calldata);
            require(success, string(error));
        }
    }
}
