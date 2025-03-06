export const mintAndRegisterNft = `
import { toHex } from 'viem';
import { useStory } from './StoryContext';

export default async function RegisterIPA() {
  const { client } = useStory();
  if (!client) return;

  const response = await client.ipAsset.mintAndRegisterIp({
    spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc", // your SPG NFT contract address
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
