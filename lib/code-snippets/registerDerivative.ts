export const registerDerivative = `
import { Address, toHex } from 'viem';
import { useStory } from './StoryContext';

export default async function RegisterDerivative() {
  const { client } = useStory();
  
  const registerResponse = await client?.ipAsset.mintAndRegisterIpAndMakeDerivativeWithLicenseTokens({
    spgNftContract: "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791", // your SPG NFT contract address
    licenseTokenIds: ["1"], // array of license ids relevant to the creation of the derivative, minted from the parent IPA
    ipMetadata: {
      ipMetadataURI: 'test-uri',
      ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
      nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
      nftMetadataURI: 'test-nft-uri',
    },
    txOptions: { waitForTransaction: true }
  });
  console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);
}
`;
