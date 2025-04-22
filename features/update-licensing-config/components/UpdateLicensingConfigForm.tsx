import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { StoryClient } from "@story-protocol/core-sdk";
import {
  executeUpdateLicensingConfig,
  verifyLicensingConfig,
} from "../services/updateLicensingConfig";
import { useWalletClient } from "wagmi";
import { useTerminal } from "@/lib/context/TerminalContext";
// Import the component files
import { IPIdentificationSection } from "./IPIdentificationSection";
import { FinancialParametersSection } from "./FinancialParametersSection";
import { LicenseAvailabilitySection } from "./LicenseAvailabilitySection";
import { LicenseHooksSection } from "./LicenseHooksSection";

interface UpdateLicensingConfigFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  walletAddress?: string;
  client?: StoryClient;
}

export const UpdateLicensingConfigForm: React.FC<
  UpdateLicensingConfigFormProps
> = ({ paramValues, onParamChange, walletAddress, client }) => {
  // Internal form state
  const [isFormValid, setIsFormValid] = useState(false);
  const [licenseTermsOptions, setLicenseTermsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [ipIdError, setIpIdError] = useState("");
  // We no longer need to track license limit error in the main form

  // Track validation state for form sections
  const [isIPSectionValid, setIsIPSectionValid] = useState(false);
  const [isFinancialSectionValid, setIsFinancialSectionValid] = useState(false);
  const [isHooksSectionValid, setIsHooksSectionValid] = useState(false);
  const [isAvailabilitySectionValid, setIsAvailabilitySectionValid] =
    useState(true);
  const [isDisabledLoading, setIsDisabledLoading] = useState(false);

  const { data: wallet } = useWalletClient();
  const {
    setIsExecuting,
    addTerminalMessage,
    executionSuccess,
    setExecutionSuccess,
    isExecuting,
  } = useTerminal();

  // Reset form values function - centralized reset logic
  const resetFormValues = () => {
    // Reset all form values
    onParamChange("licenseTermsId", "");
    onParamChange("mintingFee", "");
    onParamChange("commercialRevShare", "");
    onParamChange("disabled", "false");
    onParamChange("licensingHook", "none");
    onParamChange("licenseLimit", "");

    // Reset internal state
    setLicenseTermsOptions([]);
  };

  // Validate the form
  const validateForm = () => {
    // Check if all required fields are filled
    const isValid =
      isIPSectionValid &&
      isFinancialSectionValid &&
      isHooksSectionValid &&
      isAvailabilitySectionValid &&
      !isLoadingTerms;

    setIsFormValid(isValid);
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    onParamChange(name, value);

    // Validate form after any parameter change
    setTimeout(validateForm, 0);
  };

  // Effect to validate form when parameters change
  useEffect(() => {
    validateForm();
  }, [
    paramValues,
    ipIdError,
    licenseTermsOptions,
    isIPSectionValid,
    isFinancialSectionValid,
    isHooksSectionValid,
    isAvailabilitySectionValid,
    isLoadingTerms,
  ]);

  // Effect to update form validity when dependencies change
  useEffect(() => {
    // This is needed to ensure form validity is updated when dependencies change
    validateForm();
  }, [paramValues]);

  // Effect to refresh data when wallet connects (client becomes available)
  useEffect(() => {
    // If client becomes available and we have necessary data already entered
    if (client && paramValues.ipId && paramValues.licenseTermsId) {
      if (addTerminalMessage) {
        addTerminalMessage(
          "Wallet connected - refreshing licensing configuration data",
          "info"
        );
      }
    }
  }, [client]);

  // Effect to check result after execution
  const validateExecution = async () => {
    // Add a slight delay to ensure the blockchain state has updated
    setTimeout(async () => {
      // Verify the licensing config and provide detailed feedback

      addTerminalMessage("Verifying licensing configuration...", "info");

      try {
        // Verify the licensing config has been updated correctly
        const verificationResult = await verifyLicensingConfig(
          paramValues.ipId,
          paramValues.licenseTermsId,
          {
            mintingFee: paramValues.mintingFee,
            disabled: paramValues.disabled === "true",
            licensingHook: paramValues.licensingHook,
            licenseLimit: paramValues.licenseLimit,
          }
        );

        // Display the verification result
        addTerminalMessage(
          verificationResult.message,
          verificationResult.success ? "success" : "error"
        );

        // If there are details, show them
        if (verificationResult.details) {
          addTerminalMessage(
            `Verification details: ${verificationResult.details}`,
            "info"
          );
        }
      } catch (error) {
        console.error("Error verifying licensing config:", error);
        addTerminalMessage(
          "Could not verify licensing configuration. Please check manually.",
          "error"
        );
      }
    }, 2000); // 2 second delay
  };

  const handleExecute = async () => {
    setIsExecuting(true);

    // Display basic transaction start message
    addTerminalMessage(`Executing update licensing config transaction...`);

    if (!client) {
      addTerminalMessage("Error: No client available.", "error");
      addTerminalMessage("Please connect your wallet to execute transactions.");
      setExecutionSuccess(false);
      return;
    }

    try {
      const result = await executeUpdateLicensingConfig(
        paramValues,
        client,
        wallet
      );

      if (result.success) {
        if (result.txHashes.length == 0) {
          addTerminalMessage(
            "No changes were made to the licensing configuration.",
            "info"
          );
        } else {
          for (const txHash of result.txHashes) {
            addTerminalMessage(
              `Transaction submitted with hash: ${txHash}`,
              "success"
            );
          }
          await validateExecution();
        }

        // Set execution success - the form components will handle verification
        setExecutionSuccess(true);
      } else {
        addTerminalMessage("Transaction failed.", "error");
        addTerminalMessage(`Error: ${result.error}`);
        setExecutionSuccess(false);
      }
    } catch (error) {
      addTerminalMessage("Transaction failed.", "error");
      addTerminalMessage(`Error: ${String(error)}`);
      setExecutionSuccess(false);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <form
      className="flex flex-col items-center w-full"
      style={{ gap: "24px" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid && !isExecuting) handleExecute();
      }}
    >
      {/* IP Identification Section - Foundation of the form */}
      <IPIdentificationSection
        ipId={paramValues.ipId || ""}
        licenseTermsId={paramValues.licenseTermsId || ""}
        onParamChange={handleParamChange}
        onValidationChange={setIsIPSectionValid}
      />

      {/* Configuration Sections - Only fully visible when IP and Terms are selected */}
      <div
        className={`w-full transition-opacity duration-300 ${
          !paramValues.ipId || !paramValues.licenseTermsId
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
        }`}
      >
        {/* Configuration Header - Only shown when required fields are filled */}
        {paramValues.ipId && paramValues.licenseTermsId && (
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              License Configuration Parameters
            </h3>
            <p className="text-sm text-gray-500">
              Configure the parameters for the selected license terms
            </p>
          </div>
        )}

        {/* Financial Parameters Section */}
        <FinancialParametersSection
          ipId={paramValues.ipId || ""}
          licenseTermsId={paramValues.licenseTermsId || ""}
          client={client}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          onValidationChange={setIsFinancialSectionValid}
        />

        {/* License Availability Section */}
        <LicenseAvailabilitySection
          ipId={paramValues.ipId || ""}
          licenseTermsId={paramValues.licenseTermsId || ""}
          client={client}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          onValidationChange={setIsAvailabilitySectionValid}
        />

        {/* License Hooks Section */}
        <LicenseHooksSection
          ipId={paramValues.ipId || ""}
          licenseTermsId={paramValues.licenseTermsId || ""}
          client={client}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          onValidationChange={setIsHooksSectionValid}
        />
      </div>

      {/* Execute Button */}
      <div className="w-full max-w-4xl mt-4">
        <button
          type="submit"
          disabled={!isFormValid || isExecuting}
          className={`w-full h-12 rounded-md font-medium transition-colors ${
            isFormValid
              ? "bg-[#09ACFF] hover:bg-[#066DA1] text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isExecuting ? (
            <span className="flex items-center justify-center space-x-2">
              <Spinner size="sm" color="text-white" />
              <span>Executing...</span>
            </span>
          ) : (
            "$ execute update licensing config"
          )}
        </button>
      </div>
    </form>
  );
};
