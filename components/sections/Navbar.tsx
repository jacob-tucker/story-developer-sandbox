import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-950/10 bg-white p-2 sm:px-6 py-5 sm:px-8 lg:z-10 lg:flex lg:h-16 lg:items-center lg:py-0 dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto flex w-full items-center justify-between lg:max-w-7xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <a aria-label="Home" href="/">
            <img
              src="/story-logo.svg"
              className="h-[1.0rem] text-zinc-950 dark:text-white forced-colors:text-[CanvasText]"
            />
          </a>
          <div className="hidden sm:flex flex-col gap-1">
            <a
              href="https://docs.story.foundation/sdk-reference/overview"
              target="_blank"
              className="flex items-center"
            >
              <div className="relative flex items-center rounded-full border border-dashed border-zinc-300 pr-2 pl-12 py-px text-[10px] font-medium text-zinc-900 dark:border-white/20 dark:text-white">
                <div className="absolute left-0 flex h-[18px] w-[30px] items-center justify-center rounded-full bg-[#09ACFF] text-white text-[9px] ring-1 ring-[#066DA1]">
                  v1.3.0
                </div>
                <span>SDK</span>
              </div>
            </a>
            <a
              href="https://docs.story.foundation/smart-contract-reference/overview"
              target="_blank"
              className="flex items-center"
            >
              <div className="relative flex items-center rounded-full border border-dashed border-zinc-300 pr-2 pl-12 py-px text-[10px] font-medium text-zinc-900 dark:border-white/20 dark:text-white">
                <div className="absolute left-0 flex h-[18px] w-[30px] items-center justify-center rounded-full bg-[#A1D1FF] text-black text-[9px] ring-1 ring-[#066DA1]">
                  v1.3.2
                </div>
                <span>Protocol</span>
              </div>
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
