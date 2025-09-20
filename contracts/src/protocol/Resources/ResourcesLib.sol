// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library ResourceIds {
    uint256 constant GOLD = 1;
    uint256 constant IRON = 2;
    uint256 constant STONE = 3;
    uint256 constant WOOD = 4;
}

/// @title ERC1155ResourcesLib
/// @notice Storage + helpers for ERC1155Resources Facet
library ResourcesLib {
    // --- Storage Slot ---
    bytes32 constant RES_STORAGE_POSITION = keccak256("diamond.resources");

    // --- Storage Layout ---
    struct ResourcesStorage {
        mapping(uint256 => mapping(address => uint256)) balances; // tokenId => account => balance
        mapping(address => mapping(address => bool)) operatorApprovals; // owner => operator => approved
    }

    // --- Accessor ---
    function s() internal pure returns (ResourcesStorage storage rs) {
        bytes32 pos = RES_STORAGE_POSITION;
        assembly {
            rs.slot := pos
        }
    }

    // --- Helpers ---
    function balanceOf(
        address account,
        uint256 id
    ) internal view returns (uint256) {
        require(account != address(0), "ERC1155: zero address");
        return s().balances[id][account];
    }

    function _transfer(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) internal {
        require(to != address(0), "ERC1155: transfer to zero");

        ResourcesStorage storage rs = s();
        uint256 fromBal = rs.balances[id][from];
        require(fromBal >= amount, "ERC1155: insufficient balance");

        unchecked {
            rs.balances[id][from] = fromBal - amount;
        }
        rs.balances[id][to] += amount;
    }

    function _mint(address to, uint256 id, uint256 amount) internal {
        require(to != address(0), "ERC1155: mint to zero");

        ResourcesStorage storage rs = s();
        rs.balances[id][to] += amount;
    }

    function _burn(address from, uint256 id, uint256 amount) internal {
        ResourcesStorage storage rs = s();
        uint256 bal = rs.balances[id][from];
        require(bal >= amount, "ERC1155: burn exceeds balance");

        unchecked {
            rs.balances[id][from] = bal - amount;
        }
    }

    // --- Receiver checks ---
    function _callOnReceived(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal {
        if (_isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155Received(
                    operator,
                    from,
                    id,
                    amount,
                    data
                )
            returns (bytes4 retval) {
                require(
                    retval == IERC1155Receiver.onERC1155Received.selector,
                    "ERC1155: invalid onReceived"
                );
            } catch {
                revert("ERC1155: transfer rejected");
            }
        }
    }

    function _callOnBatchReceived(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal {
        if (_isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155BatchReceived(
                    operator,
                    from,
                    ids,
                    amounts,
                    data
                )
            returns (bytes4 retval) {
                require(
                    retval == IERC1155Receiver.onERC1155BatchReceived.selector,
                    "ERC1155: invalid onBatchReceived"
                );
            } catch {
                revert("ERC1155: batch transfer rejected");
            }
        }
    }

    function _isContract(address account) private view returns (bool) {
        return account.code.length > 0;
    }
}

// Minimal IERC1155Receiver interface
interface IERC1155Receiver {
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external returns (bytes4);

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external returns (bytes4);
}
