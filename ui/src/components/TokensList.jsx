const tokens = ["WETH", "USDC"];

const TokensList = (props) => {
  return (
    <select
      className="bg-slate-50 border border-purple-400 rounded mb-2 rounded-tl-none rounded-bl-none border-l-0"
      defaultValue={props.selected}
    >
      {tokens.map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>
  );
};

export default TokensList;
