// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../core/protocols/ERC173/ERC173.sol";
import {ERC1155Lib} from "../ERC1155/ERC1155Lib.sol";
import {ResourceIds} from "../../constants/ResourceIds.sol";
import {IERC20} from "../../interfaces/IERC20.sol";

/// @title ERC20Proxy
/// @notice ERC20 Facet, das eine Resource-ID aus ERC1155Lib als ERC20 darstellt
contract ERC20Proxy is ERC173, IERC20 {
    // --- Config ---
    uint256 private _resourceId = uint256(ResourceIds.GOLD);
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
        return ERC1155Lib.totalSupply(_resourceId);
    }

    function balanceOf(address account) external view returns (uint256) {
        return ERC1155Lib.balanceOf(account, _resourceId);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        ERC1155Lib._transfer(msg.sender, to, _resourceId, amount);
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
        ERC1155Lib._transfer(from, to, _resourceId, amount);
        emit Transfer(from, to, amount);
        return true;
    }

}
