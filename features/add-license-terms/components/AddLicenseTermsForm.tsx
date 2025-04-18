import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionType } from "../../types";
import { StoryClient } from "@story-protocol/core-sdk";
import { verifyLicenseTerms } from "../services/addLicenseTerms";
import { BaseFormLayout } from "../../base/components/BaseFormLayout";

interface AddLicenseTermsFormProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionSuccess: boolean | null;
  walletAddress?: string;
  client?: StoryClient;
  addTerminalMessage?: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
  lastExecutionResult?: Record<string, string>;
}

export const AddLicenseTermsForm: React.FC<AddLicenseTermsFormProps> = ({
  paramValues,
  onParamChange,
  onExecute,
  isExecuting,
  executionSuccess,
  walletAddress,
  client,
  addTerminalMessage,
  lastExecutionResult,
}) => {
  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);
  const [ipIdError, setIpIdError] = useState("");
  const [mintingFeeError, setMintingFeeError] = useState("");
  const [commercialRevShareError, setCommercialRevShareError] = useState("");

  // Validate form whenever params change
  useEffect(() => {
    validateForm();
  }, [paramValues]);

  // Initialize default values on component mount
  useEffect(() => {
    // Set default values for boolean parameters only
    onParamChange("commercialUse", "true");
    onParamChange("derivativesAllowed", "true");
    onParamChange("derivativesAttribution", "true");
    onParamChange("aiTrainingAllowed", "false");
  }, []);

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    onParamChange(name, value);

    // Special validation for IP ID
    if (name === "ipId") {
      // Validate IP ID format
      if (value && !value.startsWith("0x")) {
        setIpIdError("Invalid IP ID format. Must start with 0x.");
      } else {
        setIpIdError("");
      }
    }
  };

  // Form validation logic
  const validateForm = () => {
    let valid = true;

    // Clear previous errors
    setMintingFeeError("");
    setCommercialRevShareError("");

    // Required field: IP ID
    if (!paramValues.ipId || paramValues.ipId.trim() === "") {
      valid = false;
    }

    // IP ID format validation
    if (ipIdError) {
      valid = false;
    }

    // Validate minting fee if provided (allow empty string during editing)
    if (paramValues.mintingFee !== "") {
      const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(paramValues.mintingFee);
      if (!isValidNumber && paramValues.mintingFee !== undefined) {
        setMintingFeeError("Minting fee must be a valid number");
        valid = false;
      }
    }

    // Validate commercial rev share if provided (allow empty string during editing)
    if (paramValues.commercialRevShare !== "") {
      const revShareValue = parseFloat(paramValues.commercialRevShare);
      const isValidPercentage =
        /^(\d+\.?\d*|\.\d+)$/.test(paramValues.commercialRevShare) &&
        revShareValue >= 0 &&
        revShareValue <= 100;

      if (!isValidPercentage && paramValues.commercialRevShare !== undefined) {
        setCommercialRevShareError(
          "Commercial rev share must be between 0 and 100"
        );
        valid = false;
      }
    }

    setIsFormValid(valid);
  };

  // After successful execution, verify the license terms
  useEffect(() => {
    if (executionSuccess && paramValues.ipId) {
      // Add delay to ensure blockchain state has updated
      setTimeout(async () => {
        if (addTerminalMessage) {
          addTerminalMessage("Verifying license terms addition...", "info");

          // Get license terms ID from execution result
          const licenseTermsId = lastExecutionResult?.licenseTermsId || "0";

          // Verify if term ID is found in IP's attached terms
          const verificationResult = await verifyLicenseTerms(
            paramValues.ipId,
            licenseTermsId
          );

          // Show results
          addTerminalMessage(
            verificationResult.message,
            verificationResult.success ? "success" : "info"
          );

          if (verificationResult.details) {
            addTerminalMessage(
              `Verification details: ${verificationResult.details}`,
              "info"
            );
          }
        }
      }, 2000);
    }
  }, [executionSuccess]);

  return (
    <BaseFormLayout
      actionType={ActionType.ADD_LICENSE_TERMS}
      isFormValid={isFormValid}
      isExecuting={isExecuting}
      onExecute={onExecute}
      walletAddress={walletAddress}
      buttonText="$ execute add license terms"
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
            placeholder="0"
            value={paramValues.mintingFee || ""}
            onChange={(e) => handleParamChange("mintingFee", e.target.value)}
            style={{ paddingRight: "32px" }}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
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
        {mintingFeeError && (
          <p className="text-xs text-[#09ACFF]">{mintingFeeError}</p>
        )}
      </div>

      {/* Commercial Use */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="commercialUse" className="text-black mb-1">
          <span className="text-[#09ACFF]">$</span> Can people use your IP
          commercially?
        </Label>
        <select
          id="commercialUse"
          value={paramValues.commercialUse}
          onChange={(e) => handleParamChange("commercialUse", e.target.value)}
          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* Commercial Rev Share - Only show if commercialUse is true */}
      {paramValues.commercialUse === "true" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="commercialRevShare" className="text-black">
            <span className="text-[#09ACFF]">$</span> commercialRevShare
          </Label>
          <div style={{ position: "relative" }}>
            <Input
              id="commercialRevShare"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={paramValues.commercialRevShare || ""}
              onChange={(e) =>
                handleParamChange("commercialRevShare", e.target.value)
              }
              style={{ paddingRight: "32px" }}
              className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
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
              %
            </span>
          </div>
          {commercialRevShareError && (
            <p className="text-xs text-[#09ACFF]">{commercialRevShareError}</p>
          )}
        </div>
      )}

      {/* Derivatives Allowed */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="derivativesAllowed" className="text-black mb-1">
          <span className="text-[#09ACFF]">$</span> Can people remix your work?
        </Label>
        <select
          id="derivativesAllowed"
          value={paramValues.derivativesAllowed}
          onChange={(e) =>
            handleParamChange("derivativesAllowed", e.target.value)
          }
          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* Derivatives Attribution - Only show if derivativesAllowed is true */}
      {paramValues.derivativesAllowed === "true" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="derivativesAttribution" className="text-black mb-1">
            <span className="text-[#09ACFF]">$</span> Do remixes have to give
            you attribution?
          </Label>
          <select
            id="derivativesAttribution"
            value={paramValues.derivativesAttribution}
            onChange={(e) =>
              handleParamChange("derivativesAttribution", e.target.value)
            }
            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      )}

      {/* AI Training Allowed */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="aiTrainingAllowed" className="text-black mb-1">
          <span className="text-[#09ACFF]">$</span> Is AI training allowed?
        </Label>
        <select
          id="aiTrainingAllowed"
          value={paramValues.aiTrainingAllowed}
          onChange={(e) =>
            handleParamChange("aiTrainingAllowed", e.target.value)
          }
          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#09ACFF] focus:ring-[#09ACFF]"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
    </BaseFormLayout>
  );
};
