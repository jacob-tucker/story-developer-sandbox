"use client";
import { http, createConfig, WagmiProvider, useWalletClient } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppProvider from "@/lib/context/AppContext";
import { PropsWithChildren } from "react";
import { type Chain } from "viem";
import { StoryProvider } from "@story-protocol/react-sdk";

export const iliad = {
  id: 1513, // Your custom chain ID
  name: "Story Network Testnet",
  nativeCurrency: {
    name: "Testnet IP",
    symbol: "IP",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://testnet.storyscan.xyz" },
  },
  testnet: true,
} as const satisfies Chain;

const config = createConfig({
  chains: [iliad],
  multiInjectedProviderDiscovery: false,
  transports: {
    [iliad.id]: http(),
  },
});
const queryClient = new QueryClient();
const evmNetworks = [
  {
    blockExplorerUrls: ["https://testnet.storyscan.xyz"],
    chainId: 1513,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/sepolia.svg"],
    name: "Story Network Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Testnet IP",
      symbol: "IP",
    },
    networkId: 1513,
    rpcUrls: ["https://testnet.storyrpc.io"],
    vanityName: "Iliad",
  },
];

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        appName: "Developer Sandbox",
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID as string,
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
        networkValidationMode: "always",
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <AppProvider>
              <StoryProviderWrapper>{children}</StoryProviderWrapper>
            </AppProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();
  if (!wallet) {
    return <>{children}</>;
  }
  return (
    <StoryProvider
      config={{
        chainId: "iliad",
        wallet: wallet,
        transport: http("https://testnet.storyrpc.io"),
      }}
    >
      {children}
    </StoryProvider>
  );
}
