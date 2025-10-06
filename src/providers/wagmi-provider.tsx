import { type ReactNode } from 'react';
import { WagmiProvider as Wagmi, createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { WORLDCHAIN_CHAIN_ID, WORLDCHAIN_RPC_URL } from "@/config/worldchain";

const worldChain = defineChain({
  id: WORLDCHAIN_CHAIN_ID,
  name: "World Chain",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: [WORLDCHAIN_RPC_URL] },
    public: { http: [WORLDCHAIN_RPC_URL] },
  },
});

const config = createConfig({
  chains: [worldChain],
  transports: {
    [worldChain.id]: http(WORLDCHAIN_RPC_URL),
  },
});

export const WagmiProvider = ({ children }: { children: ReactNode }) => {
  return <Wagmi config={config}>{children}</Wagmi>;
};
