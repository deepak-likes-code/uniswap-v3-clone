// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.14;

import './lib/Tick.sol';
import './lib/Position.sol';
import './interfaces/IERC20.sol';
import "./interfaces/IUniswapV3MintCallback.sol";

contract UniswapV3Pool {

    using Tick for mapping(int24 => Tick.Info);
    using Position for mapping(bytes32 =>Position.Info);
    using Position for Position.Info;


    // Errors
    error InsufficientInputAmount();
    error InvalidTickRange();
    error ZeroLiquidity();

    // Events

  event Mint(
        address sender,
        address indexed owner,
        int24 indexed tickLower,
        int24 indexed tickUpper,
        uint128 amount,
        uint256 amount0,
        uint256 amount1
    );


    int24 internal constant MIN_TICK = -887272;
    int24 internal constant MAX_TICK = -MIN_TICK;

    // Pool tokens, immutable
    address public immutable token0;
    address public immutable token1;

    // Packing variables that are read together in a slot
    struct Slot0{
        // current sqrt(P)
        uint160 sqrtPriceX96;

        // current tick
        int24 tick;
    }

    Slot0 public slot0;

// amount of liquidity L
uint128 public liquidity;

// ticks info
mapping(int24=>Tick.Info) public ticks;

// positions info
mapping(bytes32=>Position.Info) public positions;


    constructor(
        address token0_,
        address token1_,
        uint160 sqrtPriceX96,
        int24 tick
    ) {
        token0 = token0_;
        token1 = token1_;

        slot0 = Slot0({sqrtPriceX96: sqrtPriceX96, tick: tick});
    }


// this function mint provides liquidity to the pool

function mint( address owner, int24 lowerTick, int24 upperTick, uint128 amount) external returns (uint256 amount0, uint256 amount1){
    
    if(lowerTick >=upperTick || lowerTick < MIN_TICK || upperTick > MAX_TICK) revert InvalidTickRange();

    if (amount == 0) revert ZeroLiquidity();

    ticks.update(lowerTick, amount);
    ticks.update(upperTick, amount);

    Position.Info storage position= positions.get(owner, lowerTick, upperTick);
    position.update(amount);

    amount0 = 0.998976618347425280 ether;
    amount1 = 5000 ether;


    // update the liquidity of the pool
    liquidity += uint128(amount);



    // Take the tokens from the user

    uint256 balance0Before;
    uint256 balance1Before;

    if (amount0 > 0) balance0Before = balance0();
    if (amount1 > 0) balance1Before = balance1();

    IUniswapV3MintCallback(msg.sender).uniswapV3MintCallback(amount0, amount1);

    if (amount0 > 0 && balance0Before + amount0 > balance0()) revert InsufficientInputAmount();
    if (amount1 > 0 && balance1Before + amount1 > balance1()) revert InsufficientInputAmount();


emit Mint(msg.sender, owner, lowerTick, upperTick, amount, amount0, amount1);


}


    ////////////////////////////////////////////////////////////////////////////
    //
    // INTERNAL
    //
    ////////////////////////////////////////////////////////////////////////////


function balance0() internal returns (uint256 balance){
    balance= IERC20(token0).balanceOf(address(this));
}



function balance1() internal returns (uint256 balance){
    balance= IERC20(token1).balanceOf(address(this));

}

    
}