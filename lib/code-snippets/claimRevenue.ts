export const claimRevenue = `
const { client } from './config.ts';
import { Address } from 'viem';

const currencyTokenAddress: Address = ...
const childIpId: Address = ...
const snapshotId: string = ...

const response = await client.royalty.claimRevenue({
    snapshotIds: [snapshotId],
    royaltyVaultIpId: childIpId,
    token: currencyTokenAddress,
    txOptions: { waitForTransaction: true },
});

console.log(\`Claimed revenue token \${response.claimableToken} at transaction hash \${response.txHash}\`);
`;
