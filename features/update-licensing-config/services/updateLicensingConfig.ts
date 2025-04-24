import { StoryClient, LicensingConfig } from "@story-protocol/core-sdk";
import { parseEther, Account, zeroAddress, zeroHash, Address } from "viem";
import { getPublicClient, extractLicenseLimitFromHookData } from "../../utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { ExecuteReturnType } from "../../types";
import { tokenLimitAbi } from "@/features/tokenLimitAbi";
import { WalletClient } from "viem";

/**
 * Execute update licensing config to change minting fee, disabled status, and/or licensing hook
 * @param params Parameters for the update
 * @param client Story Protocol client
 * @returns Execution result
 */
export async function executeUpdateLicensingConfig(
  params: Record<string, string>,
  licenseConfig: LicensingConfig | null,
  client?: StoryClient,
  wallet?: WalletClient
): Promise<ExecuteReturnType> {
  try {
    console.log(params);
    // We must have a client to make the transaction
    if (!client) {
      throw new Error(
        "No client available. Please connect your wallet to execute transactions."
      );
    }

    if (!wallet) {
      throw new Error(
        "No wallet available. Please connect your wallet to execute transactions."
      );
    }

    if (!licenseConfig) {
      throw new Error("Could not fetch current licensing configuration");
    }

    // Get network configuration
    const networkConfig = getCurrentNetworkConfig();
    const licenseTemplateAddress = networkConfig.licenseTemplateAddress;
    const limitHookAddress = networkConfig.limitLicenseHookAddress;

    // Check if any config values have changed
    const mintingFeeChanged =
      parseEther(params.mintingFee) !== licenseConfig.mintingFee;
    const disabledChanged =
      (params.disabled === "true") !== licenseConfig.disabled;

    const revShareChanged =
      Number(params.commercialRevShare) !==
      licenseConfig.commercialRevShare / 1000000;

    const paramHook =
      params.licensingHook === "limit" ? limitHookAddress : zeroAddress;
    const hookChanged = paramHook !== licenseConfig.licensingHook;

    const configChanged =
      mintingFeeChanged || disabledChanged || hookChanged || revShareChanged;

    // Check if the license limit has changed
    const currentLimit = await extractLicenseLimitFromHookData(
      params.ipId as `0x${string}`,
      params.licenseTermsId
    );
    const limitChanged = currentLimit != params.licenseLimit;

    let configTxHash: string | undefined;
    let limitTxHash: string | undefined;

    if (!configChanged && !limitChanged) {
      return {
        success: true,
        txHashes: [],
      };
    }

    // Step 1: Update the licensing config if needed
    if (configChanged) {
      // Create updated licensing config
      const licensingConfig: LicensingConfig = {
        mintingFee: parseEther(params.mintingFee),
        isSet: true,
        licensingHook: paramHook,
        hookData: licenseConfig.hookData || zeroHash,
        commercialRevShare: Number(params.commercialRevShare),
        disabled: params.disabled === "true",
        expectMinimumGroupRewardShare:
          licenseConfig.expectMinimumGroupRewardShare || 0,
        expectGroupRewardPool:
          licenseConfig.expectGroupRewardPool || zeroAddress,
      };

      console.log("licensingConfig", licensingConfig);

      // Update the licensing configuration
      const response = await client.license.setLicensingConfig({
        ipId: params.ipId as `0x${string}`,
        licenseTermsId: parseInt(params.licenseTermsId),
        licenseTemplate: licenseTemplateAddress,
        licensingConfig,
        txOptions: {
          waitForTransaction: true,
        },
      });

      if (!response.success) {
        return {
          success: false,
          error: "Config update transaction failed",
        };
      }

      configTxHash = response.txHash;
    }

    // Step 2: Update the license limit if needed
    if (limitChanged) {
      const limitResult = await updateLicenseLimit(
        params.ipId,
        params.licenseTermsId,
        licenseTemplateAddress,
        limitHookAddress,
        params.licenseLimit,
        wallet
      );

      if (!limitResult.success) {
        return {
          success: false,
          error: `Limit update failed: ${limitResult.error}`,
        };
      }

      limitTxHash = limitResult.txHash;
    }

    return {
      success: true,
      txHashes: [limitTxHash, configTxHash].filter((x) => x !== undefined),
    };
  } catch (error) {
    console.error("Error in executeUpdateLicensingConfig:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Updates only the license limit for an IP/license terms without updating the licensing config
 * @param ipId The IP ID
 * @param licenseTermsId The license terms ID
 * @param licenseLimit The new license limit
 * @param client Story client instance
 * @returns Execution result
 */
export async function updateLicenseLimit(
  ipId: string,
  licenseTermsId: string,
  licenseTemplateAddress: string,
  limitLicenseHookAddress: Address,
  licenseLimit: string,
  wallet: WalletClient
): Promise<{ txHash?: string; success: boolean; error?: string }> {
  try {
    const publicClient = getPublicClient();

    const { request } = await publicClient.simulateContract({
      // address of TotalLicenseTokenLimitHook
      // from https://docs.story.foundation/developers/deployed-smart-contracts
      address: limitLicenseHookAddress,
      abi: tokenLimitAbi,
      functionName: "setTotalLicenseTokenLimit",
      args: [
        ipId, // licensorIpId
        licenseTemplateAddress, // licenseTemplate
        licenseTermsId, // licenseTermsId
        BigInt(licenseLimit), // limit (as BigInt)
      ],
      account: wallet.account, // Specify the account to use for permission checking
    });

    // Prepare transaction
    const hash = await wallet.writeContract({
      ...request,
      account: wallet.account as Account,
    });

    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    console.log(receipt);

    return {
      success: true,
      txHash: receipt.transactionHash,
    };
  } catch (error) {
    console.error("Error in updateLicenseLimit:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
