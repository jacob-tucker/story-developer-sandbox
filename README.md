# Story - Developer Sandbox

This is a Next.js app built to help you learn the Story TypeScript SDK and see its integration with a wallet like Metamask.

The sandbox will walk you through building with Story step-by-step. More specifically:

1. Registering an IP Asset
2. Attaching License Terms to that IP Asset
3. Minting a License Token from an IP Asset
4. Registering a derivative IP Asset from a License Token
5. Claiming revenue from a child IP Asset

## Get Started

### Configure your .env

1. Rename the `.env.example` file to `.env`
2. Go to [Pinata and get a JWT](https://knowledge.pinata.cloud/en/articles/6191471-how-to-create-an-pinata-api-key). Set `PINATA_JWT` equal to your JWT.
3. Login to to [Dynamic](https://app.dynamic.xyz/). Set `NEXT_PUBLIC_DYNAMIC_ENV_ID` equal to your Environment ID, which you will get when you create a project.

### Run the sandbox

1. `npm install` in the root directory
2. `npm run dev` in the root directory
