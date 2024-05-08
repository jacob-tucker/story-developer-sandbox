export const collectRoyalty = `
const { client } from './config.ts';
import { Address } from 'viem';

const parentIpId: Address = ...
const childIpId: Address = ...

const response = await client.royalty.collectRoyaltyTokens({
    parentIpId,
    royaltyVaultIpId: childIpId,
    txOptions: { waitForTransaction: true },
});

console.log(\`Collected royalty token \${response.royaltyTokensCollected} at transaction hash \${response.txHash}\`);
`;
