import { getLicensingConfigSDK } from "@/features/utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { formatEther, zeroAddress } from "viem";

/**
 * Verifies if a license config has been updated correctly
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @param expectedConfig The expected configuration values
 * @returns An object with verification results
 */
export async function verifyLicensingConfig(
  ipId: string,
  licenseTermsId: string,
  expectedConfig: {
    mintingFee: string;
    disabled: boolean;
    licensingHook: string;
    licenseLimit?: string;
  }
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
        // Verify minting fee
        const currentFeeWei = currentConfig.mintingFee || BigInt(0);
        const currentFeeHuman = formatEther(currentFeeWei);
        const feeMatches = currentFeeHuman === expectedConfig.mintingFee;

        // Verify disabled status
        const disabledMatches =
          currentConfig.disabled === expectedConfig.disabled;

        // Verify licensing hook (only if expected hook is not "none")
        let hookMatches = true;
        if (expectedConfig.licensingHook !== "none") {
          const networkConfig = getCurrentNetworkConfig();
          const limitHookAddress =
            networkConfig.limitLicenseHookAddress || zeroAddress;

          hookMatches =
            currentConfig.licensingHook.toLowerCase() ===
            limitHookAddress.toLowerCase();
        } else {
          hookMatches = currentConfig.licensingHook === zeroAddress;
        }

        // Check if all verification checks passed
        if (feeMatches && disabledMatches && hookMatches) {
          return {
            success: true,
            message: `The licensing configuration was successfully updated.`,
          };
        } else {
          return {
            success: false,
            message: `Licensing configuration doesn't match the expected values.`,
            details: `
              Fee matches: ${feeMatches} (Current: ${currentFeeHuman} IP, Expected: ${expectedConfig.mintingFee} IP)
              Disabled matches: ${disabledMatches} (Current: ${currentConfig.disabled}, Expected: ${expectedConfig.disabled})
              Hook matches: ${hookMatches} (Current: ${currentConfig.licensingHook})
            `,
          };
        }
      } catch (error) {
        return {
          success: false,
          message: `Error comparing licensing configuration.`,
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
    console.error("Error verifying licensing config:", error);
    return {
      success: false,
      message:
        "Could not verify licensing configuration. Please check manually.",
      details: String(error),
    };
  }
}
