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
import { useState } from "react";
import { ViewCode } from "../atoms/ViewCode";
import { useStory } from "@/lib/context/StoryContext";

export default function AttachTerms() {
  const { client } = useStory();
  const [ipId, setIpId] = useState("");
  const [termsId, setTermsId] = useState("");

  async function attachTermsToIPA(policyId: string, ipId: `0x${string}`) {
    if (!client) return;
    const response = await client.policy.addPolicyToIp({
      policyId,
      ipId,
      txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
    });
    console.log(
      `Attached Policy to IP at transaction hash ${response.txHash}, index: ${response.index}`
    );
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
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
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
            <Button
              onClick={() => attachTermsToIPA(termsId, ipId as `0x${string}`)}
            >
              Attach
            </Button>
            <ViewCode type="attach-terms" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
