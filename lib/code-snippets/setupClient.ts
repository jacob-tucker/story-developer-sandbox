export const setupClient = `
import { custom } from 'viem';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { useWalletClient } from 'wagmi';

/* context code, emitted to shorten example */

export default function StoryProvider({ children }) {
    const { data: wallet } = useWalletClient();

    const initializeStoryClient: () => Promise<StoryClient | undefined> = async () => {
        if (!wallet?.account.address) return;
        const config: StoryConfig = {
            account: wallet.account,
            transport: custom(wallet.transport),
            chainId: "sepolia",
        };
        const client = StoryClient.newClient(config);
        return client;
    };

    return (
        <StoryContext.Provider value={{ initializeStoryClient }}>
          {children}
        </StoryContext.Provider>
    );
}
`;
