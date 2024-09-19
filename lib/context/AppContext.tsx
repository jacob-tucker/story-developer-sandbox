"use client";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  Address,
  custom,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { defaultNftContractAbi } from "../defaultNftContractAbi";
import { useWalletClient } from "wagmi";
import { StoryProvider } from "@story-protocol/react-sdk";

interface AppContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
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

  const addTransaction = (txHash: string, action: string, data: any) => {
    setTransactions((oldTxs) => [...oldTxs, { txHash, action, data }]);
  };

  if (!wallet) {
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
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <StoryProvider
      config={{
        chainId: "iliad",
        transport: http("https://testnet.storyrpc.io"),
        wallet: wallet,
      }}
    >
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
        }}
      >
        {children}
      </AppContext.Provider>
    </StoryProvider>
  );
}
