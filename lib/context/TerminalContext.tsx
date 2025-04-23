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
    <div className="flex-1 mt-4">
      <h3 className="text-xl font-bold text-black border-b border-[#09ACFF] pb-2 mb-4">
        Response
      </h3>
      <div
        style={{
          backgroundColor: "#1E1E1E",
          padding: "1rem",
          borderRadius: "0.375rem",
          height: "450px",
          minHeight: "450px",
          overflowY: "auto",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #333",
          fontFamily: "monospace",
        }}
      >
        <div className="flex items-center mb-2 text-sm">
          <span style={{ marginRight: "0.25rem", color: "#6B7280" }}>$</span>
          <span style={{ color: "#4ADE80" }}>story-sandbox</span>
          <span
            style={{
              marginRight: "0.25rem",
              marginLeft: "0.25rem",
              color: "#6B7280",
            }}
          >
            :
          </span>
          <span style={{ color: "#60A5fA" }}>~</span>
          <span
            style={{
              animation: "pulse 1.5s infinite",
              marginLeft: "0.25rem",
              color: "#E5E7EB",
            }}
          >
            ▌
          </span>
        </div>
        <pre
          style={{
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            color:
              success === true
                ? "#A1D1FF"
                : success === false
                ? "#f87171"
                : "#E5E7EB",
          }}
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
