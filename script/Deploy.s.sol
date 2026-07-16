// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../src/FlokiFrunkFOMO.sol";

/// @dev Minimal subset of Foundry's cheatcode interface (avoids forge-std dep).
interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
    function envOr(string calldata name, address defaultValue) external returns (address);
}

contract Deploy {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    // Default anvil account #0.
    address constant DEFAULT_OWNER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function run() external returns (FlokiFrunkFOMO token) {
        address owner = vm.envOr("TOKEN_OWNER", DEFAULT_OWNER);

        vm.startBroadcast();
        token = new FlokiFrunkFOMO(
            owner,
            "Floki Frunk FOMO",
            "FFF",
            18,
            1_000_000_000 ether,
            100,
            100,
            payable(owner)
        );
        vm.stopBroadcast();
    }
}
