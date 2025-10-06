// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ERC1155Lib
/// @notice Storage + helpers for ERC1155Lib Facet
library ERC1155Lib {
    // --- Storage Slot ---
    bytes32 constant RES_STORAGE_POSITION = keccak256("diamond.erc1155");

    // --- Storage Layout ---
    struct ERC1155Storage {
        mapping(uint256 => mapping(address => uint256)) balances; // tokenId => account => balance
        mapping(address => mapping(address => bool)) operatorApprovals; // owner => operator => approved
        mapping(uint256 => uint256) totalSupply;
    }

    // --- Accessor ---
    function s() internal pure returns (ERC1155Storage storage rs) {
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

        ERC1155Storage storage rs = s();
        uint256 fromBal = rs.balances[id][from];
        require(fromBal >= amount, "ERC1155: insufficient balance");

        unchecked {
            rs.balances[id][from] = fromBal - amount;
        }
        rs.balances[id][to] += amount;
    }

    function _mint(address to, uint256 id, uint256 amount) internal {
        require(to != address(0), "ERC1155: mint to zero");

        ERC1155Storage storage rs = s();
        rs.balances[id][to] += amount;
        rs.totalSupply[id] += amount;
    }

    function _burn(address from, uint256 id, uint256 amount) internal {
        ERC1155Storage storage rs = s();
        uint256 bal = rs.balances[id][from];
        require(bal >= amount, "ERC1155: burn exceeds balance");

        unchecked {
            rs.balances[id][from] = bal - amount;
            rs.totalSupply[id] -= amount;
        }
    }

    function totalSupply(uint256 id) internal view returns (uint256) {
        ERC1155Storage storage rs = s();
        return rs.totalSupply[id];
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
