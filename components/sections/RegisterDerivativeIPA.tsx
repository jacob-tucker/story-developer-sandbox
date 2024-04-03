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
import { useStory } from "@/lib/context/StoryContext";
import { Address } from "viem";

export default function RegisterDerivativeIPA() {
  const { client, mintNFT, walletAddress } = useStory();
  const [licenseId, setLicenseId] = useState("");
  const [nftId, setNftId] = useState("");
  const [nftContractAddress, setNftContractAddress] = useState("");

  const mintAndRegisterNFT = async () => {
    if (!client) return;
    const tokenId = await mintNFT(walletAddress as Address);
    registerDerivativeIPA(
      tokenId,
      "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49",
      licenseId
    );
  };

  async function registerDerivativeIPA(
    tokenId: string,
    tokenContractAddress: `0x${string}`,
    licenseId: string
  ) {
    if (!client) return;
    const response = await client.ipAsset.registerDerivativeIp({
      tokenContractAddress,
      tokenId,
      licenseIds: [licenseId],
      txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
    });

    console.log(
      `Remixed IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
  }

  return (
    <div>
      <div className="flex md:flex-row gap-3 justify-center items-center flex-col">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 4a. Register existing NFT derivative</CardTitle>
            <CardDescription>
              Register an existing NFT in your wallet as a derivative of an
              existing IP Asset.
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
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="licenseId">License ID</Label>
                <Input
                  type="text"
                  id="licenseId"
                  placeholder="5"
                  onChange={(e) => setLicenseId(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={() =>
                registerDerivativeIPA(
                  nftId,
                  nftContractAddress as `0x${string}`,
                  licenseId
                )
              }
            >
              Register
            </Button>
            <ViewCode type="register-existing-nft-derivative" />
          </CardFooter>
        </Card>
        <h3>OR</h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Step 4b. Mint & register new derivative IP</CardTitle>
            <CardDescription>
              Mint a new NFT to represent your IP and register it as a
              derivative of an existing IP Asset.
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
                <Label htmlFor="licenseId">License ID</Label>
                <Input
                  type="text"
                  id="licenseId"
                  placeholder="5"
                  onChange={(e) => setLicenseId(e.target.value)}
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