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
import { Address } from "viem";

export default function ClaimRevenue() {
  const { client, setTxHash, setTxLoading, setTxName, addTransaction } =
    useStory();
  const [childIpId, setChildIpId] = useState("");
  const [currencyTokenAddress, setCurrencyTokenAddress] = useState("");
  const [snapshotId, setSnapshotId] = useState("");

  async function claimRevenue() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Claiming the revenue you are due...");
    const response = await client.royalty.claimRevenue({
      snapshotIds: [snapshotId],
      royaltyVaultIpId: childIpId as Address,
      token: currencyTokenAddress as Address,
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Claimed revenue token ${response.claimableToken} at transaction hash ${response.txHash}`
    );
    setTxLoading(false);
    setTxHash(response.txHash);
    addTransaction(response.txHash, "Claim Revenue", {
      claimableToken: response.claimableToken,
    });
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 7. Claim Revenue</CardTitle>
            <CardDescription>
              Claim the revenue you are due from holding the Royalty Token of a
              child IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Child IP ID</Label>
                <Input
                  type="text"
                  id="childIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setChildIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Snapshot ID</Label>
                <Input
                  type="text"
                  id="snapshotId"
                  placeholder="2"
                  onChange={(e) => setSnapshotId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Currency Token Address</Label>
                <Input
                  type="text"
                  id="currencyTokenAddress"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setCurrencyTokenAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={claimRevenue}>Claim</Button>
            <ViewCode type="claim-revenue" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
