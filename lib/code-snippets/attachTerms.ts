export const attachTerms = `
import { Address } from 'viem';
import { useLicense } from "@story-protocol/react-sdk";

export default function AttachTerms() {
    const { attachLicenseTerms } = useLicense();

    const licenseTermsId: string = ...
    const ipId: Address = ...

    try {
        const response = await attachLicenseTerms({
            licenseTermsId,
            ipId,
            txOptions: { waitForTransaction: true },
        });
        console.log(\`Attached License Terms to IP at tx hash \${response.txHash}\`);
    } catch (e) {
        console.error(e);
    }
}
`;
