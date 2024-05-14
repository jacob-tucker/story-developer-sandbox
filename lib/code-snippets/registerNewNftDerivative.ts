export const registerNewNftDerivative = `
import { client } from './config.ts';
import { Address } from 'viem';
import { mintNFT } from './mint.ts';

const walletAddress: Address = ...

const tokenId: string = await mintNFT(walletAddress);
const nftContract: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";
const licenseId: string = ...

const registerResponse = await client.ipAsset.register({
  nftContract,
  tokenId,
  txOptions: { waitForTransaction: true }
});
console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);

const registerDerivativeResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
  childIpId: registerResponse.ipId as Address,
  licenseTokenIds: [licenseId],
  txOptions: { waitForTransaction: true }
});
console.log(\`IPA registered as derivative at tx hash \${registerDerivativeResponse.txHash}\`);
`;
