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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Address } from "viem";
import { useLicense } from "react-sdk57";

export default function AttachTerms() {
  const { setTxHash, setTxLoading, setTxName, addTransaction } = useStory();
  const [ipId, setIpId] = useState("");
  const [termsId, setTermsId] = useState("");
  const { attachLicenseTerms } = useLicense();

  async function attachTermsToIPA() {
    setTxLoading(true);
    setTxName("Attaching terms to an IP Asset...");
    try {
      const response = await attachLicenseTerms({
        licenseTermsId: termsId,
        ipId: ipId as Address,
        txOptions: { waitForTransaction: true },
      });
      console.log(`Attached License Terms to IP at tx hash ${response.txHash}`);
      setTxLoading(false);
      setTxHash(response.txHash);
      addTransaction(response.txHash, "Attach Terms", {});
    } catch (e) {
      console.error(e);
    }
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
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={attachTermsToIPA}>Attach</Button>
            <ViewCode type="attach-terms" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
