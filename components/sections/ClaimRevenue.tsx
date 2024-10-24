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

export default function ClaimRevenue() {
  const { setTxHash, setTxLoading, setTxName, addTransaction, client } =
    useStory();
  const [ancestorIpId, setAncestorIpId] = useState("");
  const [childIpId, setChildIpId] = useState("");
  const [amount, setAmount] = useState("");

  async function claimRevenueTokens() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Claiming the revenue you are due...");
    const response =
      await client.royalty.transferToVaultAndSnapshotAndClaimByTokenBatch({
        ancestorIpId: ancestorIpId as Address,
        claimer: ancestorIpId as Address,
        royaltyClaimDetails: [
          {
            childIpId: childIpId as Address,
            royaltyPolicy: "0x793Df8d32c12B0bE9985FFF6afB8893d347B6686",
            currencyToken: "0x91f6F05B08c16769d3c85867548615d270C42fC7",
            amount: amount,
          },
        ],
        txOptions: { waitForTransaction: true },
      });
    console.log(
      `Claimed ${response.amountsClaimed} revenue at snapshotId ${response.snapshotId}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Claim Revenue", {
      amountsClaimed: response.amountsClaimed,
    });
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 5. Claim Revenue</CardTitle>
            <CardDescription>
              Claim the revenue you are due from a child IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Ancestor IP ID</Label>
                <Input
                  type="text"
                  id="ancestorIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setAncestorIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="childIpId">Child IP ID</Label>
                <Input
                  type="text"
                  id="childIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setChildIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="text"
                  id="amount"
                  placeholder="2"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={claimRevenueTokens}>Claim</Button>
            <ViewCode type="claim-revenue" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
