import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/atoms/Spinner";
import { LicensingConfig, StoryClient } from "@story-protocol/core-sdk";
import {
  getLicensingConfigSDK,
  extractLicenseLimitFromHookData,
} from "@/features/utils";
import { getCurrentNetworkConfig } from "@/lib/context/NetworkContext";

interface LicenseHooksSectionProps {
  licenseConfig: LicensingConfig | null;
  client?: StoryClient;
  paramValues?: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const LicenseHooksSection: React.FC<LicenseHooksSectionProps> = ({
  licenseConfig,
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
      onValidationChange(false);
      return false;
    }

    if (value) {
      // Check if it's a positive integer
      const isPositiveInteger = /^[1-9]\d*$/.test(value);
      if (!isPositiveInteger) {
        setLicenseLimitError("License limit must be a positive integer");
        onValidationChange(false);
        return false;
      }
    }

    setLicenseLimitError("");
    onValidationChange(true);
    return true;
  };

  // Handle licensing hook change
  const handleLicensingHookChange = (value: string) => {
    onParamChange("licensingHook", value);

    if (value === "limit") {
      setShowLicenseLimitInput(true);
      if (!paramValues.licenseLimit) {
        setLicenseLimitError(
          "License limit is required for Limit License hook"
        );
        onValidationChange(false);
      }
    } else {
      setShowLicenseLimitInput(false);
      setLicenseLimitError("");
      onParamChange("licenseLimit", "");
      onValidationChange(true);
    }
  };

  // Handle license limit change
  const handleLicenseLimitChange = (value: string) => {
    onParamChange("licenseLimit", value);
    validateLicenseLimit(value);
  };

  // Fetch current licensing config for hooks and limits
  const fetchLicensingHooks = async () => {
    setIsLoadingHooks(true);
    setLicenseLimitError("");
    if (!licenseConfig) {
      return;
    }

    try {
      // Get the network configuration
      const networkConfig = getCurrentNetworkConfig();
      const limitLicenseHookAddress = networkConfig.limitLicenseHookAddress;

      const licenseLimit = await extractLicenseLimitFromHookData(
        paramValues.ipId as `0x${string}`,
        paramValues.licenseTermsId
      );

      if (licenseLimit !== undefined) {
        onParamChange("licenseLimit", licenseLimit);
      } else {
        onParamChange("licenseLimit", "");
      }

      // Check licensing hook type
      if (
        licenseConfig.licensingHook &&
        licenseConfig.licensingHook.toLowerCase() ===
          limitLicenseHookAddress.toLowerCase()
      ) {
        // It's a limit license hook
        onParamChange("licensingHook", "limit");
      } else {
        // It's not a limit license hook
        onParamChange("licensingHook", "none");
      }

      onValidationChange(true);
    } catch (error) {
      console.error("Error fetching licensing hooks:", error);
      setLicenseLimitError("Error fetching licensing hooks. Please try again.");
      onValidationChange(false);
    } finally {
      setIsLoadingHooks(false);
    }
  };

  // Update internal state when licensing hook or license limit changes
  useEffect(() => {
    // Set showLicenseLimitInput based on current hook value
    setShowLicenseLimitInput(paramValues.licensingHook === "limit");

    // Validate license limit if hook is "limit" and we have a value
    if (paramValues.licensingHook === "limit" && paramValues.licenseLimit) {
      validateLicenseLimit(paramValues.licenseLimit);
    }
  }, [paramValues.licensingHook, paramValues.licenseLimit]);

  // Fetch licensing hooks when ipId or licenseTermsId changes
  useEffect(() => {
    if (
      paramValues.ipId &&
      paramValues.licenseTermsId &&
      licenseConfig &&
      client
    ) {
      fetchLicensingHooks();
    }
  }, [paramValues.ipId, paramValues.licenseTermsId, licenseConfig, client]);
  return (
    <div
      className="bg-white border rounded-lg shadow-sm w-full h-full"
      style={{ borderLeft: "4px solid #09ACFF" }}
    >
      <div className="flex flex-col w-full p-3">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-2">
          Additional Features
        </div>
        <div className="flex flex-col gap-2">
          {/* Licensing Hook */}
          <div className="flex flex-col">
            <div className="mb-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-black">
                  Licensing Hook
                </span>
                <span
                  className="ml-1 px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                  style={{ fontFamily: "Menlo, monospace" }}
                >
                  licensingHook
                </span>
              </div>
            </div>
            <div className="mb-2">
              <select
                id="licensingHook"
                value={paramValues.licensingHook || "none"}
                onChange={(e) => handleLicensingHookChange(e.target.value)}
                className="w-full h-8 px-2 py-0 bg-white border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
                disabled={isLoadingHooks}
              >
                <option value="none">None</option>
                <option value="limit">Limit</option>
              </select>
            </div>
            <span className="text-xs text-gray-600 block">
              Select the hook to apply to this license.
            </span>
            {isLoadingHooks && (
              <div className="flex items-center gap-1 mt-1">
                <Spinner size="sm" />
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            )}
          </div>

          {/* License Limit (only shown when Limit License hook is selected) */}
          {showLicenseLimitInput && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm text-black">
                    License Limit
                  </span>
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                    style={{ fontFamily: "Menlo, monospace" }}
                  >
                    licenseLimit
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 mb-1">
                Maximum number of licenses that can be minted.
              </span>
              <Input
                id="licenseLimit"
                placeholder="Max licenses"
                value={paramValues.licenseLimit || ""}
                onChange={(e) => handleLicenseLimitChange(e.target.value)}
                className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-8 text-sm"
              />
              {licenseLimitError && (
                <p className="text-xs text-[#09ACFF] mt-1">
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
