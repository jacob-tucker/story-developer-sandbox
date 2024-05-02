export const registerExistingNftDerivative = `
import { client } from './config.ts';
import { Address } from 'viem';

const tokenContractAddress: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";
const tokenId: string = ...
const licenseId: string = ...

const registerResponse = await client.ipAsset.register({
  tokenContract,
  tokenId,
  txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) }
});
console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);

const registerDerivativeResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
  childIpId: registerResponse.ipId!,
  licenseTokenIds: [licenseId],
  txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) }
});
console.log(\`IPA registered as derivative at tx hash \${registerDerivativeResponse.txHash}\`);
`;
