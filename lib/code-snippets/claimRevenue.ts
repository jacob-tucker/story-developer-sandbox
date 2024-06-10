export const claimRevenue = `
import { Address } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function ClaimRevenue() {
    const { data: wallet } = useWalletClient();
    const { initializeStoryClient } = useStory();

    async function claimRevenue() {
        if (!wallet?.account.address) return;

        const currencyTokenAddress: Address = ...
        const childIpId: Address = ...
        const snapshotId: string = ...

        const client = await initializeStoryClient();
        const response = await client.royalty.claimRevenue({
            snapshotIds: [snapshotId],
            royaltyVaultIpId: childIpId,
            token: currencyTokenAddress,
            txOptions: { waitForTransaction: true },
        });
        
        console.log(\`Claimed revenue token \${response.claimableToken} at transaction hash \${response.txHash}\`);
    }
}
`;
