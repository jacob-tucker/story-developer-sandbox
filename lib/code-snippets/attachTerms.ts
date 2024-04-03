export const attachTerms = `
const { client } from './config.ts';

const policyId: string = ...
const ipId: \`0x\${string}\` = ...

const response = await client.policy.addPolicyToIp({
    policyId,
    ipId,
    txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});
console.log(\`Attached Policy to IP at transaction hash \${response.txHash}, index: \${response.index}\`);
`;
