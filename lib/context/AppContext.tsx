"use client";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useContext,
  useState,
} from "react";
import { Address, createPublicClient, createWalletClient, custom } from "viem";
import { useWalletClient } from "wagmi";
import { defaultNftContractAbi } from "../defaultNftContractAbi";
import { aeneid, StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { NFT_CONTRACT_ADDRESS } from "../constants";

interface AppContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
  client: StoryClient | undefined;
  setTxLoading: (loading: boolean) => void;
  setTxHash: (txHash: string) => void;
  setTxName: (txName: string) => void;
  mintNFT: (to: Address, uri: string) => Promise<number | null>;
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

  const setupStoryClient: () => StoryClient = () => {
    const config: StoryConfig = {
      wallet: wallet,
      transport: custom(wallet!.transport),
      chainId: "aeneid",
    };
    const client = StoryClient.newClient(config);
    return client;
  };

  const mintNFT = async (to: Address, uri: string): Promise<number | null> => {
    if (!wallet?.account.address) return null;
    console.log("Minting a new NFT...");
    console.log(to, uri);

    const walletClient = createWalletClient({
      account: wallet.account,
      chain: aeneid,
      transport: custom(wallet!.transport),
    });
    const publicClient = createPublicClient({
      transport: custom(wallet!.transport),
      chain: aeneid,
    });

    const { request } = await publicClient.simulateContract({
      address: NFT_CONTRACT_ADDRESS,
      functionName: "mintNFT",
      args: [to, uri],
      abi: defaultNftContractAbi,
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Minted NFT successful with hash: ${hash}`);

    const { logs } = await publicClient.waitForTransactionReceipt({
      hash,
    });
    if (logs[0].topics[3]) {
      let tokenId = parseInt(logs[0].topics[3], 16);
      console.log(`Minted NFT tokenId: ${tokenId}`);
      addTransaction(hash, "Mint NFT", { tokenId });
      return tokenId;
    }
    return null;
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
