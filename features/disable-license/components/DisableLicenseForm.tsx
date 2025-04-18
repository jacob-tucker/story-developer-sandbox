import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/atoms/Spinner";
import { ActionType } from "../../types";
import { checkLicenseDisabledStatus } from "../../utils";
import { verifyLicenseDisabled } from "../services/disableLicense";
import { BaseFormLayout } from "../../base/components/BaseFormLayout";
import { fetchLicenseTermsIds } from "../../api";

interface DisableLicenseFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionSuccess: boolean | null;
  walletAddress?: string;
  addTerminalMessage?: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
}

export const DisableLicenseForm: React.FC<DisableLicenseFormProps> = ({
  paramValues,
  onParamChange,
  onExecute,
  isExecuting,
  executionSuccess,
  walletAddress,
  addTerminalMessage,
}) => {
  // Internal form state
  const [isFormValid, setIsFormValid] = useState(false);
  const [licenseTermsOptions, setLicenseTermsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [ipIdError, setIpIdError] = useState("");
  const [isLicenseDisabled, setIsLicenseDisabled] = useState(false);
  const [isCheckingDisabled, setIsCheckingDisabled] = useState(false);
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
          // Check if the license is already disabled
          checkLicenseStatus(ipId, result.options[0].value);
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

  // Check if the license is already disabled
  const checkLicenseStatus = async (ipId: string, licenseTermsId: string) => {
    if (!ipId || !licenseTermsId) return;

    setIsCheckingDisabled(true);
    try {
      const result = await checkLicenseDisabledStatus(ipId, licenseTermsId);
      setIsLicenseDisabled(result.isDisabled);

      if (result.isDisabled && addTerminalMessage) {
        addTerminalMessage("This license is already disabled.", "info");
      }
    } catch (error) {
      console.error("Error checking license status:", error);
    } finally {
      setIsCheckingDisabled(false);
    }
  };

  // Validate the form
  const validateForm = () => {
    // Required fields for disable license action
    const requiredFields = ["ipId", "licenseTermsId"];

    // Check if all required fields are filled
    const hasAllRequiredFields = requiredFields.every(
      (field) => paramValues[field] && paramValues[field].trim() !== ""
    );

    // Set form validity (also consider if license is already disabled)
    setIsFormValid(
      hasAllRequiredFields &&
        !isLoadingTerms &&
        !ipIdError &&
        licenseTermsOptions.length > 0 &&
        !isLicenseDisabled
    );
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    onParamChange(name, value);

    // For IP ID, fetch license terms when it's a valid address
    if (name === "ipId" && value && value.startsWith("0x")) {
      fetchLicenseTerms(value);
    }

    // For license terms ID, check if license is disabled
    if (name === "licenseTermsId" && value && paramValues.ipId) {
      checkLicenseStatus(paramValues.ipId, value);
    }
  };

  // Effect to validate form when parameters change
  useEffect(() => {
    validateForm();
  }, [
    paramValues,
    licenseTermsOptions,
    ipIdError,
    isLoadingTerms,
    isLicenseDisabled,
  ]);

  // Effect to fetch license terms when IP ID is available
  useEffect(() => {
    if (paramValues.ipId && paramValues.ipId.startsWith("0x")) {
      fetchLicenseTerms(paramValues.ipId);
    }
  }, []);

  // Effect to update the license disabled status after a successful transaction
  useEffect(() => {
    // If transaction was successful and we have the necessary parameters, check if license is now disabled
    if (
      executionSuccess === true &&
      paramValues.ipId &&
      paramValues.licenseTermsId
    ) {
      // Set license as disabled immediately for better UI feedback
      setIsLicenseDisabled(true);

      // Add a slight delay to ensure the blockchain state has updated
      setTimeout(async () => {
        // Verify the license disabled status and provide detailed feedback
        if (addTerminalMessage) {
          addTerminalMessage("Verifying license disabled status...", "info");

          try {
            // Verify the license is actually disabled
            const verificationResult = await verifyLicenseDisabled(
              paramValues.ipId,
              paramValues.licenseTermsId
            );

            // Display the verification result
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

            // Update the UI state based on the verification result
            if (verificationResult.isDisabled !== undefined) {
              setIsLicenseDisabled(verificationResult.isDisabled);
            }
          } catch (error) {
            console.error("Error verifying license disabled status:", error);
            addTerminalMessage(
              "Could not verify if license is disabled. Please check manually.",
              "error"
            );
          }
        }
      }, 2000); // 2 second delay
    }
  }, [executionSuccess]);

  return (
    <>
      <BaseFormLayout
        actionType={ActionType.DISABLE_LICENSE}
        isFormValid={isFormValid}
        isExecuting={isExecuting}
        onExecute={onExecute}
        walletAddress={walletAddress}
        isDisabled={isLicenseDisabled}
        disabledReason="License Disabled"
        isCheckingStatus={isCheckingDisabled}
        buttonText="$ execute disable license"
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
            onChange={(e) =>
              handleParamChange("licenseTermsId", e.target.value)
            }
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
          {isLicenseDisabled && (
            <p className="text-xs text-yellow-600">
              ⚠️ This license term is already disabled. Select a different one
              or try another IP.
            </p>
          )}
        </div>
      </BaseFormLayout>
    </>
  );
};
