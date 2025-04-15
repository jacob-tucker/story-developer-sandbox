export const setLicensingConfig = `
import { zeroAddress } from 'viem';
import { LicensingConfig } from '@story-protocol/core-sdk';

const licensingConfig: LicensingConfig = {
  mintingFee: 0n,
  isSet: true,
  licensingHook: zeroAddress,
  hookData: zeroAddress,
  commercialRevShare: 0,
  disabled: false,
  expectMinimumGroupRewardShare: 0,
  expectGroupRewardPool: zeroAddress,
};
  
const response = await client.license.setLicensingConfig({
  ipId: '0x01',
  licenseTermsId: 1,
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
