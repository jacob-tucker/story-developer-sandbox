import React from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { useNetwork } from "@/lib/context/NetworkContext";

interface OnChainTermsSectionProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

const FIELD_DESCRIPTIONS: Record<string, string> = {
  transferable:
    "If false, the License Token cannot be transferred once it is minted to a recipient address.",
  royaltyPolicy: "The address of the royalty policy contract.",
  defaultMintingFee: "The fee to be paid when minting a license.",
  expiration:
    "The expiration period of the license (unix timestamp, 0 for none).",
  commercialUse:
    "You can make money from using the original IP Asset, subject to limitations below.",
  commercialAttribution:
    "If true, people must give credit to the original work in their commercial application (eg. merch)",
  commercialRevShare:
    "Amount of revenue (from any source, original & derivative) that must be shared with the licensor.",
  derivativesAllowed:
    "Indicates whether the licensee can create derivatives of his work or not.",
  derivativesAttribution:
    "If true, derivatives that are made must give credit to the original work.",
  derivativesApproval:
    "If true, the licensor must approve derivatives of the work.",
  derivativesReciprocal:
    "If false, you cannot create a derivative of a derivative. Set this to true to allow indefinite remixing.",
};

export const OnChainTermsSection: React.FC<OnChainTermsSectionProps> = ({
  paramValues,
  onParamChange,
  errors = {},
}) => {
  // Get current network configuration for network-specific addresses
  const { config } = useNetwork();

  // State to track the expiration preset
  const [expirationPreset, setExpirationPreset] =
    React.useState<string>("none");

  // Update expiration preset when paramValues changes
  React.useEffect(() => {
    // Determine the preset based on the expiration value
    if (!paramValues.expiration || paramValues.expiration === "0") {
      setExpirationPreset("none");
      return;
    }

    const exp = parseInt(paramValues.expiration, 10);
    const now = Math.floor(Date.now() / 1000);

    // Check for approximate matches to handle slight time differences
    const oneMonth = 2629743;
    const threeMonths = 7889229;
    const sixMonths = 15778458;
    const oneYear = 31556926;

    // Check if expiration is within 5 minutes of any preset
    const isClose = (a: number, b: number) => Math.abs(a - b) < 300; // 5 minutes tolerance

    if (isClose(exp, now + oneMonth)) setExpirationPreset("1m");
    else if (isClose(exp, now + threeMonths)) setExpirationPreset("3m");
    else if (isClose(exp, now + sixMonths)) setExpirationPreset("6m");
    else if (isClose(exp, now + oneYear)) setExpirationPreset("1y");
    else setExpirationPreset("custom");
  }, [paramValues.expiration]);

  const commercialUse = paramValues.commercialUse === "true";
  const derivativesAllowed = paramValues.derivativesAllowed === "true";

  // Use royalty policy addresses from the current network config
  // This ensures the correct addresses are used based on the connected network
  const royaltyPolicies = [
    {
      label: "Liquid Absolute Percentage",
      value: config.royaltyPolicyLAPAddress,
    },
    {
      label: "Liquid Relative Percentage",
      value: config.royaltyPolicyLRPAddress,
    },
  ];

  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Core Parameters (Transferability, Expiration, Royalties) */}
      <div
        className="bg-white border rounded-lg shadow-sm mb-4 w-full"
        style={{ borderLeft: "5px solid #09ACFF" }}
      >
        <div className="flex flex-col w-full p-4">
          <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-3">
            Core On-Chain Parameters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <FormField
              label="Transferable"
              codeName="transferable"
              description={FIELD_DESCRIPTIONS.transferable}
            >
              <select
                id="transferable"
                value={paramValues.transferable}
                onChange={(e) => onParamChange("transferable", e.target.value)}
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Expiration"
              codeName="expiration"
              description={
                "Expiration period for the license. Choose a preset or set a custom unix timestamp. 0 = none."
              }
            >
              <select
                id="expirationPreset"
                value={expirationPreset}
                onChange={(e) => {
                  setExpirationPreset(e.target.value);
                  const now = Math.floor(Date.now() / 1000);
                  switch (e.target.value) {
                    case "none":
                      onParamChange("expiration", "0");
                      break;
                    case "1m":
                      onParamChange("expiration", (now + 2629743).toString());
                      break;
                    case "3m":
                      onParamChange("expiration", (now + 7889229).toString());
                      break;
                    case "6m":
                      onParamChange("expiration", (now + 15778458).toString());
                      break;
                    case "1y":
                      onParamChange("expiration", (now + 31556926).toString());
                      break;
                    case "custom":
                      // Keep the current value
                      break;
                  }
                }}
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md mb-2"
              >
                <option value="none">No Expiration (default)</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
              </select>
            </FormField>
            <FormField
              label="Royalty Policy"
              codeName="royaltyPolicy"
              description={FIELD_DESCRIPTIONS.royaltyPolicy}
            >
              <select
                id="royaltyPolicy"
                value={paramValues.royaltyPolicy}
                onChange={(e) => onParamChange("royaltyPolicy", e.target.value)}
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                {royaltyPolicies.map((opt) => (
                  <option value={opt.value} key={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              label="Default Minting Fee"
              codeName="defaultMintingFee"
              description={FIELD_DESCRIPTIONS.defaultMintingFee}
            >
              <Input
                id="mintingFee"
                type="number"
                min="0"
                placeholder="0"
                value={paramValues.mintingFee || ""}
                onChange={(e) => onParamChange("mintingFee", e.target.value)}
                className="bg-white border-gray-300 text-black"
              />
              {errors.mintingFee && (
                <p className="text-xs text-[#09ACFF]">{errors.mintingFee}</p>
              )}
            </FormField>
          </div>
        </div>
      </div>

      {/* Commercial Terms */}
      <div
        className="bg-white border rounded-lg shadow-sm mb-4 w-full"
        style={{ borderLeft: "5px solid #09ACFF" }}
      >
        <div className="flex flex-col w-full p-4">
          <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-3">
            Commercial Terms
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <FormField
              label="Allow Commercial Use?"
              codeName="commercialUse"
              description={FIELD_DESCRIPTIONS.commercialUse}
            >
              <select
                id="commercialUse"
                value={paramValues.commercialUse}
                onChange={(e) => onParamChange("commercialUse", e.target.value)}
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Require Commercial Attribution?"
              codeName="commercialAttribution"
              description={FIELD_DESCRIPTIONS.commercialAttribution}
            >
              <select
                id="commercialAttribution"
                value={
                  commercialUse
                    ? paramValues.commercialAttribution || "true"
                    : "false"
                }
                onChange={(e) =>
                  onParamChange("commercialAttribution", e.target.value)
                }
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                disabled={!commercialUse}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Commercial Revenue Share (%)"
              codeName="commercialRevShare"
              description={FIELD_DESCRIPTIONS.commercialRevShare}
            >
              <Input
                id="commercialRevShare"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={
                  commercialUse ? paramValues.commercialRevShare || "" : ""
                }
                onChange={(e) =>
                  onParamChange("commercialRevShare", e.target.value)
                }
                className="bg-white border-gray-300 text-black"
                disabled={!commercialUse}
              />
              {errors.commercialRevShare && (
                <p className="text-xs text-[#09ACFF]">
                  {errors.commercialRevShare}
                </p>
              )}
            </FormField>
          </div>
        </div>
      </div>

      {/* Derivatives Terms */}
      <div
        className="bg-white border rounded-lg shadow-sm mb-4 w-full"
        style={{ borderLeft: "5px solid #09ACFF" }}
      >
        <div className="flex flex-col w-full p-4">
          <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-3">
            Derivatives Terms
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <FormField
              label="Allow Derivatives?"
              codeName="derivativesAllowed"
              description={FIELD_DESCRIPTIONS.derivativesAllowed}
            >
              <select
                id="derivativesAllowed"
                value={paramValues.derivativesAllowed}
                onChange={(e) =>
                  onParamChange("derivativesAllowed", e.target.value)
                }
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Require Derivative Attribution?"
              codeName="derivativesAttribution"
              description={FIELD_DESCRIPTIONS.derivativesAttribution}
            >
              <select
                id="derivativesAttribution"
                value={
                  derivativesAllowed
                    ? paramValues.derivativesAttribution || "false"
                    : "false"
                }
                onChange={(e) =>
                  onParamChange("derivativesAttribution", e.target.value)
                }
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                disabled={!derivativesAllowed}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Require Derivative Approval?"
              codeName="derivativesApproval"
              description={FIELD_DESCRIPTIONS.derivativesApproval}
            >
              <select
                id="derivativesApproval"
                value={
                  derivativesAllowed
                    ? paramValues.derivativesApproval || "false"
                    : "false"
                }
                onChange={(e) =>
                  onParamChange("derivativesApproval", e.target.value)
                }
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                disabled={!derivativesAllowed}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <FormField
              label="Require Derivative Reciprocity?"
              codeName="derivativesReciprocal"
              description={FIELD_DESCRIPTIONS.derivativesReciprocal}
            >
              <select
                id="derivativesReciprocal"
                value={
                  derivativesAllowed
                    ? paramValues.derivativesReciprocal || "true"
                    : "false"
                }
                onChange={(e) =>
                  onParamChange("derivativesReciprocal", e.target.value)
                }
                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                disabled={!derivativesAllowed}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
          </div>
        </div>
      </div>
    </section>
  );
};
