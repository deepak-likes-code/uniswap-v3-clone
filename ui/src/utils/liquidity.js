import { ethers } from "ethers";

export const addLiquidity = (
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
