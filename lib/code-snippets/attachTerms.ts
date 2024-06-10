export const attachTerms = `
import { Address } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function ClaimRevenue() {
    const { data: wallet } = useWalletClient();
    const { initializeStoryClient } = useStory();

    async function claimRevenue() {
        if (!wallet?.account.address) return;

        const licenseTermsId: string = ...
        const ipId: Address = ...

        const client = await initializeStoryClient();
        const response = await client.license.attachLicenseTerms({
            licenseTermsId,
            ipId,
            txOptions: { waitForTransaction: true },
        });
        console.log(\`Attached License Terms to IP at tx hash \${response.txHash}\`);
    }
}
`;
