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
import { StoryProvider } from "react-sdk57";

interface AppContextType {
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
          initializeStoryClient,
          mintNFT,
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
        chainId: "sepolia",
        transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
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
          initializeStoryClient,
          mintNFT,
          addTransaction,
        }}
      >
        {children}
      </AppContext.Provider>
    </StoryProvider>
  );
}
