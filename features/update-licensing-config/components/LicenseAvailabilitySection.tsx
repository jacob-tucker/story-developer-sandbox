import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { StoryClient } from "@story-protocol/core-sdk";
import { getLicensingConfigSDK } from "@/features/utils";

interface LicenseAvailabilitySectionProps {
  ipId?: string;
  licenseTermsId?: string;
  client?: StoryClient;
  paramValues?: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const LicenseAvailabilitySection: React.FC<
  LicenseAvailabilitySectionProps
> = ({
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
  // Internal state for managing disabled status loading
  const [isDisabledLoading, setIsDisabledLoading] = useState(false);
  const [disabledError, setDisabledError] = useState("");

  // Fetch current licensing config to get disabled status
  const fetchLicenseAvailability = async () => {
    console.log("Fetching license availability for", ipId, licenseTermsId);

    setIsDisabledLoading(true);
    setDisabledError("");

    try {
      // Fetch the current licensing configuration
      const currentConfig = await getLicensingConfigSDK(
        ipId as `0x${string}`,
        licenseTermsId as string
      );

      console.log("Current licensing config for availability:", currentConfig);

      if (currentConfig) {
        // Set disabled status from the config
        onParamChange("disabled", currentConfig.disabled ? "true" : "false");
      } else {
        // Set default value if no config found
        onParamChange("disabled", "false");
      }

      if (onValidationChange) onValidationChange(true);
    } catch (error) {
      console.error("Error fetching license availability:", error);
      setDisabledError(
        "Error fetching license availability. Please try again."
      );
      if (onValidationChange) onValidationChange(false);
    } finally {
      setIsDisabledLoading(false);
    }
  };

  // Fetch license availability when ipId or licenseTermsId changes
  useEffect(() => {
    if (ipId && licenseTermsId && client) {
      fetchLicenseAvailability();
    }
  }, [ipId, licenseTermsId, client]);

  return (
    <div
      className="bg-white border rounded-lg shadow-sm mb-6 w-full"
      style={{ borderLeft: "5px solid #09ACFF" }}
    >
      <div className="flex flex-col w-full p-6">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-4">
          License Availability
        </div>
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-base text-black">
              Disable License
            </span>
            <span
              className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
              style={{ fontFamily: "Menlo, monospace" }}
            >
              disabled
            </span>
          </div>
          <span className="text-xs text-gray-600 mb-2 block">
            Set to true to prevent users from minting new licenses.
          </span>
          <select
            id="disabled"
            value={paramValues.disabled || "false"}
            onChange={(e) => onParamChange("disabled", e.target.value)}
            className="w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            disabled={isDisabledLoading}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
          {isDisabledLoading && (
            <div className="flex items-center gap-2 mt-2">
              <Spinner size="sm" />
              <p className="text-xs text-gray-500">
                Loading disabled status...
              </p>
            </div>
          )}
          <p className="text-xs text-gray-600 mt-3">
            {paramValues.disabled === "true"
              ? "True means the license is disabled. Users cannot mint new licenses."
              : "False means the license is enabled. Users can mint new licenses."}
          </p>
        </div>
      </div>
    </div>
  );
};
