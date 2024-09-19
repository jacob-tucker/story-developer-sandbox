export const setupClient = `
import { http } from 'viem';
import { StoryProvider } from "@story-protocol/react-sdk";
import { useWalletClient } from 'wagmi';

// wrapper around your app
export default function StoryWrapper({ children }) {
    // from wagmi or some other wallet provider
    const { data: wallet } = useWalletClient();

    return (
        <StoryProvider
            config={{
                chainId: "iliad",
                transport: http("https://testnet.storyrpc.io"),
                wallet: wallet,
            }}
        >
          {children}
        </StoryProvider>
    );
}
`;
