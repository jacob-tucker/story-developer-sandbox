I would like to do a pretty decent change. Right now, Change License Minting Fee allows you to change the minting fee of an IP by utilizing the licensing config. Additionally, disabling a license allows you to disable a license using the licensing config.

I would like to combine these two, so that there is one action that allows you to set the entire licensing config. This also means allowing people to add a "Licensing Hook".

TODO:

- Make a new action, called Update Licensing Config, that allows you to both change the license minting fee and disable a license. And, have a selector for "License Hook" that has 2 options: 1) None 2) Limit License

- If Limit License is selected, also have a an input option for the # of license to limit. This can be any number the user inputs

NEXT STEP:

Awesome job! So here's the thing when the user inputs an ipId and the form auto selects the license term id, we should run a function to get the current minting fee by calling predictMintingLicenseFee, like we do in @ChangeMintingFeeForm.tsx

To get disabled status, we should use the getLicensingConfigSDK in @utils.ts , which has a `disabled` field inside of it. Additionally, this has a `licensingHook` inside of it. If it is zeroAddress or empty string, that means the licensing hook is "None". If it is the address of license limit (0xaBAD364Bfa41230272b08f171E0Ca939bD600478 on aneid and 0xB72C9812114a0Fc74D49e01385bd266A75960Cda on mainnet), then it is Limit License.

We should also define a separate function to get the current limit, if you make a function structure for this i can fill it out
