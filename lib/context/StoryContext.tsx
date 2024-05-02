"use client";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { createPublicClient, createWalletClient, Address, custom } from "viem";
import { sepolia } from "viem/chains";
import { defaultNftContractAbi } from "../defaultNftContractAbi";

const sepoliaChainId = "0xaa36a7";

const defaultValue: {
  txLoading: boolean;
  txHash: string;
  txName: string;
  setTxLoading: any;
  setTxHash: any;
  setTxName: any;
  client: StoryClient | null;
  walletAddress: string;
  initializeStoryClient: any;
  logout: any;
  mintNFT: any;
} = {
  txLoading: false,
  txHash: "",
  client: null,
  walletAddress: "",
  txName: "",
  setTxLoading: () => {},
  setTxHash: () => {},
  setTxName: () => {},
  initializeStoryClient: async () => {},
  logout: () => {},
  mintNFT: async () => {},
};

export const StoryContext = createContext(defaultValue);

export const useStory = () => useContext(StoryContext);

export default function StoryProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<StoryClient | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txName, setTxName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const initializeStoryClient = async () => {
    if (!client || !walletAddress) {
      const [account]: [Address] = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });
      const config: StoryConfig = {
        account: account,
        transport: custom(window.ethereum!),
        chainId: "sepolia",
      };
      const client = StoryClient.newClient(config);
      setWalletAddress(account);
      setClient(client);
    }
    const chainId = await window.ethereum!.request({ method: "eth_chainId" });
    if (chainId !== sepoliaChainId) {
      await window.ethereum!.request({
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
    console.log("Minting a new NFT...");
    const walletClient = createWalletClient({
      account: walletAddress as Address,
      chain: sepolia,
      transport: custom(window.ethereum!),
    });
    const publicClient = createPublicClient({
      transport: custom(window.ethereum!),
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
    return tokenId;
  };

  useEffect(() => {
    if (!client || !walletAddress) {
      initializeStoryClient();
    }
  }, []);

  return (
    <StoryContext.Provider
      value={{
        client,
        walletAddress,
        txLoading,
        txHash,
        txName,
        setTxLoading,
        setTxName,
        setTxHash,
        initializeStoryClient,
        logout,
        mintNFT,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
