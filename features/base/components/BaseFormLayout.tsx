import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/atoms/Spinner";
import { useTerminal } from "@/lib/context/TerminalContext";

interface BaseFormLayoutProps {
  children: ReactNode;
  actionType: string;
  isFormValid: boolean;
  onExecute: () => void;
  walletAddress?: string;
  isDisabled?: boolean;
  disabledReason?: string;
  isCheckingStatus?: boolean;
  buttonText: string;
}

export const BaseFormLayout: React.FC<BaseFormLayoutProps> = ({
  children,
  actionType,
  isFormValid,
  onExecute,
  walletAddress,
  isDisabled = false,
  disabledReason,
  isCheckingStatus = false,
  buttonText,
}) => {
  const { isExecuting } = useTerminal();

  return (
    <div className="space-y-4">
      {/* Hidden action type field */}
      <input type="hidden" name="actionType" value={actionType} />

      {/* Parameters Grid */}
      <div
        className="grid grid-cols-2 gap-4 mb-4 w-full"
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {children}
      </div>

      {/* Execute Button or Help Text */}
      {isFormValid ? (
        <Button
          onClick={onExecute}
          disabled={!walletAddress || isExecuting || isDisabled}
          className={`w-full ${
            !isDisabled ? "bg-[#09ACFF] hover:bg-[#09ACFF]/80" : "bg-gray-300"
          } text-white relative`}
        >
          {isExecuting ? (
            <div className="flex items-center justify-center space-x-2">
              <Spinner size="sm" color="text-white" />
              <span>Executing...</span>
            </div>
          ) : isCheckingStatus ? (
            <div className="flex items-center justify-center space-x-2">
              <Spinner size="sm" color="text-white" />
              <span>Checking status...</span>
            </div>
          ) : isDisabled && disabledReason ? (
            disabledReason
          ) : (
            buttonText
          )}
        </Button>
      ) : (
        <p className="text-xs text-gray-500 p-2 bg-gray-50 rounded-md text-center border border-gray-200">
          Please fill in all required fields to execute this action
        </p>
      )}
    </div>
  );
};
