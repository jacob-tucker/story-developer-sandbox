export const attachTerms = `
import { zeroAddress, parseEther } from 'viem';
import { LicenseTerms } from '@story-protocol/core-sdk';

const IP_ID: Address = 'INSERT_IP_ID_HERE';
const MINTING_FEE: string = 10;
const COMMERCIAL_REV_SHARE: number = 10;
const AI_TRAINING_ALLOWED: boolean = true;

const licenseTerms: LicenseTerms = {
    transferable: true,
    royaltyPolicy: '0x9156e603C949481883B1d3355c6f1132D191fC41',
    defaultMintingFee: parseEther(MINTING_FEE),
    expiration: BigInt(0),
    commercialUse: MINTING_FEE && parseFloat(MINTING_FEE) > 0 ? true : false,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: COMMERCIAL_REV_SHARE,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: "0x1514000000000000000000000000000000000000",
    uri: AI_TRAINING_ALLOWED
    ? "https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/CC-BY.json"
    : "https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/Default.json",
};

const response = await client.ipAsset.registerPilTermsAndAttach({
    ipId: IP_ID,
    licenseTermsData: [{ terms: licenseTerms }],
    txOptions: { waitForTransaction: true },
});
`;
