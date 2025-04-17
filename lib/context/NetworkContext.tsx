"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { aeneid, mainnet } from "@story-protocol/core-sdk";
import { Chain } from "viem";
import { useAccount } from "wagmi";

export type NetworkType = "aeneid" | "mainnet";

// Network-specific configuration
export interface NetworkConfig {
  name: NetworkType;
  displayName: string;
  rpcUrl: string;
  apiChain: string;
  licenseRegistryAddress: `0x${string}`;
  licenseTemplateAddress: `0x${string}`;
  explorerUrl: string;
  chain: Chain;
}

// Network configurations using SDK chain definitions
export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  aeneid: {
    name: "aeneid",
    displayName: "Aeneid Testnet",
    rpcUrl: "https://aeneid.storyrpc.io",
    apiChain: "story-aeneid",
    licenseRegistryAddress: "0x529a750E02d8E2f15649c13D69a465286a780e24",
    licenseTemplateAddress: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
    explorerUrl: "https://aeneid.storyscan.io",
    chain: aeneid,
  },
  mainnet: {
    name: "mainnet",
    displayName: "Mainnet",
    rpcUrl: "https://mainnet.storyrpc.io",
    apiChain: "story",
    licenseRegistryAddress: "0x529a750E02d8E2f15649c13D69a465286a780e24",
    licenseTemplateAddress: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
    explorerUrl: "https://www.storyscan.io",
    chain: mainnet,
  },
};

// Map chain IDs to network types
const CHAIN_ID_TO_NETWORK: Record<number, NetworkType> = {
  [aeneid.id]: "aeneid",
  [mainnet.id]: "mainnet",
};

// Global variable for access outside React
let currentNetworkConfig = NETWORK_CONFIGS.aeneid;

// Function to get the current network config (can be used outside of React components)
export const getCurrentNetworkConfig = (): NetworkConfig => {
  return currentNetworkConfig;
};

interface NetworkContextType {
  network: NetworkType;
  config: NetworkConfig;
}

const NetworkContext = createContext<NetworkContextType>({
  network: "aeneid",
  config: NETWORK_CONFIGS.aeneid,
});

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get chain from wagmi
  const { chain } = useAccount();

  // Get network type from chain ID or default to aeneid
  const networkType: NetworkType =
    chain?.id && CHAIN_ID_TO_NETWORK[chain.id]
      ? CHAIN_ID_TO_NETWORK[chain.id]
      : "aeneid";

  // Set the global config for non-React access
  const config = NETWORK_CONFIGS[networkType];

  // Update global variable when chain changes
  useEffect(() => {
    currentNetworkConfig = config;
    console.log(
      `Network: ${networkType} (Chain: ${chain?.name || "disconnected"})`
    );
  }, [networkType, chain, config]);

  return (
    <NetworkContext.Provider value={{ network: networkType, config }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  return useContext(NetworkContext);
};
