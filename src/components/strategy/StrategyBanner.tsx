import { useMemo } from "react";
import { Strategy } from "~/utils/interfaces";

import IconCard from "../IconCard";
import clsx from "clsx";

type StrategyBannerProps = {
  strategyOne: Strategy;
  strategyTwo: Strategy;
};

const StrategyBanner = ({ strategyOne, strategyTwo }: StrategyBannerProps) => {
  const size = { width: 55, height: 55 };
  const [titleOne, titleTwo] = useMemo(
    () => {
      if (!strategyOne || !strategyTwo) return [null, null];
      const { name: nameOne } = strategyOne;
      const [titleOne]  = nameOne.replace("Astrolab ", "").split(" ");
      const { name: nameTwo } = strategyTwo;
      const [titleTwo]  = nameTwo.replace("Astrolab ", "").split(" ");
      return [titleOne.toUpperCase(), titleTwo.toUpperCase()]
    }, [strategyOne, strategyTwo]
  )
  return (
  <div
    className={ clsx(
      "flex flex-col w-screen max-w-full text-7xl gilroy italic font-black my-auto"
      )}
  >
    <div className="strategy-banner-wrapper -mx-12">
      <div className="text-gray-500 flex h-14">
        <div className="scrolling-text-rtl">
          <span>
            FARM<span className="text-sky-600"> ALL OF { titleOne }&nbsp;
            { strategyOne?.network.icon && <IconCard
              icon={{
                url: strategyOne?.network.icon,
                alt: strategyOne?.network.name,
                size,
              }}
            />}
            </span>&nbsp;STABLE DEFI - IN<span className="text-primary"> ONE VAULT </span>-&nbsp;
          </span>
        </div>
        <div className="scrolling-text-rtl scrolling-text-shadow">
          <span>
            FARM<span className="text-sky-600"> ALL OF { titleOne }&nbsp;
            { strategyOne?.network.icon &&
              <IconCard
                icon={{
                  url: strategyOne?.network.icon,
                  alt: strategyOne?.network.name,
                  size,
                }}
              />
            }
            </span>&nbsp;STABLE DEFI - IN<span className="text-primary"> ONE VAULT </span>-&nbsp;
          </span>
        </div>
      </div>
      <div className="text-gray-500 flex h-14">
        <div className="scrolling-text-ltr">
          <span>&nbsp;- PROVIDE LIQUIDITY TO THE BEST<span className="text-white"> { titleTwo } POOLS&nbsp;
            { strategyTwo?.network.icon && <IconCard
                icon={{
                  url: strategyTwo?.network.icon,
                  alt: strategyTwo?.network.name,
                  size,
                }}
              />
            }
            </span>
          </span>
        </div>
        <div className="scrolling-text-ltr scrolling-text-shadow">
          <span>&nbsp;- PROVIDE LIQUIDITY TO THE BEST<span className="text-white"> { titleTwo } POOLS&nbsp;
            { strategyTwo?.network.icon && <IconCard
                icon={{
                  url: strategyTwo?.network.icon,
                  alt: strategyTwo?.network.name,
                  size,
                }}
              />
            }
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
  )
}

export default StrategyBanner;