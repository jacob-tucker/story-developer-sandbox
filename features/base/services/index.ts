// Export all service functions
export * from "../../change-license-fee/services/changeMintingFee";
export * from "../../disable-license/services/disableLicense";
export * from "../../add-license-terms/services/addLicenseTerms";
export * from "../../utils";

import { StoryClient } from "@story-protocol/core-sdk";
import { ActionType, ExecuteReturnType } from "../../types";
import { executeChangeMintingFee } from "../../change-license-fee/services/changeMintingFee";
import { executeDisableLicense } from "../../disable-license/services/disableLicense";
import { executeAddLicenseTerms } from "../../add-license-terms/services/addLicenseTerms";

/**
 * Router function that executes the appropriate action based on the action type
 * This maintains backward compatibility with existing code
 * @param params The parameters for the licensing configuration
 * @param client The Story Protocol client
 * @returns The result of the action
 */
export async function executeLicensingConfig(
  params: Record<string, string>,
  client?: StoryClient
): Promise<ExecuteReturnType> {
  const actionType =
    (params.actionType as ActionType) || ActionType.CHANGE_MINTING_FEE;

  switch (actionType) {
    case ActionType.DISABLE_LICENSE:
      return executeDisableLicense(params, client);
    case ActionType.ADD_LICENSE_TERMS:
      return executeAddLicenseTerms(params, client);
    case ActionType.CHANGE_MINTING_FEE:
    default:
      return executeChangeMintingFee(params, client);
  }
}
