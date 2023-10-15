## Uniswap V3 Clone

We'll be recreating the core smart contracts of Uniswap V3 and a simple UI using next JS to interact with the smart contracts.

**Tools Used**

- We'll be using Foundry to write, compile, test and deploy our smart contracts.
- We'll be using libraries and interfaces to keep the code modular and easy to extend

## Math Behind Uniswap V3

**Uniswap V2**
It's important to understand how uniswap V2's mathematics works before jumping on to Uniswap V3

Constant product formula
x\*y= k

Uniswap V2 is an automated market maker (AMM) and relies on the principle that the product amount of token0 (x) and token1 (y) is constant (k), and rebalance updates the cost of the other token in order to maintain the constant k.

**Uniswap V3**
Some of the drawbacks of Uniswap V2 are that the tokens provided by the liquidity providers have to spread out throughout the curve k= x\*y in order to maintain the constant and that renders the liquidity quite inefficient . This is especially true for stable coins which trade in very narrow ranges. Example: ETH/USDC, USDC/USDT pairs.

Uniswap V3 brings in the concept of Concentrated Liquidity that allows the Liquidity Providers to deploy there capital in narrow price ranges. Basically each price range of specific token pool is a specific smart contract in itself.
