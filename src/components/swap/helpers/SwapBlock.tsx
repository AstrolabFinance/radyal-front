import clsx from "clsx";
import { useMemo } from "react";

import { Strategy, Token } from "~/utils/interfaces";
import { weiToAmount, round } from "~/utils/format";

import { useBalanceByTokenSlug, usePrices } from "~/hooks/store/tokens";

import { WalletIcon } from "@heroicons/react/24/solid";
import IconGroup from "~/components/IconGroup";

type SwapBlockProps = {
  disabled?: boolean;
  isFocused?: boolean;
  label: string;
  symbol: string;
  network: string;
  token: Token | Strategy;
  children: React.ReactNode;
  icons: { background: string; foreground: string };
  value: number;
  onTokenClick: () => void;
  onWalletClick?: (walletBalance: number) => void;
};

const SwapBlock = ({
  label,
  symbol,
  icons,
  network,
  token,
  children,
  disabled,
  value,
  isFocused = false,
  onTokenClick,
  onWalletClick = () => {},
}: SwapBlockProps) => {
  const tokenPrices = usePrices();
  const balanceBySlug = useBalanceByTokenSlug();
  const balance = useMemo(() => {
    if (!token) return 0;
    const balance = balanceBySlug[token.slug];

    return weiToAmount(BigInt(balance?.amountWei ?? 0), token.decimals);
  }, [balanceBySlug, token]);

  const balanceEquivalent = useMemo(() => {
    if (!token || !tokenPrices) return 0;

    let price = Number(tokenPrices[token.coinGeckoId]?.usd);

    // check if token is a strategy
    if ("sharePrice" in token) {
      const { sharePrice, asset, weiPerUnit } = token;
      price =
        (Number(tokenPrices[asset.coinGeckoId]?.usd) * sharePrice) / weiPerUnit;
    }
    return isNaN(price * value) ? 0 : price * value;
  }, [tokenPrices, token, value]);

  const iconGroup = [
    {
      alt: symbol,
      url: icons.background,
      size: {
        width: 32,
        height: 32,
      },
    },
    {
      url: icons.foreground,
      alt: network,
      classes: "-ms-3 -mb-1",
      size: {
        width: 18,
        height: 18,
      },
      small: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-1 text-gray-500 font-medium">{ label }</div>
      <div
        className={clsx(
          "flex flex-col md:flex-row p-2 rounded-[1.15rem] border-1 border-solid",
          {
            "bg-dark-700": !disabled,
            "border-dark-500": disabled,
            "border-primary/50": isFocused,
            "border-transparent": !isFocused && !disabled,
          }
        )}
      >
        <div
          className={clsx("flex flex-row rounded-xl my-auto py-0 ps-2", {
            "group cursor-pointer bg-dark-550 hover:bg-primary/5 hover:ring-1 hover:ring-primary/25":
              !disabled,
          })}
          onClick={onTokenClick}
        >
          {symbol && network && (
            <>
              <div className="my-auto">
                <IconGroup icons={iconGroup} />
              </div>
              <div className="flex flex-col ps-1.5 pe-3 py-3 bg-medium my-auto">
                <div className="text-xl font-bold text-white group-hover:text-primary">{ symbol }</div>
                <div className="-mt-2 pt-1 text-nowrap text-xs">on { network }</div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div
            className={clsx(
              "text-xs flex rounded-md flex-row align-middle ms-auto rounded",
              {
                "cursor-pointer hover:bg-primary hover:text-dark px-1":
                  !disabled,
                "bg-transparent text-dark-500": disabled,
                "bg-dark-550": !disabled,
              }
            )}
            onClick={() => onWalletClick(balance)}
          >
            <WalletIcon className="flex me-1 my-auto h-3 w-3" />
            <span className="flex my-auto"> {round(balanceEquivalent, 4)} </span>
          </div>
          <div className="flex ms-auto text-white">
            { children }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapBlock;
