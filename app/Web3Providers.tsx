"use client";
// import StoryProvider from "@/lib/context/AppContext";
import { http, createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppProvider from "@/lib/context/AppContext";
import { PropsWithChildren } from "react";

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
});
const queryClient = new QueryClient();
const evmNetworks = [
  {
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    chainId: 11155111,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/sepolia.svg"],
    name: "Sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Sepolia Ether",
      symbol: "ETH",
    },
    networkId: 11155111,
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    vanityName: "Sepolia",
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
            <AppProvider>{children}</AppProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
