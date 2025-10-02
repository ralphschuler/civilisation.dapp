// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {StarterPackConfig} from "./StarterPackConfig.sol";
import {StarterPackLib} from "./StarterPackLib.sol";

/// @title StarterPackFacet
/// @notice Facet to manage and claim starter packs
contract StarterPackFacet is ERC173 {
    event StarterPackConfigured(
        uint256 gold,
        uint256 wood,
        uint256 stone,
        uint256 iron
    );
    event StarterPackClaimed(address indexed player);

    /// @notice Configure the starter pack amounts (only owner)
    function setStarterPack(
        uint256 gold,
        uint256 wood,
        uint256 stone,
        uint256 iron
    ) external onlyOwner {
        StarterPackConfig.setStarterPack(gold, wood, stone, iron);
        emit StarterPackConfigured(gold, wood, stone, iron);
    }

    /// @notice Claim your starter pack if you don't have one yet
    function claimStarterPack() external {
        StarterPackLib.giveStarterPack(msg.sender);
        emit StarterPackClaimed(msg.sender);
    }

    /// @notice Check if a player already claimed
    function hasClaimed(address player) external view returns (bool) {
        return StarterPackConfig.hasClaimed(player);
    }

    /// @notice Preview starter pack values
    function getStarterPack()
        external
        view
        returns (uint256 gold, uint256 wood, uint256 stone, uint256 iron)
    {
        return StarterPackConfig.getStarterPack();
    }
}
