"use client";
import "viem/window";
import Navbar from "@/components/sections/Navbar";
import { useStory } from "@/lib/context/AppContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/react/dist/iconify.js";
import Footer from "@/components/sections/Footer";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { ViewCode } from "@/components/atoms/ViewCode";
import { ActionType } from "@/features/types";
import { AddLicenseTermsForm } from "@/features/add-license-terms/components/AddLicenseTermsForm";
import { UpdateLicensingConfigForm } from "@/features/update-licensing-config/components/UpdateLicensingConfigForm";
import {
  TerminalProvider,
  Terminal,
  useTerminal,
} from "@/lib/context/TerminalContext";

// Using the string type to match ViewCode component's expected keys
type CodeSnippetType = "add-license-terms" | "update-licensing-config";

// Define the card data structure
interface ActionCard {
  id: CodeSnippetType;
  title: string;
  description: string;
  actionType: ActionType;
}

function MainContent() {
  const { txLoading, txHash, txName, client } = useStory();
  const { data: wallet } = useWalletClient();
  const { addTerminalMessage, clearMessages } = useTerminal();
  const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean | null>(
    null
  );
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [lastExecutionResult, setLastExecutionResult] = useState<
    Record<string, string>
  >({});

  // Define the cards with their actions
  const actionCards: ActionCard[] = [
    {
      id: "update-licensing-config",
      title: "Update Licensing Config",
      description:
        "Update licensing configuration including minting fee, disabled status, and license hook settings",
      actionType: ActionType.UPDATE_LICENSING_CONFIG,
    },
    {
      id: "add-license-terms",
      title: "Add License Terms",
      description: "Add new license terms to an existing license",
      actionType: ActionType.ADD_LICENSE_TERMS,
    },
  ];

  // Select the first card by default
  useEffect(() => {
    if (actionCards.length > 0 && !selectedCard) {
      setSelectedCard(actionCards[0]);
    }
  }, []);

  // Handle card selection
  const handleCardSelect = (card: ActionCard) => {
    setSelectedCard(card);
    clearMessages(); // Reset terminal messages
    setParamValues({}); // Reset parameter values
    setExecutionSuccess(null); // Reset execution status
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Transaction Alerts JSX
  const renderTransactionAlerts = () => {
    if (txLoading) {
      return (
        <div className="fixed bottom-5 left-5 md:max-w-[600px] max-w-[300px] z-10">
          <Alert>
            <Icon
              style={{ color: "#ff2825", marginTop: "-5px" }}
              className="h-4 w-4"
              icon="tabler:loader"
            />
            <AlertTitle>Transaction Loading</AlertTitle>
            <AlertDescription>{txName}</AlertDescription>
          </Alert>
        </div>
      );
    } else if (txHash) {
      return (
        <div className="fixed bottom-5 left-5 md:max-w-[600px] max-w-[300px] z-10">
          <Alert>
            <Icon
              style={{ color: "#ff2825", marginTop: "-5px" }}
              className="h-4 w-4"
              icon="tabler:check"
            />
            <AlertTitle>Transaction Complete</AlertTitle>
            <AlertDescription>
              View your transaction on the{" "}
              <a
                href={`https://aeneid.storyscan.xyz/tx/${txHash}`}
                target="_blank"
                style={{ color: "rgb(255, 40, 37)" }}
              >
                Story explorer
              </a>
              .
            </AlertDescription>
          </Alert>
        </div>
      );
    } else if (!wallet?.account.address) {
      return (
        <div className="fixed bottom-5 left-5 md:max-w-[600px] max-w-[300px] z-10">
          <Alert>
            <Icon
              style={{ color: "#ff2825", marginTop: "-5px" }}
              className="h-4 w-4"
              icon="tabler:alert-triangle"
            />
            <AlertTitle>Please connect your wallet!</AlertTitle>
            <AlertDescription>
              In order to use the Developer Sandbox, you must connect your
              wallet in the top right.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {renderTransactionAlerts()}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4 bg-white font-mono">
        {/* Left Side - Cards List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-black border-b border-[#09ACFF] pb-2">
            $ story sandbox
          </h2>
          {actionCards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer p-3 transition-all rounded border"
              style={{
                backgroundColor: selectedCard?.id === card.id ? "#09ACFF" : "",
                borderColor:
                  selectedCard?.id === card.id
                    ? "#09ACFF"
                    : "rgb(229, 231, 235)",
                color: selectedCard?.id === card.id ? "white" : "inherit",
              }}
              onClick={() => handleCardSelect(card)}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: selectedCard?.id === card.id ? "white" : "#09ACFF",
                    fontWeight: "normal",
                  }}
                >
                  {">"}
                </span>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    color: selectedCard?.id === card.id ? "white" : "black",
                  }}
                >
                  {card.title}
                </h3>
              </div>
              <div className="mt-2">
                <p
                  className={`text-sm ml-4 ${
                    selectedCard?.id === card.id
                      ? "text-gray-100"
                      : "text-gray-600"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Params and Response */}
        <div className="w-full md:w-2/3 flex flex-col bg-gray-50 p-4 rounded-md border border-gray-200">
          {selectedCard && (
            <>
              {/* Top Section - Parameters */}
              <div className="flex-1">
                <div className="flex justify-between items-center border-b border-[#09ACFF] pb-2 mb-4">
                  <h3 className="text-xl font-bold text-black">
                    {selectedCard.title} Parameters
                  </h3>
                  <ViewCode type={selectedCard.id} />
                </div>
                {selectedCard?.actionType ===
                  ActionType.UPDATE_LICENSING_CONFIG && (
                  <UpdateLicensingConfigForm
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                    walletAddress={wallet?.account.address}
                    client={client}
                  />
                )}
                {selectedCard?.actionType === ActionType.ADD_LICENSE_TERMS && (
                  <AddLicenseTermsForm
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                    walletAddress={wallet?.account.address}
                    client={client}
                  />
                )}
              </div>

              {/* Terminal Component */}
              <Terminal success={executionSuccess} isExecuting={isExecuting} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <TerminalProvider>
        <MainContent />
      </TerminalProvider>

      <Footer />
    </main>
  );
}
