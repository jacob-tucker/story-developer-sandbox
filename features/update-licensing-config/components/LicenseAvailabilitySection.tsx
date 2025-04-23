import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { LicensingConfig, StoryClient } from "@story-protocol/core-sdk";
import { getLicensingConfigSDK } from "@/features/utils";

interface LicenseAvailabilitySectionProps {
  licenseConfig: LicensingConfig | null;
  client?: StoryClient;
  paramValues?: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const LicenseAvailabilitySection: React.FC<
  LicenseAvailabilitySectionProps
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
  // Internal state for managing disabled status loading
  const [isDisabledLoading, setIsDisabledLoading] = useState(false);
  const [disabledError, setDisabledError] = useState("");

  // Fetch current licensing config to get disabled status
  const fetchLicenseAvailability = async () => {
    if (!licenseConfig) {
      return;
    }
    setIsDisabledLoading(true);
    setDisabledError("");

    try {
      // Set disabled status from the config
      onParamChange("disabled", licenseConfig.disabled ? "true" : "false");

      onValidationChange(true);
    } catch (error) {
      console.error("Error fetching license availability:", error);
      setDisabledError(
        "Error fetching license availability. Please try again."
      );
      onValidationChange(false);
    } finally {
      setIsDisabledLoading(false);
    }
  };

  // Fetch license availability when ipId or licenseTermsId changes
  useEffect(() => {
    if (
      paramValues.ipId &&
      paramValues.licenseTermsId &&
      licenseConfig &&
      client
    ) {
      fetchLicenseAvailability();
    }
  }, [paramValues.ipId, paramValues.licenseTermsId, licenseConfig, client]);

  return (
    <div
      className="bg-white border rounded-lg shadow-sm w-full h-full flex flex-col"
      style={{ borderLeft: `4px solid ${licenseConfig?.disabled ? "#FACC15" : "#09ACFF"}` }}
    >
      <div className="flex flex-col w-full p-3 flex-grow">
        <div className="uppercase tracking-wider text-xs font-bold mb-2" style={{ color: licenseConfig?.disabled ? "#FACC15" : "#09ACFF" }}>
          License Availability
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <div className="mb-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-black">
                  Disable License
                </span>
                <span
                  className="ml-1 px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
                  style={{ fontFamily: "Menlo, monospace" }}
                >
                  disabled
                </span>
              </div>
            </div>
            <div className="mb-2">
              <select
                id="disabled"
                value={paramValues.disabled || "false"}
                onChange={(e) => onParamChange("disabled", e.target.value)}
                className="w-full h-8 px-2 py-0 bg-white border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
                disabled={isDisabledLoading}
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <span className="text-xs text-gray-600 block">
              Set to true to prevent users from minting new licenses.
            </span>
            {disabledError && (
              <p className="text-xs text-[#09ACFF] mt-1">{disabledError}</p>
            )}
            {isDisabledLoading && (
              <div className="flex items-center gap-1 mt-1">
                <Spinner size="sm" />
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Simple warning message at the bottom of the card */}
      {licenseConfig?.disabled && (
        <div className="py-2 flex items-center justify-center mt-auto border-t border-gray-100">
          <span className="text-yellow-500 mr-1">⚠️</span>
          <span className="text-xs text-yellow-600 font-medium">
            This license is currently disabled.
          </span>
        </div>
      )}
    </div>
  );
};
