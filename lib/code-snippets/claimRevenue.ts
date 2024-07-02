export const claimRevenue = `
import { Address } from 'viem';
import { useRoyalty } from "react-sdk57";

export default function ClaimRevenue() {
    const { claimRevenue } = useRoyalty();

    const currencyTokenAddress: Address = ...
    const childIpId: Address = ...
    const snapshotId: string = ...

    const response = await claimRevenue({
        snapshotIds: [snapshotId],
        royaltyVaultIpId: childIpId,
        token: currencyTokenAddress,
        txOptions: { waitForTransaction: true },
    });
    console.log(\`Claimed revenue token \${response.claimableToken} at transaction hash \${response.txHash}\`);
}
`;
