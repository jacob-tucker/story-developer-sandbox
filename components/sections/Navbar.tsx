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
          <a
            href="https://docs.story.foundation/sdk-reference/overview"
            target="_blank"
            className="hidden sm:block"
          >
            <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
              <div className="flex h-7 w-16 items-center justify-center rounded-full bg-[#09ACFF] text-white text-xs ring-1 ring-[#066DA1]">
                v1.3.0
              </div>
              SDK
            </div>
          </a>
          <a
            href="https://docs.story.foundation/smart-contract-reference/overview"
            target="_blank"
            className="hidden sm:block"
          >
            <div className="flex items-center gap-2 rounded-full border border-dashed border-zinc-300 py-px pr-3 text-xs/6 font-medium text-zinc-900 dark:border-white/20 dark:text-white">
              <div className="flex h-7 w-16 items-center justify-center rounded-full bg-[#A1D1FF] text-black text-xs ring-1 ring-[#066DA1]">
                v1.3.2
              </div>
              Protocol
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.494C9.34 21.591 9.5 21.275 9.5 21.003V19.309C6.73 19.925 6.14 17.969 6.14 17.969C5.68 16.812 5.03 16.497 5.03 16.497C4.12 15.881 5.1 15.895 5.1 15.895C6.1 15.968 6.63 16.93 6.63 16.93C7.5 18.451 8.97 18.017 9.54 17.752C9.63 17.115 9.89 16.682 10.17 16.419C7.95 16.151 5.62 15.276 5.62 11.449C5.62 10.302 6.01 9.36 6.65 8.622C6.55 8.365 6.2 7.386 6.75 6.045C6.75 6.045 7.59 5.77 9.5 7.027C10.29 6.797 11.15 6.682 12 6.678C12.85 6.682 13.71 6.797 14.5 7.027C16.41 5.77 17.25 6.045 17.25 6.045C17.8 7.386 17.45 8.365 17.35 8.622C17.99 9.36 18.38 10.302 18.38 11.449C18.38 15.286 16.04 16.147 13.81 16.41C14.17 16.736 14.5 17.38 14.5 18.369V21.003C14.5 21.278 14.66 21.598 15.17 21.493C19.137 20.161 22 16.417 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
              </svg>
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
