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
import { ViewCode } from "../ViewCode";
import { useStory } from "@/lib/context/StoryContext";

export default function RegisterIPA() {
  const { client, walletAddress, mintNFT } = useStory();
  const [nftId, setNftId] = useState("");
  const [nftContractAddress, setNftContractAddress] = useState("");

  const mintAndRegisterNFT = async () => {
    if (!client) return;
    const tokenId = await mintNFT(walletAddress as Address);
    registerExistingNFT(tokenId, "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49");
  };

  const registerExistingNFT = async (
    tokenId: string,
    tokenContractAddress: `0x${string}`
  ) => {
    if (!client) return;
    const response = await client.ipAsset.registerRootIp({
      tokenContractAddress,
      tokenId,
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
  };

  return (
    <div>
      {/* <div className="flex flex-col justify-center items-center mb-[15px]">
        <h2 className="text-xl font-bold">Step 1: Register IP Asset</h2>
        <p className="text-muted-foreground md:max-w-[600px] max-w-[400px] text-center">
          Register an existing NFT as an IP Asset, or mint a new NFT to
          represent a real-world asset.
        </p>
      </div> */}
      <div className="flex md:flex-row gap-3 justify-center items-center flex-col">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 1a. Register existing NFT</CardTitle>
            <CardDescription>
              Register an existing NFT in your wallet as an IP Asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="nftId">NFT ID</Label>
                <Input
                  type="text"
                  id="nftId"
                  placeholder="12"
                  onChange={(e) => setNftId(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="nftContractAddress">NFT Contract Address</Label>
                <Input
                  type="text"
                  id="nftContractAddress"
                  placeholder="0x7ee32b8b515dee0ba2f25f612a04a731eec24f49"
                  onChange={(e) => setNftContractAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={() =>
                registerExistingNFT(nftId, nftContractAddress as `0x${string}`)
              }
            >
              Register
            </Button>
            <ViewCode type="register-existing-nft" />
          </CardFooter>
        </Card>
        <h3>OR</h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 1b. Mint & register new IP</CardTitle>
            <CardDescription>
              Mint a new NFT to represent your IP and register it as an IP
              Asset.
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
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={mintAndRegisterNFT}>Register</Button>
            <ViewCode type="register-new-nft" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
