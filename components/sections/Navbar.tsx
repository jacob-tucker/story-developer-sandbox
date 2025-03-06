import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Icon } from "@iconify/react";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-950/10 bg-white p-2 sm:px-6 py-5 sm:px-8 lg:z-10 lg:flex lg:h-16 lg:items-center lg:py-0 dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto flex w-full items-center justify-between lg:max-w-7xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <a aria-label="Home" href="/">
            <img
              src="/story-logo.svg"
              className="hidden h-[1.0rem] text-zinc-950 sm:block dark:text-white forced-colors:text-[CanvasText]"
            />
          </a>
          <a
            href="https://docs.story.foundation/docs/sdk-overview"
            target="_blank"
            className="hidden sm:block"
          >
            <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/25">
                v1.3
              </div>
              SDK Version
            </div>
          </a>
          <a
            href="https://docs.story.foundation/docs/sdk-overview"
            target="_blank"
            className="block sm:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/25">
              v1.3
            </div>
          </a>
        </div>
        <div className="flex items-center gap-8">
          <a
            className="text-sm/6 font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            href="https://github.com/jacob-tucker/story-developer-sandbox"
            target="_blank"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-white/25">
              <Icon icon="tabler:brand-github" />
            </div>
          </a>
          <a
            className="text-sm/6 font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            href="https://docs.story.foundation"
            target="_blank"
          >
            Docs
          </a>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
