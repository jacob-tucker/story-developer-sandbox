"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { aeneid, mainnet } from "@story-protocol/core-sdk";
import { Chain } from "viem";

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
  chain: Chain; // Using any for the chain type to avoid complex type imports
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

interface NetworkContextType {
  network: NetworkType;
  config: NetworkConfig;
  setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Create a global variable to store the network config outside of React components
let currentNetworkConfig = NETWORK_CONFIGS.aeneid;

// Function to get the current network config (can be used outside of React components)
export const getCurrentNetworkConfig = (): NetworkConfig => {
  return currentNetworkConfig;
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize from localStorage if available, otherwise default to testnet
  const [network, setNetworkState] = useState<NetworkType>(() => {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      const savedNetwork = localStorage.getItem("network") as NetworkType;
      return savedNetwork === "mainnet" ? "mainnet" : "aeneid";
    }
    return "aeneid";
  });

  const config = NETWORK_CONFIGS[network];

  // Update the global variable when network changes
  useEffect(() => {
    currentNetworkConfig = NETWORK_CONFIGS[network];
  }, [network]);

  // Save to localStorage when network changes
  const setNetwork = (newNetwork: NetworkType) => {
    setNetworkState(newNetwork);
    if (typeof window !== "undefined") {
      localStorage.setItem("network", newNetwork);
    }
  };

  return (
    <NetworkContext.Provider value={{ network, config, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
