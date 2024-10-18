"use client";
import { PropsWithChildren, createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { Address, createPublicClient, createWalletClient, custom } from "viem";
import { useWalletClient } from "wagmi";
import { defaultNftContractAbi } from "../defaultNftContractAbi";
import { iliad, StoryClient, StoryConfig } from "@story-protocol/core-sdk";

interface AppContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
  client: StoryClient | null;
  setTxLoading: (loading: boolean) => void;
  setTxHash: (txHash: string) => void;
  setTxName: (txName: string) => void;
  mintNFT: (to: Address, uri: string) => Promise<string>;
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
  const [client, setClient] = useState<StoryClient | null>(null);

  const setupStoryClient: () => StoryClient = () => {
    const config: StoryConfig = {
      account: wallet!.account,
      transport: custom(wallet!.transport),
      chainId: "iliad",
    };
    const client = StoryClient.newClient(config);
    return client;
  };

  const mintNFT = async (to: Address, uri: string) => {
    if (!window.ethereum) return "";
    console.log("Minting a new NFT...");
    const walletClient = createWalletClient({
      account: wallet?.account.address as Address,
      chain: iliad,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: iliad,
    });

    const { request } = await publicClient.simulateContract({
      address: "0xd2a4a4Cb40357773b658BECc66A6c165FD9Fc485",
      functionName: "mintNFT",
      args: [to, uri],
      abi: defaultNftContractAbi,
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Minted NFT successful with hash: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const tokenId = Number(receipt.logs[0].topics[3]).toString();
    console.log(`Minted NFT tokenId: ${tokenId}`);
    addTransaction(hash, "Mint NFT", { tokenId });
    return tokenId;
  };

  const addTransaction = (txHash: string, action: string, data: any) => {
    setTransactions((oldTxs) => [...oldTxs, { txHash, action, data }]);
  };

  useEffect(() => {
    if (!client && wallet?.account.address) {
      let newClient = setupStoryClient();
      setClient(newClient);
    }
  }, [wallet]);

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
        mintNFT,
        addTransaction,
        client,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
