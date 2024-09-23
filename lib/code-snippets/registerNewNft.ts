export const registerNewNft = `
import { Address, toHex } from 'viem';
import { useIpAsset } from '@story-protocol/react-sdk';
import { useWalletClient } from "wagmi";
import { mintNFT } from './mintNFT.ts'; // some function to mint an nft that returns a tokenId
import CryptoJS from "crypto-js";

export default function RegisterIPA() {
  const { register } = useIpAsset();
  const { data: wallet } = useWalletClient();
  const ipfsJson = {
    name: "Azuki",
    description: "This is an Azuki",
    image: "https://ipfs.io/ipfs/Qma7362dU3FguYjENcFzivKTEF3uq5aAmoZUHWH9d5zN4N"
  }
  const ipfsUri = "https://ipfs.io/ipfs/QmPuVyYjT1ZEPf4ACka3og3XtYmSpnHJAWS8DsmHx2PUqG";
  const metadataHash = CryptoJS.SHA256(JSON.stringify(ipfsJson)).toString(CryptoJS.enc.Hex);

  const tokenId = await mintNFT(wallet?.account.address as Address, ipfsUri);

  const response = await register({
    nftContract: "0xd516482bef63Ff19Ed40E4C6C2e626ccE04e19ED", // your NFT contract address
    tokenId, // your NFT token ID
    ipMetadata: {
      ipMetadataURI: ipfsUri,
      ipMetadataHash: \`0x\${metadataHash}\`,
      nftMetadataHash: \`0x\${metadataHash}\`,
      nftMetadataURI: ipfsUri,
    },
    txOptions: { waitForTransaction: true }
  });

  console.log(\`Root IPA created at tx hash \${response.txHash}, IPA ID: \${response.ipId}\`);
}
`;
