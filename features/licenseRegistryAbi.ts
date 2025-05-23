export const licenseRegistryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "groupIpAssetRegistry",
        internalType: "address",
        type: "address",
      },
      { name: "licensingModule", internalType: "address", type: "address" },
      { name: "disputeModule", internalType: "address", type: "address" },
      { name: "ipGraphAcl", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    inputs: [{ name: "authority", internalType: "address", type: "address" }],
    name: "AccessManagedInvalidAuthority",
  },
  {
    type: "error",
    inputs: [
      { name: "caller", internalType: "address", type: "address" },
      { name: "delay", internalType: "uint32", type: "uint32" },
    ],
    name: "AccessManagedRequiredDelay",
  },
  {
    type: "error",
    inputs: [{ name: "caller", internalType: "address", type: "address" }],
    name: "AccessManagedUnauthorized",
  },
  {
    type: "error",
    inputs: [{ name: "target", internalType: "address", type: "address" }],
    name: "AddressEmptyCode",
  },
  {
    type: "error",
    inputs: [
      { name: "implementation", internalType: "address", type: "address" },
    ],
    name: "ERC1967InvalidImplementation",
  },
  { type: "error", inputs: [], name: "ERC1967NonPayable" },
  { type: "error", inputs: [], name: "FailedCall" },
  { type: "error", inputs: [], name: "InvalidInitialization" },
  {
    type: "error",
    inputs: [
      { name: "childIpId", internalType: "address", type: "address" },
      { name: "parentIpIds", internalType: "address[]", type: "address[]" },
    ],
    name: "LicenseRegistry__AddParentIpToIPGraphFailed",
  },
  { type: "error", inputs: [], name: "LicenseRegistry__CallFailed" },
  {
    type: "error",
    inputs: [],
    name: "LicenseRegistry__CallerNotLicensingModule",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__CannotAddIpWithExpirationToGroup",
  },
  {
    type: "error",
    inputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__DerivativeAlreadyRegistered",
  },
  {
    type: "error",
    inputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__DerivativeIpAlreadyHasChild",
  },
  {
    type: "error",
    inputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__DerivativeIpAlreadyHasLicense",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__DerivativeIsParent",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "parentIpId", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__DuplicateParentIp",
  },
  {
    type: "error",
    inputs: [{ name: "groupId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__EmptyGroupCannotMintLicenseToken",
  },
  {
    type: "error",
    inputs: [{ name: "groupId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__GroupCannotHasParentIp",
  },
  {
    type: "error",
    inputs: [{ name: "groupId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__GroupIpAlreadyHasLicenseTerms",
  },
  {
    type: "error",
    inputs: [
      { name: "groupId", internalType: "address", type: "address" },
      { name: "ipCommercialRevShare", internalType: "uint32", type: "uint32" },
      {
        name: "groupCommercialRevShare",
        internalType: "uint32",
        type: "uint32",
      },
    ],
    name: "LicenseRegistry__GroupIpCommercialRevShareConfigMustNotLessThanIp",
  },
  {
    type: "error",
    inputs: [
      { name: "childIpId", internalType: "address", type: "address" },
      { name: "groupId", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__GroupMustBeSoleParent",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
      { name: "length", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__IndexOutOfBounds",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      {
        name: "expectGroupRewardPool",
        internalType: "address",
        type: "address",
      },
      { name: "groupId", internalType: "address", type: "address" },
      { name: "groupRewardPool", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__IpExpectGroupRewardPoolNotMatch",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__IpExpectGroupRewardPoolNotSet",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__IpExpired",
  },
  {
    type: "error",
    inputs: [
      { name: "groupId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__IpHasNoGroupLicenseTerms",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__IpLicenseDisabled",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
      { name: "groupHookData", internalType: "bytes", type: "bytes" },
    ],
    name: "LicenseRegistry__IpLicensingHookDataNotMatchWithGroup",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licensingHook", internalType: "address", type: "address" },
      { name: "groupLicensingHook", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__IpLicensingHookNotMatchWithGroup",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "mintingFee", internalType: "uint256", type: "uint256" },
      { name: "groupMintingFee", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__IpMintingFeeNotMatchWithGroup",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__LicenseTermsAlreadyAttached",
  },
  {
    type: "error",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__LicenseTermsCannotAttachToGroupIp",
  },
  {
    type: "error",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__LicenseTermsNotExists",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__LicensorIpHasNoLicenseTerms",
  },
  {
    type: "error",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__NotLicenseTemplate",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__ParentIpExpired",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__ParentIpHasNoLicenseTerms",
  },
  {
    type: "error",
    inputs: [{ name: "groupId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__ParentIpIsEmptyGroup",
  },
  {
    type: "error",
    inputs: [{ name: "parentIpId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__ParentIpNotRegistered",
  },
  {
    type: "error",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "LicenseRegistry__ParentIpTagged",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__ParentIpUnmatchedLicenseTemplate",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "ancestors", internalType: "uint256", type: "uint256" },
      { name: "maxAncestors", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__TooManyAncestors",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "parents", internalType: "uint256", type: "uint256" },
      { name: "maxParents", internalType: "uint256", type: "uint256" },
    ],
    name: "LicenseRegistry__TooManyParents",
  },
  {
    type: "error",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "newLicenseTemplate", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__UnmatchedLicenseTemplate",
  },
  {
    type: "error",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
    ],
    name: "LicenseRegistry__UnregisteredLicenseTemplate",
  },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroAccessManager" },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroDisputeModule" },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroGroupIpRegistry" },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroIPGraphACL" },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroLicenseTemplate" },
  { type: "error", inputs: [], name: "LicenseRegistry__ZeroLicensingModule" },
  {
    type: "error",
    inputs: [],
    name: "LicensingModule__DerivativesCannotAddLicenseTerms",
  },
  {
    type: "error",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "LicensingModule__LicenseTermsNotFound",
  },
  { type: "error", inputs: [], name: "NotInitializing" },
  { type: "error", inputs: [], name: "RoyaltyModule__CallFailed" },
  { type: "error", inputs: [], name: "UUPSUnauthorizedCallContext" },
  {
    type: "error",
    inputs: [{ name: "slot", internalType: "bytes32", type: "bytes32" }],
    name: "UUPSUnsupportedProxiableUUID",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "authority",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "AuthorityUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "licenseTemplate",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "licenseTermsId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "DefaultLicenseTermsSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "ipId", internalType: "address", type: "address", indexed: true },
      {
        name: "expireTime",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "ExpirationTimeSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "version",
        internalType: "uint64",
        type: "uint64",
        indexed: false,
      },
    ],
    name: "Initialized",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "licenseTemplate",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "LicenseTemplateRegistered",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "ipId", internalType: "address", type: "address", indexed: true },
      {
        name: "licenseTemplate",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "licenseTermsId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "licensingConfig",
        internalType: "struct Licensing.LicensingConfig",
        type: "tuple",
        components: [
          { name: "isSet", internalType: "bool", type: "bool" },
          { name: "mintingFee", internalType: "uint256", type: "uint256" },
          { name: "licensingHook", internalType: "address", type: "address" },
          { name: "hookData", internalType: "bytes", type: "bytes" },
          {
            name: "commercialRevShare",
            internalType: "uint32",
            type: "uint32",
          },
          { name: "disabled", internalType: "bool", type: "bool" },
          {
            name: "expectMinimumGroupRewardShare",
            internalType: "uint32",
            type: "uint32",
          },
          {
            name: "expectGroupRewardPool",
            internalType: "address",
            type: "address",
          },
        ],
        indexed: false,
      },
    ],
    name: "LicensingConfigSetForLicense",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "implementation",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Upgraded",
  },
  {
    type: "function",
    inputs: [],
    name: "DISPUTE_MODULE",
    outputs: [
      { name: "", internalType: "contract IDisputeModule", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "EXPIRATION_TIME",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "GROUP_IP_ASSET_REGISTRY",
    outputs: [
      {
        name: "",
        internalType: "contract IGroupIPAssetRegistry",
        type: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "IP_GRAPH",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "IP_GRAPH_ACL",
    outputs: [
      { name: "", internalType: "contract IPGraphACL", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "LICENSING_MODULE",
    outputs: [
      { name: "", internalType: "contract ILicensingModule", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MAX_ANCESTORS",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MAX_PARENTS",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "attachLicenseTermsToIp",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "authority",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "exists",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "getAncestorsCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
    ],
    name: "getAttachedLicenseTerms",
    outputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "getAttachedLicenseTermsCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getDefaultLicenseTerms",
    outputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "parentIpId", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
    ],
    name: "getDerivativeIp",
    outputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "parentIpId", internalType: "address", type: "address" }],
    name: "getDerivativeIpCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "getExpireTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "getLicensingConfig",
    outputs: [
      {
        name: "",
        internalType: "struct Licensing.LicensingConfig",
        type: "tuple",
        components: [
          { name: "isSet", internalType: "bool", type: "bool" },
          { name: "mintingFee", internalType: "uint256", type: "uint256" },
          { name: "licensingHook", internalType: "address", type: "address" },
          { name: "hookData", internalType: "bytes", type: "bytes" },
          {
            name: "commercialRevShare",
            internalType: "uint32",
            type: "uint32",
          },
          { name: "disabled", internalType: "bool", type: "bool" },
          {
            name: "expectMinimumGroupRewardShare",
            internalType: "uint32",
            type: "uint32",
          },
          {
            name: "expectGroupRewardPool",
            internalType: "address",
            type: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "childIpId", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
    ],
    name: "getParentIp",
    outputs: [{ name: "parentIpId", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    name: "getParentIpCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "childIpId", internalType: "address", type: "address" },
      { name: "parentIpId", internalType: "address", type: "address" },
    ],
    name: "getParentLicenseTerms",
    outputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "getRoyaltyPercent",
    outputs: [
      { name: "royaltyPercent", internalType: "uint32", type: "uint32" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "parentIpId", internalType: "address", type: "address" }],
    name: "hasDerivativeIps",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "hasIpAttachedLicenseTerms",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "accessManager", internalType: "address", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "isConsumingScheduledOp",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "isDefaultLicense",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "childIpId", internalType: "address", type: "address" }],
    name: "isDerivativeIp",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "ipId", internalType: "address", type: "address" }],
    name: "isExpiredNow",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "parentIpId", internalType: "address", type: "address" },
      { name: "childIpId", internalType: "address", type: "address" },
    ],
    name: "isParentIp",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
    ],
    name: "isRegisteredLicenseTemplate",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "childIpId", internalType: "address", type: "address" },
      { name: "parentIpIds", internalType: "address[]", type: "address[]" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsIds", internalType: "uint256[]", type: "uint256[]" },
      { name: "isUsingLicenseToken", internalType: "bool", type: "bool" },
    ],
    name: "registerDerivativeIp",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "licenseTemplate", internalType: "address", type: "address" },
    ],
    name: "registerLicenseTemplate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newAuthority", internalType: "address", type: "address" },
    ],
    name: "setAuthority",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newLicenseTemplate", internalType: "address", type: "address" },
      { name: "newLicenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "setDefaultLicenseTerms",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "ipId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
      {
        name: "licensingConfig",
        internalType: "struct Licensing.LicensingConfig",
        type: "tuple",
        components: [
          { name: "isSet", internalType: "bool", type: "bool" },
          { name: "mintingFee", internalType: "uint256", type: "uint256" },
          { name: "licensingHook", internalType: "address", type: "address" },
          { name: "hookData", internalType: "bytes", type: "bytes" },
          {
            name: "commercialRevShare",
            internalType: "uint32",
            type: "uint32",
          },
          { name: "disabled", internalType: "bool", type: "bool" },
          {
            name: "expectMinimumGroupRewardShare",
            internalType: "uint32",
            type: "uint32",
          },
          {
            name: "expectGroupRewardPool",
            internalType: "address",
            type: "address",
          },
        ],
      },
    ],
    name: "setLicensingConfigForLicense",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newImplementation", internalType: "address", type: "address" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "groupId", internalType: "address", type: "address" },
      { name: "groupRewardPool", internalType: "address", type: "address" },
      { name: "ipId", internalType: "address", type: "address" },
      {
        name: "groupLicenseTemplate",
        internalType: "address",
        type: "address",
      },
      { name: "groupLicenseTermsId", internalType: "uint256", type: "uint256" },
    ],
    name: "verifyGroupAddIp",
    outputs: [
      {
        name: "ipLicensingConfig",
        internalType: "struct Licensing.LicensingConfig",
        type: "tuple",
        components: [
          { name: "isSet", internalType: "bool", type: "bool" },
          { name: "mintingFee", internalType: "uint256", type: "uint256" },
          { name: "licensingHook", internalType: "address", type: "address" },
          { name: "hookData", internalType: "bytes", type: "bytes" },
          {
            name: "commercialRevShare",
            internalType: "uint32",
            type: "uint32",
          },
          { name: "disabled", internalType: "bool", type: "bool" },
          {
            name: "expectMinimumGroupRewardShare",
            internalType: "uint32",
            type: "uint32",
          },
          {
            name: "expectGroupRewardPool",
            internalType: "address",
            type: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "licensorIpId", internalType: "address", type: "address" },
      { name: "licenseTemplate", internalType: "address", type: "address" },
      { name: "licenseTermsId", internalType: "uint256", type: "uint256" },
      { name: "isMintedByIpOwner", internalType: "bool", type: "bool" },
    ],
    name: "verifyMintLicenseToken",
    outputs: [
      {
        name: "",
        internalType: "struct Licensing.LicensingConfig",
        type: "tuple",
        components: [
          { name: "isSet", internalType: "bool", type: "bool" },
          { name: "mintingFee", internalType: "uint256", type: "uint256" },
          { name: "licensingHook", internalType: "address", type: "address" },
          { name: "hookData", internalType: "bytes", type: "bytes" },
          {
            name: "commercialRevShare",
            internalType: "uint32",
            type: "uint32",
          },
          { name: "disabled", internalType: "bool", type: "bool" },
          {
            name: "expectMinimumGroupRewardShare",
            internalType: "uint32",
            type: "uint32",
          },
          {
            name: "expectGroupRewardPool",
            internalType: "address",
            type: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
] as const;
