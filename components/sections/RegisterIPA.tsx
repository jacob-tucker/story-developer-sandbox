"use client";
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
import { uploadJSONToIPFS } from "@/lib/functions/uploadJSONToIpfs";
import { useWalletClient } from "wagmi";
import { useIpAsset, PIL_TYPE } from "@story-protocol/react-sdk";
import { createHash } from "crypto";

export default function RegisterIPA() {
  const { setTxHash, setTxLoading, setTxName, addTransaction } = useStory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const { data: wallet } = useWalletClient();
  const { mintAndRegisterIpAssetWithPilTerms } = useIpAsset();

  const mintAndRegisterNFT = async () => {
    if (!wallet?.account.address) return;
    setTxLoading(true);
    setTxName("Minting and registering an NFT as an IP Asset...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    //@ts-ignore
    formData.append("file", image);
    const { ipfsUri, ipfsJson } = await uploadJSONToIPFS(formData);

    const metadataHash = createHash("sha256")
      .update(JSON.stringify(ipfsJson))
      .digest("hex");
    const response = await mintAndRegisterIpAssetWithPilTerms({
      nftContract: "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791",
      pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
      ipMetadata: {
        ipMetadataURI: ipfsUri,
        ipMetadataHash: `0x${metadataHash}`,
        nftMetadataURI: ipfsUri,
        nftMetadataHash: `0x${metadataHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Root IPA created at tx hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
    setTxLoading(false);
    setTxHash(response.txHash as string);
    addTransaction(response.txHash as string, "Register IPA", {
      ipId: response.ipId,
    });
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <Card
          className="w-[350px]"
          data-title="Step-by-Step"
          data-intro="Each step shows you how to interact with your IP."
          data-step="2"
          data-position="left"
        >
          <CardHeader>
            <CardTitle>Step 1. Mint & Register NFT</CardTitle>
            <CardDescription>
              Register an existing NFT in your wallet as an IP Asset.
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
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={mintAndRegisterNFT}>Mint & Register</Button>
            <div
              data-title="View Code"
              data-intro="You can view the code associated with each step."
              data-step="3"
            >
              <ViewCode type="register-existing-nft" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
