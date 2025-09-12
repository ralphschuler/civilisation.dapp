// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DiamondInit {
    event DiamondInitialized(address indexed owner);

    function init() external {
        // Beispiel: du kannst hier globalen State setzen
        emit DiamondInitialized(msg.sender);
    }
}
