import { StoryClient, LicenseTerms } from "@story-protocol/core-sdk";
import { zeroAddress, parseEther } from "viem";
import { ExecuteReturnType } from "../../types";
import { getLicenseTermsSDK } from "@/features/utils";
import { fetchLicenseTermsIds } from "@/features/api";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";

/**
 * Executes the add license terms action
 * @param params The parameters for adding license terms
 * @param client The Story Protocol client
 * @returns The result of the action
 */
export async function executeAddLicenseTerms(
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

    const networkConfig = getCurrentNetworkConfig();

    const licenseTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: networkConfig.royaltyPolicyLRPAddress,
      defaultMintingFee: params.mintingFee
        ? parseEther(params.mintingFee)
        : BigInt(0),
      expiration: BigInt(0),
      commercialUse: true,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: zeroAddress,
      commercialRevShare: params.commercialRevShare
        ? parseInt(params.commercialRevShare)
        : 0,
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: true,
      derivativesAttribution: true,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      currency: "0x1514000000000000000000000000000000000000", // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
      uri: params.aiTrainingAllowed
        ? "https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/CC-BY.json"
        : "https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/Default.json",
    };

    console.log("licenseTerms", licenseTerms);

    const response = await client.ipAsset.registerPilTermsAndAttach({
      ipId: params.ipId as `0x${string}`,
      licenseTermsData: [{ terms: licenseTerms }],
      txOptions: { waitForTransaction: true },
    });
    const attachedLicenseTermsId = response.licenseTermsIds?.at(0);
    if (!attachedLicenseTermsId) {
      return {
        success: false,
        error: "Failed to attach license terms",
      };
    }

    // Return the created license terms ID along with the success response
    return {
      success: true,
      txHash: response.txHash!,
      licenseTermsId: attachedLicenseTermsId.toString(),
    };
  } catch (error) {
    console.error("Error in executeAddLicenseTerms:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Verifies if license terms have been added correctly and checks if the specific license terms ID
 * is among those attached to the IP
 * @param ipId The IP ID
 * @param licenseTermsId The specific license terms ID to check for
 * @returns An object with verification results and license terms
 */
export async function verifyLicenseTerms(
  ipId: string,
  licenseTermsId: string
): Promise<{
  success: boolean;
  message: string;
  details?: string;
}> {
  try {
    // Fetch all license terms associated with the IP
    const result = await fetchLicenseTermsIds(ipId);

    if (result.options.length > 0) {
      // Format the terms IDs into a readable string
      const termsIds = result.options.map((option) => option.value);

      // Check if the specific license terms ID is in the list
      const isTermsIdFound =
        licenseTermsId && termsIds.includes(licenseTermsId);

      if (isTermsIdFound) {
        return {
          success: true,
          message: `License terms ID ${licenseTermsId} successfully attached to IP.`,
          details: `All license terms attached to IP: ${termsIds.join(", ")}`,
        };
      }
      return {
        success: false,
        message: `License terms ID ${licenseTermsId} not found in attached terms.`,
      };
    } else {
      return {
        success: false,
        message: "No license terms found for this IP after operation.",
        details:
          result.error ||
          "License terms might not have been attached properly.",
      };
    }
  } catch (error) {
    console.error("Error verifying license terms:", error);
    return {
      success: false,
      message: "Could not verify license terms. Please check manually.",
      details: String(error),
    };
  }
}
