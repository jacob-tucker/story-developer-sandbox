export const mintLicense = `
import { Address } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function MintLicense() {
    const { data: wallet } = useWalletClient();
    const { initializeStoryClient } = useStory();

    async function mintLicense() {
        if (!wallet?.account.address) return;

        const licenseTermsId: string = ...
        const licensorIpId: Address = ...
        const receiver: Address = ...

        const client = await initializeStoryClient();
        const response = await client.license.mintLicenseTokens({
            licenseTermsId,
            licensorIpId,
            receiver,
            amount: 1,
            txOptions: { waitForTransaction: true },
        });

        console.log(\`License minted at tx hash \${response.txHash}, License IDs: \${response.licenseTokenIds}\`);
    }
}
`;
