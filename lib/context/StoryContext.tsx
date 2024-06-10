"use client";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import { createPublicClient, createWalletClient, Address, custom } from "viem";
import { sepolia } from "viem/chains";
import { defaultNftContractAbi } from "../defaultNftContractAbi";
import { useWalletClient } from "wagmi";

interface StoryContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
  setTxLoading: (loading: boolean) => void;
  setTxHash: (txHash: string) => void;
  setTxName: (txName: string) => void;
  initializeStoryClient: () => Promise<StoryClient | undefined>;
  mintNFT: (to: Address, uri: string) => Promise<string>;
  addTransaction: (txHash: string, action: string, data: any) => void;
}

export const StoryContext = createContext<StoryContextType | undefined>(
  undefined
);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};

export default function StoryProvider({ children }: PropsWithChildren) {
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txName, setTxName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [transactions, setTransactions] = useState<
    { txHash: string; action: string; data: any }[]
  >([]);
  const { data: wallet } = useWalletClient();

  const initializeStoryClient: () => Promise<
    StoryClient | undefined
  > = async () => {
    if (!wallet?.account.address) return;
    const config: StoryConfig = {
      account: wallet.account,
      transport: custom(wallet.transport),
      chainId: "sepolia",
    };
    const client = StoryClient.newClient(config);
    return client;
  };

  const mintNFT = async (to: Address, uri: string) => {
    if (!window.ethereum) return "";
    console.log("Minting a new NFT...");
    const walletClient = createWalletClient({
      account: wallet?.account.address as Address,
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: sepolia,
    });

    const { request } = await publicClient.simulateContract({
      address: "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc",
      functionName: "mint",
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

  // useEffect(() => {
  //   if (!client) {
  //     initializeStoryClient();
  //   }
  // }, []);

  return (
    <StoryContext.Provider
      value={{
        txLoading,
        txHash,
        txName,
        transactions,
        setTxLoading,
        setTxName,
        setTxHash,
        initializeStoryClient,
        mintNFT,
        addTransaction,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
