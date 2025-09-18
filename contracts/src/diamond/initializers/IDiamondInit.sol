pragma solidity ^0.8.30;

interface IDiamondInit {
    /// @notice Init function that must be (delegated) call when deploying the diamond contract.
    function init() external;
}
