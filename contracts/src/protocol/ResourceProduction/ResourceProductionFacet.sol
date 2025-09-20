// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC173} from "../../diamond/implementations/ERC173/ERC173.sol";
import {ResourcesLib, ResourceIds} from "../Resources/ResourcesLib.sol";
import {ResourceProductionLib} from "./ResourceProductionLib.sol";
import {ResourceProductionConfig} from "./ResourceProductionConfig.sol";
import {StarterPackLib} from "../StarterPack/StarterPackLib.sol";

/// @title ResourceProductionFacet
/// @notice Handles timed generation of resources per player
contract ResourceProductionFacet is ERC173 {
    using ResourceProductionLib for address;

    uint256 public constant GOLD = ResourceIds.GOLD; // ID aus ERC1155Resources

    event Claimed(
        address indexed player,
        uint256 indexed resourceId,
        uint256 amount
    );
    event UpgradeStarted(
        address indexed player,
        uint256 indexed resourceId,
        uint256 level,
        uint256 endsAt
    );

    /// @notice View pending claimable resources
    function pending(
        address player,
        uint256 resourceId
    ) external view returns (uint256) {
        return ResourceProductionLib.pending(player, resourceId);
    }

    /// @notice Claim produced resources
    function claim(uint256 resourceId) external {
        StarterPackLib.giveIfNew(msg.sender);

        uint256 amount = ResourceProductionLib._applyClaim(
            msg.sender,
            resourceId
        );
        require(amount > 0, "Nothing to claim");

        ResourcesLib._mint(msg.sender, resourceId, amount);
        emit Claimed(msg.sender, resourceId, amount);
    }

    /// @notice Start an upgrade for a resource
    /// @dev Requires Gold as payment, production paused until done
    function startUpgrade(uint256 resourceId, uint256 duration) external {
        ResourceProductionLib.Production storage p = ResourceProductionLib
            .s()
            .productions[msg.sender][resourceId];
        require(block.timestamp >= p.upgradeEndsAt, "Already upgrading");

        // Hole Werte für nächstes Level
        (
            uint256 newRate,
            uint256 newLimit,
            uint256 cost
        ) = ResourceProductionConfig.valuesAt(resourceId, p.level + 1);

        // Zahle Kosten in Gold
        ResourcesLib._burn(msg.sender, GOLD, cost);

        // Starte Upgrade
        p.upgradeEndsAt = block.timestamp + duration;
        p.ratePerMinute = newRate;
        p.claimLimit = newLimit;
        p.level += 1;

        emit UpgradeStarted(msg.sender, resourceId, p.level, p.upgradeEndsAt);
    }
}
