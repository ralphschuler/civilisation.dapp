// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {ResourcesLib, ResourceIds} from "../Resources/ResourcesLib.sol";

/// @title ResourceTokenFacet
/// @notice ERC20 Facet, das eine Resource-ID aus ResourcesLib als ERC20 darstellt
contract ERC20TokenFacet is ERC173 {
    // --- Config ---
    uint256 private _resourceId = ResourceIds.GOLD;
    string private _name = "Gold";
    string private _symbol = "GLD";

    // --- ERC20 Metadata ---
    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    // --- ERC20 Standard Methods ---
    function totalSupply() external view returns (uint256) {
        return ResourcesLib.totalSupply(_resourceId);
    }

    function balanceOf(address account) external view returns (uint256) {
        return ResourcesLib.balanceOf(account, _resourceId);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        ResourcesLib._transfer(msg.sender, to, _resourceId, amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address, address) external pure returns (uint256) {
        return type(uint256).max;
    }

    function approve(address, uint256) external pure returns (bool) {
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        ResourcesLib._transfer(from, to, _resourceId, amount);
        emit Transfer(from, to, amount);
        return true;
    }

    // --- Events (ERC20) ---
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
