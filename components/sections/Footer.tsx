export default function Footer() {
  return (
    <div className="flex-col justify-between bg-black pt-8 md:pt-16 mt-[30px]">
      <div className="text-white flex flex-col md:flex-row justify-around md:pb-16 align-center">
        <a
          className="hover:underline text-center"
          href="https://www.story.foundation/academy"
          target="_blank"
        >
          Story Academy
        </a>
        <a
          className="hover:underline text-center"
          href="https://discord.gg/storyprotocol"
          target="_blank"
        >
          Discord
        </a>
        <a
          className="hover:underline text-center"
          href="https://twitter.com/StoryProtocol"
          target="_blank"
        >
          Twitter / X
        </a>
        <a
          className="hover:underline text-center"
          href="https://github.com/storyprotocol"
          target="_blank"
        >
          GitHub
        </a>
      </div>

      <div className="flex justify-center align-center flex-row p-12">
        <svg
          className="text-white"
          width="75%"
          viewBox="0 0 401 92"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_27_4)">
            <path
              d="M354.834 89.9932H373.263V52.8671L401 2.19496H379.822L354.834 49.1043V89.9932ZM338.654 40.638H359.332L338.654 2.19496H317.914L338.654 40.638ZM297.798 32.5481C297.798 41.5787 292.926 45.9686 283.617 45.9686H265.813V19.5665H282.993C292.301 19.5665 297.798 23.5174 297.798 32.5481ZM246.76 89.9932H265.813V63.3402H283.617C284.679 63.3402 285.741 63.2774 286.803 63.2147L300.734 89.9932H321.1L304.045 57.7587C312.167 52.1772 316.102 42.9584 316.102 32.5481C316.102 15.5528 305.67 2.19496 282.993 2.19496H246.76V89.9932ZM220.459 45.9686H211.901C211.901 57.3197 203.467 65.7233 192.91 65.7233V74.3149C177.417 74.3149 166.172 61.4588 166.172 45.9686C166.172 29.2243 176.168 17.9986 192.91 17.9986C208.403 17.9986 220.459 29.8514 220.459 45.9686ZM192.91 92V82.9693C213.213 82.9693 228.456 67.1029 228.456 45.9686H237.826C237.826 20.9461 218.46 0 192.91 0C165.485 0 147.806 19.1275 147.806 45.9686C147.806 70.9911 167.359 92 192.91 92ZM101.015 89.9932H120.256V19.5037H147.931V2.13224H73.4032V19.5037H101.015V89.9932ZM34.9212 92C54.0372 92 69.53 80.4608 69.53 61.1452C69.53 42.9584 55.9738 30.2904 34.8587 30.2904V43.6483C25.1133 43.6483 17.9916 39.3838 17.9916 30.5412C17.9916 21.6987 24.1762 16.4935 35.3585 16.4935C44.5417 16.4935 50.1016 20.319 51.4759 25.3361H68.468C67.1561 11.3511 54.0372 0 34.9836 0C14.868 0 0.562237 12.6053 0.562237 31.0429C0.562237 49.4806 15.4303 60.5181 34.8587 60.5181V47.7873C45.1664 47.7873 52.2256 52.4281 52.2256 61.4588C52.2256 70.4894 44.979 75.5692 34.9212 75.5692C25.8629 75.5692 19.5534 71.5556 17.6168 66.0368H0C2.49883 80.5862 15.8051 92 34.9212 92Z"
              fill="black"
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
  );
}
