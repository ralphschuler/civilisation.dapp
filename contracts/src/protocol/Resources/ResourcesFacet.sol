// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {ERC1155ResourcesLib} from "./ResourcesLib.sol";

/// @title ERC1155Resources
/// @notice ERC1155 Facet for game resources: GOLD, IRON, STONE, WOOD
contract ERC1155Resources is ERC173 {
    // --- Resource IDs ---
    uint256 public constant GOLD = 1;
    uint256 public constant IRON = 2;
    uint256 public constant STONE = 3;
    uint256 public constant WOOD = 4;

    // --- Metadata ---
    function uri(uint256 id) external pure returns (string memory) {
        return "ipfs://someJSON.json";
    }

    // --- ERC1155 Standard Functions ---

    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256) {
        return ERC1155ResourcesLib.balanceOf(account, id);
    }

    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory balances) {
        require(accounts.length == ids.length, "ERC1155: length mismatch");
        balances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            balances[i] = ERC1155ResourcesLib.balanceOf(accounts[i], ids[i]);
        }
    }

    function setApprovalForAll(address operator, bool approved) external {
        ERC1155ResourcesLib.s().operatorApprovals[msg.sender][
            operator
        ] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(
        address account,
        address operator
    ) external view returns (bool) {
        return ERC1155ResourcesLib.s().operatorApprovals[account][operator];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external {
        require(
            from == msg.sender ||
                ERC1155ResourcesLib.s().operatorApprovals[from][msg.sender],
            "ERC1155: not approved"
        );

        ERC1155ResourcesLib._transfer(from, to, id, amount);

        emit TransferSingle(msg.sender, from, to, id, amount);

        ERC1155ResourcesLib._callOnReceived(
            msg.sender,
            from,
            to,
            id,
            amount,
            data
        );
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external {
        require(ids.length == amounts.length, "ERC1155: length mismatch");
        require(
            from == msg.sender ||
                ERC1155ResourcesLib.s().operatorApprovals[from][msg.sender],
            "ERC1155: not approved"
        );

        for (uint256 i = 0; i < ids.length; i++) {
            ERC1155ResourcesLib._transfer(from, to, ids[i], amounts[i]);
        }

        emit TransferBatch(msg.sender, from, to, ids, amounts);

        ERC1155ResourcesLib._callOnBatchReceived(
            msg.sender,
            from,
            to,
            ids,
            amounts,
            data
        );
    }

    // --- Mint / Burn ---
    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        ERC1155ResourcesLib._mint(to, id, amount);
        emit TransferSingle(msg.sender, address(0), to, id, amount);
    }

    function burn(address from, uint256 id, uint256 amount) external onlyOwner {
        ERC1155ResourcesLib._burn(from, id, amount);
        emit TransferSingle(msg.sender, from, address(0), id, amount);
    }

    // --- Events ---
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );
    event ApprovalForAll(
        address indexed account,
        address indexed operator,
        bool approved
    );
    event URI(string value, uint256 indexed id);
}
