export const setupClientForMint = `
import { custom, Address } from "viem";
import { sepolia } from "viem/chains";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const [account]: [Address] = await window.ethereum!.request({
    method: "eth_requestAccounts",
});
const config: StoryConfig = {
    account: account,
    transport: custom(window.ethereum!),
    chainId: "sepolia"
};
export const client = StoryClient.newClient(config);

export const walletClient = createWalletClient({
    account: account,
    chain: sepolia,
    transport: custom(window.ethereum!),
});
export const publicClient = createPublicClient({
    transport: custom(window.ethereum!),
    chain: sepolia,
});
`;
