export const registerExistingNft = `
import { client } from './config.ts';
import { Address } from 'viem';

const tokenContractAddress: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";
const tokenId: string = ...

const response = await client.ipAsset.registerRootIp({
  tokenContractAddress,
  tokenId,
  txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});
console.log(\`Root IPA created at transaction hash \${response.txHash}, IPA ID: \${response.ipId}\`);
`;
