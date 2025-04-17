import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { zeroAddress, zeroHash } from "viem";
import { checkLicenseDisabledStatus, getLicensingConfigSDK } from "./utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { ExecuteReturnType } from "../types";

/**
 * Executes the disable license action
 * @param params The parameters for disabling the license
 * @param client The Story Protocol client
 * @returns The result of the action
 */
/**
 * Verifies if a license is disabled after a transaction
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @returns An object with verification results
 */
export async function verifyLicenseDisabled(
  ipId: string,
  licenseTermsId: string
): Promise<{
  success: boolean;
  message: string;
  details?: string;
  isDisabled?: boolean;
}> {
  try {
    // Check if the license is now disabled
    const result = await checkLicenseDisabledStatus(ipId, licenseTermsId);

    if (result.isDisabled) {
      return {
        success: true,
        message: "Verification successful: License is now disabled.",
        isDisabled: true,
      };
    } else {
      return {
        success: false,
        message:
          "Warning: Transaction completed but license may not be disabled yet. Please check again later.",
        details: result.error,
        isDisabled: false,
      };
    }
  } catch (error) {
    console.error("Error verifying disabled status:", error);
    return {
      success: false,
      message:
        "Could not verify if license is disabled. Please check manually.",
      details: String(error),
    };
  }
}

/**
 * Executes the disable license action
 * @param params The parameters for disabling the license
 * @param client The Story Protocol client
 * @returns The result of the action
 */
export async function executeDisableLicense(
  params: Record<string, string>,
  client?: StoryClient
): Promise<ExecuteReturnType> {
  try {
    // We must have a client to make the transaction
    if (!client) {
      throw new Error(
        "No client available. Please connect your wallet to execute transactions."
      );
    }

    // For disable license, check if    // Fetch the current licensing configuration to preserve existing values
    // Force a refresh to ensure we have the latest data from the blockchain
    const currentConfig = await getLicensingConfigSDK(
      params.ipId as `0x${string}`,
      params.licenseTermsId
    );

    // Determine the minting fee to use
    let mintingFee: bigint;

    // If we already have a minting fee in the current config, use that
    if (currentConfig && currentConfig.mintingFee) {
      mintingFee = BigInt(currentConfig.mintingFee);
      console.log("Using existing minting fee:", mintingFee.toString());
    } else {
      // Only if there's no existing fee, try to predict it
      mintingFee = BigInt(0); // Default to 0
      try {
        console.log("No existing minting fee found, predicting fee...");
        // Get the license template address from the network configuration
        const networkConfig = getCurrentNetworkConfig();
        const licenseTemplateAddress = networkConfig.licenseTemplateAddress;

        const feeResponse = await client.license.predictMintingLicenseFee({
          licensorIpId: params.ipId as `0x${string}`,
          licenseTermsId: parseInt(params.licenseTermsId),
          amount: BigInt(1),
          licenseTemplate: licenseTemplateAddress,
        });

        if (feeResponse && feeResponse.tokenAmount !== undefined) {
          mintingFee = feeResponse.tokenAmount;
          console.log("Predicted minting fee:", mintingFee.toString());
        }
      } catch (error) {
        console.error("Error predicting minting fee, using zero:", error);
      }
    }

    // Create licensing config based on existing values but with disabled set to true
    const licensingConfig: LicensingConfig = {
      mintingFee: mintingFee, // Use the existing or predicted minting fee
      isSet: true,
      licensingHook: (currentConfig?.licensingHook ||
        zeroAddress) as `0x${string}`, // Use existing hook if available
      hookData: (currentConfig?.hookData || zeroHash) as `0x${string}`,
      commercialRevShare: currentConfig?.commercialRevShare || 0,
      disabled: true, // Set disabled to true
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
        return {
          success: true,
          txHash: response.txHash!,
        };
      } else {
        return {
          success: false,
          error: "Transaction failed",
        };
      }
    } catch (error) {
      console.error("Error executing setLicensingConfig:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in executeDisableLicense:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
