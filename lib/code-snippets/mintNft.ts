export const mintNft = `
import { createPublicClient, createWalletClient, Address, custom } from "viem";
import { sepolia } from "viem/chains";
import { walletClient, publicClient } from "./config.ts";

export const mintNFT: (to: Address) => Promise<string> = async (to: Address) => {
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

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const tokenId = Number(receipt.logs[0].topics[3]).toString();
    return tokenId;
};
`;
