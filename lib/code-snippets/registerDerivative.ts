export const registerDerivative = `
import { toHex } from 'viem';
import { useStory } from './StoryContext';

export default async function RegisterDerivative() {
  const { client } = useStory();
  if (!client) return;
  
  const registerResponse = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
    spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc", // your SPG NFT contract address
    derivData: {
      parentIpIds: ["0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"],
      licenseTermsIds: ['1'],
    },
    // dummy metadata
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
