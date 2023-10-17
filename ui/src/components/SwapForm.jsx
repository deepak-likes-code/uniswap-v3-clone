import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { MetaMaskContext } from "../context/Metamask";
import swap from "../utils/swap";
import addLiquidity from "../utils/liquidity";
import TokensList from "./TokensList";

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
