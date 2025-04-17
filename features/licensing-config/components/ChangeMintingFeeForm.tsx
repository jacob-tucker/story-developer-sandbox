import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionType } from "../types";
import { formatEther, parseEther } from "viem";
import { StoryClient } from "@story-protocol/core-sdk";
import { verifyMintingFee } from "../services/changeMintingFee";
import { BaseFormLayout } from "./BaseFormLayout";
import { Spinner } from "@/components/atoms/Spinner";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { fetchLicenseTermsIds } from "../api";
import {
  checkLicenseDisabledStatus,
  getLicenseTermsSDK,
} from "../services/utils";

interface ChangeMintingFeeFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionSuccess: boolean | null;
  walletAddress?: string;
  client?: StoryClient;
  addTerminalMessage?: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
}

export const ChangeMintingFeeForm: React.FC<ChangeMintingFeeFormProps> = ({
  paramValues,
  onParamChange,
  onExecute,
  isExecuting,
  executionSuccess,
  walletAddress,
  client,
  addTerminalMessage,
}) => {
  // Internal form state
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentMintingFee, setCurrentMintingFee] = useState("");
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [feeError, setFeeError] = useState("");
  const [licenseTermsOptions, setLicenseTermsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [ipIdError, setIpIdError] = useState("");
  const [defaultMintingFee, setDefaultMintingFee] = useState<string | null>(
    null
  );

  // Handle minting fee input change
  const handleMintingFeeChange = (value: string) => {
    // Just store the user input directly
    onParamChange("mintingFee", value);
  };

  // Fetch license terms details to get default minting fee
  const fetchLicenseTermsDetails = async (licenseTermsId: string) => {
    if (!licenseTermsId || !client) return;

    try {
      const terms = await getLicenseTermsSDK(licenseTermsId, client);

      if (terms && terms.defaultMintingFee !== undefined) {
        // Use optional chaining and type assertion to safely access mintingFee
        const defaultFee = formatEther(terms.defaultMintingFee);
        setDefaultMintingFee(defaultFee);
      }
    } catch (error) {
      console.error("Error fetching license terms details:", error);
    }
  };

  // Fetch license terms for an IP
  const fetchLicenseTerms = async (ipId: string) => {
    if (!ipId || !ipId.startsWith("0x")) {
      setIpIdError("Invalid IP ID format. Must start with 0x.");
      setLicenseTermsOptions([]);
      return;
    }

    setIsLoadingTerms(true);
    setLicenseTermsOptions([]);

    try {
      // Use the existing API function instead of duplicating the logic
      const result = await fetchLicenseTermsIds(ipId);

      if (result.options.length > 0) {
        setLicenseTermsOptions(result.options);
        setIpIdError("");

        // Auto-select the first license term if available
        if (result.options.length > 0 && !paramValues.licenseTermsId) {
          onParamChange("licenseTermsId", result.options[0].value);
          // Fetch the current minting fee for the selected license term
          fetchCurrentMintingFee(ipId, result.options[0].value);
        }
      } else {
        setLicenseTermsOptions([]);
        setIpIdError(result.error || "No license terms found for this IP ID.");
      }
    } catch (error) {
      console.error("Error fetching license terms:", error);
      setIpIdError("Error fetching license terms. Please try again.");
      setLicenseTermsOptions([]);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  // Fetch current minting fee for a license
  const fetchCurrentMintingFee = async (
    ipId: string,
    licenseTermsId: string
  ) => {
    if (!ipId || !licenseTermsId) return;

    setIsLoadingFee(true);
    setCurrentMintingFee("");
    setFeeError("");

    try {
      if (!client) {
        setFeeError("No client available. Please connect your wallet.");
        return;
      }

      // Check if the license is disabled
      const licenseStatus = await checkLicenseDisabledStatus(
        ipId,
        licenseTermsId
      );
      if (licenseStatus.isDisabled && addTerminalMessage) {
        addTerminalMessage(
          "Note: This license is currently DISABLED. Executing this action will RE-ENABLE it.",
          "info"
        );
      }

      // Fetch the license terms to get default minting fee
      fetchLicenseTermsDetails(licenseTermsId);

      // Get the license template address from the network configuration
      const networkConfig = getCurrentNetworkConfig();
      const licenseTemplateAddress = networkConfig.licenseTemplateAddress;

      // Access the licensing module through the client
      const response = await client.license.predictMintingLicenseFee({
        licensorIpId: ipId as `0x${string}`,
        licenseTermsId: parseInt(licenseTermsId),
        amount: BigInt(1),
        licenseTemplate: licenseTemplateAddress,
      });

      if (response && response.tokenAmount !== undefined) {
        const feeInWei = response.tokenAmount.toString();
        setCurrentMintingFee(feeInWei);

        // Auto-populate the minting fee input with the human-readable value
        const feeInEth = formatEther(response.tokenAmount);
        onParamChange("mintingFee", feeInEth);

        if (addTerminalMessage) {
          addTerminalMessage(`Current minting fee: ${feeInEth} IP`, "info");
        }
      } else {
        setFeeError("Could not fetch current minting fee.");
      }
    } catch (error) {
      console.error("Error fetching minting fee:", error);
      setFeeError("Error fetching minting fee. Please try again.");
    } finally {
      setIsLoadingFee(false);
    }
  };

  // Validate the form
  const validateForm = () => {
    // Common required fields
    const requiredFields = ["ipId", "licenseTermsId", "mintingFee"];

    // Check if all required fields are filled
    const hasAllRequiredFields = requiredFields.every(
      (field) => paramValues[field] && paramValues[field].trim() !== ""
    );

    // Validate minting fee is a valid number
    let isValidMintingFee = true;
    if (paramValues.mintingFee) {
      const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(paramValues.mintingFee);
      if (!isValidNumber) {
        setFeeError("Minting fee must be a valid number");
        isValidMintingFee = false;
      } else if (
        defaultMintingFee &&
        parseFloat(paramValues.mintingFee) < parseFloat(defaultMintingFee)
      ) {
        setFeeError(
          `Minting fee must be greater than or equal to ${defaultMintingFee} IP (default fee)`
        );
        isValidMintingFee = false;
      } else {
        // Clear fee error if the value is now valid
        setFeeError("");
      }
    }

    // Set form validity
    setIsFormValid(
      hasAllRequiredFields &&
        !isLoadingTerms &&
        !ipIdError &&
        isValidMintingFee &&
        licenseTermsOptions.length > 0
    );
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    onParamChange(name, value);

    // For IP ID, fetch license terms when it's a valid address
    if (name === "ipId" && value && value.startsWith("0x")) {
      fetchLicenseTerms(value);
    }

    // For license terms ID, fetch current minting fee and license terms details
    if (name === "licenseTermsId" && value && paramValues.ipId) {
      fetchCurrentMintingFee(paramValues.ipId, value);
    }
  };

  // Effect to validate form when parameters change
  useEffect(() => {
    validateForm();
  }, [paramValues, licenseTermsOptions, ipIdError, isLoadingTerms]);

  // Effect to fetch license terms when IP ID is available
  useEffect(() => {
    if (paramValues.ipId && paramValues.ipId.startsWith("0x")) {
      fetchLicenseTerms(paramValues.ipId);
    }
  }, []);

  // Effect to update the minting fee after a successful transaction
  useEffect(() => {
    // If transaction was successful and we have the necessary parameters, check the minting fee
    if (
      executionSuccess === true &&
      paramValues.ipId &&
      paramValues.licenseTermsId &&
      paramValues.mintingFee
    ) {
      // Add a slight delay to ensure the blockchain state has updated
      setTimeout(async () => {
        // Update the form UI state
        fetchCurrentMintingFee(paramValues.ipId, paramValues.licenseTermsId);

        // Verify the minting fee change and provide detailed feedback
        if (addTerminalMessage) {
          addTerminalMessage("Verifying minting fee update...", "info");

          const verificationResult = await verifyMintingFee(
            paramValues.ipId,
            paramValues.licenseTermsId,
            paramValues.mintingFee
          );

          // Display the formatted message
          addTerminalMessage(
            verificationResult.message,
            verificationResult.success ? "success" : "info"
          );

          // If there are details, show them
          if (verificationResult.details) {
            addTerminalMessage(
              `Verification details: ${verificationResult.details}`,
              "info"
            );
          }
        }
      }, 2000); // 2 second delay
    }
  }, [executionSuccess]);

  return (
    <BaseFormLayout
      actionType={ActionType.CHANGE_MINTING_FEE}
      isFormValid={isFormValid}
      isExecuting={isExecuting}
      onExecute={onExecute}
      walletAddress={walletAddress}
      buttonText="$ execute change license minting fee"
    >
      {/* IP ID */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ipId" className="text-black">
          <span className="text-[#09ACFF]">$</span> ipId
        </Label>
        <Input
          id="ipId"
          placeholder="IP ID (0x...)"
          value={paramValues.ipId || ""}
          onChange={(e) => handleParamChange("ipId", e.target.value)}
          className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
        />
        {ipIdError && <p className="text-xs text-[#09ACFF]">{ipIdError}</p>}
      </div>

      {/* License Terms ID */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="licenseTermsId" className="text-black">
          <span className="text-[#09ACFF]">$</span> licenseTermsId
        </Label>
        <select
          id="licenseTermsId"
          value={paramValues.licenseTermsId || ""}
          onChange={(e) => handleParamChange("licenseTermsId", e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          disabled={isLoadingTerms || licenseTermsOptions.length === 0}
        >
          <option value="">Select License Terms ID</option>
          {licenseTermsOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isLoadingTerms && (
          <div className="flex items-center text-xs text-gray-500">
            <Spinner size="sm" color="text-gray-500" />
            <span className="ml-2">Loading license terms...</span>
          </div>
        )}
      </div>

      {/* Minting Fee */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="mintingFee" className="text-black">
          <span className="text-[#09ACFF]">$</span> mintingFee
        </Label>
        <div style={{ position: "relative" }}>
          <Input
            id="mintingFee"
            type="text"
            inputMode="decimal"
            placeholder="Minting fee in IP"
            value={paramValues.mintingFee || ""}
            onChange={(e) => handleMintingFeeChange(e.target.value)}
            style={{ paddingRight: "32px" }}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
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
          <div className="flex items-center text-xs text-gray-500">
            <Spinner size="sm" color="text-gray-500" />
            <span className="ml-2">Loading current fee...</span>
          </div>
        ) : currentMintingFee ? (
          <p className="text-xs text-gray-500">
            Current fee: {formatEther(BigInt(currentMintingFee))} IP
          </p>
        ) : null}
        {feeError && <p className="text-xs text-[#09ACFF]">{feeError}</p>}
      </div>

      {/* Empty div to maintain the grid layout */}
      <div className="flex flex-col gap-2">
        {/* This div is intentionally left empty to maintain the 2-column grid */}
      </div>
    </BaseFormLayout>
  );
};
