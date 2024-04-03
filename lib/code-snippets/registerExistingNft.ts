export const registerExistingNft = `
import { client } from './config.ts';
import { Address } from 'viem';

const tokenContractAddress: Address = "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49";
const tokenId: string = ...

const response = await client.ipAsset.registerRootIp({
  tokenContractAddress,
  tokenId,
  txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});
console.log(\`Root IPA created at transaction hash \${response.txHash}, IPA ID: \${response.ipId}\`);
`;
