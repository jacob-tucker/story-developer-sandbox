import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { PropsWithChildren, createContext } from "react";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { createPublicClient, createWalletClient, Address, custom } from "viem";
import { sepolia } from "viem/chains";

const defaultValue: {
  client: StoryClient | null;
  walletAddress: string;
  initializeStoryClient: () => void;
  logout: () => void;
  mintNFT: (to: Address) => Promise<string>;
} = {
  client: null,
  walletAddress: "",
  initializeStoryClient: () => {},
  logout: () => {},
  mintNFT: async () => {
    return "";
  },
};
export const StoryContext = createContext(defaultValue);

export const useStory = () => useContext(StoryContext);

export default function StoryProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<StoryClient | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const initializeStoryClient = async () => {
    const [account]: [Address] = await window.ethereum!.request({
      method: "eth_requestAccounts",
    });
    const config: StoryConfig = {
      account: account,
      transport: custom(window.ethereum!),
    };
    const client = StoryClient.newClient(config);
    setWalletAddress(account);
    setClient(client);
  };

  const logout = async () => {
    setWalletAddress("");
    setClient(null);
  };

  const mintNFT: (to: Address) => Promise<string> = async (to: Address) => {
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

    // 3. Mint an NFT to your account
    const mintContractAbi = {
      inputs: [{ internalType: "address", name: "to", type: "address" }],
      name: "mint",
      outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    };
    const { request } = await publicClient.simulateContract({
      address: "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49",
      functionName: "mint",
      args: [to],
      abi: [mintContractAbi],
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Minted NFT successful with hash: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const tokenId = Number(receipt.logs[0].topics[3]).toString();
    console.log(`Minted NFT tokenId: ${tokenId}`);
    return tokenId;
  };

  //   useEffect(() => {
  //     initializeStoryClient();
  //   }, []);

  return (
    <StoryContext.Provider
      value={{ client, walletAddress, initializeStoryClient, logout, mintNFT }}
    >
      {children}
    </StoryContext.Provider>
  );
}
