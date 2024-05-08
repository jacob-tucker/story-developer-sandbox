export const snapshot = `
const { client } from './config.ts';
import { Address } from 'viem';

const childIpId: Address = ...

const response = await client.license.attachLicenseTerms({
    royaltyVaultIpId: childIpId,
    txOptions: { waitForTransaction: true },
});
console.log(\`Took a snapshot with ID \${response.snapshotId} at transaction hash \${response.txHash}\`);
`;
