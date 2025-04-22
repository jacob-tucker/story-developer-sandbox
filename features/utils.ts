import {
  LicenseTerms,
  LicensingConfig,
  StoryClient,
} from "@story-protocol/core-sdk";
import { createPublicClient, http } from "viem";
import { licenseRegistryAbi } from "./licenseRegistryAbi";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { tokenLimitAbi } from "./tokenLimitAbi";

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
 * @param licenseTermsId The license terms ID
 * @returns The licensing configuration from the blockchain
 */
export async function getLicensingConfigSDK(
  ipId: `0x${string}`,
  licenseTermsId: string
): Promise<LicensingConfig | undefined> {
  if (!ipId || !licenseTermsId) {
    return undefined;
  }

  try {
    // Get the network configuration from the global state
    const config = getCurrentNetworkConfig();

    // Get a public client configured for the current network
    const publicClient = getPublicClient();

    return await publicClient.readContract({
      abi: licenseRegistryAbi,
      address: config.licenseRegistryAddress,
      functionName: "getLicensingConfig",
      args: [ipId, config.licenseTemplateAddress, BigInt(licenseTermsId)],
    });
  } catch (error) {
    console.error("Error fetching current licensing config:", error);
    return undefined;
  }
}

/**
 * Get licensing configuration directly using viem
 * @param licenseTermsId The license terms ID
 * @returns The licensing configuration from the blockchain
 */
export async function getLicenseTermsSDK(
  licenseTermsId: string,
  client?: StoryClient
): Promise<LicenseTerms | undefined> {
  if (!licenseTermsId || !client) {
    return undefined;
  }

  try {
    const { terms } = await client.license.getLicenseTerms(licenseTermsId);
    return terms;
  } catch (error) {
    console.error("Error fetching license terms:", error);
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

    const config = await getLicensingConfigSDK(
      ipId as `0x${string}`,
      licenseTermsId
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

/**
 * Extracts the license limit from licensing configuration hook data
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @returns The license limit as a string, or undefined if invalid or not found
 */
export async function extractLicenseLimitFromHookData(
  ipId: `0x${string}`,
  licenseTermsId: string
): Promise<string | undefined> {
  if (!ipId || !licenseTermsId) {
    return undefined;
  }

  try {
    // Get the network configuration from the global state
    const config = getCurrentNetworkConfig();

    // Get a public client configured for the current network
    const publicClient = getPublicClient();

    const result = await publicClient.readContract({
      abi: tokenLimitAbi,
      address: config.limitLicenseHookAddress,
      functionName: "getTotalLicenseTokenLimit",
      args: [ipId, config.licenseTemplateAddress, BigInt(licenseTermsId)],
    });

    // Convert the result to a string
    return result !== null && result !== undefined
      ? result.toString()
      : undefined;
  } catch (error) {
    console.error("Error fetching license token limit:", error);
    return undefined;
  }
}
