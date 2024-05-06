export const collectRoyalty = `
const { client } from './config.ts';
import { Address } from 'viem';

const parentIpId: \`0x\${string}\` = ...
const childIpId: \`0x\${string}\` = ...

const response = await client.royalty.collectRoyaltyTokens({
    parentIpId,
    royaltyVaultIpId: childIpId,
    txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});

console.log(\`Collected royalty token \${response.royaltyTokensCollected} at transaction hash \${response.txHash}\`);
`;
