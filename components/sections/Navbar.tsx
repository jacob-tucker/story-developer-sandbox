import { Button } from "@/components/ui/button";
import { useStory } from "@/lib/context/StoryContext";
import { Icon } from "@iconify/react";

export default function Navbar() {
  const { initializeStoryClient, logout, walletAddress } = useStory();
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-950/10 bg-white px-6 py-5 sm:px-8 lg:z-10 lg:flex lg:h-16 lg:items-center lg:py-0 dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto flex w-full items-center justify-between lg:max-w-7xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <a aria-label="Home" href="/">
            <img
              src="/story-logo.svg"
              className="hidden h-[1.0rem] text-zinc-950 sm:block dark:text-white forced-colors:text-[CanvasText]"
            />
          </a>
          <a
            href="https://docs.storyprotocol.xyz/v1/docs/sdk-overview"
            target="_blank"
          >
            <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pl-1 pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/25">
                <Icon icon="tabler:flask-2" />
              </div>
              SDK Version: v1
            </div>
          </a>
        </div>
        <div className="flex items-center gap-8">
          <a
            className="text-sm/6 font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            href="https://docs.storyprotocol.xyz/v1/docs/what-is-story-protocol"
            target="_blank"
          >
            Docs
          </a>
          {walletAddress ? (
            <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pl-1 pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/25">
                <Icon icon="tabler:wallet" />
              </div>
              {walletAddress.substring(0, 7)}...
            </div>
          ) : null}
          {!walletAddress ? (
            <Button
              className="text-xs gap-2 p-[0.5rem] h-8"
              onClick={initializeStoryClient}
            >
              <Icon icon="tabler:wallet" />
              Connect
            </Button>
          ) : (
            <Button className="text-xs gap-2 p-[0.5rem] h-8" onClick={logout}>
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
