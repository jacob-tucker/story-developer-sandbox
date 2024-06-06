export const mintLicense = `
const { client } from './config.ts';
import { Address } from 'viem';

const licenseTermsId: string = ...
const licensorIpId: Address = ...
const receiver: Address = ...

const response = await client.license.mintLicenseTokens({
    licenseTermsId,
    licensorIpId,
    receiver,
    amount: 1,
    txOptions: { waitForTransaction: true },
});

console.log(\`License minted at tx hash \${response.txHash}, License IDs: \${response.licenseTokenIds}\`);
`;
