"use client";
import "viem/window";
import Navbar from "../components/sections/Navbar";
import { useStory } from "@/lib/context/AppContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/react/dist/iconify.js";
import Footer from "@/components/sections/Footer";
import { ConsoleLog } from "@/components/atoms/ConsoleLog";
import { useEffect, useState, useCallback } from "react";
import { useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ViewCode } from "@/components/atoms/ViewCode";
import { Spinner } from "@/components/atoms/Spinner";
import { formatEther, parseEther } from "viem";

// Import licensing configuration components and services
import {
  executeLicensingConfig,
  checkLicenseDisabledStatus,
  ChangeMintingFeeForm,
  DisableLicenseForm,
  ActionType
} from "@/features/licensing-config";

// Using the string type to match ViewCode component's expected keys
type CodeSnippetType = "set-licensing-config" | "disable-license";

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
  const [transactionResult, setTransactionResult] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean | null>(
    null
  );
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [licenseTermsOptions, setLicenseTermsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [ipIdError, setIpIdError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentMintingFee, setCurrentMintingFee] = useState<string>("");
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [feeError, setFeeError] = useState("");
  const [isLicenseDisabled, setIsLicenseDisabled] = useState(false);
  const [isCheckingDisabled, setIsCheckingDisabled] = useState(false);

  // Define the cards with their actions
  const actionCards: ActionCard[] = [
    {
      id: "set-licensing-config",
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
    }
  }, []);

  // Handle card selection
  const handleCardSelect = (card: ActionCard) => {
    setSelectedCard(card);
    setTransactionResult(""); // Clear previous transaction result
    setParamValues({}); // Reset parameter values

    // Reset license disabled status when changing action type
    setIsLicenseDisabled(false);

    // Check if the selected license is already disabled when selecting the disable action
    if (
      card.actionType === ActionType.DISABLE_LICENSE &&
      paramValues.ipId &&
      paramValues.licenseTermsId
    ) {
      checkLicenseStatus(paramValues.ipId, paramValues.licenseTermsId);
    }
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

  // Verify the minting fee after execution
  const verifyMintingFee = async (
    ipId: string,
    licenseTermsId: string,
    expectedFee: string
  ) => {
    addTerminalMessage("Verifying minting fee...");

    if (!client) {
      addTerminalMessage("Error: Client not initialized.", "error");
      addTerminalMessage(
        "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
      );
      setExecutionSuccess(false);
      return;
    }

    try {
      // Access the licensing module through the client
      const response = await client.license.predictMintingLicenseFee({
        licensorIpId: ipId as `0x${string}`,
        licenseTermsId: parseInt(licenseTermsId),
        amount: BigInt(1),
        licenseTemplate: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
      });

      if (response && response.tokenAmount !== undefined) {
        const actualFee = response.tokenAmount.toString();
        const expectedFeeWei = parseEthToWei(expectedFee);

        if (actualFee === expectedFeeWei) {
          addTerminalMessage("Minting fee verified successfully!", "success");
          addTerminalMessage(
            `New minting fee: ${formatWeiToEth(actualFee)} IP`
          );
          setExecutionSuccess(true);
        } else {
          addTerminalMessage(
            `Minting fee verification failed. Expected: ${formatWeiToEth(
              expectedFeeWei
            )} IP, Actual: ${formatWeiToEth(actualFee)} IP`,
            "error"
          );
          addTerminalMessage(
            "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
          );
          setExecutionSuccess(false);
        }
      } else {
        addTerminalMessage("Error: Could not verify minting fee.", "error");
        addTerminalMessage(
          "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
        );
        setExecutionSuccess(false);
      }
    } catch (error) {
      console.error("Error verifying minting fee:", error);
      addTerminalMessage("Error: Could not verify minting fee.", "error");
      addTerminalMessage(`Error details: ${String(error)}`);
      addTerminalMessage(
        "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
      );
      setExecutionSuccess(false);
    }
  };

  // Handle the licensing configuration action
  const handleExecuteAction = async () => {
    if (!isFormValid) return;

    setIsExecuting(true);
    setExecutionSuccess(null);
    setTransactionResult(""); // Clear previous results

    try {
      // Add action type to parameters
      let actionParams: Record<string, string> = {
        ...paramValues,
        actionType:
          selectedCard?.actionType?.toString() ||
          ActionType.CHANGE_MINTING_FEE.toString(),
      };

      // For change minting fee action, convert mintingFee to wei
      if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
        actionParams.mintingFee = parseEthToWei(paramValues.mintingFee);
      }

      // Display appropriate messages based on action type
      if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
        addTerminalMessage("Starting license minting fee update...");
        addTerminalMessage(`IP ID: ${paramValues.ipId}`);
        addTerminalMessage(`License Terms ID: ${paramValues.licenseTermsId}`);
        addTerminalMessage(`New Minting Fee: ${paramValues.mintingFee} IP`);
        addTerminalMessage(`Licensing Hook: ${paramValues.licensingHook}`);

        if (
          paramValues.licensingHook === "limit-license" &&
          paramValues.licenseLimit
        ) {
          addTerminalMessage(`License Limit: ${paramValues.licenseLimit}`);
        }
      } else if (selectedCard?.actionType === ActionType.DISABLE_LICENSE) {
        addTerminalMessage("Starting license disable operation...");
        addTerminalMessage(`IP ID: ${paramValues.ipId}`);
        addTerminalMessage(`License Terms ID: ${paramValues.licenseTermsId}`);
        addTerminalMessage(`Using Lock License hook to disable the license`);
      }

      addTerminalMessage("Executing transaction...");

      if (!client) {
        addTerminalMessage("Error: No client available.", "error");
        addTerminalMessage(
          "Please connect your wallet to execute transactions."
        );
        addTerminalMessage(
          "Visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
        );
        setExecutionSuccess(false);
        return;
      }

      addTerminalMessage(
        "Using Story Protocol SDK to update licensing config..."
      );

      try {
        // Execute the actual transaction with the client
        const result = await executeLicensingConfig(actionParams, client);
        const resultObj = JSON.parse(result);

        if (resultObj.success) {
          addTerminalMessage(
            `Transaction submitted with hash: ${resultObj.txHash}`
          );
          addTerminalMessage("Transaction confirmed!");

          // Verify the result based on action type
          if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
            // Verify the minting fee was updated correctly
            await verifyMintingFee(
              paramValues.ipId,
              paramValues.licenseTermsId,
              paramValues.mintingFee
            );
          } else if (selectedCard?.actionType === ActionType.DISABLE_LICENSE) {
            // Check if the license is now disabled
            const disabledStatus = await checkLicenseDisabledStatus(
              paramValues.ipId,
              paramValues.licenseTermsId
            );
            if (disabledStatus.isDisabled) {
              addTerminalMessage("License successfully disabled!", "success");
              setIsLicenseDisabled(true);
            } else if (disabledStatus.error) {
              addTerminalMessage(
                `Could not verify disabled status: ${disabledStatus.error}`,
                "error"
              );
            } else {
              addTerminalMessage(
                "Warning: License may not be properly disabled. Please verify.",
                "error"
              );
            }
          }
        } else {
          addTerminalMessage("Transaction failed.", "error");
          if (resultObj.error) {
            addTerminalMessage(`Error: ${resultObj.error}`);
          }
          setExecutionSuccess(false);
        }
      } catch (error) {
        addTerminalMessage("Transaction failed.", "error");
        addTerminalMessage(`Error: ${String(error)}`);
        addTerminalMessage(
          "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
        );
        setExecutionSuccess(false);
      }

      // Refresh the current minting fee display if it's a change minting fee action
      if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
        fetchCurrentMintingFee(paramValues.ipId, paramValues.licenseTermsId);
      }
    } catch (error) {
      console.error("Error executing licensing configuration:", error);
      addTerminalMessage("Error executing transaction.", "error");
      addTerminalMessage(`Error details: ${String(error)}`);
      addTerminalMessage(
        "Please visit the Story Builders Discord for assistance: https://discord.gg/storybuilders"
      );
      setExecutionSuccess(false);
    } finally {
      setIsExecuting(false);
    }
  };

  // Fetch license terms IDs for a given IP ID
  const fetchLicenseTermsIds = useCallback(async (ipId: string) => {
    if (!ipId || ipId === "0x1234...") return;

    setIsLoadingTerms(true);
    setLicenseTermsOptions([]);
    setIpIdError("");
    setIsLicenseDisabled(false);

    try {
      const options = {
        method: "GET",
        headers: {
          "X-Api-Key": "MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U",
          "X-Chain": "story-aeneid",
        },
      };

      const response = await fetch(
        `https://api.storyapis.com/api/v3/licenses/ip/terms/${ipId}`,
        options
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Map terms and remove duplicates by creating a Map with licenseTermsId as key
        const termsMap = new Map();
        data.data.forEach((term: any) => {
          const id = term.licenseTermsId.toString();
          termsMap.set(id, {
            value: id,
            label: `Terms ID: ${id}`,
          });
        });

        // Convert Map back to array
        const options = Array.from(termsMap.values());

        setLicenseTermsOptions(options);

        // If there are options, automatically select the first one
        if (options.length > 0) {
          const firstTermId = options[0].value;
          setParamValues((prev) => ({
            ...prev,
            licenseTermsId: firstTermId,
          }));

          // Check if the selected license is already disabled
          if (selectedCard?.actionType === ActionType.DISABLE_LICENSE) {
            checkLicenseStatus(ipId, firstTermId);
          }
        }
      } else {
        setIpIdError("No license terms found for this IP ID");
      }
    } catch (error) {
      console.error("Error fetching license terms:", error);
      setIpIdError("Error fetching license terms. Please check the IP ID.");
    } finally {
      setIsLoadingTerms(false);
    }
  }, []);

  // Fetch the current minting fee
  const fetchCurrentMintingFee = useCallback(
    async (ipId: string, licenseTermsId: string) => {
      if (!ipId || !licenseTermsId || ipId === "0x1234..." || !client) {
        setCurrentMintingFee("");
        return;
      }

      setIsLoadingFee(true);
      setFeeError("");

      try {
        // Access the licensing module through the client
        const response = await client.license.predictMintingLicenseFee({
          licensorIpId: ipId as `0x${string}`,
          licenseTermsId: parseInt(licenseTermsId),
          amount: BigInt(1),
          licenseTemplate: "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
        });

        if (response && response.tokenAmount !== undefined) {
          // Store the raw wei value
          setCurrentMintingFee(response.tokenAmount.toString());
        } else {
          setFeeError("Could not retrieve minting fee");
        }
      } catch (error) {
        console.error("Error fetching minting fee:", error);
        setFeeError("Error fetching minting fee");
      } finally {
        setIsLoadingFee(false);
      }
    },
    [client]
  );

  // Format wei value to IP for display
  const formatWeiToEth = (weiValue: string): string => {
    if (!weiValue || weiValue === "0") return "0";
    try {
      // Format to IP with 6 decimal places maximum
      const ipValue = formatEther(BigInt(weiValue));
      const formatted = parseFloat(ipValue).toFixed(6);
      // Remove trailing zeros
      return formatted.replace(/\.?0+$/, "");
    } catch (error) {
      console.error("Error formatting wei to IP:", error);
      return weiValue;
    }
  };

  // Convert user input IP to wei
  const parseEthToWei = (ipValue: string): string => {
    if (!ipValue || ipValue === "0") return "0";
    try {
      const weiValue = parseEther(ipValue);
      return weiValue.toString();
    } catch (error) {
      console.error("Error parsing IP to wei:", error);
      return ipValue;
    }
  };

  // Handle parameter change
  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // When ipId changes, fetch license terms after a short delay
    if (name === "ipId" && value && value !== "0x1234...") {
      const debounceTimer = setTimeout(() => {
        fetchLicenseTermsIds(value);
      }, 1000); // 1 second delay to avoid too many requests while typing

      return () => clearTimeout(debounceTimer);
    }

    // When licenseTermsId changes, fetch the current minting fee
    if (
      name === "licenseTermsId" &&
      value &&
      paramValues.ipId &&
      paramValues.ipId !== "0x1234..."
    ) {
      const debounceTimer = setTimeout(() => {
        fetchCurrentMintingFee(paramValues.ipId, value);
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  };

  // Set default values when component mounts
  useEffect(() => {
    setParamValues((prev) => ({
      ...prev,
      licensingHook: "none",
    }));
  }, []);

  // Update minting fee when license terms ID changes
  useEffect(() => {
    if (paramValues.ipId && paramValues.licenseTermsId && client) {
      fetchCurrentMintingFee(paramValues.ipId, paramValues.licenseTermsId);
    }
  }, [
    paramValues.licenseTermsId,
    paramValues.ipId,
    client,
    fetchCurrentMintingFee,
  ]);

  // Check if the form is valid
  useEffect(() => {
    const requiredFields = ["ipId", "licenseTermsId"];

    // Add mintingFee to required fields if action type is CHANGE_MINTING_FEE
    if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
      requiredFields.push("mintingFee");
    }

    // Add licensingHook to required fields if action type is CHANGE_MINTING_FEE
    if (selectedCard?.actionType === ActionType.CHANGE_MINTING_FEE) {
      requiredFields.push("licensingHook");
    }

    // Add licenseLimit to required fields if licensingHook is 'limit-license'
    if (paramValues.licensingHook === "limit-license") {
      requiredFields.push("licenseLimit");
    }

    const isValid =
      requiredFields.every(
        (field) =>
          paramValues[field] &&
          paramValues[field].trim() !== "" &&
          paramValues[field] !== "0x1234..."
      ) &&
      !isLoadingTerms &&
      !ipIdError &&
      licenseTermsOptions.length > 0;

    setIsFormValid(isValid);
  }, [paramValues, isLoadingTerms, ipIdError, licenseTermsOptions.length]);

  // Check if the license is already disabled
  const checkLicenseStatus = async (ipId: string, licenseTermsId: string) => {
    if (!ipId || !licenseTermsId || licenseTermsId === "") return;

    setIsCheckingDisabled(true);
    const result = await checkLicenseDisabledStatus(ipId, licenseTermsId);
    setIsCheckingDisabled(false);

    setIsLicenseDisabled(result.isDisabled);

    if (result.isDisabled) {
      addTerminalMessage(`Note: This license is already disabled.`, "info");
    } else if (result.error) {
      addTerminalMessage(
        `Error checking license status: ${result.error}`,
        "error"
      );
    }
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
      <div className="relative">
        <ConsoleLog />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4 bg-white font-mono">
        {/* Left Side - Cards List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-black border-b border-[#09ACFF] pb-2">
            $ story-protocol
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
                <div className="bg-black p-4 rounded-md h-[350px] overflow-y-auto">
                  <pre
                    className={`font-mono ${
                      executionSuccess === true
                        ? "text-[#A1D1FF]"
                        : executionSuccess === false
                        ? "text-red-500"
                        : "text-white"
                    }`}
                  >
                    <code>
                      {transactionResult ||
                        "// Waiting for transaction execution..."}
                    </code>
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
