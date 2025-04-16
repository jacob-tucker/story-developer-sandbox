// Licensing configuration types

// Action types for different licensing configurations
export enum ActionType {
  CHANGE_MINTING_FEE = "change-minting-fee",
  DISABLE_LICENSE = "disable-license",
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
  ipId: string;
  licenseTermsId: string;
  actionType: ActionType;
}

// Change minting fee parameters
export interface ChangeMintingFeeParams extends BaseLicensingConfigParams {
  actionType: ActionType.CHANGE_MINTING_FEE;
  mintingFee: string;
  licenseLimit?: string;
}

// Disable license parameters
export interface DisableLicenseParams extends BaseLicensingConfigParams {
  actionType: ActionType.DISABLE_LICENSE;
}

// Union type for all licensing configuration parameters
export type LicensingConfigParams =
  | ChangeMintingFeeParams
  | DisableLicenseParams;

export type ExecuteReturnType =
  | { success: true; txHash: string }
  | { success: false; error: string };
