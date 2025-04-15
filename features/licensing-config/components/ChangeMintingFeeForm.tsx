import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionType } from "../types";
import { formatEther, parseEther } from "viem";
import { StoryClient } from "@story-protocol/core-sdk";
import { verifyMintingFee } from "../services/changeMintingFee";
import { BaseFormLayout } from "./BaseFormLayout";
import { Spinner } from "@/components/atoms/Spinner";

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
  // Format wei value to IP for display
  const formatWeiToEth = (weiValue: string): string => {
    if (!weiValue || weiValue === "0") return "0";
    try {
      return formatEther(BigInt(weiValue));
    } catch (error) {
      console.error("Error formatting wei to ETH:", error);
      return "0";
    }
  };

  // Convert user input IP to wei
  const parseEthToWei = (ipValue: string): string => {
    if (!ipValue || ipValue === "0") return "0";
    try {
      return parseEther(ipValue).toString();
    } catch (error) {
      console.error("Error parsing ETH to wei:", error);
      return "0";
    }
  };

  // Handle minting fee input change
  const handleMintingFeeChange = (value: string) => {
    // Update the display value
    onParamChange("mintingFeeDisplay", value);

    // Convert to wei and update the actual value
    const weiValue = parseEthToWei(value);
    onParamChange("mintingFee", weiValue);
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
      // Use the Story API to fetch license terms
      const options = {
        method: "GET",
        headers: {
          "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
          "X-Chain": "story-aeneid",
        },
      };

      const response = await fetch(
        `https://api.storyapis.com/api/v3/licenses/ip/terms/${ipId}`,
        options
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Format license terms options
        const options = data.data.map((term: any) => ({
          value: term.licenseTermsId.toString(),
          label: term.licenseTermsId.toString(),
        }));

        setLicenseTermsOptions(options);
        setIpIdError("");

        // Auto-select the first license term if available
        if (options.length > 0 && !paramValues.licenseTermsId) {
          onParamChange("licenseTermsId", options[0].value);
          // Fetch the current minting fee for the selected license term
          fetchCurrentMintingFee(ipId, options[0].value);
        }
      } else {
        setLicenseTermsOptions([]);
        setIpIdError("No license terms found for this IP ID.");
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

      // Access the licensing module through the client
      const response = await client.license.predictMintingLicenseFee({
        licensorIpId: ipId as `0x${string}`,
        licenseTermsId: parseInt(licenseTermsId),
        amount: BigInt(1),
        licenseTemplate: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
      });

      if (response && response.tokenAmount !== undefined) {
        const feeInWei = response.tokenAmount.toString();
        setCurrentMintingFee(feeInWei);

        // Auto-populate the minting fee input with the current fee
        const feeInEth = formatWeiToEth(feeInWei);
        onParamChange("mintingFeeDisplay", feeInEth);
        onParamChange("mintingFee", feeInWei);

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

    // Set form validity
    setIsFormValid(
      hasAllRequiredFields &&
        !isLoadingTerms &&
        !ipIdError &&
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

    // For license terms ID, fetch current minting fee
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

          // Display the formatted message (already formatted in wei to ETH in the service)
          addTerminalMessage(
            verificationResult.message,
            verificationResult.success ? "success" : "info"
          );

          // If there are details, they're already formatted in the service
          if (verificationResult.details) {
            addTerminalMessage(
              `Verification details: ${verificationResult.details}`,
              "info"
            );
          }

          // If we have both current and expected fees, show them in a more readable format
          if (verificationResult.currentFee && verificationResult.expectedFee) {
            const currentFeeFormatted = formatWeiToEth(verificationResult.currentFee);
            const expectedFeeFormatted = formatWeiToEth(verificationResult.expectedFee);

            addTerminalMessage(
              `Current fee: ${currentFeeFormatted} IP, Expected: ${expectedFeeFormatted} IP`,
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
        <Label htmlFor="mintingFeeDisplay" className="text-black">
          <span className="text-[#09ACFF]">$</span> mintingFee
        </Label>
        <div className="relative">
          <Input
            id="mintingFeeDisplay"
            type="text"
            inputMode="decimal"
            placeholder="Minting fee in IP"
            value={paramValues.mintingFeeDisplay || ""}
            onChange={(e) => handleMintingFeeChange(e.target.value)}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">IP</span>
          </div>
        </div>
        {isLoadingFee ? (
          <div className="flex items-center text-xs text-gray-500">
            <Spinner size="sm" color="text-gray-500" />
            <span className="ml-2">Loading current fee...</span>
          </div>
        ) : currentMintingFee ? (
          <p className="text-xs text-gray-500">
            Current fee: {formatWeiToEth(currentMintingFee)} IP
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
