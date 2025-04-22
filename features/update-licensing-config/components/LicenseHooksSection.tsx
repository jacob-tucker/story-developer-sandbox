import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { StoryClient } from "@story-protocol/core-sdk";
import {
  getLicensingConfigSDK,
  extractLicenseLimitFromHookData,
} from "@/features/utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";

interface LicenseHooksSectionProps {
  ipId?: string;
  licenseTermsId?: string;
  client?: StoryClient;
  paramValues?: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const LicenseHooksSection: React.FC<LicenseHooksSectionProps> = ({
  ipId,
  licenseTermsId,
  client,
  paramValues,
  onParamChange,
  onValidationChange,
}) => {
  if (!paramValues) {
    return <></>;
  }
  // Internal state for managing hooks and limits
  const [showLicenseLimitInput, setShowLicenseLimitInput] = useState(false);
  const [licenseLimitError, setLicenseLimitError] = useState("");
  const [isLoadingHooks, setIsLoadingHooks] = useState(false);

  // Validate license limit
  const validateLicenseLimit = (value: string) => {
    if (!value && paramValues.licensingHook === "limit") {
      setLicenseLimitError("License limit is required for Limit License hook");
      if (onValidationChange) onValidationChange(false);
      return false;
    }

    if (value) {
      // Check if it's a positive integer
      const isPositiveInteger = /^[1-9]\d*$/.test(value);
      if (!isPositiveInteger) {
        setLicenseLimitError("License limit must be a positive integer");
        if (onValidationChange) onValidationChange(false);
        return false;
      }
    }

    setLicenseLimitError("");
    if (onValidationChange) onValidationChange(true);
    return true;
  };

  // Handle licensing hook change
  const handleLicensingHookChange = (value: string) => {
    onParamChange("licensingHook", value);

    if (value === "limit") {
      setShowLicenseLimitInput(true);
      if (paramValues.licenseLimit) {
        validateLicenseLimit(paramValues.licenseLimit);
      } else {
        setLicenseLimitError(
          "License limit is required for Limit License hook"
        );
        if (onValidationChange) onValidationChange(false);
      }
    } else {
      setShowLicenseLimitInput(false);
      setLicenseLimitError("");
      onParamChange("licenseLimit", "");
      if (onValidationChange) onValidationChange(true);
    }
  };

  // Handle license limit change
  const handleLicenseLimitChange = (value: string) => {
    onParamChange("licenseLimit", value);
    validateLicenseLimit(value);
  };

  // Fetch current licensing config for hooks and limits
  const fetchLicensingHooks = async () => {
    // Only proceed if both values are valid and client is available
    if (
      !ipId ||
      !licenseTermsId ||
      !client ||
      !ipId.startsWith("0x") ||
      licenseTermsId === ""
    ) {
      return;
    }

    console.log("Fetching licensing hooks for", ipId, licenseTermsId);

    setIsLoadingHooks(true);
    setLicenseLimitError("");

    try {
      // Get the network configuration
      const networkConfig = getCurrentNetworkConfig();
      const limitLicenseHookAddress = networkConfig.limitLicenseHookAddress;

      // Fetch the current licensing configuration
      const currentConfig = await getLicensingConfigSDK(
        ipId as `0x${string}`,
        licenseTermsId
      );

      console.log("Current licensing config for hooks:", currentConfig);

      if (currentConfig) {
        // Check licensing hook type
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
        onParamChange("licensingHook", "none");
        setShowLicenseLimitInput(false);
        onParamChange("licenseLimit", "");
      }

      if (onValidationChange) onValidationChange(true);
    } catch (error) {
      console.error("Error fetching licensing hooks:", error);
      setLicenseLimitError("Error fetching licensing hooks. Please try again.");
      if (onValidationChange) onValidationChange(false);
    } finally {
      setIsLoadingHooks(false);
    }
  };

  // Update internal state when licensing hook changes
  useEffect(() => {
    if (paramValues.licensingHook === "limit") {
      setShowLicenseLimitInput(true);
      if (paramValues.licenseLimit) {
        validateLicenseLimit(paramValues.licenseLimit);
      }
    } else {
      setShowLicenseLimitInput(false);
    }
  }, [paramValues.licensingHook, paramValues.licenseLimit]);

  // Fetch licensing hooks when ipId or licenseTermsId changes
  useEffect(() => {
    if (ipId && licenseTermsId && client) {
      fetchLicensingHooks();
    }
  }, [ipId, licenseTermsId, client]);
  return (
    <div
      className="bg-white border rounded-lg shadow-sm mb-6 w-full"
      style={{ borderLeft: "5px solid #09ACFF" }}
    >
      <div className="flex flex-col w-full p-6">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-4">
          License Hooks
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* Licensing Hook */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base text-black">
                Licensing Hook
              </span>
              <span
                className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                style={{ fontFamily: "Menlo, monospace" }}
              >
                licensingHook
              </span>
            </div>
            <span className="text-xs text-gray-600 mb-2">
              Select the hook to apply to this license.
            </span>
            <select
              id="licensingHook"
              value={paramValues.licensingHook || "none"}
              onChange={(e) => handleLicensingHookChange(e.target.value)}
              className="w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            >
              <option value="none">None</option>
              <option value="limit">Limit License</option>
            </select>
          </div>

          {/* License Limit (only shown when Limit License hook is selected) */}
          {showLicenseLimitInput && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-base text-black">
                  License Limit
                </span>
                <span
                  className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                  style={{ fontFamily: "Menlo, monospace" }}
                >
                  licenseLimit
                </span>
              </div>
              <span className="text-xs text-gray-600 mb-2">
                Maximum number of licenses that can be minted.
              </span>
              <Input
                id="licenseLimit"
                placeholder="Maximum number of licenses"
                value={paramValues.licenseLimit || ""}
                onChange={(e) => handleLicenseLimitChange(e.target.value)}
                className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-12"
              />
              {licenseLimitError && (
                <p className="text-xs text-[#09ACFF] mt-2">
                  {licenseLimitError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
