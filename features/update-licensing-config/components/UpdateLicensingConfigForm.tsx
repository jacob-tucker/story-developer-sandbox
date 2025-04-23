import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { LicensingConfig, StoryClient } from "@story-protocol/core-sdk";
import { executeUpdateLicensingConfig } from "../services/updateLicensingConfig";
import { useWalletClient } from "wagmi";
import { useTerminal } from "@/lib/context/TerminalContext";
// Import the component files
import { IPIdentificationSection } from "./IPIdentificationSection";
import { FinancialParametersSection } from "./FinancialParametersSection";
import { LicenseAvailabilitySection } from "./LicenseAvailabilitySection";
import { LicenseHooksSection } from "./LicenseHooksSection";
import { Button } from "@/components/ui/button";
import { verifyLicensingConfig } from "../services/verifyUpdateLicenseConfig";
import { getLicensingConfigSDK } from "@/features/utils";

interface UpdateLicensingConfigFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  walletAddress?: string;
  client?: StoryClient;
}

export const UpdateLicensingConfigForm: React.FC<
  UpdateLicensingConfigFormProps
> = ({ paramValues, onParamChange, client }) => {
  // Internal form state
  const [isFormValid, setIsFormValid] = useState(false);

  // Track validation state for form sections
  const [isIPSectionValid, setIsIPSectionValid] = useState(true);
  const [isFinancialSectionValid, setIsFinancialSectionValid] = useState(true);
  const [isHooksSectionValid, setIsHooksSectionValid] = useState(true);
  const [isAvailabilitySectionValid, setIsAvailabilitySectionValid] =
    useState(true);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [licenseConfig, setLicenseConfig] = useState<LicensingConfig | null>(
    null
  );

  // Check if screen is wider than 1150px
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 1150);
    };

    // Check on initial render
    checkScreenWidth();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenWidth);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  const { data: wallet } = useWalletClient();
  const {
    setIsExecuting,
    addTerminalMessage,
    executionSuccess,
    setExecutionSuccess,
    isExecuting,
  } = useTerminal();

  // Function to refresh licensing config data
  const refreshData = async () => {
    if (paramValues.ipId && paramValues.licenseTermsId && client) {
      try {
        setIsLoading(true);
        const currentConfig = await getLicensingConfigSDK(
          paramValues.ipId as `0x${string}`,
          paramValues.licenseTermsId
        );

        setLicenseConfig(currentConfig || null);
        addTerminalMessage("Loading licensing configuration data", "info");
      } catch (error) {
        console.error("Error fetching licensing config:", error);
        setLicenseConfig(null);
        addTerminalMessage("Failed to load licensing configuration", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fetch licensing config when IP ID or license terms ID changes
  useEffect(() => {
    refreshData();
  }, [paramValues.ipId, paramValues.licenseTermsId, client]);

  // Validate the form
  const validateForm = () => {
    // Check if all required fields are filled
    const isValid =
      isIPSectionValid &&
      isFinancialSectionValid &&
      isHooksSectionValid &&
      isAvailabilitySectionValid;

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
    isIPSectionValid,
    isFinancialSectionValid,
    isHooksSectionValid,
    isAvailabilitySectionValid,
  ]);

  // Effect to refresh data when wallet connects (client becomes available)
  useEffect(() => {
    // If client becomes available and we have necessary data already entered
    if (client && paramValues.ipId && paramValues.licenseTermsId) {
      addTerminalMessage(
        "Wallet connected - refreshing licensing configuration data",
        "info"
      );
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
        licenseConfig,
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

          // Refresh data after successful transaction
          setTimeout(() => {
            refreshData();
          }, 2000); // Wait 2 seconds for blockchain to update
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
      {/* SECTION 1: Top 2 columns (Instructions | IP Identification) */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Instructions */}
        <div className="p-6 bg-[#F6FBFF] border border-[#A1D1FF] rounded shadow-sm flex flex-col justify-center flex-1 min-w-0 w-full">
          <h2 className="text-xl font-bold text-[#09ACFF] mb-1">
            Instructions
          </h2>
          <p className="text-sm text-gray-700">
            Update the licensing configuration for your IP asset. You can modify
            the minting fee, licensing hook settings, and availability status.
            Each parameter includes its technical code name for full
            transparency.
          </p>
        </div>
        {/* IP Identification Section - Foundation of the form */}
        <div className="flex flex-col gap-2 p-6 bg-white border border-[#A1D1FF] rounded shadow-sm justify-center flex-1 min-w-0 w-full">
          <IPIdentificationSection
            ipId={paramValues.ipId || ""}
            licenseTermsId={paramValues.licenseTermsId || ""}
            onParamChange={handleParamChange}
            onValidationChange={setIsIPSectionValid}
          />
        </div>
      </div>

      {/* Configuration Sections - Only fully visible when IP and Terms are selected */}
      <div
        className={`w-full transition-opacity duration-300 ${
          !paramValues.ipId || !paramValues.licenseTermsId
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            License Configuration Parameters
          </h3>
          <p className="text-sm text-gray-500">
            Configure the parameters for the selected license terms
          </p>
        </div>

        {/* Card Layout for Configuration Sections - 3 columns side by side on desktop, stacked below 1150px */}
        <div
          className="flex flex-col space-y-6"
          style={{
            flexDirection: isWideScreen ? "row" : "column",
            columnGap: "1.5rem",
          }}
        >
          {/* Financial Parameters Section */}
          <div
            style={{ flex: isWideScreen ? "1" : "auto", padding: "0 0.25rem" }}
          >
            <FinancialParametersSection
              licenseConfig={licenseConfig}
              client={client}
              paramValues={paramValues}
              onParamChange={handleParamChange}
              onValidationChange={setIsFinancialSectionValid}
            />
          </div>

          {/* License Availability Section */}
          <div
            style={{ flex: isWideScreen ? "1" : "auto", padding: "0 0.25rem" }}
          >
            <LicenseAvailabilitySection
              licenseConfig={licenseConfig}
              client={client}
              paramValues={paramValues}
              onParamChange={handleParamChange}
              onValidationChange={setIsAvailabilitySectionValid}
            />
          </div>

          {/* License Hooks Section */}
          <div
            style={{ flex: isWideScreen ? "1" : "auto", padding: "0 0.25rem" }}
          >
            <LicenseHooksSection
              licenseConfig={licenseConfig}
              client={client}
              paramValues={paramValues}
              onParamChange={handleParamChange}
              onValidationChange={setIsHooksSectionValid}
            />
          </div>
        </div>
      </div>

      {/* Execute Button */}
      <div className="w-full max-w-4xl" style={{ marginTop: "-10px" }}>
        <Button
          type="submit"
          disabled={!isFormValid || isExecuting}
          className="w-full bg-[#09ACFF] hover:bg-[#09ACFF]/80 text-white relative"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center space-x-2">
              <Spinner size="sm" color="text-white" />
              <span>Executing...</span>
            </span>
          ) : (
            "$ execute update license config"
          )}
        </Button>
      </div>
    </form>
  );
};
