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
import { ROYALTY_POLICY_LAP_ADDRESS } from "@/lib/constants";
import { WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";

export default function ClaimRevenue() {
  const { setTxHash, setTxLoading, setTxName, addTransaction, client } =
    useStory();
  const [ancestorIpId, setAncestorIpId] = useState("");
  const [childIpId, setChildIpId] = useState("");

  async function claimRevenueTokens() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Claiming the revenue you are due...");
    const response = await client.royalty.claimAllRevenue({
      ancestorIpId: ancestorIpId as Address,
      claimer: ancestorIpId as Address,
      childIpIds: [childIpId as Address],
      royaltyPolicies: [ROYALTY_POLICY_LAP_ADDRESS],
      currencyTokens: [WIP_TOKEN_ADDRESS],
    });
    console.log(`Claimed revenue: ${response.claimedTokens}`);
    setTxLoading(false);
    setTxHash(response.txHashes[0] as string);
    addTransaction(response.txHashes[0] as string, "Claim Revenue", {
      amountsClaimed: response.claimedTokens,
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
