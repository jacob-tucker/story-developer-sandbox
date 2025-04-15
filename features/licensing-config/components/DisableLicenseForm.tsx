import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/atoms/Spinner';
import { ActionType } from '../types';
import { checkLicenseDisabledStatus } from '../services/utils';
import { verifyLicenseDisabled } from '../services/disableLicense';
import { BaseFormLayout } from './BaseFormLayout';

interface DisableLicenseFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionSuccess: boolean | null;
  walletAddress?: string;
  addTerminalMessage?: (message: string, type?: "success" | "error" | "info") => void;
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
  const [licenseTermsOptions, setLicenseTermsOptions] = useState<{ value: string; label: string }[]>([]);
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
      // Use the Story API to fetch license terms
      const options = {
        method: "GET",
        headers: {
          "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
          "X-Chain": "story-aeneid"
        }
      };

      const response = await fetch(`https://api.storyapis.com/api/v3/licenses/ip/terms/${ipId}`, options);
      const data = await response.json();

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Format license terms options
        const options = data.data.map((term: any) => ({
          value: term.licenseTermsId.toString(),
          label: term.licenseTermsId.toString()
        }));

        setLicenseTermsOptions(options);
        setIpIdError("");
        
        // Auto-select the first license term if available
        if (options.length > 0 && !paramValues.licenseTermsId) {
          onParamChange('licenseTermsId', options[0].value);
          // Check if the license is already disabled
          checkLicenseStatus(ipId, options[0].value);
        }
      } else {
        setLicenseTermsOptions([]);
        setIpIdError("No license terms found for this IP ID.");
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
  }, [paramValues, licenseTermsOptions, ipIdError, isLoadingTerms, isLicenseDisabled]);

  // Effect to fetch license terms when IP ID is available
  useEffect(() => {
    if (paramValues.ipId && paramValues.ipId.startsWith("0x")) {
      fetchLicenseTerms(paramValues.ipId);
    }
  }, []);
  
  // Effect to update the license disabled status after a successful transaction
  useEffect(() => {
    // If transaction was successful and we have the necessary parameters, check if license is now disabled
    if (executionSuccess === true && paramValues.ipId && paramValues.licenseTermsId) {
      // Add a slight delay to ensure the blockchain state has updated
      setTimeout(async () => {
        // Update the form UI state
        checkLicenseStatus(paramValues.ipId, paramValues.licenseTermsId);
        
        // Verify the license disabled status and provide detailed feedback
        if (addTerminalMessage) {
          addTerminalMessage("Verifying license disabled status...", "info");
          
          const verificationResult = await verifyLicenseDisabled(
            paramValues.ipId,
            paramValues.licenseTermsId
          );
          
          // Add appropriate messages based on verification result
          addTerminalMessage(verificationResult.message, verificationResult.success ? "success" : "info");
          
          if (verificationResult.details) {
            addTerminalMessage(`Verification details: ${verificationResult.details}`, "info");
          }
        }
      }, 2000); // 2 second delay
    }
  }, [executionSuccess]);

  return (
    <>
      {/* License Disabled Status Warning - Outside the form layout */}
      {isLicenseDisabled && (
        <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>This license is already disabled.</span>
          </p>
        </div>
      )}

      <BaseFormLayout
        actionType={ActionType.DISABLE_LICENSE}
        isFormValid={isFormValid}
        isExecuting={isExecuting}
        onExecute={onExecute}
        walletAddress={walletAddress}
        isDisabled={isLicenseDisabled}
        disabledReason="Already Disabled"
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
            value={paramValues.ipId || ''}
            onChange={(e) => handleParamChange('ipId', e.target.value)}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          />
          {ipIdError && (
            <p className="text-xs text-[#09ACFF]">{ipIdError}</p>
          )}
        </div>

        {/* License Terms ID */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="licenseTermsId" className="text-black">
            <span className="text-[#09ACFF]">$</span> licenseTermsId
          </Label>
          <select
            id="licenseTermsId"
            value={paramValues.licenseTermsId || ''}
            onChange={(e) => handleParamChange('licenseTermsId', e.target.value)}
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
        </div>
      </BaseFormLayout>
    </>
  );
};
