import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/atoms/Spinner";
import { fetchLicenseTermsIds } from "../../api";

interface IPIdentificationSectionProps {
  ipId: string;
  licenseTermsId: string;
  ipIdError?: string;
  isLoadingTerms?: boolean;
  licenseTermsOptions?: { value: string; label: string }[];
  onParamChange: (name: string, value: string) => void;
  onLicenseTermsLoaded?: (licenseTermsId: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const IPIdentificationSection: React.FC<IPIdentificationSectionProps> = ({
  ipId,
  licenseTermsId,
  ipIdError: externalIpIdError,
  isLoadingTerms: externalIsLoadingTerms,
  licenseTermsOptions: externalLicenseTermsOptions,
  onParamChange,
  onLicenseTermsLoaded,
  onValidationChange,
}) => {
  // Internal state for when not provided externally
  const [internalIpIdError, setInternalIpIdError] = useState("");
  const [internalIsLoadingTerms, setInternalIsLoadingTerms] = useState(false);
  const [internalLicenseTermsOptions, setInternalLicenseTermsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  
  // Use external values if provided, otherwise use internal state
  const ipIdError = externalIpIdError !== undefined ? externalIpIdError : internalIpIdError;
  const isLoadingTerms = externalIsLoadingTerms !== undefined ? externalIsLoadingTerms : internalIsLoadingTerms;
  const licenseTermsOptions = externalLicenseTermsOptions !== undefined ? externalLicenseTermsOptions : internalLicenseTermsOptions;
  
  // Fetch license terms for an IP
  const fetchLicenseTerms = async (ipIdValue: string) => {
    if (!ipIdValue || !ipIdValue.startsWith("0x")) {
      setInternalIpIdError("Invalid IP ID format. Must start with 0x.");
      if (onValidationChange) onValidationChange(false);
      return;
    }

    setInternalIsLoadingTerms(true);

    try {
      // Use the existing API function instead of duplicating the logic
      const result = await fetchLicenseTermsIds(ipIdValue);

      if (result.options.length > 0) {
        setInternalLicenseTermsOptions(result.options);
        setInternalIpIdError("");
        if (onValidationChange) onValidationChange(true);

        // Auto-select the first license term when options are available
        const firstTermId = result.options[0].value;
        onParamChange("licenseTermsId", firstTermId);
        
        // Notify parent component that license terms are loaded
        if (onLicenseTermsLoaded) {
          onLicenseTermsLoaded(firstTermId);
        }
      } else {
        setInternalLicenseTermsOptions([]);
        setInternalIpIdError(result.error || "No license terms found for this IP ID.");
        if (onValidationChange) onValidationChange(false);
      }
    } catch (error) {
      console.error("Error fetching license terms:", error);
      setInternalIpIdError("Error fetching license terms. Please try again.");
      setInternalLicenseTermsOptions([]);
      if (onValidationChange) onValidationChange(false);
    } finally {
      setInternalIsLoadingTerms(false);
    }
  };
  
  // Handle IP ID change
  const handleIpIdChange = (value: string) => {
    onParamChange("ipId", value);
    
    // For IP ID, fetch license terms when it's a valid address
    if (value && value.startsWith("0x")) {
      fetchLicenseTerms(value);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {/* IP ID */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="ipId" className="text-black font-semibold">
              IP Asset ID
            </Label>
            <span className="px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight">
              ipId
            </span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Enter the unique identifier for your IP asset (must start with 0x).
          </div>
          <Input
            id="ipId"
            placeholder="IP ID (0x...)"
            value={ipId || ""}
            onChange={(e) => handleIpIdChange(e.target.value)}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          />
          {ipIdError && <p className="text-xs text-[#09ACFF] mt-1">{ipIdError}</p>}
        </div>
        
        {/* License Terms ID */}
        <div>
          <div className="flex items-center gap-1 mb-1 mt-4">
            <Label htmlFor="licenseTermsId" className="text-black font-semibold">
              License Terms
            </Label>
            <span className="px-1.5 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight">
              licenseTermsId
            </span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Select the license terms to configure.
          </div>
          <select
            id="licenseTermsId"
            value={licenseTermsId || ""}
            onChange={(e) => onParamChange("licenseTermsId", e.target.value)}
            className="w-full h-9 px-2 py-0 bg-white border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
            disabled={isLoadingTerms || licenseTermsOptions.length === 0}
          >
            <option value="">Select License Terms</option>
            {licenseTermsOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isLoadingTerms && (
            <div className="flex items-center gap-1 mt-1">
              <Spinner size="sm" />
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
