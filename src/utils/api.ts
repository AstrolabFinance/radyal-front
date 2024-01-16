import { abi as AgentABI } from "@astrolabs/registry/abis/StrategyV5Agent.json";
import axios from "axios";
import { zeroAddress } from "viem";
import { getTokenBySlug } from "~/services/tokens";
import { COINGECKO_API, TOKEN_BASENAME_REGEX } from "./constants";
import { Strategy, Token } from "./interfaces";
import { networkBySlug } from "./mappings";
import { multicall } from "./multicall";
import { ApiResponseStrategy } from "~/interfaces/astrolab-api";

export const getTokenPrice = (token: Token) => {
  return axios.get(`${COINGECKO_API}/simple/price`, {
    params: {
      ids: token.coinGeckoId,
      vs_currencies: "usd",
    },
  });
};

export const getTokensPrices = async (coingeckoIds: string[]) => {
  if (!coingeckoIds.length) return [];
  const result = await axios.get(`${COINGECKO_API}/simple/price`, {
    params: {
      ids: Array.from(coingeckoIds).join(","),
      vs_currencies: "usd",
    },
  });
  return result.data;
};

export const getTokens = async () => {
  return axios
    .get(`${process.env.ASTROLAB_API}/tokens`)
    .then((res) => res.data.data)
    .then((tokens) => {
      const filteredTokens = tokens
        .filter((token) => {
          const { nativeNetwork } = token;
          const network = networkBySlug[nativeNetwork];
          token.network = network;
          return !!token.network;
        })
        .map(({ nativeAddress, symbol, network, scale, coinGeckoId, slug }) => {
          const cleanSymbol = symbol.replace(TOKEN_BASENAME_REGEX, "$1");
          const token = {
            address: nativeAddress,
            symbol,
            decimals: scale,
            weiPerUnit: 10 ** scale,
            icon: `/images/tokens/${encodeURI(cleanSymbol.toLowerCase())}.svg`,
            network,
            slug,
            coinGeckoId,
          } as Token;

          return token;
        });

      return filteredTokens;
    });
};

export const getNetworks = async () => {
  return axios
    .get(`${process.env.ASTROLAB_API}/networks`)
    .then((result) => result.data.data);
};

export const loadBalancesByAddress = async (address: `0x${string}`) => {
  const result = await axios.get(
    `${process.env.ASTROLAB_API}/users/balance/${address}`
  );
  return result?.data?.data;
};

export const getStrategies = async () => {
  const strategiesData = await axios
    .get(`${process.env.ASTROLAB_API}/strategies`)
    .then((res) => res.data.data as ApiResponseStrategy[]);

  const strategiesByNetwork: { [key: number]: ApiResponseStrategy[] } = {};

  // Generate strategies mapping by Network with api Data
  for (let i = 0; i < strategiesData.length; i++) {
    const strategy = strategiesData[i];

    const { nativeNetwork } = strategy;
    const network = networkBySlug[nativeNetwork];
    if (!network) continue;
    if (!strategiesByNetwork[network.id]) strategiesByNetwork[network.id] = [];
    // Add index on strategy to retrieve it after
    Object.assign(strategy, { index: i });
    strategiesByNetwork[network.id].push(strategy);
  }

  // Loop on Strategies by networks to multicall (getting strategy token details)
  for (const chainId of Object.keys(strategiesByNetwork)) {
    const networkStrategies = strategiesByNetwork[chainId];
    const contractsCalls = networkStrategies
      .map((strategy) => {
        const call = {
          abi: AgentABI,
          address: strategy.nativeAddress,
        };
        return ["symbol", "decimals", "sharePrice", "name"]
          .map((functionName) => ({
            ...call,
            functionName,
          }));
      })
      .flat(1);

    const result: any[] = await multicall(Number(chainId), contractsCalls);

    // Add multicall result on api Data

    for (let i = 0; i < result.length; i += 4) {
      const [symbol, decimals, sharePrice, name] = result.slice(i, i + 4);

      if (!symbol?.result || !decimals?.result || !name?.result) continue;
      const strategy = networkStrategies[i / 4];
      Object.assign(strategiesData[strategy.index], {
        symbol: symbol?.result,
        decimals: decimals?.result,
        sharePrice: Number(sharePrice?.result),
        name: name?.result,
      });
    }
  }

  return strategiesData
    .filter((strategy) => {
      const { nativeNetwork, nativeAddress } = strategy;
      const network = networkBySlug[nativeNetwork];

      const token = getTokenBySlug(strategy.denomination);
      return !!network && !!token && nativeAddress !== zeroAddress;
    })
    .map((strategy) => {
      const {
        name,
        nativeNetwork,
        nativeAddress,
        symbol,
        decimals,
        sharePrice,
        slug,
      } = strategy as ApiResponseStrategy & { decimals: number, sharePrice: number };

      const network = networkBySlug[nativeNetwork];

      const token = getTokenBySlug(strategy.denomination);
      const _strat = {
        name,
        symbol,
        decimals,
        address: nativeAddress,
        network,
        asset: token,
        icon: `/tokens/${symbol?.toLowerCase()}.svg`,
        slug,
        weiPerUnit: 10 ** decimals,
        sharePrice,
      } as Strategy;
      return _strat;
    });
};

export const getProtocols = async () => {
  const result = await axios.get(`${process.env.ASTROLAB_API}/protocols`);
  return result.data.data;
};
