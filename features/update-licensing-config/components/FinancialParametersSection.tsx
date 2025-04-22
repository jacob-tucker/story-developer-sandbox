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
    } else {
      // if licensing hook is not set, we set to the
      // actual fee (the predicted one)
      onParamChange("mintingFee", currentMintingFee);
      setDisableMintingFee(false);
    }
  }, [paramValues.licensingHook]);

  return (
    <div
      className="bg-white border rounded-lg shadow-sm mb-6 w-full"
      style={{ borderLeft: "5px solid #09ACFF" }}
    >
      <div className="flex flex-col w-full p-6">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-4">
          Financial Parameters
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* Minting Fee */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base text-black">
                Minting Fee
              </span>
              <span
                className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                style={{ fontFamily: "Menlo, monospace" }}
              >
                mintingFee
              </span>
            </div>
            <span className="text-xs text-gray-600 mb-2">
              The fee users must pay to mint this license (in IP tokens).
            </span>
            <div style={{ position: "relative" }}>
              <Input
                id="mintingFee"
                type="text"
                inputMode="decimal"
                placeholder="Minting fee in IP"
                value={paramValues.mintingFee || ""}
                onChange={(e) => onParamChange("mintingFee", e.target.value)}
                style={{ paddingRight: "32px" }}
                className={`border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-12 ${
                  disableMintingFee ? "bg-gray-100" : "bg-white"
                }`}
                disabled={isLoadingFee || disableMintingFee}
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgb(107, 114, 128)",
                }}
              >
                IP
              </span>
            </div>
            {isLoadingFee ? (
              <div className="flex items-center gap-2 mt-2">
                <Spinner size="sm" />
                <p className="text-xs text-gray-500">Loading current fee...</p>
              </div>
            ) : (
              feeError && (
                <p className="text-xs text-[#09ACFF] mt-2">{feeError}</p>
              )
            )}
            {currentMintingFee && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Current fee:</span>{" "}
                  {currentMintingFee} IP
                </p>
                {defaultMintingFee && (
                  <p className="text-xs text-gray-500 ml-2">
                    <span className="font-semibold">(Default:</span>{" "}
                    {defaultMintingFee} IP
                    <span className="font-semibold">)</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Commercial Rev Share */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base text-black">
                Commercial Revenue Share
              </span>
              <span
                className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                style={{ fontFamily: "Menlo, monospace" }}
              >
                commercialRevShare
              </span>
            </div>
            <span className="text-xs text-gray-600 mb-2">
              Percentage of commercial revenue shared with the IP owner.
            </span>
            <div style={{ position: "relative" }}>
              <Input
                id="commercialRevShare"
                type="text"
                inputMode="decimal"
                placeholder="Commercial revenue share percentage"
                value={paramValues.commercialRevShare || ""}
                onChange={(e) =>
                  onParamChange("commercialRevShare", e.target.value)
                }
                style={{ paddingRight: "32px" }}
                className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-12"
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "rgb(107, 114, 128)",
                }}
              >
                %
              </span>
              {revShareError && (
                <p className="text-xs text-[#09ACFF] mt-2">{revShareError}</p>
              )}
            </div>
            {currentRevShare && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Current share:</span>{" "}
                  {currentRevShare}%
                </p>
                {defaultRevShare && (
                  <p className="text-xs text-gray-500 ml-2">
                    <span className="font-semibold">(Default:</span>{" "}
                    {defaultRevShare}%<span className="font-semibold">)</span>
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
