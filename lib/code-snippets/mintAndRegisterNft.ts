export const mintAndRegisterNft = `
import { Address, toHex } from 'viem';
import { useStory } from './StoryContext';

export default async function RegisterIPA() {
  const { client } = useStory();

  const response = await client?.ipAsset.mintAndRegisterIp({
    spgNftContract: "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791", // your SPG NFT contract address
    ipMetadata: {
      ipMetadataURI: 'test-uri',
      ipMetadataHash: toHex('test-metadata-hash', { size: 32 }),
      nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }),
      nftMetadataURI: 'test-nft-uri',
    },
    txOptions: { waitForTransaction: true }
  });
  
  console.log(\`Root IPA created at tx hash \${response.txHash}, IPA ID: \${response.ipId}\`);
}
`;
