"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { iliad } from "@story-protocol/core-sdk";
import AppProvider from "@/lib/context/AppContext";

const config = getDefaultConfig({
  appName: "Developer Sandbox",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [iliad],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
