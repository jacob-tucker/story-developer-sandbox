import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface OffChainTermsSectionProps {
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/**
 * Section for all off-chain PIL terms (JSON fields), minus excluded ones.
 * Excludes: governingLaw, PILUri
 */
export const OffChainTermsSection: React.FC<OffChainTermsSectionProps> = ({
  paramValues,
  onParamChange,
  errors = {},
}) => {
  // Field descriptions for off-chain terms
  const FIELD_DESCRIPTIONS: Record<string, string> = {
    territory: "Geographic regions where the license is valid (comma-separated).",
    channelsOfDistribution: "Distribution channels allowed for the IP (comma-separated).",
    attribution: "Whether attribution is required for use.",
    contentStandards: "Content standards or restrictions (comma-separated).",
    sublicensable: "Whether sublicensing is permitted.",
    aiLearningModels: "Allow use in AI learning models?",
    restrictionOnCrossPlatformUse: "Restrict use on other platforms?",
    additionalParameters: "Any extra terms as a JSON object.",
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-4 w-full" style={{borderLeft: "5px solid #A1D1FF"}}>
      <div className="flex flex-col w-full p-4">
        <div className="uppercase tracking-wider text-xs text-[#09ACFF] font-bold mb-3">Off-Chain Terms</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <FormField
            label="Territory"
            codeName="territory"
            description={"Geographic regions where the license is valid (comma-separated). Recommended: leave blank for global."}
          >
            <Input
              id="territory"
              type="text"
              placeholder="e.g. US, EU"
              value={paramValues.territory || ""}
              onChange={(e) => onParamChange("territory", e.target.value)}
              className="bg-white border-gray-300 text-black"
            />
          </FormField>
          <FormField
            label="Channels of Distribution"
            codeName="channelsOfDistribution"
            description={"Distribution channels allowed for the IP (comma-separated). Recommended: leave blank for all."}
          >
            <Input
              id="channelsOfDistribution"
              type="text"
              placeholder="e.g. Online, Print"
              value={paramValues.channelsOfDistribution || ""}
              onChange={(e) => onParamChange("channelsOfDistribution", e.target.value)}
              className="bg-white border-gray-300 text-black"
            />
          </FormField>
          <FormField
            label="Attribution Required?"
            codeName="attribution"
            description={FIELD_DESCRIPTIONS.attribution}
          >
            <select
              id="attribution"
              value={paramValues.attribution}
              onChange={(e) => onParamChange("attribution", e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
          <FormField
            label="Content Standards"
            codeName="contentStandards"
            description={"Set content standards for use of the IP. Default: none. Select any that apply."}
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {["No-Hate", "Suitable-for-All-Ages", "No-Drugs-or-Weapons", "No-Pornography"].map(option => {
                const selected = (paramValues.contentStandards||"").split(",").map(s => s.trim()).filter(Boolean).includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    className={`px-3 py-1 rounded-full border text-xs font-semibold transition ${selected ? 'bg-[#09ACFF] text-white border-[#09ACFF]' : 'bg-white text-[#09ACFF] border-[#A1D1FF]'}`}
                    onClick={() => {
                      let current = (paramValues.contentStandards||"").split(",").map(s => s.trim()).filter(Boolean);
                      if (selected) current = current.filter(v => v !== option);
                      else current.push(option);
                      onParamChange("contentStandards", current.join(","));
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </FormField>
          <FormField
            label="Sublicensable?"
            codeName="sublicensable"
            description={FIELD_DESCRIPTIONS.sublicensable}
          >
            <select
              id="sublicensable"
              value={paramValues.sublicensable}
              onChange={(e) => onParamChange("sublicensable", e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
          <FormField
            label="Allow AI Learning Models?"
            codeName="aiLearningModels"
            description={FIELD_DESCRIPTIONS.aiLearningModels}
          >
            <select
              id="aiLearningModels"
              value={paramValues.aiLearningModels}
              onChange={(e) => onParamChange("aiLearningModels", e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
          <FormField
            label="Restrict Cross-Platform Use?"
            codeName="restrictionOnCrossPlatformUse"
            description={FIELD_DESCRIPTIONS.restrictionOnCrossPlatformUse}
          >
            <select
              id="restrictionOnCrossPlatformUse"
              value={paramValues.restrictionOnCrossPlatformUse}
              onChange={(e) => onParamChange("restrictionOnCrossPlatformUse", e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </FormField>
          <FormField
            label="Additional Parameters (JSON)"
            codeName="additionalParameters"
            description={FIELD_DESCRIPTIONS.additionalParameters}
          >
            <Input
              id="additionalParameters"
              type="text"
              placeholder='e.g. {"customTerm": "value"}'
              value={paramValues.additionalParameters || ""}
              onChange={(e) => onParamChange("additionalParameters", e.target.value)}
              className="bg-white border-gray-300 text-black"
            />
            {errors.additionalParameters && (
              <p className="text-xs text-[#09ACFF]">{errors.additionalParameters}</p>
            )}
          </FormField>
        </div>
      </div>
    </div>
  );
};
