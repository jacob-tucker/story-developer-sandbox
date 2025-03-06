export const claimRevenue = `
import { useStory } from "./StoryContext";
import { WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";

export default async function ClaimRevenue() {
    const { client } = useStory();
    if (!client) return;

    const response = await client.royalty.claimAllRevenue({
        ancestorIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        claimer: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba", // holder of the royalty tokens (usually same as ancestorIpId)
        childIpIds: ["0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"],
        royaltyPolicies: ["0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E"], // LAP Royalty Policy address
        currencyTokens: [WIP_TOKEN_ADDRESS],
        txOptions: { waitForTransaction: true }
    });
    
    console.log(\`Claimed revenue tokens \${response.claimedTokens} at transaction hash \${response.txHashes[0]}\`);
}
`;
