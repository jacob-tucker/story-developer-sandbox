"use client";
import "viem/window";
import Navbar from "../components/sections/Navbar";
import Introduction from "@/components/sections/Introduction";
import RegisterIPA from "@/components/sections/RegisterIPA";
import { VerticalLine } from "@/components/atoms/VerticalLine";
import AttachTerms from "@/components/sections/AttachTerms";
import MintLicense from "@/components/sections/MintLicense";
import RegisterDerivativeIPA from "@/components/sections/RegisterDerivativeIPA";
import { useStory } from "@/lib/context/AppContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/react/dist/iconify.js";
import Footer from "@/components/sections/Footer";
import CollectRoyalty from "@/components/sections/CollectRoyalty";
import { ConsoleLog } from "@/components/atoms/ConsoleLog";
import Snapshot from "@/components/sections/Snapshot";
import ClaimRevenue from "@/components/sections/ClaimRevenue";
import introJs from "intro.js";
import { useEffect } from "react";
import { useWalletClient } from "wagmi";

export default function Home() {
  const { txLoading, txHash, txName } = useStory();
  const { data: wallet } = useWalletClient();

  useEffect(() => {
    introJs()
      .setOptions({
        dontShowAgain: true,
        disableInteraction: true,
      })
      .start();
  }, []);
  return (
    <main className="flex min-h-screen flex-col">
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
                href={`https://explorer.storyprotocol.xyz/transactions/${txHash}`}
                target="_blank"
                style={{ color: "rgb(255, 40, 37)" }}
              >
                Story Protocol explorer
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
      <Introduction />
      <RegisterIPA />
      <VerticalLine />
      <AttachTerms />
      <VerticalLine />
      <MintLicense />
      <VerticalLine />
      <RegisterDerivativeIPA />
      <VerticalLine />
      <CollectRoyalty />
      <VerticalLine />
      <Snapshot />
      <VerticalLine />
      <ClaimRevenue />
      <Footer />
    </main>
  );
}
