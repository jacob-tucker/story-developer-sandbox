export const setupClient = `
import { http } from 'viem';
import { StoryProvider } from "@story-protocol/react-sdk";
import { useWalletClient } from 'wagmi';

// wrapper around your app
function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();
  if (!wallet) {
    return <>{children}</>;
  }
  return (
    <StoryProvider
      config={{
        chainId: "iliad",
        wallet: wallet,
        transport: http("https://testnet.storyrpc.io"),
      }}
    >
      {children}
    </StoryProvider>
  );
}
`;
