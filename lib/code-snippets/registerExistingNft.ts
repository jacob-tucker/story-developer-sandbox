export const registerExistingNft = `
import { Address, toHex } from 'viem';
import { useIpAsset } from "@story-protocol/react-sdk";

export default function RegisterIPA() {
  const { register } = useIpAsset();

  const response = await register({
    nftContract: "0xd516482bef63Ff19Ed40E4C6C2e626ccE04e19ED", // your NFT contract address
    tokenId: "12", // your NFT token ID
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
