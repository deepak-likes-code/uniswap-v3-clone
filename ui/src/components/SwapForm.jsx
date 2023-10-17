import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { MetaMaskContext } from "../context/Metamask";
import TokensList from "./TokensList";

const addLiquidity = (
  account,
  { token0, token1, manager },
  { managerAddress, poolAddress }
) => {
  if (!token0 || !token1) {
    return;
  }

  const amount0 = ethers.utils.parseEther("0.998976618347425280");
  const amount1 = ethers.utils.parseEther("5000"); // 5000 USDC
  const lowerTick = 84222;
  const upperTick = 86129;
  const liquidity = ethers.BigNumber.from("1517882343751509868544");
  const extra = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address"],
    [token0.address, token1.address, account]
  );

  // Approve the manager to spend the tokens
  Promise.all([
    token0.allowance(account, managerAddress),
    token1.allowance(account, managerAddress),
  ])
    .then(([allowance0, allowance1]) => {
      return (
        Promise.resolve()
          .then(() => {
            if (allowance0.lt(amount0)) {
              return token0
                .approve(managerAddress, amount0)
                .then((tx) => tx.wait());
            }
          })
          .then(() => {
            if (allowance1.lt(amount1)) {
              return token1
                .approve(managerAddress, amount1)
                .then((tx) => tx.wait());
            }
          })

          // Once the manager is approved, mint the liquidity
          .then(() => {
            return manager
              .mint(poolAddress, lowerTick, upperTick, liquidity, extra)
              .then((tx) => tx.wait());
          })
          .then(() => {
            alert("Liquidity added!");
          })
      );
    })
    .catch((err) => {
      console.error(err);
      alert("Failed!");
    });
};

const swap = (
  amountIn,
  account,
  { tokenIn, manager, token0, token1 },
  { managerAddress, poolAddress }
) => {
  const amountInWei = ethers.utils.parseEther(amountIn);
  const extra = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "address"],
    [token0.address, token1.address, account]
  );

  tokenIn
    .allowance(account, managerAddress)
    .then((allowance) => {
      if (allowance.lt(amountInWei)) {
        return tokenIn
          .approve(managerAddress, amountInWei)
          .then((tx) => tx.wait());
      }
    })
    .then(() => {
      return manager.swap(poolAddress, extra).then((tx) => tx.wait());
    })
    .then(() => {
      alert("Swap succeeded!");
    })
    .catch((err) => {
      console.error(err);
      alert("Failed!");
    });
};

const SwapForm = (props) => {
  const metamaskContext = useContext(MetaMaskContext);
  const enabled = metamaskContext.status === "connected";

  const amount0 = 0.008396714242162444;
  const amount1 = 42;

  const [token0, setToken0] = useState();
  const [token1, setToken1] = useState();
  const [manager, setManager] = useState();

  useEffect(() => {
    setToken0(
      new ethers.Contract(
        props.config.token0Address,
        props.config.ABIs.ERC20,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      )
    );
    setToken1(
      new ethers.Contract(
        props.config.token1Address,
        props.config.ABIs.ERC20,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      )
    );
    setManager(
      new ethers.Contract(
        props.config.managerAddress,
        props.config.ABIs.Manager,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      )
    );
  }, []);

  const addLiquidity_ = () => {
    addLiquidity(
      metamaskContext.account,
      { token0, token1, manager },
      props.config
    );
  };

  const swap_ = (e) => {
    e.preventDefault();
    swap(
      amount1.toString(),
      metamaskContext.account,
      { tokenIn: token1, manager, token0, token1 },
      props.config
    );
  };

  return (
    <section className=" py-4 px-6 bg-cyan-500 rounded-xl shadow-lg">
      <header className="flex flex-row justify-between">
        <h1 className=" font-bold mb-4 text-gray-800">Swap tokens</h1>
        <button
          className="inline h-fit"
          disabled={!enabled}
          onClick={addLiquidity_}
        >
          Add liquidity
        </button>
      </header>
      <form className="flex flex-col">
        <fieldset className="flex flex-row">
          <input
            type="text"
            className="border border-purple-400 rounded mb-2 px-4 py-2 bg-slate-50 text-xl rounded-tr-none rounded-br-none border-r-0 w-full;
}
"
            placeholder="0.0"
            value={amount1}
            readOnly
          />
          <TokensList selected="USDC" />
        </fieldset>
        <fieldset className="flex flex-row">
          <input
            className="border border-purple-400 rounded mb-2 px-4 py-2 bg-slate-50 text-xl rounded-tr-none rounded-br-none border-r-0 w-full;"
            type="text"
            placeholder="0.0"
            value={amount0}
            readOnly
          />
          <TokensList selected="WETH" />
        </fieldset>
        <button
          className="w-full rounded-xl py-4 bg-slate-100 text-xl mt-3 hover:bg-purple-300"
          disabled={!enabled}
          onClick={swap_}
        >
          Swap
        </button>
      </form>
    </section>
  );
};

export default SwapForm;
