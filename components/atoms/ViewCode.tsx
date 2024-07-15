import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Code } from "./CodeBlock";
import { registerExistingNft } from "@/lib/code-snippets/registerExistingNft";
import { setupClient } from "@/lib/code-snippets/setupClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { attachTerms } from "@/lib/code-snippets/attachTerms";
import { mintLicense } from "@/lib/code-snippets/mintLicense";
import { registerNewNft } from "@/lib/code-snippets/registerNewNft";
import { registerNewNftDerivative } from "@/lib/code-snippets/registerNewNftDerivative";
import { registerExistingNftDerivative } from "@/lib/code-snippets/registerExistingNftDerivative";
import { collectRoyalty } from "@/lib/code-snippets/collectRoyalty";
import { snapshot } from "@/lib/code-snippets/snapshot";
import { claimRevenue } from "@/lib/code-snippets/claimRevenue";

const data: {
  [type: string]: {
    title: string;
    description: string;
    code: { filename: string; code: string }[];
  };
} = {
  "register-existing-nft": {
    title: "Register IP Asset",
    description: "Register an existing NFT in your wallet as an IP Asset.",
    code: [
      { filename: "RegisterIPA.tsx", code: registerExistingNft },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "register-new-nft": {
    title: "Register IP Asset",
    description:
      "Mint a new NFT to represent your IP and register it as an IP Asset.",
    code: [
      { filename: "RegisterIPA.tsx", code: registerNewNft },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "attach-terms": {
    title: "Attach terms to IP Asset",
    description: "Attach existing pre-set terms to an IP Asset.",
    code: [
      { filename: "AttachTerms.tsx", code: attachTerms },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "mint-license": {
    title: "Mint a License Token",
    description: "Mint a License Token from an existing IP Asset.",
    code: [
      { filename: "MintLicense.tsx", code: mintLicense },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "register-existing-nft-derivative": {
    title: "Register Derivative IP Asset",
    description:
      "Register an existing NFT in your wallet as a derivative of an existing IP Asset.",
    code: [
      {
        filename: "RegisterDerivative.tsx",
        code: registerExistingNftDerivative,
      },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "register-new-nft-derivative": {
    title: "Register Derivative IP Asset",
    description:
      "Mint a new NFT to represent your IP and register it as a derivative of an existing IP Asset.",
    code: [
      { filename: "RegisterDerivative.tsx", code: registerNewNftDerivative },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "collect-royalty": {
    title: "Collect Royalty Tokens",
    description:
      "Claim the royalty tokens and any accrued revenue tokens from children.",
    code: [
      { filename: "CollectRoyalty.tsx", code: collectRoyalty },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  snapshot: {
    title: "Snapshot",
    description:
      "Take a snapshot of the current state of the royalty system so you can claim revenue in the next step.",
    code: [
      { filename: "Snapshot.tsx", code: snapshot },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
  "claim-revenue": {
    title: "Claim Revenue",
    description:
      "Claim the revenue you are due from holding the Royalty Token of a child IP Asset.",
    code: [
      { filename: "ClaimRevenue.tsx", code: claimRevenue },
      { filename: "StoryWrapper.tsx", code: setupClient },
    ],
  },
};

export function ViewCode({ type }: { type: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">View Code</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="mx-auto w-full">
          <SheetHeader>
            <SheetTitle>{data[type].title}</SheetTitle>
            <SheetDescription>{data[type].description}</SheetDescription>
          </SheetHeader>
          <div className="pt-4">
            <Tabs defaultValue={data[type].code[0].filename}>
              <TabsList>
                {data[type].code.map((file, index) => {
                  return (
                    <TabsTrigger value={file.filename} key={index}>
                      {file.filename}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {data[type].code.map((file, index) => {
                return (
                  <TabsContent
                    value={file.filename}
                    key={index}
                    className="max-h-[400px] overflow-y-scroll"
                  >
                    <Code code={file.code} />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
