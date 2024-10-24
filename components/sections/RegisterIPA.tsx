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
import { Address } from "viem";
import { useState } from "react";
import { ViewCode } from "../atoms/ViewCode";
import { uploadJSONToIPFS } from "@/lib/functions/uploadJSONToIpfs";
import { useWalletClient } from "wagmi";
import CryptoJS from "crypto-js";
import { useStory } from "@/lib/context/AppContext";

export default function RegisterIPA() {
  const {
    mintNFT,
    setTxHash,
    setTxLoading,
    setTxName,
    addTransaction,
    client,
  } = useStory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const { data: wallet } = useWalletClient();

  const NFT_CONTRACT_ADDRESS: Address =
    "0xd2a4a4Cb40357773b658BECc66A6c165FD9Fc485";
  const SPG_NFT_CONTRACT_ADDRESS: Address =
    "0x9BDca7dbdd7cFB7984993e6EcEbB91DAE360f791";

  const mintThenRegisterNFT = async () => {
    if (!client) return;
    setTxLoading(true);
    setTxName("Minting an NFT so it can be registered as an IP Asset...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", image as any);

    // nft data
    const { ipfsUri, ipfsJson } = await uploadJSONToIPFS(formData);
    const tokenId = await mintNFT(wallet?.account.address as Address, ipfsUri);
    const metadataHash = CryptoJS.SHA256(
      JSON.stringify(ipfsJson || {})
    ).toString(CryptoJS.enc.Hex);

    setTxName("Registering an NFT as an IP Asset...");

    const response = await client.ipAsset.register({
      nftContract: NFT_CONTRACT_ADDRESS,
      tokenId,
      ipMetadata: {
        ipMetadataURI: "", // uri of IP metadata
        ipMetadataHash: "0x", // hash of IP metadata
        nftMetadataURI: ipfsUri, // uri of NFT metadata
        nftMetadataHash: `0x${metadataHash}`, // hash of NFT metadata
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

  const mintAndRegisterNFT = async () => {
    if (!client) return;
    setTxLoading(true);
    setTxName("Minting and registering an IP Asset...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", image as any);

    // nft data
    const { ipfsUri, ipfsJson } = await uploadJSONToIPFS(formData);

    const metadataHash = CryptoJS.SHA256(
      JSON.stringify(ipfsJson || {})
    ).toString(CryptoJS.enc.Hex);

    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: SPG_NFT_CONTRACT_ADDRESS,
      ipMetadata: {
        ipMetadataURI: "", // uri of IP metadata
        ipMetadataHash: "0x", // hash of IP metadata
        nftMetadataURI: ipfsUri, // uri of NFT metadata
        nftMetadataHash: `0x${metadataHash}`, // hash of NFT metadata
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
      <div className="flex md:flex-row gap-3 justify-center items-center flex-col">
        <Card
          className="w-[350px]"
          data-title="Step-by-Step"
          data-intro="Each step shows you how to interact with your IP."
          data-step="2"
          data-position="left"
        >
          <CardHeader>
            <CardTitle>Step 1a. Mint Then Register NFT</CardTitle>
            <CardDescription>
              Mint an NFT and then register it as an IP Asset in 2 transactions
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
            <Button onClick={mintThenRegisterNFT}>Register</Button>
            <div
              data-title="View Code"
              data-intro="You can view the code associated with each step."
              data-step="3"
            >
              <ViewCode type="mint-then-register" />
            </div>
          </CardFooter>
        </Card>
        <h3>OR</h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 1b. Mint And Register NFT</CardTitle>
            <CardDescription>
              Mint an NFT and register it as an IP Asset in 1 transaction.
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
            <Button onClick={mintAndRegisterNFT}>Register</Button>
            <ViewCode type="mint-and-register" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
