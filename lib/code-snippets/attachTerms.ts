export const attachTerms = `
import { useStory } from './StoryContext';

export default async function AttachTerms() {
    const { client } = useStory();

    const response = await client?.ipAsset.attachLicenseTerms({
        licenseTermsId: "1", 
        ipId: "0x4c1f8c1035a8cE379dd4ed666758Fb29696CF721",
        txOptions: { waitForTransaction: true }
    });
    
    if (response.success) {
        console.log(\`Attached License Terms to IPA at transaction hash \${response.txHash}.\`)
    } else {
        console.log(\`License Terms already attached to this IPA.\`)
    }
}
`;
