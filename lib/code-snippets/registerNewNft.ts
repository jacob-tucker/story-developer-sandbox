export const registerNewNft = `
import { Address, toHex } from 'viem';
import { useIpAsset } from 'react-sdk57';
import { mintNFT } from './mintNFT.ts'; // some function to mint an nft that returns a tokenId

export default function RegisterIPA() {
  const { register } = useIpAsset();

  // mint nft
  const walletAddress: Address = ...
  const tokenId: string = await mintNFT(walletAddress); // some mint function
  const nftContract: Address = "0xe8E8dd120b067ba86cf82B711cC4Ca9F22C89EDc";

  const response = await register({
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
`;
