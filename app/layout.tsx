'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { Config, WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const config: Config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
})
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
