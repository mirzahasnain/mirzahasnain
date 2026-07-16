// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../src/FlokiFrunkFOMO.sol";

/// @dev Minimal subset of Foundry's cheatcode interface so this test needs no
///      external library (forge-std) dependency.
interface Vm {
    function createSelectFork(string calldata urlOrAlias) external returns (uint256);
    function prank(address) external;
    function label(address account, string calldata newLabel) external;
}

contract FlokiFrunkFOMOTest {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    FlokiFrunkFOMO token;

    address owner = address(0xA11CE);
    address payable feeWallet = payable(address(0xFEE));
    address user = address(0xB0B);
    address user2 = address(0xCAFE);

    // 1,000,000,000 tokens with 18 decimals
    uint256 constant SUPPLY = 1_000_000_000 ether;

    function setUp() public {
        // Fork BSC mainnet so the hardcoded PancakeSwap V2 router/factory exist.
        vm.createSelectFork("bsc");

        token = new FlokiFrunkFOMO(
            owner,
            "Floki Frunk FOMO",
            "FFF",
            18,
            SUPPLY,
            100, // max tx percent
            100, // max wallet percent
            feeWallet
        );
    }

    function testDeploymentMetadata() public view {
        require(
            keccak256(bytes(token.name())) == keccak256(bytes("Floki Frunk FOMO")),
            "name mismatch"
        );
        require(keccak256(bytes(token.symbol())) == keccak256(bytes("FFF")), "symbol mismatch");
        require(token.decimals() == 18, "decimals mismatch");
        require(token.totalSupply() == SUPPLY, "supply mismatch");
        require(token.balanceOf(owner) == SUPPLY, "owner should hold full supply");
        require(token.pcsV2Pair() != address(0), "PancakeSwap pair not created");
    }

    /// Owner is excluded from fees, so a transfer moves the full amount.
    function testOwnerTransferNoFee() public {
        uint256 amount = 1_000 ether;

        vm.prank(owner);
        token.transfer(user, amount);

        require(token.balanceOf(user) == amount, "user should receive full amount from owner");
        require(token.balanceOf(owner) == SUPPLY - amount, "owner balance should decrease");
    }

    /// Transfers between non-excluded accounts incur the token's fees.
    function testFeeTransferBetweenUsers() public {
        vm.prank(owner);
        token.transfer(user, 100_000 ether);

        uint256 sendAmount = 10_000 ether;
        vm.prank(user);
        token.transfer(user2, sendAmount);

        uint256 received = token.balanceOf(user2);
        require(received > 0, "recipient should receive tokens");
        require(received < sendAmount, "fees should be deducted between non-excluded accounts");
    }
}
