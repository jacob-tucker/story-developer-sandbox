import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Code } from "./atoms/CodeBlock";

const data: {
  [type: string]: { title: string; description: string; code: string };
} = {
  "register-existing-nft": {
    title: "View Code",
    description: "Register an existing NFT as an IP Asset.",
    code: `
import { useAccount } from "wagmi";
import { Address, custom } from "viem";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const config: StoryConfig = {
  account: account,
  transport: custom(window.ethereum!),
};
const client = StoryClient.newClient(config);
const registeredIpAsset = await client.ipAsset.registerRootIp({
  tokenContractAddress: "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49" as Address,
  tokenId: nftId,
  txOptions: { waitForTransaction: true },
});
console.log(registeredIpAsset);
`,
  },
  "register-new-nft": {
    title: "View Code",
    description:
      "Mint a new NFT to represent your IP and register it as an IP Asset.",
    code: `Unavailable.`,
  },
};

export function ViewCode({ type }: { type: string }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">View Code</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full mt-6">
          <DrawerHeader>
            <DrawerTitle>{data[type].title}</DrawerTitle>
            <DrawerDescription>{data[type].description}</DrawerDescription>
          </DrawerHeader>
          <div>
            <Code code={data[type].code} />
          </div>
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
