export const registerNewNft = `
import { client } from './config.ts';
import { Address } from 'viem';
import { mintNFT } from './mint.ts';

const walletAddress: Address = ...

const tokenId: string = await mintNFT(walletAddress);
const tokenContractAddress: Address = "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49";

const response = await client.ipAsset.registerRootIp({
  tokenContractAddress,
  tokenId,
  txOptions: { waitForTransaction: true },
});
console.log(\`Root IPA created at transaction hash \${response.txHash}, IPA ID: \${response.ipId}\`);
`;
