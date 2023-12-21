import { useContext, useEffect } from "react";
import { StrategyContext } from "~/context/strategy-context";
import { SwapContext } from "~/context/swap-context";
import { TokensContext } from "~/context/tokens-context";
import SelectToken from "./SelectToken";
import ModalLayout from "./layout/ModalLayout";
import SwapInput from "./SwapInput";
import SwapRouteDetail from "./SwapRouteDetail";

import { tokensIsEqual } from "~/utils";
import { withdraw } from "~/utils/flows/strategy";
const Withdraw = () => {
  const { selectedStrategy } = useContext(StrategyContext);
  const {
    selectTokenMode,
    toToken,
    toValue,
    fromToken,
    selectToToken,
    switchSelectMode,
    selectFromToken,
    setFromValue,
    swap,
  } = useContext(SwapContext);

  useEffect(() => {
    selectFromToken(selectedStrategy.asset);
  }, [selectedStrategy, selectFromToken]);

  const { tokens } = useContext(TokensContext);

  if (selectTokenMode) {
    return (
      <div className="select-token block">
        <div className="box w-full">
          <SelectToken
            tokens={tokens}
            onSelect={(token) => {
              switchSelectMode();
              selectToToken(token);
            }}
          />
        </div>
      </div>
    );
  }
  const modalActions = [
    {
      label: "Withdraw",
      onClick: async () => {
        const withdrawPromise = withdraw({
          strategy: selectedStrategy,
          value: toValue,
        });
        if (tokensIsEqual(fromToken, toToken)) {
          await withdrawPromise;
          swap();
        }
      },
    },
  ];
  return (
    <ModalLayout actions={modalActions}>
      <div className="flex gap-5 relative w-full flex-col">
        <SwapInput
          locked={true}
          selected={selectedStrategy?.share}
          onChange={(value) => setFromValue(value)}
        />
        <SwapInput selected={toToken} isDestination={true} />
      </div>
      {toValue !== 0 && <SwapRouteDetail />}
    </ModalLayout>
  );
};
export default Withdraw;
