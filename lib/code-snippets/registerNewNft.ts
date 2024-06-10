export const registerNewNft = `
import { Address, toHex } from 'viem';
import { useStory } from './StoryContext';
import { useWalletClient } from 'wagmi';
import { mintNFT } from './mintNFT.ts'; // some function to mint an nft that returns a tokenId

export default function RegisterIPA() {
  const { data: wallet } = useWalletClient();
  const { initializeStoryClient } = useStory();

  async function register() {
    if (!wallet?.account.address) return;
    // mint nft
    const walletAddress: Address = wallet!.account.address;
    const tokenId: string = await mintNFT(walletAddress);
    const nftContract: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";

    // register the newly minted nft
    const client = await initializeStoryClient();
    const response = await client.ipAsset.register({
      nftContract,
      tokenId,
      metadata: {
        metadataURI: 'test-uri', // uri of IP metadata
        metadataHash: toHex('test-metadata-hash', { size: 32 }), // hash of IP metadata
        nftMetadataHash: toHex('test-nft-metadata-hash', { size: 32 }), // hash of NFT metadata
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(\`Root IPA created at tx hash \${response.txHash}, IPA ID: \${response.ipId}\`);
  }
}
`;
