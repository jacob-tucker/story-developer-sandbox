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
import { setupClient } from "@/lib/code-snippets/setupClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { changeMintingFee } from "@/lib/code-snippets/changeMintingFee";
import { disableLicense } from "@/lib/code-snippets/disableLicense";
import { addLicenseTerms } from "@/lib/code-snippets/addLicenseTerms";

const data: {
  [type: string]: {
    title: string;
    description: string;
    code: { filename: string; code: string }[];
  };
} = {
  "change-minting-fee": {
    title: "Change License Minting Fee",
    description:
      "Set the licensing configuration including minting fee for a specific license terms of an IP.",
    code: [
      { filename: "ChangeMintingFee.tsx", code: changeMintingFee },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "disable-license": {
    title: "Disable License",
    description:
      "Disable a license for a specific IP and license terms using the Licensing Config.",
    code: [
      { filename: "DisableLicense.tsx", code: disableLicense },
      { filename: "StoryContext.tsx", code: setupClient },
    ],
  },
  "add-license-terms": {
    title: "Add License Terms",
    description:
      "Add new license terms to an existing license with different configurations based on license type.",
    code: [
      { filename: "AddLicenseTerms.tsx", code: addLicenseTerms },
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
