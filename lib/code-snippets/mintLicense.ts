export const mintLicense = `
import { Address } from 'viem';
import { useLicense } from "react-sdk57";

export default function MintLicense() {
    const { mintLicenseTokens } = useLicense();

    const licenseTermsId: string = ...
    const parentIpId: Address = ...
    const receiver: Address = ...

    const response = await mintLicenseTokens({
        licenseTermsId,
        licensorIpId: parentIpId,
        receiver,
        amount: 1,
        txOptions: { waitForTransaction: true },
    });
    console.log(\`License minted at tx hash \${response.txHash}, License IDs: \${response.licenseTokenIds}\`);
}
`;
