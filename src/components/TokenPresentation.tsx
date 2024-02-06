import clsx from "clsx";
import { Token } from "~/utils/interfaces";
import IconGroup from "./IconGroup";

type TokenPresentationProps = {
  token: Token;
  isHoverable?: boolean;
  children?: React.ReactNode;
};

const TokenPresentation = ({ token, isHoverable = true, children }: TokenPresentationProps) => {
  const icons = [
    {
      url: token?.icon,
      alt: token?.symbol,
      size: { width: 32, height: 32 },
    },
    {
      url: token?.network?.icon,
      alt: token?.network?.name,
      size: { width: 18, height: 18 },
      classes: "-ms-3 -mb-1",
      small: true,
    },
  ];
  return (
    <div className="flex flex-row">
      <div className="my-auto">
        <IconGroup icons={ icons }/>
      </div>
      <div className="flex flex-col ps-1.5 pe-3 py-3 bg-medium my-auto">
        <div className={
          clsx("text-xl font-bold text-white", isHoverable && "group-hover:text-primary")}>
            { token.symbol }
        </div>
        { children &&
          <div className="-mt-1 pb-0.5"> { children } </div>
        }
        <div className="-mt-2 pt-1 text-dark-400 text-nowrap text-xs">on { token.network.name }</div>
      </div>
    </div>
  );
}

export default TokenPresentation;