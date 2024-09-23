export const attachTerms = `
import { Address } from 'viem';
import { useLicense } from "@story-protocol/react-sdk";

export default function AttachTerms() {
    const { attachLicenseTerms } = useLicense();

    const response = await attachLicenseTerms({
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
