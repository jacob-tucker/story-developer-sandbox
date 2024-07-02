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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLicense } from "react-sdk57";

export default function MintLicense() {
  const { setTxHash, setTxLoading, setTxName, addTransaction } = useStory();
  const [licensorIpId, setLicensorIpId] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [termsId, setTermsId] = useState("");
  const { mintLicenseTokens } = useLicense();

  async function mintLicense() {
    setTxLoading(true);
    setTxName("Minting a License Token from an IP Asset...");
    const response = await mintLicenseTokens({
      licenseTermsId: termsId,
      licensorIpId: licensorIpId as Address,
      receiver: receiverAddress as Address,
      amount: 1,
      txOptions: { waitForTransaction: true },
    });

    console.log(
      `License minted at tx hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Mint License", {
      licenseTokenIds: response.licenseTokenIds,
    });
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 3. Mint a License Token</CardTitle>
            <CardDescription>
              Mint a License Token from an existing IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="licensorIpId">Licensor IP ID</Label>
                <Input
                  type="text"
                  id="licensorIpId"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setLicensorIpId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="termsId">Terms</Label>
                <Select onValueChange={(value) => setTermsId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pre-set terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">
                      Non-Commercial Social Remixing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="receiverAddress">Receiver Address</Label>
                <Input
                  type="text"
                  id="receiverAddress"
                  placeholder="0x6Bba939A4215b8705bCaFdD34B99876D4D36FcaC"
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={mintLicense}>Mint</Button>
            <ViewCode type="mint-license" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
