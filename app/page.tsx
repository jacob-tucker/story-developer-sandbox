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

// Import licensing configuration components and services
import {
  executeLicensingConfig,
  ChangeMintingFeeForm,
  DisableLicenseForm,
  ActionType,
} from "@/features/licensing-config";

// Using the string type to match ViewCode component's expected keys
type CodeSnippetType = "change-minting-fee" | "disable-license";

// Define the card data structure
interface ActionCard {
  id: CodeSnippetType;
  title: string;
  description: string;
  actionType: ActionType;
}

export default function Home() {
  const { txLoading, txHash, txName, client } = useStory();
  const { data: wallet } = useWalletClient();
  const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);
  const [transactionResult, setTransactionResult] = useState<string>();
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean | null>(
    null
  );
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // Define the cards with their actions
  const actionCards: ActionCard[] = [
    {
      id: "change-minting-fee",
      title: "Change License Minting Fee",
      description:
        "Set the licensing configuration including minting fee for a specific license terms of an IP",
      actionType: ActionType.CHANGE_MINTING_FEE,
    },
    {
      id: "disable-license",
      title: "Disable License",
      description:
        "Disable a license for a specific IP and license terms using the Lock License hook",
      actionType: ActionType.DISABLE_LICENSE,
    },
  ];

  // Select the first card by default
  useEffect(() => {
    if (actionCards.length > 0 && !selectedCard) {
      setSelectedCard(actionCards[0]);
      // Set initial message
      const timestamp = new Date().toLocaleTimeString();
      setTransactionResult(`[${timestamp}] ℹ️ Waiting for inputs...`);
    }
  }, []);

  // Handle card selection
  const handleCardSelect = (card: ActionCard) => {
    setSelectedCard(card);
    // Set waiting message when changing cards
    const timestamp = new Date().toLocaleTimeString();
    setTransactionResult(`[${timestamp}] ℹ️ Waiting for inputs...`);
    setParamValues({}); // Reset parameter values
    setExecutionSuccess(null); // Reset execution status
  };

  // Add a message to the terminal with timestamp
  const addTerminalMessage = (
    message: string,
    type?: "success" | "error" | "info"
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    let formattedMessage = message;

    // Apply color formatting based on message type
    if (type === "success") {
      formattedMessage = `✅ ${message}`;
    } else if (type === "error") {
      formattedMessage = `❌ ${message}`; // Red color will be applied in the terminal display
    } else if (type === "info") {
      formattedMessage = `ℹ️ ${message}`;
    }

    setTransactionResult(
      (prev) => `${prev}\n[${timestamp}] ${formattedMessage}`
    );
  };

  // Handle the licensing configuration action
  const handleExecuteAction = async () => {
    setIsExecuting(true);
    setExecutionSuccess(null);

    try {
      // Add action type to parameters
      const actionParams: Record<string, string> = {
        ...paramValues,
        actionType:
          selectedCard?.actionType?.toString() ||
          ActionType.CHANGE_MINTING_FEE.toString(),
      };

      // Display basic transaction start message
      addTerminalMessage(`Executing ${selectedCard?.title} transaction...`);

      if (!client) {
        addTerminalMessage("Error: No client available.", "error");
        addTerminalMessage(
          "Please connect your wallet to execute transactions."
        );
        setExecutionSuccess(false);
        return;
      }

      try {
        // Execute the actual transaction with the client
        const result = await executeLicensingConfig(actionParams, client);

        if (result.success) {
          addTerminalMessage(
            `Transaction submitted with hash: ${result.txHash}`
          );
          addTerminalMessage("Transaction confirmed!", "success");

          // Set execution success - the form components will handle verification
          setExecutionSuccess(true);
        } else {
          addTerminalMessage("Transaction failed.", "error");
          addTerminalMessage(`Error: ${result.error}`);
          setExecutionSuccess(false);
        }
      } catch (error) {
        addTerminalMessage("Transaction failed.", "error");
        addTerminalMessage(`Error: ${String(error)}`);
        setExecutionSuccess(false);
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      addTerminalMessage("Error executing transaction.", "error");
      addTerminalMessage(`Error details: ${String(error)}`);
      setExecutionSuccess(false);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Transaction Alerts */}
      {txLoading ? (
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
      ) : txHash ? (
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
      ) : !wallet?.account.address ? (
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
      ) : null}

      <Navbar />
      {/* <div className="relative">
        <ConsoleLog />
      </div> */}

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
                {selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE ? (
                  <ChangeMintingFeeForm
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                    onExecute={handleExecuteAction}
                    isExecuting={isExecuting}
                    executionSuccess={executionSuccess}
                    walletAddress={wallet?.account.address}
                    client={client}
                    addTerminalMessage={addTerminalMessage}
                  />
                ) : selectedCard?.actionType === ActionType.DISABLE_LICENSE ? (
                  <DisableLicenseForm
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                    onExecute={handleExecuteAction}
                    isExecuting={isExecuting}
                    executionSuccess={executionSuccess}
                    walletAddress={wallet?.account.address}
                    addTerminalMessage={addTerminalMessage}
                  />
                ) : null}
              </div>

              {/* Bottom Section - Transaction Response */}
              <div className="flex-1 mt-6">
                <h3 className="text-xl font-bold text-black border-b border-[#09ACFF] pb-2 mb-4">
                  Response
                </h3>
                <div className="bg-[#1E1E1E] p-4 rounded-md h-[350px] overflow-y-auto shadow-inner border border-[#333] font-mono">
                  <div className="flex items-center mb-2 text-gray-500 text-sm">
                    <span className="mr-1">$</span>
                    <span className="text-green-400">story-sandbox</span>
                    <span className="mr-1 ml-1">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="animate-pulse ml-1">▌</span>
                  </div>
                  <pre
                    className={`font-mono text-sm leading-relaxed ${
                      executionSuccess === true
                        ? "text-[#A1D1FF]"
                        : executionSuccess === false
                        ? "text-red-400"
                        : "text-gray-200"
                    }`}
                  >
                    <code>{transactionResult}</code>
                  </pre>
                </div>
                {executionSuccess === false && (
                  <div className="mt-2 text-sm text-[#09ACFF]">
                    <a
                      href="https://discord.gg/storybuilders"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#09ACFF]/80"
                    >
                      Need help? Join the Story Builders Discord
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
