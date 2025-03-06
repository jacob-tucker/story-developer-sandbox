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
import {
  uploadImageToIPFS,
  uploadJSONToIPFS,
} from "@/lib/functions/uploadJSONToIpfs";
import { useWalletClient } from "wagmi";
import CryptoJS from "crypto-js";
import { useStory } from "@/lib/context/AppContext";
import { getFileHash } from "@/lib/functions/getFileHash";
import {
  NFT_CONTRACT_ADDRESS,
  SPG_NFT_CONTRACT_ADDRESS,
} from "@/lib/constants";

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
  const [image, setImage] = useState<File | null>(null);
  const { data: wallet } = useWalletClient();

  const mintThenRegisterNFT = async () => {
    if (!client) return;
    setTxLoading(true);
    setTxName("Uploading data to IPFS...");
    const formData = new FormData();
    formData.append("file", image as File);
    const imageIpfsHash = await uploadImageToIPFS(formData);

    /* NFT data */
    const nftData = {
      name,
      description,
      image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
    };
    const nftIpfsCid = await uploadJSONToIPFS(nftData);
    const nftMetadataHash = CryptoJS.SHA256(JSON.stringify(nftData)).toString(
      CryptoJS.enc.Hex
    );

    /* IP data */
    const ipData = client.ipAsset.generateIpMetadata({
      title: name,
      description,
      image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      imageHash: await getFileHash(image as File),
      mediaUrl: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      mediaHash: await getFileHash(image as File),
      mediaType: "image/png",
      creators: [
        {
          name: "Test Creator",
          contributionPercent: 100,
          address: wallet?.account.address as Address,
        },
      ],
    });
    const ipIpfsCid = await uploadJSONToIPFS(ipData);
    const ipMetadataHash = CryptoJS.SHA256(JSON.stringify(ipData)).toString(
      CryptoJS.enc.Hex
    );

    // mint NFT
    setTxName("Minting an NFT so it can be registered as an IP Asset...");
    const tokenId = await mintNFT(
      wallet?.account.address as Address,
      `https://ipfs.io/ipfs/${nftIpfsCid}`
    );
    if (!tokenId) return;
    // register IPA
    setTxName("Registering an NFT as an IP Asset...");
    const response = await client.ipAsset.register({
      nftContract: NFT_CONTRACT_ADDRESS,
      tokenId,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsCid}`, // uri of IP metadata
        ipMetadataHash: `0x${ipMetadataHash}`, // hash of IP metadata
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsCid}`, // uri of NFT metadata
        nftMetadataHash: `0x${nftMetadataHash}`, // hash of NFT metadata
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
    setTxName("Uploading data to IPFS...");

    const formData = new FormData();
    formData.append("file", image as File);
    const imageIpfsHash = await uploadImageToIPFS(formData);

    /* NFT data */
    const nftData = {
      name,
      description,
      image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
    };
    const nftIpfsCid = await uploadJSONToIPFS(nftData);
    const nftMetadataHash = CryptoJS.SHA256(JSON.stringify(nftData)).toString(
      CryptoJS.enc.Hex
    );

    /* IP data */
    const ipData = client.ipAsset.generateIpMetadata({
      title: name,
      description,
      image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      imageHash: await getFileHash(image as File),
      mediaUrl: `https://ipfs.io/ipfs/${imageIpfsHash}`,
      mediaHash: await getFileHash(image as File),
      mediaType: "image/png",
      creators: [
        {
          name: "Test Creator",
          contributionPercent: 100,
          address: wallet?.account.address as Address,
        },
      ],
    });
    const ipIpfsCid = await uploadJSONToIPFS(ipData);
    const ipMetadataHash = CryptoJS.SHA256(JSON.stringify(ipData)).toString(
      CryptoJS.enc.Hex
    );

    setTxName("Minting and registering an IP Asset...");
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: SPG_NFT_CONTRACT_ADDRESS,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsCid}`, // uri of IP metadata
        ipMetadataHash: `0x${ipMetadataHash}`, // hash of IP metadata
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsCid}`, // uri of NFT metadata
        nftMetadataHash: `0x${nftMetadataHash}`, // hash of NFT metadata
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
