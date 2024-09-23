export const registerNewNftDerivative = `
import { Address, toHex } from 'viem';
import { useIpAsset } from "@story-protocol/react-sdk";
import { useWalletClient } from "wagmi";
import { mintNFT } from './mintNFT.ts'; // some function to mint an nft that returns a tokenId
import CryptoJS from "crypto-js";
export default function RegisterDerivative() {
  const { register, registerDerivativeWithLicenseTokens } = useIpAsset();
  const { data: wallet } = useWalletClient();
  const ipfsUri = "https://ipfs.io/ipfs/QmPuVyYjT1ZEPf4ACka3og3XtYmSpnHJAWS8DsmHx2PUqG";

  const tokenId = await mintNFT(wallet?.account.address as Address, ipfsUri);
  const metadataHash = CryptoJS.SHA256(JSON.stringify(ipfsJson)).toString(CryptoJS.enc.Hex);
  
  const registerResponse = await register({
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
  console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);

  const registerDerivativeResponse = await registerDerivativeWithLicenseTokens({
    childIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
    licenseTokenIds: ["5"], // array of license ids relevant to the creation of the derivative, minted from the parent IPA
    txOptions: { waitForTransaction: true }
  });
  console.log(\`IPA registered as derivative at tx hash \${registerDerivativeResponse.txHash}\`);
}
`;
