export const registerExistingNftDerivative = `
import { Address, toHex } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';

export default function RegisterDerivative() {
  const { data: wallet } = useWalletClient();
  const { initializeStoryClient } = useStory();

  async function register() {
    if (!wallet?.account.address) return;
    const tokenId: string = ...;
    const licenseId: string = ...;
    const nftContract: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";

    const client = await initializeStoryClient();
    const registerResponse = await client.ipAsset.register({
      nftContract,
      tokenId,
      metadata: {
        metadataURI: 'test-uri', // uri of IP metadata
        metadataHash: toHex('test-metadata-hash', { size: 32 }), // hash of IP metadata
        nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }), // hash of NFT metadata
      },
      txOptions: { waitForTransaction: true }
    });
    console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);

    const registerDerivativeResponse = await client.ipAsset.registerDerivativeWithLicenseTokens({
      childIpId: registerResponse.ipId as Address,
      licenseTokenIds: [licenseId],
      txOptions: { waitForTransaction: true }
    });
    console.log(\`IPA registered as derivative at tx hash \${registerDerivativeResponse.txHash}\`);
  }
}
`;
