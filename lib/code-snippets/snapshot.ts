export const snapshot = `
import { Address } from 'viem';
import { useRoyalty } from "@story-protocol/react-sdk";

export default function Snapshot() {
  const { snapshot } = useRoyalty();

  const response = await snapshot({
    royaltyVaultIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
    txOptions: { waitForTransaction: true }
  });
  
  console.log(\`Took a snapshot with ID \${response.snapshotId} at transaction hash \${response.txHash}\`);
}
`;
