export const setupClient = `
import { custom, Address } from "viem";
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
`;
