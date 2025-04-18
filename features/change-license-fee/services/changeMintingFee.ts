import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { zeroAddress, formatEther, parseEther, zeroHash } from "viem";
import { getLicensingConfigSDK } from "../../utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { ExecuteReturnType } from "../../types";
/**
 * Executes the change minting fee action
 * @param params The parameters for changing the minting fee
 * @param client The Story Protocol client
 * @returns The result of the action
 */
export async function executeChangeMintingFee(
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

    // Fetch the current licensing configuration to preserve existing values
    // Force a refresh to ensure we have the latest data from the blockchain
    const currentConfig = await getLicensingConfigSDK(
      params.ipId as `0x${string}`,
      params.licenseTermsId
    );

    console.log("currentConfig", currentConfig);

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
      disabled: false,
      expectMinimumGroupRewardShare:
        currentConfig?.expectMinimumGroupRewardShare || 0,
      expectGroupRewardPool: (currentConfig?.expectGroupRewardPool ||
        zeroAddress) as `0x${string}`,
    };

    console.log("licensingConfig", licensingConfig);

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
      return {
        success: false,
        error: String(error),
      };
    }
  } catch (error) {
    console.error("Error in executeChangeMintingFee:", error);
    return {
      success: false,
      error: String(error),
    };
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
    // Get the current licensing configuration directly from the blockchain
    const currentConfig = await getLicensingConfigSDK(
      ipId as `0x${string}`,
      licenseTermsId
    );

    if (currentConfig) {
      try {
        // Get the current fee from the blockchain (already in wei format)
        const currentFeeWei = currentConfig.mintingFee || BigInt(0);

        // Convert current fee from wei to human-readable format for display
        const currentFeeHuman = formatEther(currentFeeWei);

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
        message: `No licensing configuration found.`,
        details: `Licensing config not found for IP ${ipId} with license terms ID ${licenseTermsId}`,
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
