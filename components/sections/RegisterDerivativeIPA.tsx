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
import { uploadJSONToIPFS } from "@/lib/functions/uploadJSONToIpfs";
import { useWalletClient } from "wagmi";
import CryptoJS from "crypto-js";

export default function RegisterDerivativeIPA() {
  const {
    mintNFT,
    setTxLoading,
    setTxName,
    setTxHash,
    addTransaction,
    client,
  } = useStory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [licenseTokenId, setLicenseTokenId] = useState("");

  const SPG_NFT_CONTRACT_ADDRESS: Address =
    "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791";

  async function registerDerivative() {
    if (!client) return;
    setTxLoading(true);
    setTxName("Registering an NFT as an IP Asset...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", image as any);

    // nft data
    const { ipfsUri, ipfsJson } = await uploadJSONToIPFS(formData);
    // Hash the string using SHA-256 and convert the result to hex
    const metadataHash = CryptoJS.SHA256(
      JSON.stringify(ipfsJson || {})
    ).toString(CryptoJS.enc.Hex);

    const response =
      await client.ipAsset.mintAndRegisterIpAndMakeDerivativeWithLicenseTokens({
        spgNftContract: SPG_NFT_CONTRACT_ADDRESS, // your SPG NFT contract address
        licenseTokenIds: [licenseTokenId],
        ipMetadata: {
          ipMetadataURI: "", // uri of IP metadata
          ipMetadataHash: "0x", // hash of IP metadata
          nftMetadataURI: ipfsUri, // uri of NFT metadata
          nftMetadataHash: `0x${metadataHash}`, // hash of NFT metadata
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
            <CardTitle>Step 4. Register a Derivative IP</CardTitle>
            <CardDescription>
              Mint an NFT and register it as a derivative IP using a License
              Token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Doge"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  placeholder="doge wif hat"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image">Image</Label>
                <Input
                  type="file"
                  id="image"
                  // @ts-ignore
                  onChange={(e) => setImage(e.target.files[0])}
                />
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
            <Button onClick={registerDerivative}>Register</Button>
            <ViewCode type="register-derivative" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
