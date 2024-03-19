'use client';
import 'viem/window'
import { Address, custom } from 'viem'
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount()
  console.log(account)

  async function doStuff() {
    const config: StoryConfig = {
      account: account,
      transport: custom(window.ethereum!)
    }
    const client = StoryClient.newClient(config);
    const registeredIpAsset = await client.ipAsset.registerRootIp({
      tokenContractAddress: "0x7ee32b8b515dee0ba2f25f612a04a731eec24f49" as Address,
      tokenId: '833',
      policyId: '0',
      txOptions: { waitForTransaction: true }
    })
    console.log(registeredIpAsset)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={doStuff}>Do the thing</button>
    </main>
  );
}
