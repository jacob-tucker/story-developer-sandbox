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
import { useWalletClient } from "wagmi";

export default function Snapshot() {
  const { setTxHash, setTxLoading, setTxName, addTransaction, client } =
    useStory();
  const [childIpId, setChildIpId] = useState("");
  const { data: wallet } = useWalletClient();

  async function takeSnapshot() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Taking a snapshot...");
    const response = await client.royalty.snapshot({
      royaltyVaultIpId: childIpId as Address,
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Took a snapshot with ID ${response.snapshotId} at transaction hash ${response.txHash}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Snapshot", {
      snapshotId: response.snapshotId,
    });
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 6. Snapshot</CardTitle>
            <CardDescription>
              Take a snapshot of the current state of the royalty system so you
              can claim revenue in the next step.
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
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={takeSnapshot}>Snapshot</Button>
            <ViewCode type="snapshot" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
