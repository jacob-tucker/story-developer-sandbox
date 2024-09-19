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
import { useIpAsset } from "@story-protocol/react-sdk";
import { createHash } from "crypto";

export default function RegisterDerivativeIPA() {
  const { setTxLoading, setTxName, setTxHash, addTransaction } = useStory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [licenseId, setLicenseId] = useState("");
  const [parentIpId, setParentIpId] = useState("");
  const { data: wallet } = useWalletClient();
  const { mintAndRegisterIpAndMakeDerivative } = useIpAsset();

  const mintAndRegisterNFT = async () => {
    if (!wallet?.account.address) return;
    setTxLoading(true);
    setTxName(
      "Minting an NFT and registering it as a derivative of an IP Asset..."
    );
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    //@ts-ignore
    formData.append("file", image);
    const { ipfsUri, ipfsJson } = await uploadJSONToIPFS(formData);

    const metadataHash = createHash("sha256")
      .update(JSON.stringify(ipfsJson))
      .digest("hex");
    const registerResponse = await mintAndRegisterIpAndMakeDerivative({
      nftContract: "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791",
      derivData: {
        parentIpIds: [parentIpId as Address],
        licenseTermsIds: [licenseId],
      },
      ipMetadata: {
        ipMetadataURI: ipfsUri,
        ipMetadataHash: `0x${metadataHash}`,
        nftMetadataURI: ipfsUri,
        nftMetadataHash: `0x${metadataHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `IPA created at tx hash ${registerResponse.txHash}, IPA ID: ${registerResponse.childIpId}`
    );
    setTxLoading(false);
    setTxHash(registerResponse.txHash as string);
    addTransaction(registerResponse.txHash as string, "Register IPA", {
      ipId: registerResponse.childIpId,
    });
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 4. Mint & register new derivative IP</CardTitle>
            <CardDescription>
              Mint a new NFT to represent your IP and register it as a
              derivative of an existing IP Asset.
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
                  //@ts-ignore
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="licenseId">License ID</Label>
                <Input
                  type="text"
                  id="licenseId"
                  placeholder="5"
                  onChange={(e) => setLicenseId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="parentIpId">Parent IP ID</Label>
                <Input
                  type="text"
                  id="parentIpId"
                  placeholder="0x0123456789012345678901234567890123456789"
                  onChange={(e) => setParentIpId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={mintAndRegisterNFT}>Register</Button>
            <ViewCode type="register-new-nft-derivative" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
