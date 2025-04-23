export const tokenLimitAbi = [
  {
    inputs: [
      { internalType: "address", name: "licenseRegistry", type: "address" },
      { internalType: "address", name: "licenseToken", type: "address" },
      { internalType: "address", name: "accessController", type: "address" },
      { internalType: "address", name: "ipAssetRegistry", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "ipAccount", type: "address" }],
    name: "AccessControlled__NotIpAccount",
    type: "error",
  },
  { inputs: [], name: "AccessControlled__ZeroAddress", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "totalSupply", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "TotalLicenseTokenLimitHook_LimitLowerThanTotalSupply",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "totalSupply", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "TotalLicenseTokenLimitHook_TotalLicenseTokenLimitExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "TotalLicenseTokenLimitHook_ZeroLicenseRegistry",
    type: "error",
  },
  {
    inputs: [],
    name: "TotalLicenseTokenLimitHook_ZeroLicenseToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "licensorIpId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "licenseTemplate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "licenseTermsId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "SetTotalLicenseTokenLimit",
    type: "event",
  },
  {
    inputs: [],
    name: "ACCESS_CONTROLLER",
    outputs: [
      { internalType: "contract IAccessController", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "IP_ASSET_REGISTRY",
    outputs: [
      { internalType: "contract IIPAssetRegistry", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LICENSE_REGISTRY",
    outputs: [
      { internalType: "contract ILicenseRegistry", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LICENSE_TOKEN",
    outputs: [
      { internalType: "contract ILicenseToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "caller", type: "address" },
      { internalType: "address", name: "licensorIpId", type: "address" },
      { internalType: "address", name: "licenseTemplate", type: "address" },
      { internalType: "uint256", name: "licenseTermsId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "bytes", name: "hookData", type: "bytes" },
    ],
    name: "beforeMintLicenseTokens",
    outputs: [
      { internalType: "uint256", name: "totalMintingFee", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "caller", type: "address" },
      { internalType: "address", name: "childIpId", type: "address" },
      { internalType: "address", name: "parentIpId", type: "address" },
      { internalType: "address", name: "licenseTemplate", type: "address" },
      { internalType: "uint256", name: "licenseTermsId", type: "uint256" },
      { internalType: "bytes", name: "hookData", type: "bytes" },
    ],
    name: "beforeRegisterDerivative",
    outputs: [{ internalType: "uint256", name: "mintingFee", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "caller", type: "address" },
      { internalType: "address", name: "licensorIpId", type: "address" },
      { internalType: "address", name: "licenseTemplate", type: "address" },
      { internalType: "uint256", name: "licenseTermsId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "bytes", name: "hookData", type: "bytes" },
    ],
    name: "calculateMintingFee",
    outputs: [
      { internalType: "uint256", name: "totalMintingFee", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "licensorIpId", type: "address" },
      { internalType: "address", name: "licenseTemplate", type: "address" },
      { internalType: "uint256", name: "licenseTermsId", type: "uint256" },
    ],
    name: "getTotalLicenseTokenLimit",
    outputs: [{ internalType: "uint256", name: "limit", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "licensorIpId", type: "address" },
      { internalType: "address", name: "licenseTemplate", type: "address" },
      { internalType: "uint256", name: "licenseTermsId", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "setTotalLicenseTokenLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "totalLicenseTokenLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
