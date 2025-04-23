import { StoryClient, LicenseTerms } from "@story-protocol/core-sdk";
import { zeroAddress, parseEther } from "viem";
import { ExecuteReturnType } from "../../types";
import { fetchLicenseTermsIds } from "@/features/api";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { uploadJSONToIPFS } from "@/lib/functions/uploadJSONToIpfs";

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

    // 1. Prepare off-chain terms JSON from params (or defaults)
    const offChainTerms = {
      // Array fields (empty array means no restrictions)
      territory: params.territory
        ? params.territory.split(",").map((item) => item.trim())
        : [],
      channelsOfDistribution: params.channelsOfDistribution
        ? params.channelsOfDistribution.split(",").map((item) => item.trim())
        : [],
      contentStandards: params.contentStandards
        ? params.contentStandards.split(",").map((item) => item.trim())
        : [],

      // Boolean fields
      sublicensable: params.sublicensable === "true",
      aiLearningModels: params.aiLearningModels === "true",
      attribution: params.attribution === "true",

      // String fields
      restrictionOnCrossPlatformUse:
        params.restrictionOnCrossPlatformUse === "true",
      governingLaw: "California, USA",
      additionalParameters: params.additionalParameters || {},
    };

    // 2. Upload off-chain terms to IPFS and get the hash
    let ipfsHash: string;
    try {
      ipfsHash = await uploadJSONToIPFS(offChainTerms);
    } catch (err) {
      return {
        success: false,
        error: `Could not upload off-chain terms to IPFS: ${String(err)}`,
      };
    }
    const ipfsUri = `https://ipfs.io/ipfs/${ipfsHash}`;

    // 3. PILTerms: Set user-configurable fields from params, all others to defaults
    const licenseTerms: LicenseTerms = {
      // 1. Transferability
      transferable: params.transferable === "true",

      // 2. Royalty Policy (user-configurable if exposed, else default)
      royaltyPolicy:
        params.commercialUse === "true" ||
        (params.mintingFee && params.mintingFee !== "0")
          ? (params.royaltyPolicy as `0x${string}`)
          : zeroAddress,

      // 3. Default Minting Fee
      defaultMintingFee: params.mintingFee
        ? parseEther(params.mintingFee)
        : BigInt(0),

      // 4. Expiration
      expiration: params.expiration ? BigInt(params.expiration) : BigInt(0),

      // 5. Commercial Use
      commercialUse: params.commercialUse === "true",

      // 6. Commercial Attribution (forced to false if commercialUse is false)
      commercialAttribution:
        params.commercialUse === "true" &&
        params.commercialAttribution === "true",

      // 7. Commercializer Checker (NOT user-configurable, always default)
      commercializerChecker: zeroAddress, // not exposed in UI

      // 8. Commercializer Checker Data (NOT user-configurable, always default)
      commercializerCheckerData: "0x", // not exposed in UI

      // 9. Commercial Revenue Share (forced to 0 if commercialUse is false)
      commercialRevShare:
        params.commercialUse === "true" && params.commercialRevShare
          ? parseInt(params.commercialRevShare)
          : 0,

      // 10. Commercial Revenue Ceiling (NOT user-configurable, always default)
      commercialRevCeiling: BigInt(0), // not exposed in UI

      // 11. Derivatives Allowed
      derivativesAllowed: params.derivativesAllowed === "true",

      // 12. Derivatives Attribution
      derivativesAttribution:
        params.derivativesAllowed === "true" &&
        params.derivativesAttribution === "true",

      // 13. Derivatives Approval
      derivativesApproval:
        params.derivativesAllowed === "true" &&
        params.derivativesApproval === "true",

      // 14. Derivatives Reciprocal
      derivativesReciprocal:
        params.derivativesAllowed === "true" &&
        params.derivativesReciprocal === "true",

      // 15. Derivative Revenue Ceiling (NOT user-configurable, always default)
      derivativeRevCeiling: BigInt(0), // not exposed in UI

      // 16. Currency
      currency: "0x1514000000000000000000000000000000000000",

      // 17. URI (off-chain terms)
      uri: ipfsUri, // Set the URI to the uploaded IPFS hash
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
      txHashes: [response.txHash!],
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
