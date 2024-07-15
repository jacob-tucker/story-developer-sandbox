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
                chainId: "sepolia",
                transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
                wallet: wallet,
            }}
        >
          {children}
        </StoryProvider>
    );
}
`;
