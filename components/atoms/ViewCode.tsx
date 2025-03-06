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
import { mintThenRegisterNft } from "@/lib/code-snippets/mintThenRegisterNft";
import { mintAndRegisterNft } from "@/lib/code-snippets/mintAndRegisterNft";
import { setupClient } from "@/lib/code-snippets/setupClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { attachTerms } from "@/lib/code-snippets/attachTerms";
import { mintLicense } from "@/lib/code-snippets/mintLicense";
import { registerDerivativeLicenseToken } from "@/lib/code-snippets/registerDerivativeLicenseToken";
import { registerDerivative } from "@/lib/code-snippets/registerDerivative";
import { claimRevenue } from "@/lib/code-snippets/claimRevenue";

const data: {
  [type: string]: {
    title: string;
    description: string;
    code: { filename: string; code: string }[];
  };
} = {
  "mint-then-register": {
    title: "Mint then Register NFT",
    description:
      "Mint an NFT and then register it as an IP Asset in 2 transactions.",
    code: [
      { filename: "RegisterIPA.tsx", code: mintThenRegisterNft },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "mint-and-register": {
    title: "Mint and Register NFT",
    description: "Mint an NFT and register it as an IP Asset in 1 transaction.",
    code: [
      { filename: "RegisterIPA.tsx", code: mintAndRegisterNft },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "attach-terms": {
    title: "Attach terms to IP Asset",
    description: "Attach existing pre-set terms to an IP Asset.",
    code: [
      { filename: "AttachTerms.tsx", code: attachTerms },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "mint-license": {
    title: "Mint a License Token",
    description: "Mint a License Token from an existing IP Asset.",
    code: [
      { filename: "MintLicense.tsx", code: mintLicense },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "register-derivative-license-token": {
    title: "Register Derivative IP Asset with License Token",
    description:
      "Mint an NFT and register it as a derivative IP by burning a License Token.",
    code: [
      {
        filename: "RegisterDerivative.tsx",
        code: registerDerivativeLicenseToken,
      },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "register-derivative": {
    title: "Register Derivative IP Asset",
    description:
      "Mint an NFT and register a derivative IP without a License Token (mints and burns it automatically).",
    code: [
      {
        filename: "RegisterDerivative.tsx",
        code: registerDerivative,
      },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "claim-revenue": {
    title: "Claim Revenue",
    description:
      "Claim the revenue you are due from holding the Royalty Token of a child IP Asset.",
    code: [
      { filename: "ClaimRevenue.tsx", code: claimRevenue },
      { filename: "StoryContext.tsx", code: setupClient },
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
