export const updateLicensingConfig = `import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { zeroAddress, parseEther, zeroHash } from "viem";

// Function to update licensing configuration for an IP
export async function updateLicensingConfig(
  ipId: \`0x\${string}\`,
  licenseTermsId: string,
  mintingFee: string,
  disabled: boolean,
  useLimitHook: boolean,
  licenseLimit?: string
) {
  // Initialize the Story Protocol client
  const client = new StoryClient({
    chainId: 13472, // Story Protocol Testnet (Aeneid)
  });

  // Define the license template address (from network config)
  const licenseTemplateAddress = "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316";
  
  // Determine licensing hook and hook data
  let licensingHook = zeroAddress;
  let hookData = zeroHash;

  // If using limit license hook, encode the limit in hook data
  if (useLimitHook && licenseLimit) {
    // Get the license limit hook address (from network config)
    const limitHookAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual hook address
    licensingHook = limitHookAddress;

    // Encode the limit as bytes32
    const limit = BigInt(licenseLimit);
    const hexLimit = limit.toString(16).padStart(64, "0");
    hookData = \`0x\${hexLimit}\`;
  }

  // Create licensing configuration with all parameters
  const licensingConfig: LicensingConfig = {
    mintingFee: parseEther(mintingFee),
    isSet: true,
    licensingHook,
    hookData,
    commercialRevShare: 0,
    disabled,
    expectMinimumGroupRewardShare: 0,
    expectGroupRewardPool: zeroAddress,
  };

  // Update the licensing configuration
  const response = await client.license.setLicensingConfig({
    ipId,
    licenseTermsId: parseInt(licenseTermsId),
    licenseTemplate: licenseTemplateAddress,
    licensingConfig,
    txOptions: {
      waitForTransaction: true,
    },
  });

  return response;
}`;
