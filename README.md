# Story Sandbox

This is a Next.js app, integrated with the Story SDK, API, and Protocol, intended to extend the features of the [Portal](https://portal.story.foundation) and give non-technical (and technical) users the ability to tap into all features of our protocol.

Additionally, it can be used as a quickstart for developers wanting to learn how to use the Story TypeScript SDK in React.

## Supported Actions

1. Change the minting fee of a license
2. Disable a license
3. Add new license terms

## Use the Sandbox Locally

1. Clone the repo: `git clone https://github.com/jacob-tucker/story-developer-sandbox`

2. Configure your .env

   a. Rename the `.env.example` file to `.env`

   b. Login to to [Dynamic](https://app.dynamic.xyz/). Set `NEXT_PUBLIC_DYNAMIC_ENV_ID` equal to your Environment ID, which you will get when you create a project.

   c. Get a Pinata JWT from [Pinata](https://app.pinata.cloud/). Set `PINATA_JWT` equal to your Pinata JWT.

3. Run the sandbox

   a. `npm install` in the root directory

   b. `npm run dev` in the root directory
