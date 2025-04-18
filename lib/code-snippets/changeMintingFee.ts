export const changeMintingFee = `
import { zeroAddress, zeroHash } from 'viem';
import { LicensingConfig } from '@story-protocol/core-sdk';

const licensingConfig: LicensingConfig = {
  mintingFee: INSERT_MINTING_FEE_HERE, // set a new minting fee here
  isSet: true,
  licensingHook: zeroAddress,
  hookData: zeroHash,
  commercialRevShare: 0,
  disabled: false,
  expectMinimumGroupRewardShare: 0,
  expectGroupRewardPool: zeroAddress,
};

const IP_ID: Address = 'INSERT_IP_ID_HERE';
const LICENSE_TERMS_ID: string = 'INSERT_LICENSE_TERMS_ID_HERE';

const response = await client.license.setLicensingConfig({
  ipId: IP_ID,
  licenseTermsId: LICENSE_TERMS_ID,
  licensingConfig,
  txOptions: {
    waitForTransaction: true,
  },
});
  
if (response.success) {
  console.log(\`Successfully updated licensing config at transaction hash \${response.txHash}.\`);
} else {
  console.log("Failed to update licensing config.");
}
`;
