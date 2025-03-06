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
import { Address, toHex } from "viem";
import { SPG_NFT_CONTRACT_ADDRESS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function RegisterDerivativeIPA() {
  const { setTxLoading, setTxName, setTxHash, addTransaction, client } =
    useStory();
  const [licenseTokenId, setLicenseTokenId] = useState("");
  const [parentIpId, setParentIpId] = useState("");
  const [licenseTermsId, setLicenseTermsId] = useState("");

  async function registerDerivativeLicenseToken() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Registering a derivative IP with a License Token...");

    const response =
      await client.ipAsset.mintAndRegisterIpAndMakeDerivativeWithLicenseTokens({
        spgNftContract: SPG_NFT_CONTRACT_ADDRESS, // your SPG NFT contract address
        licenseTokenIds: [licenseTokenId],
        // just use dummy metadata
        ipMetadata: {
          ipMetadataURI: "test-uri", // uri of IP metadata
          ipMetadataHash: toHex("test-metadata-hash", { size: 32 }), // hash of IP metadata
          nftMetadataURI: "test-uri", // uri of NFT metadata
          nftMetadataHash: toHex("test-metadata-hash", { size: 32 }), // hash of NFT metadata
        },
        maxRts: 100_000_000,
        txOptions: { waitForTransaction: true },
      });
    console.log(
      `IPA created at tx hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Register IPA Derivative", {
      ipId: response.ipId,
    });
  }

  async function registerDerivative() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Registering a derivative IP...");

    const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
      spgNftContract: SPG_NFT_CONTRACT_ADDRESS, // your SPG NFT contract address
      derivData: {
        parentIpIds: [parentIpId as Address],
        licenseTermsIds: [licenseTermsId],
      },
      // just use dummy metadata
      ipMetadata: {
        ipMetadataURI: "test-uri", // uri of IP metadata
        ipMetadataHash: toHex("test-metadata-hash", { size: 32 }), // hash of IP metadata
        nftMetadataURI: "test-uri", // uri of NFT metadata
        nftMetadataHash: toHex("test-metadata-hash", { size: 32 }), // hash of NFT metadata
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `IPA created at tx hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Register IPA Derivative", {
      ipId: response.ipId,
    });
  }

  return (
    <div>
      <div className="flex md:flex-row gap-3 justify-center items-center flex-col">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>
              Step 4a. Register a Derivative w/ License Tokens
            </CardTitle>
            <CardDescription>
              Mint an NFT and register it as a derivative IP by burning a
              License Token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" placeholder="Doge" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  placeholder="doge wif hat"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="licenseTokenId">License Token ID</Label>
                <Input
                  type="text"
                  id="licenseTokenId"
                  placeholder="5"
                  onChange={(e) => setLicenseTokenId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={registerDerivativeLicenseToken}>Register</Button>
            <ViewCode type="register-derivative-license-token" />
          </CardFooter>
        </Card>
        <h3>OR</h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 4b. Register a Derivative</CardTitle>
            <CardDescription>
              Mint an NFT and register a derivative IP without a License Token
              (mints and burns it automatically).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" placeholder="Doge" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  placeholder="doge wif hat"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" />
              </div>
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
                <Label htmlFor="termsId">Terms</Label>
                <Select onValueChange={(value) => setLicenseTermsId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pre-set terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      Non-Commercial Social Remixing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={registerDerivative}>Register</Button>
            <ViewCode type="register-derivative" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
