export const registerExistingNftDerivative = `
import { Address, toHex } from 'viem';
import { useIpAsset } from "@story-protocol/react-sdk";

export default function RegisterDerivative() {
  const { register, registerDerivativeWithLicenseTokens } = useIpAsset();

  const registerResponse = await register({
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
  console.log(\`IPA created at tx hash \${registerResponse.txHash}, IPA ID: \${registerResponse.ipId}\`);

  const registerDerivativeResponse = await registerDerivativeWithLicenseTokens({
    childIpId: "0xC92EC2f4c86458AFee7DD9EB5d8c57920BfCD0Ba",
    licenseTokenIds: ["5"], // array of license ids relevant to the creation of the derivative, minted from the parent IPA
    txOptions: { waitForTransaction: true }
  });
  console.log(\`IPA registered as derivative at tx hash \${registerDerivativeResponse.txHash}\`);
}
`;
