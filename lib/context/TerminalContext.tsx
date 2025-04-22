"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type MessageType = "success" | "error" | "info";

interface TerminalContextType {
  messages: string;
  isExecuting: boolean;
  executionSuccess: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setExecutionSuccess: (executionSuccess: boolean) => void;
  addTerminalMessage: (message: string, type?: MessageType) => void;
  clearMessages: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined
);

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}

interface TerminalProviderProps {
  children: ReactNode;
}

export function TerminalProvider({ children }: TerminalProviderProps) {
  const [messages, setMessages] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  // Add a message to the terminal with timestamp
  const addTerminalMessage = (message: string, type?: MessageType) => {
    const timestamp = new Date().toLocaleTimeString();
    let formattedMessage = message;

    // Apply formatting based on message type
    if (type === "success") {
      formattedMessage = `✅ ${message}`;
    } else if (type === "error") {
      formattedMessage = `❌ ${message}`;
    } else if (type === "info") {
      formattedMessage = `ℹ️ ${message}`;
    }

    setMessages((prev) =>
      prev
        ? `${prev}\n[${timestamp}] ${formattedMessage}`
        : `[${timestamp}] ${formattedMessage}`
    );
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages("");
  };

  // Initialize with a welcome message
  React.useEffect(() => {
    if (!messages) {
      const timestamp = new Date().toLocaleTimeString();
      setMessages(`[${timestamp}] ℹ️ Waiting for inputs...`);
    }
  }, [messages]);

  const value = {
    messages,
    isExecuting,
    executionSuccess,
    setIsExecuting,
    setExecutionSuccess,
    addTerminalMessage,
    clearMessages,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export const Terminal: React.FC<{
  success: boolean | null;
  isExecuting: boolean;
}> = ({ success, isExecuting }) => {
  const { messages } = useTerminal();

  return (
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
            success === true
              ? "text-[#A1D1FF]"
              : success === false
              ? "text-red-400"
              : "text-gray-200"
          }`}
        >
          <code>{messages}</code>
        </pre>
      </div>
      {success === false && (
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
  );
};
