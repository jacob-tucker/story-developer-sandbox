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
import { useStory } from "@/lib/context/AppContext";
import { Address } from "viem";
import { useRoyalty } from "@story-protocol/react-sdk";
import { useWalletClient } from "wagmi";

export default function CollectRoyalty() {
  const { setTxHash, setTxLoading, setTxName, addTransaction } = useStory();
  const [parentIpId, setParentIpId] = useState("");
  const [childIpId, setChildIpId] = useState("");
  const { collectRoyaltyTokens } = useRoyalty();
  const { data: wallet } = useWalletClient();

  async function collectRoyalty() {
    setTxLoading(true);
    setTxName("Collecting the Royalty Token...");
    const response = await collectRoyaltyTokens({
      parentIpId: parentIpId as Address,
      royaltyVaultIpId: childIpId as Address,
      txOptions: { waitForTransaction: true },
    });

    console.log(
      `Collected royalty token ${response.royaltyTokensCollected} at transaction hash ${response.txHash}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Collect Royalty", {
      royaltyTokensCollected: response.royaltyTokensCollected,
    });
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 5. Collect Royalty Tokens</CardTitle>
            <CardDescription>
              Claim the royalty tokens and any accrued revenue tokens from
              children.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Parent IP ID</Label>
                <Input
                  type="text"
                  id="parentIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setParentIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Child IP ID</Label>
                <Input
                  type="text"
                  id="childIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setChildIpId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={collectRoyalty}>Collect</Button>
            <ViewCode type="collect-royalty" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
