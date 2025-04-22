import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/atoms/Spinner";
import { ActionType } from "../../types";
import { formatEther, parseEther } from "viem";
import { StoryClient } from "@story-protocol/core-sdk";
import {
  getLicenseTermsSDK,
  getLicensingConfigSDK,
  extractLicenseLimitFromHookData,
} from "../../utils";
import {
  executeUpdateLicensingConfig,
  verifyLicensingConfig,
} from "../services/updateLicensingConfig";
import { BaseFormLayout } from "../../base/components/BaseFormLayout";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";
import { fetchLicenseTermsIds } from "../../api";
import { useWalletClient } from "wagmi";
import { useTerminal } from "@/lib/context/TerminalContext";

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
  const [isDisabledLoading, setIsDisabledLoading] = useState(false);
  const [showLicenseLimitInput, setShowLicenseLimitInput] = useState(false);
  const [licenseLimitError, setLicenseLimitError] = useState("");
  const { data: wallet } = useWalletClient();
  const {
    setIsExecuting,
    addTerminalMessage,
    executionSuccess,
    setExecutionSuccess,
  } = useTerminal();

  // Reset form values function - centralized reset logic
  const resetFormValues = (
    options: {
      resetLicenseTerms?: boolean;
      resetFeeValues?: boolean;
      resetLicenseHookValues?: boolean;
    } = {}
  ) => {
    const {
      resetLicenseTerms = false,
      resetFeeValues = false,
      resetLicenseHookValues = false,
    } = options;

    // Reset license terms if requested
    if (resetLicenseTerms) {
      onParamChange("licenseTermsId", "");
      setLicenseTermsOptions([]);
    }

    // Reset fee values if requested
    if (resetFeeValues) {
      setCurrentMintingFee("");
      setDefaultMintingFee(null);
      setFeeError("");
      onParamChange("mintingFee", "");
    }

    // Reset license hook values if requested
    if (resetLicenseHookValues) {
      onParamChange("licensingHook", "none");
      onParamChange("licenseLimit", "");
      setShowLicenseLimitInput(false);
      setLicenseLimitError("");
    }
  };

  // Reset all values when IP changes
  const resetForNewIp = () => {
    resetFormValues({
      resetLicenseTerms: true,
      resetFeeValues: true,
      resetLicenseHookValues: true,
    });
    onParamChange("disabled", "false");
  };

  // Reset fee-related values when license terms change
  const resetForNewLicenseTerms = () => {
    resetFormValues({
      resetFeeValues: true,
      resetLicenseHookValues: true,
    });
    onParamChange("disabled", "false");
  };

  // Validate minting fee
  const validateMintingFee = (value: string) => {
    if (!value) {
      setFeeError("Minting fee is required");
      return false;
    }

    const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(value);
    if (!isValidNumber) {
      setFeeError("Minting fee must be a valid number");
      return false;
    }

    if (
      defaultMintingFee &&
      parseFloat(value) < parseFloat(defaultMintingFee)
    ) {
      setFeeError(
        `Minting fee must be greater than or equal to ${defaultMintingFee} IP (default fee)`
      );
      return false;
    }

    // Clear error if all validations pass
    setFeeError("");
    return true;
  };

  // Validate license limit
  const validateLicenseLimit = (value: string) => {
    if (paramValues.licensingHook === "limit") {
      if (!value) {
        setLicenseLimitError(
          "License limit is required when using Limit License hook"
        );
        return false;
      }

      const isValidNumber = /^\d+$/.test(value); // Only positive integers
      if (!isValidNumber) {
        setLicenseLimitError("License limit must be a valid positive integer");
        return false;
      }

      const limit = parseInt(value);
      if (limit <= 0) {
        setLicenseLimitError("License limit must be greater than 0");
        return false;
      }

      // Clear error if all validations pass
      setLicenseLimitError("");
      return true;
    }

    // If not using limit hook, no validation needed
    return true;
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
      resetForNewIp();
      return;
    }

    setIsLoadingTerms(true);
    resetForNewIp();

    try {
      // Use the existing API function instead of duplicating the logic
      const result = await fetchLicenseTermsIds(ipId);

      if (result.options.length > 0) {
        setLicenseTermsOptions(result.options);
        setIpIdError("");

        // Always auto-select the first license term when options are available
        onParamChange("licenseTermsId", result.options[0].value);

        // Fetch the current licensing config for the selected license term
        fetchCurrentLicensingConfig(ipId, result.options[0].value);
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

  // Fetch current licensing config including minting fee and disabled status
  const fetchCurrentLicensingConfig = async (
    ipId: string,
    licenseTermsId: string
  ) => {
    if (!ipId || !licenseTermsId) return;

    setIsLoadingFee(true);
    setIsDisabledLoading(true);
    resetForNewLicenseTerms();

    try {
      if (!client) {
        setFeeError("No client available. Please connect your wallet.");
        return;
      }

      // Fetch the license terms to get default minting fee
      fetchLicenseTermsDetails(licenseTermsId);

      // Get the network configuration
      const networkConfig = getCurrentNetworkConfig();
      const licenseTemplateAddress = networkConfig.licenseTemplateAddress;
      const limitLicenseHookAddress = networkConfig.limitLicenseHookAddress;

      // 1. First, fetch the current licensing configuration
      const currentConfig = await getLicensingConfigSDK(
        ipId as `0x${string}`,
        licenseTermsId
      );

      if (currentConfig) {
        // Set disabled status from the config
        onParamChange("disabled", currentConfig.disabled ? "true" : "false");

        // 2. Then get the current minting fee from predictMintingLicenseFee for better accuracy
        try {
          const response = await client.license.predictMintingLicenseFee({
            licensorIpId: ipId as `0x${string}`,
            licenseTermsId: parseInt(licenseTermsId),
            amount: BigInt(1),
            licenseTemplate: licenseTemplateAddress,
          });

          if (response && response.tokenAmount !== undefined) {
            setCurrentMintingFee(response.tokenAmount.toString());

            // Auto-populate the minting fee input with the human-readable value
            const feeInEth = formatEther(response.tokenAmount);
            onParamChange("mintingFee", feeInEth);
          }
        } catch (error) {
          console.error(
            "Error predicting minting fee, using config value instead:",
            error
          );

          // Fallback to the value from licensing config
          if (currentConfig.mintingFee !== undefined) {
            const feeInEth = formatEther(currentConfig.mintingFee);
            setCurrentMintingFee(currentConfig.mintingFee.toString());
            onParamChange("mintingFee", feeInEth);
          }
        }

        // 3. Check licensing hook type
        if (
          currentConfig.licensingHook &&
          currentConfig.licensingHook.toLowerCase() ===
            limitLicenseHookAddress.toLowerCase()
        ) {
          // It's a limit license hook
          onParamChange("licensingHook", "limit");
          setShowLicenseLimitInput(true);

          // Extract the license limit from hook data if present
          if (currentConfig.licensingHook) {
            const licenseLimit = await extractLicenseLimitFromHookData(
              ipId as `0x${string}`,
              licenseTermsId
            );

            if (licenseLimit) {
              onParamChange("licenseLimit", licenseLimit);
            } else {
              onParamChange("licenseLimit", "");
            }
          } else {
            onParamChange("licenseLimit", "");
          }
        } else {
          // It's not a limit license hook
          onParamChange("licensingHook", "none");
          setShowLicenseLimitInput(false);
          onParamChange("licenseLimit", "");
        }
      } else {
        // Set default values if no config found
        onParamChange("disabled", "false");
        onParamChange("mintingFee", "0");
        onParamChange("licensingHook", "none");
        setShowLicenseLimitInput(false);
        onParamChange("licenseLimit", "");
      }
    } catch (error) {
      console.error("Error fetching licensing config:", error);
      setFeeError("Error fetching licensing configuration. Please try again.");
    } finally {
      setIsLoadingFee(false);
      setIsDisabledLoading(false);
    }
  };

  // Handle licensing hook selection
  const handleLicensingHookChange = (value: string) => {
    onParamChange("licensingHook", value);

    // Show/hide license limit input based on hook selection
    if (value === "limit") {
      setShowLicenseLimitInput(true);

      // Validate license limit if already entered
      if (paramValues.licenseLimit) {
        validateLicenseLimit(paramValues.licenseLimit);
      }
    } else {
      setShowLicenseLimitInput(false);
      setLicenseLimitError("");
      onParamChange("licenseLimit", "");
    }
  };

  // Validate the form
  const validateForm = () => {
    // Common required fields
    const requiredFields = [
      "ipId",
      "licenseTermsId",
      "mintingFee",
      "licensingHook",
    ];

    // Check if all required fields are filled
    const hasAllRequiredFields = requiredFields.every(
      (field) => !!paramValues[field] && paramValues[field].trim() !== ""
    );

    // Additional validation for license limit if limit hook is selected
    const hasValidLicenseLimit =
      paramValues.licensingHook !== "limit" ||
      (!!paramValues.licenseLimit &&
        validateLicenseLimit(paramValues.licenseLimit));

    // Validate minting fee
    const hasValidMintingFee =
      !!paramValues.mintingFee && validateMintingFee(paramValues.mintingFee);

    // Check for error messages
    const hasNoErrors = !ipIdError && !licenseLimitError && !feeError;

    // Set form validity
    setIsFormValid(
      !!hasAllRequiredFields &&
        !isLoadingTerms &&
        !isLoadingFee &&
        !isDisabledLoading &&
        hasNoErrors &&
        !!hasValidMintingFee &&
        !!hasValidLicenseLimit &&
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

    // For license terms ID, fetch licensing config
    if (name === "licenseTermsId" && value && paramValues.ipId) {
      fetchCurrentLicensingConfig(paramValues.ipId, value);
    }

    // For minting fee, validate input
    if (name === "mintingFee") {
      validateMintingFee(value);
    }

    // For licensing hook, update UI
    if (name === "licensingHook") {
      handleLicensingHookChange(value);
    }

    // For license limit, validate input
    if (name === "licenseLimit") {
      validateLicenseLimit(value);
    }
  };

  // Effect to validate form when parameters change
  useEffect(() => {
    validateForm();
  }, [
    paramValues,
    licenseTermsOptions,
    ipIdError,
    feeError,
    licenseLimitError,
    isLoadingTerms,
    isLoadingFee,
    isDisabledLoading,
  ]);

  // Effect to fetch license terms when IP ID is available
  useEffect(() => {
    if (paramValues.ipId && paramValues.ipId.startsWith("0x")) {
      fetchLicenseTerms(paramValues.ipId);
    }
  }, []);

  // Effect to refresh data when wallet connects (client becomes available)
  useEffect(() => {
    // If client becomes available and we have necessary data already entered
    if (client && paramValues.ipId && paramValues.licenseTermsId) {
      // Refresh the licensing configuration
      fetchCurrentLicensingConfig(paramValues.ipId, paramValues.licenseTermsId);

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
    <>
      <BaseFormLayout
        actionType={ActionType.UPDATE_LICENSING_CONFIG}
        isFormValid={isFormValid}
        onExecute={handleExecute}
        walletAddress={walletAddress}
        isCheckingStatus={isLoadingFee || isDisabledLoading}
        buttonText="$ execute update licensing config"
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
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500">Loading license terms...</p>
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
              onChange={(e) => handleParamChange("mintingFee", e.target.value)}
              style={{ paddingRight: "32px" }}
              className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
              disabled={isLoadingFee}
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
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500">Loading current fee...</p>
            </div>
          ) : (
            feeError && <p className="text-xs text-[#09ACFF]">{feeError}</p>
          )}
          {currentMintingFee && (
            <p className="text-xs text-gray-500">
              Current fee: {formatEther(BigInt(currentMintingFee))} IP
            </p>
          )}
        </div>

        {/* Licensing Hook */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="licensingHook" className="text-black">
            <span className="text-[#09ACFF]">$</span> licensingHook
          </Label>
          <select
            id="licensingHook"
            value={paramValues.licensingHook || "none"}
            onChange={(e) => handleParamChange("licensingHook", e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            disabled={isLoadingTerms || isLoadingFee}
          >
            <option value="none">None</option>
            <option value="limit">Limit License</option>
          </select>
        </div>

        {/* License Limit (only shown when Limit License hook is selected) */}
        {showLicenseLimitInput && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="licenseLimit" className="text-black">
              <span className="text-[#09ACFF]">$</span> licenseLimit
            </Label>
            <Input
              id="licenseLimit"
              placeholder="Maximum number of licenses"
              value={paramValues.licenseLimit || ""}
              onChange={(e) =>
                handleParamChange("licenseLimit", e.target.value)
              }
              className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            />
            {licenseLimitError && (
              <p className="text-xs text-[#09ACFF]">{licenseLimitError}</p>
            )}
          </div>
        )}

        {/* Disable License */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled" className="text-black">
            <span className="text-[#09ACFF]">$</span> disabled
          </Label>
          <select
            id="disabled"
            value={paramValues.disabled || "false"}
            onChange={(e) => handleParamChange("disabled", e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            disabled={isDisabledLoading}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
          {isDisabledLoading && (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500">
                Loading disabled status...
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500">
            {paramValues.disabled === "true"
              ? "True means the license is disabled. Users cannot mint new licenses."
              : "False means the license is enabled. Users can mint new licenses."}
          </p>
        </div>
      </BaseFormLayout>
    </>
  );
};
