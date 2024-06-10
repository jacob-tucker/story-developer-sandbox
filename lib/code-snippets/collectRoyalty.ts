export const collectRoyalty = `
import { Address } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function MintLicense() {
    const { data: wallet } = useWalletClient();
    const { initializeStoryClient } = useStory();

    async function mintLicense() {
        if (!wallet?.account.address) return;

        const parentIpId: Address = ...
        const childIpId: Address = ...

        const client = await initializeStoryClient();


        const response = await client.royalty.collectRoyaltyTokens({
            parentIpId,
            royaltyVaultIpId: childIpId,
            txOptions: { waitForTransaction: true },
        });

        console.log(\`Collected royalty token \${response.royaltyTokensCollected} at transaction hash \${response.txHash}\`);
    }
}
`;
