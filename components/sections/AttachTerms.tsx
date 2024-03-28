import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Address, custom } from "viem";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { useState } from "react";
import { ViewCode } from "../ViewCode";

export default function AttachTerms() {
  const [ipId, setIpId] = useState("");
  const [termsId, setTermsId] = useState("");

  async function attachTermsToIPA() {
    const [account]: [Address] = await window.ethereum!.request({
      method: "eth_requestAccounts",
    });
    const config: StoryConfig = {
      account: account,
      transport: custom(window.ethereum!),
    };
    const client = StoryClient.newClient(config);
    const attachPolicyResponse = await client.policy.addPolicyToIp({
      policyId: termsId,
      ipId: ipId as `0x${string}`,
      txOptions: { waitForTransaction: true },
    });
    console.log(attachPolicyResponse);
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 2. Attach terms to IPA</CardTitle>
            <CardDescription>
              Attach existing pre-set terms to an IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="ipId">IP ID</Label>
                <Input
                  type="text"
                  id="ipId"
                  placeholder="12"
                  onChange={(e) => setIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="termsId">Terms ID</Label>
                <Input
                  type="text"
                  id="termsId"
                  placeholder="1"
                  onChange={(e) => setTermsId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={attachTermsToIPA}>Attach</Button>
            {/* <ViewCode type="attach-terms" /> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
