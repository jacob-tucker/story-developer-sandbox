import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/atoms/Spinner";
import { OnChainTermsSection } from "./OnChainTermsSection";
import { OffChainTermsSection } from "./OffChainTermsSection";
import { ActionType } from "../../types";
import { StoryClient } from "@story-protocol/core-sdk";
import { verifyLicenseTerms } from "../services/addLicenseTerms";
import { BaseFormLayout } from "../../base/components/BaseFormLayout";
import { useNetwork } from "@/lib/context/NetworkContext";

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
  const [activeTab, setActiveTab] = useState<"onchain" | "offchain">("onchain");
  const { config } = useNetwork(); // Get network config for addresses

  // Validate form whenever params change
  useEffect(() => {
    validateForm();
  }, [paramValues]);

  // Initialize default values on component mount
  useEffect(() => {
    // Core parameters
    onParamChange("transferable", "true");
    onParamChange("expiration", "0"); // No expiration by default
    onParamChange("royaltyPolicy", config.royaltyPolicyLRPAddress); // Default to LRP
    onParamChange("mintingFee", "");

    // Commercial terms
    onParamChange("commercialUse", "true");
    onParamChange("commercialAttribution", "true");
    onParamChange("commercialRevShare", ""); // Empty by default, will be 0 if not set

    // Derivatives terms
    onParamChange("derivativesAllowed", "true");
    onParamChange("derivativesAttribution", "true");
    onParamChange("derivativesApproval", "false");
    onParamChange("derivativesReciprocal", "true");

    // Off-chain terms
    onParamChange("territory", ""); // Global by default (empty array)
    onParamChange("channelsOfDistribution", ""); // All channels by default (empty array)
    onParamChange(
      "contentStandards",
      "No-Hate, Suitable-for-All-Ages, No-Drugs-or-Weapons, No-Pornography"
    ); // All standards by default
    onParamChange("sublicensable", "false");
    onParamChange("aiLearningModels", "false");
    onParamChange("restrictionOnCrossPlatformUse", "false");
    onParamChange("attribution", "true");
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
    <form
      className="flex flex-col items-center w-full"
      style={{ gap: "24px" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid && !isExecuting) onExecute();
      }}
    >
      {/* SECTION 1: Top 2 columns (Instructions | IP ID) */}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Instructions */}
        <div className="p-6 bg-[#F6FBFF] border border-[#A1D1FF] rounded shadow-sm flex flex-col justify-center flex-1 min-w-0 w-full">
          <h2 className="text-xl font-bold text-[#09ACFF] mb-1">
            Instructions
          </h2>
          <p className="text-sm text-gray-700">
            Configure every on-chain and off-chain parameter for your
            Programmable IP License. Each field below includes a brief
            description and its technical code name for full transparency.
          </p>
        </div>
        {/* IP ID */}
        <div className="flex flex-col gap-2 p-6 bg-white border border-[#A1D1FF] rounded shadow-sm justify-center flex-1 min-w-0 w-full">
          <Label htmlFor="ipId" className="text-black font-semibold">
            IP Asset ID
          </Label>
          <div className="text-xs text-gray-500 mb-1">
            <code>ipId</code>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            The unique identifier for your IP asset (must start with 0x).
          </div>
          <Input
            id="ipId"
            placeholder="IP ID (0x...)"
            value={paramValues.ipId || ""}
            onChange={(e) => handleParamChange("ipId", e.target.value)}
            className="bg-white border-gray-300 text-black focus:border-[#09ACFF] focus:ring-[#09ACFF]"
          />
          {ipIdError && <p className="text-xs text-[#09ACFF]">{ipIdError}</p>}
        </div>
      </div>

      {/* SECTION 2: Tab Panel and Form Content */}
      <div className="w-full max-w-4xl">
        <div>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-t-md font-semibold text-sm transition-colors duration-150 border border-b-0 ${
                activeTab === "onchain"
                  ? "bg-white text-[#09ACFF] border-[#A1D1FF] shadow-sm z-20"
                  : "bg-[#F6FBFF] text-gray-500 border-[#A1D1FF] z-10"
              }`}
              onClick={() => setActiveTab("onchain")}
              style={
                activeTab === "onchain"
                  ? { position: "relative", zIndex: 2 }
                  : {}
              }
            >
              On-Chain Terms
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-t-md font-semibold text-sm transition-colors duration-150 border border-b-0 ${
                activeTab === "offchain"
                  ? "bg-white text-[#09ACFF] border-[#A1D1FF] shadow-sm z-20"
                  : "bg-[#F6FBFF] text-gray-500 border-[#A1D1FF] z-10"
              }`}
              onClick={() => setActiveTab("offchain")}
              style={
                activeTab === "offchain"
                  ? { position: "relative", zIndex: 2 }
                  : {}
              }
            >
              Off-Chain Terms
            </button>
          </div>
          <div className="bg-white border border-[#A1D1FF] rounded-b-md rounded-tr-md shadow-md -mt-1">
            <div className="p-6">
              {activeTab === "onchain" ? (
                <OnChainTermsSection
                  paramValues={paramValues}
                  onParamChange={handleParamChange}
                  errors={{
                    commercialRevShare: commercialRevShareError,
                    mintingFee: mintingFeeError,
                  }}
                />
              ) : (
                <OffChainTermsSection
                  paramValues={paramValues}
                  onParamChange={handleParamChange}
                  errors={{
                    commercialRevShare: commercialRevShareError,
                    mintingFee: mintingFeeError,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Submit Button */}
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
            "$ execute add license terms"
          )}
        </Button>
      </div>
    </form>
  );
};
