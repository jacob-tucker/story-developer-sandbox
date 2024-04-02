"use client";
import "viem/window";
import Navbar from "../components/Navbar";
import Introduction from "@/components/sections/Introduction";
import RegisterIPA from "@/components/sections/RegisterIPA";
import { VerticalLine } from "@/components/atoms/VerticalLine";
import AttachTerms from "@/components/sections/AttachTerms";
import MintLicense from "@/components/sections/MintLicense";
import RegisterDerivativeIPA from "@/components/sections/RegisterDerivativeIPA";
import { useStory } from "@/lib/context/StoryContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Home() {
  const { client } = useStory();
  return (
    <main className="flex min-h-screen flex-col">
      {!client ? (
        <div className="fixed bottom-5 left-5">
          <Alert>
            <Icon
              style={{ color: "#ff2825" }}
              className="h-4 w-4"
              icon="tabler:alert-triangle"
            />
            <AlertTitle>Please connect your wallet!</AlertTitle>
            <AlertDescription>
              In order to use the Story Playground, you must connect your wallet
              in the top right.
            </AlertDescription>
          </Alert>
        </div>
      ) : null}
      <Navbar />
      <Introduction />
      <RegisterIPA />
      <VerticalLine />
      <AttachTerms />
      <VerticalLine />
      <MintLicense />
      <VerticalLine />
      <RegisterDerivativeIPA />
    </main>
  );
}
