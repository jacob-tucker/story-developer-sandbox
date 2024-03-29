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
import { ViewCode } from "../ViewCode";
import { useStory } from "@/lib/context/StoryContext";
import { Address } from "viem";

export default function MintLicense() {
  const { client } = useStory();
  const [licensorIpId, setLicensorIpId] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [termsId, setTermsId] = useState("");

  async function mintLicense(
    policyId: string,
    licensorIpId: `0x${string}`,
    receiverAddress: Address
  ) {
    if (!client) return;
    const response = await client.license.mintLicense({
      policyId,
      licensorIpId,
      receiverAddress,
      mintAmount: 1,
      txOptions: { waitForTransaction: true },
    });

    console.log(
      `License minted at transaction hash ${response.txHash}, license id: ${response.licenseId}`
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 3. Mint a License</CardTitle>
            <CardDescription>
              Mint a license from an existing IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="licensorIpId">Licensor IP ID</Label>
                <Input
                  type="text"
                  id="licensorIpId"
                  placeholder="12"
                  onChange={(e) => setLicensorIpId(e.target.value)}
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
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="receiverAddress">Receiver Address</Label>
                <Input
                  type="text"
                  id="receiverAddress"
                  placeholder="1"
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={() =>
                mintLicense(
                  termsId,
                  licensorIpId as `0x${string}`,
                  receiverAddress as Address
                )
              }
            >
              Attach
            </Button>
            <ViewCode type="mint-license" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
