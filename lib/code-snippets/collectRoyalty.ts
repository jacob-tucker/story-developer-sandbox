export const collectRoyalty = `
import { Address } from 'viem';
import { useRoyalty } from "@story-protocol/react-sdk";

export default function CollectRoyalty() {
    const { collectRoyaltyTokens } = useRoyalty();

    const response = await collectRoyaltyTokens({
        parentIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        royaltyVaultIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        txOptions: { waitForTransaction: true }
    });
    
    console.log(\`Collected royalty token \${response.royaltyTokensCollected} at transaction hash \${response.txHash}\`);
}
`;
