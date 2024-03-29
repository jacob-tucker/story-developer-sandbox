export const mintLicense = `
const { client } from './config.ts';
import { Address } from 'viem';

const policyId: string = ...
const licensorIpId: \`0x\${string}\` = ...
const receiverAddress: Address = ...

const response = await client.license.mintLicense({
    policyId,
    licensorIpId,
    receiverAddress,
    mintAmount: 1,
    txOptions: { waitForTransaction: true },
});

console.log(
    \`License minted at transaction hash \${response.txHash}, license id: \${response.licenseId}\`
);
`;
