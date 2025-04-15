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
          <div className="hidden sm:flex flex-col gap-1">
            <a
              className="flex items-center"
              href="https://github.com/jacob-tucker/story-developer-sandbox"
              target="_blank"
              aria-label="GitHub"
            >
              <div className="relative flex items-center rounded-full border border-dashed border-zinc-300 pr-2 pl-9 py-px text-[10px] font-medium text-zinc-900 dark:border-white/20 dark:text-white hover:bg-[#E6F7FF] transition-colors">
                <div className="absolute left-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0096D6] text-white ring-1 ring-[#D1ECFF]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.494C9.34 21.591 9.5 21.275 9.5 21.003V19.309C6.73 19.925 6.14 17.969 6.14 17.969C5.68 16.812 5.03 16.497 5.03 16.497C4.12 15.881 5.1 15.895 5.1 15.895C6.1 15.968 6.63 16.93 6.63 16.93C7.5 18.451 8.97 18.017 9.54 17.752C9.63 17.115 9.89 16.682 10.17 16.419C7.95 16.151 5.62 15.276 5.62 11.449C5.62 10.302 6.01 9.36 6.65 8.622C6.55 8.365 6.2 7.386 6.75 6.045C6.75 6.045 7.59 5.77 9.5 7.027C10.29 6.797 11.15 6.682 12 6.678C12.85 6.682 13.71 6.797 14.5 7.027C16.41 5.77 17.25 6.045 17.25 6.045C17.8 7.386 17.45 8.365 17.35 8.622C17.99 9.36 18.38 10.302 18.38 11.449C18.38 15.286 16.04 16.147 13.81 16.41C14.17 16.736 14.5 17.38 14.5 18.369V21.003C14.5 21.278 14.66 21.598 15.17 21.493C19.137 20.161 22 16.417 22 12C22 6.477 17.523 2 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span>GitHub</span>
              </div>
            </a>
            <a
              className="flex items-center"
              href="https://docs.story.foundation"
              target="_blank"
            >
              <div className="relative flex items-center rounded-full border border-dashed border-zinc-300 pr-2 pl-9 py-px text-[10px] font-medium text-zinc-900 dark:border-white/20 dark:text-white hover:bg-[#E6F7FF] transition-colors">
                <div className="absolute left-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0096D6] text-white ring-1 ring-[#D1ECFF]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span>Docs</span>
              </div>
            </a>
          </div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
