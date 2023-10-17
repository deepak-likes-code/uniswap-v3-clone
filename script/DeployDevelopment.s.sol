// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "../test/ERC20Mintable.sol";
import "../src/UniswapV3Pool.sol";
import "../src/UniswapV3Manager.sol";
import "forge-std/Script.sol";

contract DeployDevelopment is Script {
    function run() public {
        uint256 wethBalance = 1 ether;
        uint256 usdcBalance = 5042 ether;
        int24 currentTick = 85176;
        uint160 currentSqrtP = 5602277097478614198912276234240;



        vm.startBroadcast();


// Deploy the tokens that will be used in the pool
        ERC20Mintable token0 = new ERC20Mintable("Wrapped Ether", "WETH", 18);
        ERC20Mintable token1 = new ERC20Mintable("USD Coin", "USDC", 18);

// Deploy the uniswap pool

    UniswapV3Pool pool = new UniswapV3Pool(address(token0), address(token1), currentSqrtP, currentTick);
    UniswapV3Manager manager = new UniswapV3Manager();

    token0.mint(msg.sender, wethBalance);
    token1.mint(msg.sender, usdcBalance); 

    console.log("WETH address", address(token0));
    console.log("USDC address", address(token1));
    console.log("Pool address", address(pool));
    console.log("Manager address", address(manager));

        vm.stopBroadcast();
    }
}