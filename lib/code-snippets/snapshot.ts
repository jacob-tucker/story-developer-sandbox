export const snapshot = `
import { Address } from 'viem';
import { useRoyalty } from "@story-protocol/react-sdk";

export default function Snapshot() {
  const { snapshot } = useRoyalty();

  const childIpId: Address = ...

  const response = await client.royalty.snapshot({
    royaltyVaultIpId: childIpId,
    txOptions: { waitForTransaction: true },
  });
  console.log(\`Took a snapshot with ID \${response.snapshotId} at transaction hash \${response.txHash}\`);
}
`;
