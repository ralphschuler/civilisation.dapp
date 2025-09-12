// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibResource} from "../libraries/LibResource.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract ResourceFacet is ERC20 {
    using LibResource for *;

    event Claimed(address indexed user, uint256 amount);
    event Raided(
        address indexed attacker,
        address indexed target,
        uint256 stolen
    );
    event UpgradeStarted(
        address indexed user,
        uint256 newLevel,
        uint256 readyAt
    );

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function configure(
        uint256 baseRatePerMinute,
        uint256 baseClaimLimit,
        uint256 baseUpgradeCost,
        uint256 ratePerMinuteModifier,
        uint256 claimLimitModifier,
        uint256 upgradeCostModifier
    ) external {
        LibResource.Layout storage ds = LibResource.layout();
        ds.baseRatePerMinute = baseRatePerMinute;
        ds.baseClaimLimit = baseClaimLimit;
        ds.baseUpgradeCost = baseUpgradeCost;
        ds.ratePerMinuteModifier = ratePerMinuteModifier;
        ds.claimLimitModifier = claimLimitModifier;
        ds.upgradeCostModifier = upgradeCostModifier;
    }

    function startUpgrade(uint256 duration) external {
        LibResource.Layout storage ds = LibResource.layout();
        LibResource.updateUnclaimed(msg.sender);

        LibResource.Player storage p = ds.players[msg.sender];

        uint256 cost = LibResource.effectiveUpgradeCost(ds, p.level);
        require(balanceOf(msg.sender) >= cost, "Not enough Gold for upgrade");

        _burn(msg.sender, cost);

        p.upgradingUntil = block.timestamp + duration;
        p.level += 1;

        emit UpgradeStarted(msg.sender, p.level, p.upgradingUntil);
    }

    function claim() external {
        LibResource.Layout storage ds = LibResource.layout();
        LibResource.updateUnclaimed(msg.sender);

        LibResource.Player storage p = ds.players[msg.sender];
        uint256 amount = p.unclaimed;

        uint256 limit = LibResource.effectiveClaimLimit(ds);
        if (amount > limit) {
            amount = limit;
        }

        p.unclaimed -= amount;
        _mint(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    function raid(address target) external {
        LibResource.Layout storage ds = LibResource.layout();
        LibResource.updateUnclaimed(target);
        LibResource.updateUnclaimed(msg.sender);

        LibResource.Player storage victim = ds.players[target];
        LibResource.Player storage attacker = ds.players[msg.sender];

        require(
            block.timestamp >= attacker.lastRaid + 60 minutes,
            "Raid cooldown active"
        );
        attacker.lastRaid = block.timestamp;

        uint256 rand = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, target))
        ) % 100;

        if (rand < 50 || victim.unclaimed == 0) {
            return; // Raid failed
        }

        uint256 stolen = victim.unclaimed / 2;
        victim.unclaimed -= stolen;
        attacker.unclaimed += stolen;

        emit Raided(msg.sender, target, stolen);
    }

    function getPending(address user) external view returns (uint256) {
        return LibResource.pending(user);
    }

    function getRaidCooldownRemaining(
        address user
    ) external view returns (uint256) {
        LibResource.Player storage p = LibResource.layout().players[user];
        if (block.timestamp >= p.lastRaid + 60 minutes) {
            return 0;
        }
        return (p.lastRaid + 60 minutes) - block.timestamp;
    }
}
