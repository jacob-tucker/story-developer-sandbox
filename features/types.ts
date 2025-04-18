// Licensing configuration types

// Action types for different licensing configurations
export enum ActionType {
  CHANGE_MINTING_FEE = "change-minting-fee",
  DISABLE_LICENSE = "disable-license",
  ADD_LICENSE_TERMS = "add-license-terms",
}

// Base parameter interface
export interface BaseParam {
  name: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
  requiredFor?: ActionType[];
}

// Select parameter interface
export interface SelectParam extends BaseParam {
  type: "select";
  options: { value: string; label: string }[];
}

// Union type for all parameter types
export type ParamType = BaseParam | SelectParam;

// License terms option type
export interface LicenseTermsOption {
  value: string;
  label: string;
}

// Base licensing configuration parameters
export interface BaseLicensingConfigParams {
  actionType: ActionType;
}

// Change minting fee parameters
export interface ChangeMintingFeeParams extends BaseLicensingConfigParams {
  actionType: ActionType.CHANGE_MINTING_FEE;
  ipId: string;
  licenseTermsId: string;
  mintingFee: string;
}

// Disable license parameters
export interface DisableLicenseParams extends BaseLicensingConfigParams {
  actionType: ActionType.DISABLE_LICENSE;
  ipId: string;
  licenseTermsId: string;
}

// Add license terms parameters
export interface AddLicenseTermsParams extends BaseLicensingConfigParams {
  actionType: ActionType.ADD_LICENSE_TERMS;
  ipId: string; // Only IP ID is required
  mintingFee?: string; // Default: 0
  commercialRevShare?: string; // Default: 0
  aiTrainingAllowed?: string; // Default: false
  derivativesAllowed?: string; // Default: true
  derivativesAttribution?: string; // Default: true
  commercialUse?: string; // Default: true
}

// Union type for all licensing configuration parameters
export type LicensingConfigParams =
  | ChangeMintingFeeParams
  | DisableLicenseParams
  | AddLicenseTermsParams;

export type ExecuteReturnType =
  | { success: true; txHash: string; licenseTermsId?: string }
  | { success: false; error: string };
