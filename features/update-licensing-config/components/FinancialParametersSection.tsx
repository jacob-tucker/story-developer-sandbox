import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/atoms/Spinner";
import { formatEther, parseEther } from "viem";
import { LicensingConfig, StoryClient } from "@story-protocol/core-sdk";
import { getLicenseTermsSDK, getLicensingConfigSDK } from "../../utils";

interface FinancialParametersSectionProps {
  licenseConfig: LicensingConfig | null;
  client?: StoryClient;
  paramValues?: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const FinancialParametersSection: React.FC<
  FinancialParametersSectionProps
> = ({
  licenseConfig,
  client,
  paramValues,
  onParamChange,
  onValidationChange,
}) => {
  if (!paramValues) {
    return <></>;
  }
  // Internal state for managing fees and errors
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [feeError, setFeeError] = useState("");
  const [revShareError, setRevShareError] = useState("");
  const [currentMintingFee, setCurrentMintingFee] = useState("");
  const [defaultMintingFee, setDefaultMintingFee] = useState("");
  const [currentRevShare, setCurrentRevShare] = useState("");
  const [defaultRevShare, setDefaultRevShare] = useState("");
  const [disableMintingFee, setDisableMintingFee] = useState(false);

  // Validate minting fee
  const validateMintingFee = (value: string) => {
    if (!value) {
      setFeeError("Minting fee is required");
      onValidationChange(false);
      return false;
    }

    const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(value);
    if (!isValidNumber) {
      setFeeError("Minting fee must be a valid number");
      onValidationChange(false);
      return false;
    }

    if (
      defaultMintingFee &&
      parseFloat(value) < parseFloat(defaultMintingFee)
    ) {
      setFeeError(
        `Minting fee cannot be less than the default fee (${defaultMintingFee})`
      );
      onValidationChange(false);
      return false;
    }

    setFeeError("");
    onValidationChange(true);
    return true;
  };

  // Validate commercial revenue share
  const validateCommercialRevShare = (value: string) => {
    if (!value) {
      setRevShareError("Commercial revenue share is required");
      onValidationChange(false);
      return false;
    }

    const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(value);
    if (!isValidNumber) {
      setRevShareError("Commercial revenue share must be a valid number");
      onValidationChange(false);
      return false;
    }

    const numValue = parseFloat(value);
    if (numValue < 0 || numValue > 100) {
      setRevShareError("Commercial revenue share must be between 0 and 100");
      onValidationChange(false);
      return false;
    }

    // Check if the value is less than the default revenue share
    if (defaultRevShare && parseFloat(value) < parseFloat(defaultRevShare)) {
      setRevShareError(
        `Commercial revenue share cannot be less than the default (${defaultRevShare}%)`
      );
      onValidationChange(false);
      return false;
    }

    setRevShareError("");
    onValidationChange(true);
    return true;
  };

  // Fetch current licensing config including minting fee and commercial rev share
  const fetchFinancialParameters = async () => {
    if (!client) {
      return;
    }
    setIsLoadingFee(true);
    setFeeError("");

    try {
      // 1. Fetch the license terms
      const terms = await getLicenseTermsSDK(
        paramValues.licenseTermsId,
        client
      );
      if (!terms) {
        setFeeError("Failed to fetch license terms");
        setIsLoadingFee(false);
        return;
      }

      console.log("License terms:", terms);

      // 2. Set default minting fee
      const defaultFee = formatEther(terms.defaultMintingFee);
      setDefaultMintingFee(defaultFee);

      // 3. Set default commercial revenue share
      const defaultRevShare = terms.commercialRevShare / 1000000;
      setDefaultRevShare(defaultRevShare.toString());

      // 3. Set current minting fee
      const response = await client.license.predictMintingLicenseFee({
        licensorIpId: paramValues.ipId as `0x${string}`,
        licenseTermsId: parseInt(paramValues.licenseTermsId),
        amount: BigInt(1),
      });

      if (response && response.tokenAmount !== undefined) {
        setCurrentMintingFee(formatEther(response.tokenAmount));

        // Auto-populate the minting fee input with the human-readable value
        const feeInEth = formatEther(response.tokenAmount);
        onParamChange("mintingFee", feeInEth);
      }

      // 3. Fetch the current licensing configuration
      const currentConfig = await getLicensingConfigSDK(
        paramValues.ipId as `0x${string}`,
        paramValues.licenseTermsId
      );

      console.log("Current licensing config:", currentConfig);

      // 4. Set commercial revenue share
      if (
        currentConfig &&
        currentConfig.commercialRevShare !== undefined &&
        currentConfig.commercialRevShare != 0
      ) {
        // Use config
        // Convert from basis points (e.g., 1000 = 10%) to percentage
        const revSharePercentage = currentConfig.commercialRevShare / 1000000;
        onParamChange("commercialRevShare", revSharePercentage.toString());
        setCurrentRevShare(revSharePercentage.toString());
      } else {
        const revShare = terms.commercialRevShare / 1000000;
        // Use default terms
        onParamChange("commercialRevShare", revShare.toString());
        setCurrentRevShare(revShare.toString());
      }
    } catch (error) {
      console.error("Error fetching financial parameters:", error);
      setFeeError("Error fetching financial parameters. Please try again.");
    } finally {
      setIsLoadingFee(false);
    }
  };

  // Validate on mount and when mintingFee changes
  useEffect(() => {
    if (paramValues.mintingFee) {
      validateMintingFee(paramValues.mintingFee);
    }
  }, [paramValues.mintingFee, defaultMintingFee]);

  // Validate commercial revenue share when it changes
  useEffect(() => {
    if (paramValues.commercialRevShare) {
      validateCommercialRevShare(paramValues.commercialRevShare);
    }
  }, [paramValues.commercialRevShare, defaultRevShare]);

  // Fetch financial parameters when ipId or licenseTermsId changes
  useEffect(() => {
    if (
      paramValues.ipId &&
      paramValues.licenseTermsId &&
      licenseConfig &&
      client
    ) {
      fetchFinancialParameters();
    }
  }, [paramValues.ipId, paramValues.licenseTermsId, licenseConfig, client]);

  useEffect(() => {
    // if licensing hook is set, we must
    // lock the minting fee at the default (terms)
    if (paramValues.licensingHook === "limit") {
      onParamChange("mintingFee", defaultMintingFee);
      setDisableMintingFee(true);
    } else if (licenseConfig?.mintingFee) {
      // if licensing hook is not set, we set to the
      // config fee because if there's no hook, that takes
      // biggest priority (we can't predict because it's
      // still currently set)
      onParamChange("mintingFee", formatEther(licenseConfig.mintingFee));
      setDisableMintingFee(false);
    } else {
      // otherwise just default lol
      onParamChange("mintingFee", currentMintingFee);
      setDisableMintingFee(false);
    }
  }, [paramValues.licensingHook]);

  return (
    <div
      className="bg-white border rounded-lg shadow-sm w-full h-full"
      style={{ borderLeft: "4px solid #09ACFF" }}
    >
      <div className="flex flex-col w-full p-3">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-2">
          Financial Parameters
        </div>
        <div className="flex flex-col gap-2">
          {/* Minting Fee */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-black">
                  Minting Fee
                </span>
                <span
                  className="ml-1 px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                  style={{ fontFamily: "Menlo, monospace" }}
                >
                  mintingFee
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600 mb-1">
              Fee to mint this license (in IP tokens).
            </span>
            <div style={{ position: "relative" }}>
              <Input
                id="mintingFee"
                type="text"
                inputMode="decimal"
                placeholder="Fee in IP"
                value={paramValues.mintingFee || ""}
                onChange={(e) => onParamChange("mintingFee", e.target.value)}
                style={{ paddingRight: "24px" }}
                className={`border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-8 text-sm ${
                  disableMintingFee ? "bg-gray-100" : "bg-white"
                }`}
                disabled={disableMintingFee}
              />
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgb(107, 114, 128)",
                  fontSize: "0.75rem",
                }}
              >
                IP
              </span>
            </div>
            {feeError && (
              <p className="text-xs text-[#09ACFF] mt-1">{feeError}</p>
            )}
            {currentMintingFee && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <p className="text-xs text-gray-500">
                  Current: {currentMintingFee} IP
                </p>
                {defaultMintingFee && (
                  <p className="text-xs text-gray-500">
                    (Default: {defaultMintingFee} IP)
                  </p>
                )}
              </div>
            )}
            {isLoadingFee && (
              <div className="flex items-center gap-1 mt-1">
                <Spinner size="sm" />
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            )}
          </div>

          {/* Commercial Revenue Share */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-black">
                  Revenue Share
                </span>
                <span
                  className="ml-1 px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                  style={{ fontFamily: "Menlo, monospace" }}
                >
                  commercialRevShare
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600 mb-1">
              Percentage of revenue commercial licensees share with IP owner.
            </span>
            <div style={{ position: "relative" }}>
              <Input
                id="commercialRevShare"
                type="text"
                inputMode="decimal"
                placeholder="Share %"
                value={paramValues.commercialRevShare || ""}
                onChange={(e) =>
                  onParamChange("commercialRevShare", e.target.value)
                }
                style={{ paddingRight: "24px" }}
                className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-8 text-sm"
              />
              <span
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgb(107, 114, 128)",
                  fontSize: "0.75rem",
                }}
              >
                %
              </span>
            </div>
            {revShareError && (
              <p className="text-xs text-[#09ACFF] mt-1">{revShareError}</p>
            )}
            {currentRevShare && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <p className="text-xs text-gray-500">
                  Current: {currentRevShare}%
                </p>
                {defaultRevShare && (
                  <p className="text-xs text-gray-500">
                    (Default: {defaultRevShare}%)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
