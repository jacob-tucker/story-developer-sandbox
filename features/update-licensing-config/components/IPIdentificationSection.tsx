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
    <div className="bg-white border-2 border-[#09ACFF] rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-[#09ACFF] mb-4">IP Identification</h2>
      
      <div className="bg-[#F6FBFF] p-4 rounded-md border border-[#A1D1FF] mb-6">
        <div className="flex items-start">
          <div className="text-[#09ACFF] mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-700">
            These fields are required before you can configure the license parameters below.
          </p>
        </div>
      </div>
      
      {/* IP ID */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="ipId" className="text-black font-semibold text-lg">
            IP Asset ID
          </Label>
          <span className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight" style={{ fontFamily: 'Menlo, monospace' }}>
            ipId
          </span>
          <span className="text-[#09ACFF] text-xs font-semibold ml-auto">Required</span>
        </div>
        <div className="text-xs text-gray-600 mb-3">
          Enter the unique identifier for your IP asset (must start with 0x).
        </div>
        <Input
          id="ipId"
          placeholder="IP ID (0x...)"
          value={ipId || ""}
          onChange={(e) => handleIpIdChange(e.target.value)}
          className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF] h-12"
        />
        {ipIdError && <p className="text-xs text-[#09ACFF] mt-2">{ipIdError}</p>}
      </div>
      
      {/* License Terms ID */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="licenseTermsId" className="text-black font-semibold text-lg">
            License Terms ID
          </Label>
          <span className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight" style={{ fontFamily: 'Menlo, monospace' }}>
            licenseTermsId
          </span>
          <span className="text-[#09ACFF] text-xs font-semibold ml-auto">Required</span>
        </div>
        <div className="text-xs text-gray-600 mb-3">
          Select the license terms associated with the IP asset above that you want to update.
        </div>
        <select
          id="licenseTermsId"
          value={licenseTermsId || ""}
          onChange={(e) => onParamChange("licenseTermsId", e.target.value)}
          className="w-full h-12 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
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
          <div className="flex items-center gap-2 mt-2">
            <Spinner size="sm" />
            <p className="text-xs text-gray-500">Loading license terms...</p>
          </div>
        )}
      </div>
    </div>
  );
};
