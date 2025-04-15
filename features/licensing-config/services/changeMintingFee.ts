import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { zeroAddress, formatEther, parseEther, zeroHash } from "viem";
import { ActionType } from "../types";
import {
  formatTransactionResponse,
  getCurrentLicensingConfig,
} from "../services/utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";

/**
 * Executes the change minting fee action
 * @param params The parameters for changing the minting fee
 * @param client The Story Protocol client
 * @returns The result of the action
 */
export async function executeChangeMintingFee(
  params: Record<string, string>,
  client?: StoryClient
): Promise<string> {
  try {
    // We must have a client to make the transaction
    if (!client) {
      throw new Error(
        "No client available. Please connect your wallet to execute transactions."
      );
    }

    // Fetch the current licensing configuration to preserve existing values
    // Force a refresh to ensure we have the latest data from the blockchain
    const currentConfig = await getCurrentLicensingConfig(
      params.ipId,
      params.licenseTermsId
    );

    // Create the licensing configuration with updated minting fee but preserving other values
    const licensingConfig: LicensingConfig = {
      mintingFee: parseEther(params.mintingFee),
      isSet: true,
      // Preserve the existing licensing hook or use zeroAddress if none exists
      licensingHook: (currentConfig?.licensingHook ||
        zeroAddress) as `0x${string}`,
      // Preserve the existing hook data or use empty data if none exists
      hookData: (currentConfig?.hookData || zeroHash) as `0x${string}`,
      // Preserve other configuration values
      commercialRevShare: currentConfig?.commercialRevShare || 0,
      disabled: false, // disabled: currentConfig?.disabled || false,
      expectMinimumGroupRewardShare:
        currentConfig?.expectMinimumGroupRewardShare || 0,
      expectGroupRewardPool: (currentConfig?.expectGroupRewardPool ||
        zeroAddress) as `0x${string}`,
    };

    try {
      // Get the license template address from the network configuration
      const networkConfig = getCurrentNetworkConfig();
      const licenseTemplateAddress = networkConfig.licenseTemplateAddress;

      const response = await client.license.setLicensingConfig({
        ipId: params.ipId as `0x${string}`,
        licenseTermsId: parseInt(params.licenseTermsId),
        licenseTemplate: licenseTemplateAddress,
        licensingConfig,
        txOptions: {
          waitForTransaction: true,
        },
      });

      if (response.success) {
        // No need to invalidate cache as we're always fetching fresh data
        return formatTransactionResponse({
          success: true,
          txHash: response.txHash,
          licensingConfig: {
            isSet: true,
            mintingFee: licensingConfig.mintingFee.toString(),
            mintingFeeFormatted: formatEther(licensingConfig.mintingFee), // Add human-readable format
            licenseTemplate: licenseTemplateAddress,
            disabled: licensingConfig.disabled,
          },
          params,
          actionType: ActionType.CHANGE_MINTING_FEE,
        });
      } else {
        return formatTransactionResponse({
          success: false,
          error: "Transaction failed",
          actionType: ActionType.CHANGE_MINTING_FEE,
        });
      }
    } catch (error) {
      console.error("Error executing setLicensingConfig:", error);
      return formatTransactionResponse({
        success: false,
        error: String(error),
        actionType: ActionType.CHANGE_MINTING_FEE,
      });
    }
  } catch (error) {
    console.error("Error in executeChangeMintingFee:", error);
    return formatTransactionResponse({
      success: false,
      error: String(error),
      actionType: ActionType.CHANGE_MINTING_FEE,
    });
  }
}

/**
 * Verifies if a license minting fee has been updated correctly
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @param expectedFee The expected minting fee in human-readable format
 * @returns An object with verification results
 */
export async function verifyMintingFee(
  ipId: string,
  licenseTermsId: string,
  expectedFee: string
): Promise<{
  success: boolean;
  message: string;
  details?: string;
}> {
  try {
    // Use the Story API to fetch the current minting fee
    const options = {
      method: "GET",
      headers: {
        "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
        "X-Chain": "story-aeneid",
      },
    };

    const response = await fetch(
      `https://api.storyapis.com/api/v3/licenses/ip/terms/${ipId}`,
      options
    );
    const data = await response.json();

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Find the specific license term
      const licenseTerm = data.data.find(
        (term: any) =>
          term.licenseTermsId.toString() === licenseTermsId.toString()
      );

      if (licenseTerm && licenseTerm.licensingConfig) {
        try {
          // Get the current fee from the blockchain (in wei format)
          const currentFeeWei = licenseTerm.licensingConfig.mintingFee || "0";

          // Convert current fee from wei to human-readable format for display
          const currentFeeHuman = formatEther(BigInt(currentFeeWei));

          if (currentFeeHuman === expectedFee) {
            return {
              success: true,
              message: `Verification successful: Minting fee has been updated to ${expectedFee} IP.`,
            };
          } else {
            return {
              success: false,
              message: `Minting fee doesn't match the expected value.`,
              details: `Current: ${currentFeeHuman} IP, Expected: ${expectedFee} IP`,
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Error comparing minting fees.`,
            details: String(error),
          };
        }
      } else {
        return {
          success: false,
          message: `License terms found but no licensing configuration available.`,
          details: `License terms ID ${licenseTermsId} found for IP ${ipId} but no licensing config data`,
        };
      }
    } else {
      return {
        success: false,
        message: `No license terms found for IP ${ipId}.`,
        details: "No license terms data available",
      };
    }
  } catch (error) {
    console.error("Error verifying minting fee:", error);
    return {
      success: false,
      message: "Could not verify minting fee. Please check manually.",
      details: String(error),
    };
  }
}
