export const resourceFacetAbi = [
  {
    type: "function",
    name: "collectAllResources",
    inputs: [],
    outputs: [
      {
        name: "collected",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "collectResource",
    inputs: [
      {
        name: "resourceId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProductionConfig",
    inputs: [],
    outputs: [
      {
        name: "productionPerHour",
        type: "uint256",
      },
      {
        name: "resourceCount",
        type: "uint256",
      },
      {
        name: "secondsPerUnit",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getUncollectedResources",
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "uncollected",
        type: "uint256[]",
      },
      {
        name: "secondsUntilNextUnit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "syncMyProduction",
    inputs: [],
    outputs: [
      {
        name: "producedPerResource",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;
