export const setupClient = `
'use client';
import { Address, createPublicClient, createWalletClient, custom } from 'viem';
import { useWalletClient } from 'wagmi';
import { PropsWithChildren, createContext, useEffect, useContext, useState } from "react";
import { iliad, StoryClient, StoryConfig } from "@story-protocol/core-sdk";

export const StoryContext = createContext<{
  client: StoryClient | null;
} | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};

export default function StoryProvider({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();
  const [client, setClient] = useState<StoryClient | null>(null);

  const setupStoryClient: () => StoryClient = () => {
    const config: StoryConfig = {
      wallet: wallet,
      transport: custom(wallet!.transport),
      chainId: "iliad",
    };
    const client = StoryClient.newClient(config);
    return client;
  };

  useEffect(() => {
    if (!client && wallet?.account.address) {
      let newClient = setupStoryClient();
      setClient(newClient);
    }
  }, [wallet]);

  return (
    <StoryContext.Provider
      value={{
        client
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
`;
