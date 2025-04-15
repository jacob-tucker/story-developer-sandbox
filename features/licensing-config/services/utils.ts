import { LicensingConfig } from "@story-protocol/core-sdk";
import { createPublicClient, http, Chain } from "viem";
import { licenseRegistryAbi } from "../licenseRegistryAbi";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";

// No cache needed as we're using SDK directly

/**
 * Formats the transaction response
 * @param data The response data
 * @returns The formatted response as a JSON string
 */
export function formatTransactionResponse(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get a configured public client based on the current network
 * @returns A viem public client configured for the current network
 */
export function getPublicClient() {
  // Get the current network config from the global state
  const config = getCurrentNetworkConfig();
  
  // Use the chain configuration from the SDK
  return createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });
}

/**
 * Get licensing configuration directly using viem
 * @param ipId The IP ID
 * @param licenseTemplate The license template address
 * @param licenseTermsId The license terms ID
 * @returns The licensing configuration from the blockchain
 */
export async function getLicensingConfigSDK(
  ipId: `0x${string}`,
  licenseTemplate: `0x${string}`,
  licenseTermsId: number
) {
  try {
    // Get the network configuration from the global state
    const config = getCurrentNetworkConfig();
    
    console.log("Fetching licensing config via viem:", {
      ipId,
      licenseTemplate,
      licenseTermsId,
      network: config.name,
    });

    // Get a public client configured for the current network
    const publicClient = getPublicClient();
    
    return await publicClient.readContract({
      abi: licenseRegistryAbi,
      address: config.licenseRegistryAddress,
      functionName: "getLicensingConfig",
      args: [ipId, licenseTemplate, BigInt(licenseTermsId)],
    });
  } catch (error) {
    console.error("Error reading contract via viem:", error);
    throw error;
  }
}

/**
 * Fetches the current licensing configuration for an IP and license terms
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @returns The current licensing configuration or undefined if not found
 */
export async function getCurrentLicensingConfig(
  ipId: string,
  licenseTermsId: string
): Promise<LicensingConfig | undefined> {
  try {
    if (!ipId || !licenseTermsId) {
      return undefined;
    }

    // Get the network configuration from the global state
    const networkConfig = getCurrentNetworkConfig();
    
    console.log("Fetching license config directly from blockchain via viem");
    const config = await getLicensingConfigSDK(
      ipId as `0x${string}`,
      networkConfig.licenseTemplateAddress,
      parseInt(licenseTermsId)
    );

    console.log("Received config from viem:", config);
    return config;
  } catch (error) {
    console.error("Error fetching current licensing config:", error);
    return undefined;
  }
}

/**
 * Checks if a license is disabled
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @returns Object with isDisabled status and any error message
 */
export async function checkLicenseDisabledStatus(
  ipId: string,
  licenseTermsId: string
): Promise<{ isDisabled: boolean; error?: string }> {
  try {
    if (!ipId || !licenseTermsId) {
      return { isDisabled: false, error: "Missing IP ID or License Terms ID" };
    }

    // Get the network configuration from the global state
    const networkConfig = getCurrentNetworkConfig();
    
    console.log("Checking license disabled status via viem");
    const config = await getLicensingConfigSDK(
      ipId as `0x${string}`,
      networkConfig.licenseTemplateAddress,
      parseInt(licenseTermsId)
    );

    if (config) {
      // Check if the license is disabled
      return { isDisabled: config.disabled === true };
    }

    return { isDisabled: false, error: "License config not found" };
  } catch (error) {
    console.error("Error checking license disabled status:", error);
    return { isDisabled: false, error: String(error) };
  }
}
