export const claimRevenue = `
import { Address } from 'viem';
import { useRoyalty } from "@story-protocol/react-sdk";

export default function ClaimRevenue() {
    const { claimRevenue } = useRoyalty();

    const response = await claimRevenue({
        snapshotIds: ["1", "2"],
        royaltyVaultIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        token: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        txOptions: { waitForTransaction: true }
    });
    
    console.log(\`Claimed revenue token \${response.claimableToken} at transaction hash \${response.txHash}\`);
}
`;
