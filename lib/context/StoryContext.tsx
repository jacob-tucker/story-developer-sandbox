"use client";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { createPublicClient, createWalletClient, Address, custom } from "viem";
import { sepolia } from "viem/chains";
import { defaultNftContractAbi } from "../defaultNftContractAbi";

const sepoliaChainId = "0xaa36a7";

interface StoryContextType {
  txLoading: boolean;
  txHash: string;
  txName: string;
  transactions: { txHash: string; action: string; data: any }[];
  setTxLoading: (loading: boolean) => void;
  setTxHash: (txHash: string) => void;
  setTxName: (txName: string) => void;
  client: StoryClient | null;
  walletAddress: string;
  initializeStoryClient: () => Promise<void>;
  logout: () => void;
  mintNFT: (to: Address, uri: string) => Promise<string>;
  addTransaction: (txHash: string, action: string, data: any) => void;
}

export const StoryContext = createContext<StoryContextType | undefined>(
  undefined
);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within an StoryProvider");
  }
  return context;
};

export default function StoryProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<StoryClient | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txName, setTxName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [transactions, setTransactions] = useState<
    { txHash: string; action: string; data: any }[]
  >([]);

  const initializeStoryClient = async () => {
    if (!window.ethereum) return;
    if (!client || !walletAddress) {
      const [account]: [Address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const config: StoryConfig = {
        account: account,
        transport: custom(window.ethereum),
        chainId: "sepolia",
      };
      const client = StoryClient.newClient(config);
      setWalletAddress(account);
      setClient(client);
    }
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== sepoliaChainId) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: sepoliaChainId }],
      });
    }
  };

  const logout = () => {
    setWalletAddress("");
    setClient(null);
  };

  const mintNFT = async (to: Address, uri: string) => {
    if (!window.ethereum) return "";
    console.log("Minting a new NFT...");
    const walletClient = createWalletClient({
      account: walletAddress as Address,
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
  //   if (!client || !walletAddress) {
  //     initializeStoryClient();
  //   }
  // }, []);

  return (
    <StoryContext.Provider
      value={{
        client,
        walletAddress,
        txLoading,
        txHash,
        txName,
        transactions,
        setTxLoading,
        setTxName,
        setTxHash,
        initializeStoryClient,
        logout,
        mintNFT,
        addTransaction,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
