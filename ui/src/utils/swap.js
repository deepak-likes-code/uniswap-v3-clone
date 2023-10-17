import { ethers } from "ethers";

export const swap = (
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
