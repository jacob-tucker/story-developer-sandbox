export const addLicenseTerms = `
import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { zeroAddress, parseEther, zeroHash } from "viem";

async function addLicenseTerms(
  client: StoryClient,
  ipId: string, 
  licenseType: string,
  mintingFee?: string,
  commercialRevShare?: string
) {
  // Get the license template address from your network configuration
  const licenseTemplateAddress = "0x..."; // Replace with your license template address
  
  // Setup base licensing configuration
  const licensingConfig: LicensingConfig = {
    isSet: true,
    disabled: false,
    licensingHook: zeroAddress as \`0x\${string}\`,
    hookData: zeroHash as \`0x\${string}\`,
    expectMinimumGroupRewardShare: 0,
    expectGroupRewardPool: zeroAddress as \`0x\${string}\`,
    mintingFee: BigInt(0),
    commercialRevShare: 0,
  };
  
  // Update config based on license type
  if (licenseType === "commercial" && mintingFee) {
    licensingConfig.mintingFee = parseEther(mintingFee);
  } else if (licenseType === "commercial-remix" && mintingFee && commercialRevShare) {
    licensingConfig.mintingFee = parseEther(mintingFee);
    licensingConfig.commercialRevShare = Math.round(parseFloat(commercialRevShare) * 100);
  }
  
  // Set the licensing configuration for the default terms (ID: 1)
  // This will either create new terms or update existing ones
  const response = await client.license.setLicensingConfig({
    ipId: ipId as \`0x\${string}\`,
    licenseTermsId: 1, // Use the standard default license terms ID
    licenseTemplate: licenseTemplateAddress,
    licensingConfig,
    txOptions: {
      waitForTransaction: true,
    },
  });
  
  return response;
}
`;
