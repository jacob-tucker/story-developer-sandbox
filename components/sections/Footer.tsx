export default function Footer() {
  return (
    <div className="flex-col justify-between bg-black pt-6 mt-[30px]">
      <div className="container mx-auto px-4">
        {/* Version badges section */}
        <div className="flex justify-center gap-4 mb-4 pb-4 border-b border-gray-800">
          <a
            href="https://docs.story.foundation/sdk-reference/overview"
            target="_blank"
            className="flex items-center"
          >
            <div className="relative flex items-center rounded-full border border-dashed border-white pr-2 pl-14 py-1 text-xs font-medium text-white hover:border-[#09ACFF] transition-colors">
              <div className="absolute left-0 flex h-[22px] w-[36px] items-center justify-center rounded-full bg-[#09ACFF] text-white text-xs ring-1 ring-white">
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
            <div className="relative flex items-center rounded-full border border-dashed border-white pr-2 pl-14 py-1 text-xs font-medium text-white hover:border-[#09ACFF] transition-colors">
              <div className="absolute left-0 flex h-[22px] w-[36px] items-center justify-center rounded-full bg-[#A1D1FF] text-black text-xs ring-1 ring-white">
                v1.3.2
              </div>
              <span>Protocol</span>
            </div>
          </a>
        </div>

        {/* Links section with icons */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pb-6 text-white text-sm">
          <a
            className="flex items-center gap-1.5 hover:text-[#09ACFF] transition-colors"
            href="https://discord.gg/storybuilders"
            target="_blank"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.9-.608 1.3A16.65 16.65 0 0 0 8.274 4.38c-.164-.4-.397-.911-.608-1.3a.077.077 0 0 0-.079-.036 19.86 19.86 0 0 0-4.885 1.49.07.07 0 0 0-.032.027C.533 9.04-.32 13.45.099 17.8a.082.082 0 0 0 .031.057 20.03 20.03 0 0 0 6.031 3.056c.079.036.169-.021.21-.1.577-.792 1.09-1.626 1.53-2.505a.076.076 0 0 0-.041-.106 13.2 13.2 0 0 1-1.88-.9.077.077 0 0 1-.008-.127c.127-.095.253-.193.375-.293a.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.122.1.248.198.375.293a.077.077 0 0 1-.006.127 12.392 12.392 0 0 1-1.883.9.077.077 0 0 0-.041.107c.445.878.958 1.712 1.53 2.504.04.078.132.137.21.1a19.961 19.961 0 0 0 6.03-3.056.076.076 0 0 0 .032-.054c.5-5.177-.838-9.543-3.549-13.285a.06.06 0 0 0-.031-.03Z" />
            </svg>
            Discord
          </a>
          <a
            className="flex items-center gap-1.5 hover:text-[#09ACFF] transition-colors"
            href="https://twitter.com/StoryProtocol"
            target="_blank"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
            </svg>
            Twitter
          </a>
          <a
            className="flex items-center gap-1.5 hover:text-[#09ACFF] transition-colors"
            href="https://github.com/jacob-tucker/story-developer-sandbox"
            target="_blank"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Sandbox
          </a>
          <a
            className="flex items-center gap-1.5 hover:text-[#09ACFF] transition-colors"
            href="https://docs.story.foundation"
            target="_blank"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
              <path d="M8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
            </svg>
            Docs
          </a>
        </div>

        {/* Logo */}
        <div className="flex justify-center align-center flex-row py-6 border-t border-gray-800">
          <svg
            className="text-white"
            width="120"
            viewBox="0 0 401 92"
            fill="currentColor"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_27_4)">
              <path
                d="M354.834 89.9932H373.263V52.8671L401 2.19496H379.822L354.834 49.1043V89.9932ZM338.654 40.638H359.332L338.654 2.19496H317.914L338.654 40.638ZM297.798 32.5481C297.798 41.5787 292.926 45.9686 283.617 45.9686H265.813V19.5665H282.993C292.301 19.5665 297.798 23.5174 297.798 32.5481ZM246.76 89.9932H265.813V63.3402H283.617C284.679 63.3402 285.741 63.2774 286.803 63.2147L300.734 89.9932H321.1L304.045 57.7587C312.167 52.1772 316.102 42.9584 316.102 32.5481C316.102 15.5528 305.67 2.19496 282.993 2.19496H246.76V89.9932ZM220.459 45.9686H211.901C211.901 57.3197 203.467 65.7233 192.91 65.7233V74.3149C177.417 74.3149 166.172 61.4588 166.172 45.9686C166.172 29.2243 176.168 17.9986 192.91 17.9986C208.403 17.9986 220.459 29.8514 220.459 45.9686ZM192.91 92V82.9693C213.213 82.9693 228.456 67.1029 228.456 45.9686H237.826C237.826 20.9461 218.46 0 192.91 0C165.485 0 147.806 19.1275 147.806 45.9686C147.806 70.9911 167.359 92 192.91 92ZM101.015 89.9932H120.256V19.5037H147.931V2.13224H73.4032V19.5037H101.015V89.9932ZM34.9212 92C54.0372 92 69.53 80.4608 69.53 61.1452C69.53 42.9584 55.9738 30.2904 34.8587 30.2904V43.6483C25.1133 43.6483 17.9916 39.3838 17.9916 30.5412C17.9916 21.6987 24.1762 16.4935 35.3585 16.4935C44.5417 16.4935 50.1016 20.319 51.4759 25.3361H68.468C67.1561 11.3511 54.0372 0 34.9836 0C14.868 0 0.562237 12.6053 0.562237 31.0429C0.562237 49.4806 15.4303 60.5181 34.8587 60.5181V47.7873C45.1664 47.7873 52.2256 52.4281 52.2256 61.4588C52.2256 70.4894 44.979 75.5692 34.9212 75.5692C25.8629 75.5692 19.5534 71.5556 17.6168 66.0368H0C2.49883 80.5862 15.8051 92 34.9212 92Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_27_4">
                <rect width="401" height="92" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
