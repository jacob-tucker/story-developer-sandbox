export const attachTerms = `
const { client } from './config.ts';
import { Address } from 'viem';

const licenseTermsId: string = ...
const ipId: Address = ...

const response = await client.license.attachLicenseTerms({
    licenseTermsId,
    ipId,
    txOptions: { waitForTransaction: true },
});
console.log(\`Attached License Terms to IP at tx hash \${response.txHash}\`);
`;
