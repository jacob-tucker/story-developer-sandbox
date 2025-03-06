export const mintThenRegisterNft = `
import { Address, toHex } from 'viem';
import { useStory } from './StoryContext';
import { mintNFT } from './mintNFT'; // a separate function to mint an nft that returns a tokenId

export default async function RegisterIPA() {
  const { client } = useStory();
  if (!client) return;
  const { data: wallet } = useWalletClient();

  const tokenId = await mintNFT(wallet?.account.address as Address, 'test-uri')
  const response = await client.ipAsset.register({
    nftContract: "0x937bef10ba6fb941ed84b8d249abc76031429a9a", // your NFT contract address
    tokenId: tokenId,
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
