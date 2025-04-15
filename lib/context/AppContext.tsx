"use client";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useContext,
  useState,
} from "react";
import { custom } from "viem";
import { useWalletClient } from "wagmi";
import {
  StoryClient,
  StoryConfig,
  SupportedChainIds,
} from "@story-protocol/core-sdk";
import { useNetwork, getCurrentNetworkConfig } from "./NetworkContext";

interface AppContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
  client: StoryClient | undefined;
  setTxLoading: (loading: boolean) => void;
  setTxHash: (txHash: string) => void;
  setTxName: (txName: string) => void;
  addTransaction: (txHash: string, action: string, data: any) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useStory must be used within a AppProvider");
  }
  return context;
};

export default function AppProvider({ children }: PropsWithChildren) {
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txName, setTxName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [transactions, setTransactions] = useState<
    { txHash: string; action: string; data: any }[]
  >([]);
  const { data: wallet } = useWalletClient();
  const [client, setClient] = useState<StoryClient | undefined>(undefined);

  const setupStoryClient = () => {
    // Make sure wallet is defined before proceeding
    if (!wallet || !wallet.account || !wallet.transport) {
      console.error("Wallet is not fully initialized");
      return undefined;
    }

    // Get the network configuration from the global state
    // This avoids using hooks in a non-component context
    const networkConfig = getCurrentNetworkConfig();

    // Map the network type to the appropriate chainId for the SDK
    // The SDK expects 'aeneid' for testnet and 'story' for mainnet
    const chainId = networkConfig.name as SupportedChainIds;

    console.log(
      `Setting up Story client with chainId: ${chainId} for network: ${networkConfig.name}`
    );

    try {
      const config: StoryConfig = {
        wallet: wallet,
        transport: custom(wallet.transport),
        chainId: chainId,
      };
      const client = StoryClient.newClient(config);
      return client;
    } catch (error) {
      console.error("Error creating Story client:", error);
      return undefined;
    }
  };

  const addTransaction = (txHash: string, action: string, data: any) => {
    setTransactions((oldTxs) => [...oldTxs, { txHash, action, data }]);
  };

  // Get the current network from the NetworkContext
  const { network } = useNetwork();

  // Create/recreate the client when wallet or network changes
  useEffect(() => {
    if (wallet?.account?.address) {
      console.log(
        `Wallet or network (${network}) changed - recreating Story client`
      );
      let newClient = setupStoryClient();
      if (newClient) {
        setClient(newClient);
      }
    }
  }, [wallet, network]);

  return (
    <AppContext.Provider
      value={{
        txLoading,
        txHash,
        txName,
        transactions,
        setTxLoading,
        setTxName,
        setTxHash,
        addTransaction,
        client,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
