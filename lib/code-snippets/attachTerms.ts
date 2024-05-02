export const attachTerms = `
const { client } from './config.ts';

const licenseTermsId: string = ...
const ipId: \`0x\${string}\` = ...

const response = await client.license.attachLicenseTerms({
    licenseTermsId,
    ipId,
    txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});
console.log(\`Attached License Terms to IP at tx hash \${response.txHash}\`);
`;
