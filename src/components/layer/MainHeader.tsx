import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { shortenAddress } from "~/utils/format";

import Button from "../Button";
import Logo from "~/assets/logo/logo.svg?react";

const Header = () => {
  const { address, isConnected } = useAccount();
  const web3Modal = useWeb3Modal();

  return (
    <header className="sticky top-0 z-20">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Logo
            className="flex w-32 md:w-64 fill-white"
            onClick={() => window.location.replace("/disclaimer")}
          />
        </div>
        <div className="navbar flex flex-row justify-center gap-10">
          <div className="flex font-extrabold text-white">FARM</div>
          <div className="flex">STAKE</div>
          <div className="flex">MINT</div>
        </div>
        <div className="navbar-end">
          { !isConnected && (
            <Button onClick={() => web3Modal.open()}>Connect wallet</Button>
          )}
          { isConnected && (
            <>
              <Button
                className="transition-ease hover:text-primary h-4 btn-small"
                onClick={() => web3Modal.open()}
              >
                { shortenAddress(address.toLowerCase()) }
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
