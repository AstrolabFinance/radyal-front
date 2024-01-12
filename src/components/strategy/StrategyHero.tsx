import { useContext, useMemo } from "react";
import { StrategyContext } from "~/context/strategy-context";
import StrategyCardCTAOne from "./StrategyCardCTAOne";
import StrategyCardCTATwo from "./StrategyCardCTATwo";

const StrategyHero = () => {
  const { filteredStrategies } =
    useContext(StrategyContext);

  const grouppedStrategies = useMemo(
    () => Object.values(filteredStrategies),
    [filteredStrategies]
  );

  return (
    <div
      className="overflow-hidden flex flex-col text-primary text-4xl md:text-6xl container mx-auto py-5"
      style={{ height: 'calc(100vh - 180px)' }}
    >
      <StrategyCardCTAOne strategyGroup={ grouppedStrategies[1] } />
      <div
        className="flex flex-col w-full relative"
        style={{ transform: 'rotate(-9deg)', height: 60 }}
      >
        <div
          className="text-gray-500 font-bold absolute"
          style={{ maxHeight: '60px', height: "60px", top: -35 }}
        >
          <p className="scrolling-text-rtl">
            <span>FARM
              <span className="text-sky-600"> ALL OF ARBITRUM </span>
                STABLE DEFI, IN
              <span className="text-primary"> ONE VAULT </span>
              -
            </span>
          </p>
          <p className="scrolling-text-rtl scrolling-text-shadow">
            <span>FARM
              <span className="text-sky-600"> ALL OF ARBITRUM </span>
                STABLE DEFI, IN
              <span className="text-primary"> ONE VAULT </span>
              -
            </span>
          </p>
        </div>
        <div
          className="text-gray-500 font-bold absolute"
          style={{ maxHeight: '60px', height: "60px", top: 35 }}
        >
          <p className="scrolling-text-ltr">
            <span>- PROVIDE LIQUIDITY TO THE BEST
              <span className="text-white"> STARGATE POOLS </span>
            </span>
          </p>
          <p className="scrolling-text-ltr scrolling-text-shadow">
            <span>- PROVIDE LIQUIDITY TO THE BEST
              <span className="text-white"> STARGATE POOLS </span>
            </span>
          </p>
        </div>
      </div>
      <StrategyCardCTATwo strategyGroup={ grouppedStrategies[0] }/>
    </div>
  );
};

export default StrategyHero;
