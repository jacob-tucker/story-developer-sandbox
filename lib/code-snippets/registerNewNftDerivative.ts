export const registerNewNftDerivative = `
import { client } from './config.ts';
import { Address } from 'viem';
import { mintNFT } from './mint.ts';

const walletAddress: Address = ...

const tokenId = await mintNFT(walletAddress);
const tokenContractAddress: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";
const licenseId: string = ...

const response = await client.ipAsset.registerDerivativeIp({
  tokenContractAddress, // your remixed NFT contract address
  tokenId, // your remixed NFT token ID
  licenseIds: [licenseId], // array of licenses relevant to the creation of the remix, minted from the parent IPA
  txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) }
});
console.log(\`Remixed IPA created at transaction hash \${response.txHash}, IPA ID: \${response.ipId}\`)
`;
