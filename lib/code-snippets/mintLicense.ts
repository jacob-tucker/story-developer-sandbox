export const mintLicense = `
import { useStory } from './StoryContext';

export default async function MintLicense() {
    const { client } = useStory();

    const response = await client?.ipAsset.mintLicenseTokens({
        licenseTermsId: "1", 
        licensorIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
        receiver: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", 
        amount: 1, 
        txOptions: { waitForTransaction: true }
	});
    
    console.log(\`License minted at tx hash \${response.txHash}, License IDs: \${response.licenseTokenIds}\`);
}
`;
