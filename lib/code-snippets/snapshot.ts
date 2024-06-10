export const snapshot = `
import { Address } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function Snapshot() {
  const { data: wallet } = useWalletClient();
  const { initializeStoryClient } = useStory();

  async function snapshot() {
    if (!wallet?.account.address) return;

    const childIpId: Address = ...

    const client = await initializeStoryClient();
    const response = await client.royalty.snapshot({
        royaltyVaultIpId: childIpId,
        txOptions: { waitForTransaction: true },
    });
    console.log(\`Took a snapshot with ID \${response.snapshotId} at transaction hash \${response.txHash}\`);
  }
}
`;
