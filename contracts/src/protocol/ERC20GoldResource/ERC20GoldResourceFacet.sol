// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {ERC20GoldResourceLib} from "./ERC20GoldResourceLib.sol";

/// @title ERC20GoldResource
/// @notice ERC20-compatible facet for the "Gold" resource.
contract ERC20GoldResource is ERC173 {
    // --- Metadata ---
    string public constant name = "Gold";
    string public constant symbol = "GLD";
    uint8 public constant decimals = 18;

    // --- ERC20 Standard Functions ---

    function totalSupply() external view returns (uint256) {
        return ERC20GoldResourceLib.totalSupply();
    }

    function balanceOf(address account) external view returns (uint256) {
        return ERC20GoldResourceLib.balanceOf(account);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        ERC20GoldResourceLib._transfer(msg.sender, to, amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        ERC20GoldResourceLib.s().allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256) {
        return ERC20GoldResourceLib.allowance(owner, spender);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        uint256 currentAllowance = ERC20GoldResourceLib.s().allowances[from][
            msg.sender
        ];
        require(currentAllowance >= amount, "Gold: allowance exceeded");

        if (currentAllowance != type(uint256).max) {
            ERC20GoldResourceLib.s().allowances[from][msg.sender] =
                currentAllowance -
                amount;
        }

        ERC20GoldResourceLib._transfer(from, to, amount);
        emit Transfer(from, to, amount);
        return true;
    }

    // --- Mint / Burn ---
    function mint(address to, uint256 amount) external onlyOwner {
        ERC20GoldResourceLib._mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        ERC20GoldResourceLib._burn(from, amount);
        emit Transfer(from, address(0), amount);
    }

    // --- Events ---
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
