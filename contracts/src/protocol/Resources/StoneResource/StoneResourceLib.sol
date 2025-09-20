// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title StoneLib
/// @notice Storage and helper functions for the Stone  Facet.
library StoneResourceLib {
    // --- Storage Slot ---
    bytes32 constant Stone_STORAGE_POSITION =
        keccak256("diamond.resource.Stone");

    // --- Storage Layout ---
    struct StoneStorage {
        uint256 totalSupply;
        mapping(address => uint256) balances;
        mapping(address => mapping(address => uint256)) allowances;
    }

    // --- Accessor ---
    function s() internal pure returns (StoneStorage storage gs) {
        bytes32 pos = Stone_STORAGE_POSITION;
        assembly {
            gs.slot := pos
        }
    }

    // ---  Helper Functions ---

    function balanceOf(address account) internal view returns (uint256) {
        return s().balances[account];
    }

    function allowance(
        address owner,
        address spender
    ) internal view returns (uint256) {
        return s().allowances[owner][spender];
    }

    function totalSupply() internal view returns (uint256) {
        return s().totalSupply;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Stone: transfer to zero");

        StoneStorage storage gs = s();
        uint256 bal = gs.balances[from];
        require(bal >= amount, "Stone: insufficient balance");

        unchecked {
            gs.balances[from] = bal - amount;
        }
        gs.balances[to] += amount;
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "Stone: mint to zero");

        StoneStorage storage gs = s();
        gs.totalSupply += amount;
        gs.balances[to] += amount;
    }

    function _burn(address from, uint256 amount) internal {
        StoneStorage storage gs = s();
        uint256 bal = gs.balances[from];
        require(bal >= amount, "Stone: burn exceeds balance");

        unchecked {
            gs.balances[from] = bal - amount;
            gs.totalSupply -= amount;
        }
    }
}
