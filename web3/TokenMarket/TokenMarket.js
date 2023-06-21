let web3;
let aAccounts;
let nGasUsed;
let ERC721Contract;
let ERC1155Contract;
let MarketContract;
let chainId;
let totalMinted;
let sepoliaChainId = 11155111;
const ERC721Address = "0x18C002148ec0A7A7e350b36dC8aaA0aB577bFAb4";
const ERC1155Address = "0x35DcbD20f770cB9280e31b474Df870d6d065cBb9";
const MArketAddress = "0xF38f7bA8F6Be75C6B7eaE663b1e4458120824e06";
const ERC721Abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_tokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "checkURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getBalances",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "givenURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC1155Abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "quentities",
        type: "uint256[]",
      },
    ],
    name: "burnBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "checkURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getBalances",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isTokenMinted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "isUsedURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "quentities",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "uries",
        type: "string[]",
      },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const MarketAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_erc721",
        type: "address",
      },
      {
        internalType: "address",
        name: "_erc1155",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "CancelAuction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_winner",
        type: "address",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_sellerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_buyerAddress",
        type: "address",
      },
    ],
    name: "Purchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_basePricePerToken",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_auctionStartTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_auctionEndTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_seller",
        type: "address",
      },
    ],
    name: "SetAuction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_seller",
        type: "address",
      },
    ],
    name: "SetOnSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "StopSale",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "RmyTokenOnSale",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isOnSale",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isERC721",
            type: "bool",
          },
        ],
        internalType: "struct MarketPlace.tokenOnSale[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "auctionInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "basePricePerToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "auctionStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "auctionEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxBidAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "maxBidAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isOnAuction",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isERC721",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "biddingHistory",
    outputs: [
      {
        internalType: "address",
        name: "bidderAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "biddingAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
    ],
    name: "cancelBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "cancelSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "checkURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "claimToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "erc1155",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "erc721",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isTokenMinted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sellerAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_basePricePerToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_auctionStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_auctionEndTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "setAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isERC721",
        type: "bool",
      },
    ],
    name: "setOnSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenOnSaleInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isOnSale",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isERC721",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

async function connect() {
  return new Promise(async (resolve, reject) => {
    if (!window.ethereum) {
      console.log("metamask not found");
      reject("Metamask not found");
    }
    web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts().then(async function (accounts) {
      console.log("connected to metamask");
      console.log("user account:", accounts[0]);

      aAccounts = accounts;
      ERC721Contract = new web3.eth.Contract(ERC721Abi, ERC721Address);
      ERC1155Contract = new web3.eth.Contract(ERC1155Abi, ERC1155Address);
      MarketContract = new web3.eth.Contract(MarketAbi, MArketAddress);

      await updateDetails();

      //   totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

      //   $("#confirmation").html(`Connected successfully`);
      //   $("#account").html(`Connected account: ${accounts[0]}`);
      //   $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
    });

    web3.eth.currentProvider.on("accountsChanged", async function (accounts) {
      if (accounts.length === 0) {
        location.reload();
      } else {
        aAccounts = accounts;
        await updateDetails();
        // totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

        // $("#confirmation").html(`Connected successfully`);
        // $("#account").html(`Connected account: ${accounts[0]}`);
        // $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
      }
    });

    // web3.eth.currentProvider.on("chainChanged", async function (newChainId) {
    //     newChainId = await web3.eth.getChainId();
    //     $("#network").text("ChainId: " + newChainId);
    // });

    $("#connectButton").unbind("click", function () {
      connect();
    });
    $("#connectButton").text("Disconnect MetaMask");
    setTimeout(() => {
      $("#connectButton").bind("click", function () {
        disconnect();
      });
    }, 0);

    resolve(true);
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Metamask not found",
      text: "install metamask",
    });
    console.log(error);
  });
}

function disconnect() {
  location.reload();
}

async function updateDetails() {
  $("#confirmation").html(`Connected successfully`);
  $("#account").html(`Connected account: ${aAccounts[0]}`);
  // $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
  $("#showTokens721").empty();
  $("#showTokens1155").empty();
  $("#showTokensOnSaleID").empty();
}

async function mintToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#MTokenId").val();
    const quantity = $("#MQuantity").val();
    const tokenURI = $("#M-URI").val();
    const isERC721 =
      $("input[name='IsERC721']:checked").val() === "true" ? true : false;

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;
    if (!(await checkURI(tokenURI))) return;

    if (isERC721) {
      if (!validateURI(tokenURI)) return;

      try {
        nGasUsed = await MarketContract.methods
          .mint(aAccounts[0], tokenId, quantity, isERC721, tokenURI)
          .estimateGas({ from: aAccounts[0] });
        console.log(nGasUsed);
      } catch (err) {
        let oErrorJSON = JSON.parse(
          err.message.substr(
            err.message.indexOf("{"),
            err.message.lastIndexOf("}")
          )
        );

        Swal.fire({
          icon: "error",
          title: "Transaction Fail",
          text: oErrorJSON.originalError.message,
        });
        console.log(err);
        $(".btn-primary ").prop("disabled", false);
        $("#connectButton ").prop("disabled", false);
        return;
      }
      await MarketContract.methods
        .mint(aAccounts[0], tokenId, quantity, isERC721, tokenURI)
        .send({ from: aAccounts[0] });
      console.log("minted successfully");
      // contractInfo();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Transaction Successfull",
        showConfirmButton: false,
        timer: 1500,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
    } else {
      console.log(await ERC1155Contract.methods.isTokenMinted(tokenId).call());

      if (!(await ERC1155Contract.methods.isTokenMinted(tokenId).call())) {
        if (!validateURI(tokenURI)) return;
      } else {
        Swal.fire({
          icon: "info",
          title: "Token already minted",
          text: "This will minted on same details",
        });
      }

      try {
        nGasUsed = await MarketContract.methods
          .mint(aAccounts[0], tokenId, quantity, isERC721, tokenURI)
          .estimateGas({ from: aAccounts[0] }, function () {});
        console.log(nGasUsed);
      } catch (err) {
        // let oErrorJSON = JSON.parse(
        //   err.message.substr(
        //     err.message.indexOf("{"),
        //     err.message.lastIndexOf("}")
        //   )
        // );

        Swal.fire({
          icon: "error",
          title: "Transaction Fail",
          text: err,
        });
        console.log(err);
        $(".btn-primary ").prop("disabled", false);
        $("#connectButton ").prop("disabled", false);
        return;
      }

      await MarketContract.methods
        .mint(aAccounts[0], tokenId, quantity, isERC721, tokenURI)
        .send({ from: aAccounts[0] });
      console.log("minted successfully");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Transaction Successfull",
        showConfirmButton: false,
        timer: 1500,
      });
      await updateDetails();
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
    }
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      console.log(err);
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
    }
  }
}

async function setOnSaleToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#SOSTokenId").val();
    const quantity = $("#SOSQuantity").val();
    const price = $("#SOSTokenPrice").val();
    const isERC721 =
      $("input[name='SOSIsERC721']:checked").val() === "true" ? true : false;

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;
    if (!emptyInputValidation(price)) return;
    if (!inputAmountvalidation(price)) return;

    if (isERC721) {
      if (
        !(await ERC721Contract.methods.getApproved(tokenId).call()) ==
        MArketAddress
      ) {
        try {
          nGasUsed = await ERC721Contract.methods
            .approve(MArketAddress, tokenId)
            .estimateGas({ from: aAccounts[0] });
          console.log(nGasUsed);
        } catch (err) {
          console.log(err);
          $(".btn-primary ").prop("disabled", false);
          $("#connectButton ").prop("disabled", false);
          return;
        }
        await ERC721Contract.methods
          .approve(MArketAddress, tokenId)
          .send({ from: aAccounts[0] });
      }
    } else {
      if (
        !(await ERC1155Contract.methods
          .isApprovedForAll(aAccounts[0], MArketAddress)
          .call())
      ) {
        try {
          nGasUsed = await ERC1155Contract.methods
            .setApprovalForAll(MArketAddress, true)
            .estimateGas({ from: aAccounts[0] });
          console.log(nGasUsed);
        } catch (err) {
          console.log(err);
          $(".btn-primary ").prop("disabled", false);
          $("#connectButton ").prop("disabled", false);
          return;
        }
        await ERC1155Contract.methods
          .setApprovalForAll(MArketAddress, true)
          .send({ from: aAccounts[0] });
      }
    }
    try {
      nGasUsed = await MarketContract.methods
        .setOnSale(tokenId, quantity, price, isERC721)
        .estimateGas({ from: aAccounts[0] });
      console.log(nGasUsed);
    } catch (err) {
      console.log(err);
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }
    await MarketContract.methods
      .setOnSale(tokenId, quantity, price, isERC721)
      .send({ from: aAccounts[0] });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    console.log(err);
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return;
  }
}

async function cancelSaleToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#CTokenId").val();
    const isERC721 =
      $("input[name='CIsERC721']:checked").val() === "true" ? true : false;

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;

    try {
      nGasUsed = await MarketContract.methods
        .cancelSale(tokenId, isERC721)
        .estimateGas({ from: aAccounts[0] });
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }
    await MarketContract.methods
      .cancelSale(tokenId, isERC721)
      .send({ from: aAccounts[0] });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    console.log(err);
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return;
  }
}

async function purchaseToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#BTokenId").val();
    const quantity = $("#BQuantityID").val();
    const totalPrice = $("#BAmountID").val();
    const seller = $("#BSellerID").val();
    const isERC721 =
      $("input[name='BIsERC721']:checked").val() === "true" ? true : false;

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(totalPrice)) return;
    if (!inputAmountvalidation(totalPrice)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;
    if (!emptyInputValidation(seller)) return;
    if (!addressValidation(seller)) return;

    try {
      nGasUsed = await MarketContract.methods
        .purchase(tokenId, quantity, seller, isERC721)
        .estimateGas({ from: aAccounts[0], value: totalPrice });
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await MarketContract.methods
      .purchase(tokenId, quantity, seller, isERC721)
      .send({ from: aAccounts[0], value: totalPrice });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    console.log(err);
  }
}

async function showToken721() {
  try {
    let uri;
    let id;
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    let Balance = await ERC721Contract.methods.balanceOf(aAccounts[0]).call();
    if (Balance == 0) {
      Swal.fire({
        icon: "error",
        title: "You have no NFT ",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);
    $("#showTokens721").empty();

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. your NFT will listed bellow",
      showConfirmButton: false,
      timer: 2000,
    });

    let myTokens = await ERC721Contract.methods
      .getBalances(aAccounts[0])
      .call();

    for (let count = 0; count < myTokens.length; count++) {
      try {
        id = myTokens[count];

        uri = await ERC721Contract.methods.tokenURI(id).call();

        let response = await fetch(uri);
        let jsonData = await response.json();

        $("#showTokens721").append(
          `<div id=${id} class="card" style="width: 18rem;">
                  <img src="${jsonData.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">ID: ${id}</h5>
                    <h5 class="card-title">Name: ${jsonData.name}</h5>
                    <p class="card-text">Description: ${jsonData.description}</p>
                    
                  </div>
                </div>`
        );
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function showToken1155() {
  try {
    let uri;
    let id;
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    let myTokens = await ERC1155Contract.methods
      .getBalances(aAccounts[0])
      .call();
    console.log({ myTokens });
    if (myTokens.length == 0) {
      Swal.fire({
        icon: "error",
        title: "You have no NFT ",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);
    $("#showTokens1155").empty();

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. your NFT will listed bellow",
      showConfirmButton: false,
      timer: 2000,
    });

    // let myTokens = await ERC721Contract.methods
    //   .getBalances(aAccounts[0])
    //   .call();

    for (let count = 0; count < myTokens.length; count++) {
      try {
        id = myTokens[count];

        let quantity = await ERC1155Contract.methods
          .balanceOf(aAccounts[0], id)
          .call();

        uri = await ERC1155Contract.methods.uri(id).call();
        let response;
        try {
          response = await fetch(uri);
        } catch (err) {
          console.log(err);
          continue;
        }

        let jsonData = await response.json();

        $("#showTokens1155").append(
          `<div id=${id} class="card" style="width: 15rem;">
                  <img src="${jsonData.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">ID: ${id}</h5>
                    <h5 class="card-title">Name: ${jsonData.name}</h5>
                    <h5 class="card-title">Quantity: ${quantity}</h5>
                    <p class="card-text">Description: ${jsonData.description}</p>
                    
                  </div>
                </div>`
        );
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: err,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function showTokenOnSale() {
  try {
    let uri;
    let id;
    let price;
    let owner;
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $("#showTokensOnSaleID").empty();

    let myTokens721 = await MarketContract.methods.RmyTokenOnSale(true).call();
    let myTokens1155 = await MarketContract.methods
      .RmyTokenOnSale(false)
      .call();

    console.log({ myTokens721 });
    console.log({ myTokens1155 });
    if (myTokens721.length == 0 && myTokens1155.length == 0) {
      Swal.fire({
        icon: "error",
        title: "no token in sale",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. NFT will listed bellow",
      showConfirmButton: false,
      timer: 2000,
    });

    for (let count = 0; count < myTokens721.length; count++) {
      try {
        id = myTokens721[count].tokenId;

        if (id == 0) {
          continue;
        }

        price = myTokens721[count].pricePerToken;

        owner = myTokens721[count].seller;

        uri = await ERC721Contract.methods.tokenURI(id).call();

        let response;
        try {
          response = await fetch(uri);
        } catch (err) {
          console.log(err);
          continue;
        }
        let jsonData = await response.json();

        $("#showTokensOnSaleID").append(
          `<div id=${count} class="card" style="width: 18rem;">
                    <img src="${jsonData.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">ID: ${id}</h5>
                      <h5 class="card-title">Name: ${jsonData.name}</h5>
                      <p class="card-text">Description: ${jsonData.description}</p>
                      <p class="card-text">Token Type:ERC721</p>
                      <p class="card-text">Price:${price}</p>
                      <p class="card-text">Seller: ${owner}</p>
                      
                    </div>
                  </div>`
        );
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Transaction Fail",
          text: err,
        });
        $(".btn-primary ").prop("disabled", false);
        $("#connectButton ").prop("disabled", false);
        console.log(err);
      }
    }

    for (let count = 0; count < myTokens1155.length; count++) {
      id = myTokens1155[count].tokenId;
      if (id == 0) {
        continue;
      }
      price = myTokens1155[count].pricePerToken;
      let quantity = myTokens1155[count].quantity;
      owner = myTokens1155[count].seller;

      uri = await ERC1155Contract.methods.uri(id).call();
      let response;
      try {
        response = await fetch(uri);
      } catch (err) {
        console.log(err);
        continue;
      }

      let jsonData = await response.json();

      $("#showTokensOnSaleID").append(
        `<div id=${id} class="card" style="width: 15rem;">
              <img src="${jsonData.image}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">ID: ${id}</h5>
                <h5 class="card-title">Name: ${jsonData.name}</h5>
                <h5 class="card-title">Quantity: ${quantity}</h5>
                <p class="card-text">Description: ${jsonData.description}</p>
                <p class="card-text">Token Type:ERC1155</p>
                <p class="card-text">Price/Token:${price}</p>
                <p class="card-text">Seller: ${owner}</p>

              </div>
            </div>`
      );
    }

    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Transaction Fail",
      text: err,
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    console.log(err);
  }
}

async function checkNetwork() {
  try {
    chainId = await web3.eth.getChainId();

    if (chainId !== sepoliaChainId) {
      let newChainId = "0x" + sepoliaChainId.toString(16);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: newChainId }],
      });
      return true;
    } else {
      // await updateDetails();
      // $("#network").text("ChainId: " + chainId);
      return true;
    }
  } catch (error) {
    console.log("Error:", error);
    if (error.code === 4001) {
      console.log(error.code);
      Swal.fire({
        icon: "warning",
        title:
          "you have changed your Network to another. Please select sepolia ",
      });
      return false;
    }
  }
}

function validateURI(uri) {
  try {
    new URL(uri);
    return true; // URI is valid
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Invalid URI",
      text: "Enter valid URI",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false; // URI is invalid
  }
}

async function checkURI(_tokenURI) {
  if (!(await MarketContract.methods.checkURI(_tokenURI).call())) {
    Swal.fire({
      icon: "error",
      title: "Invalid URI",
      text: "URI exist in another token",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}
function emptyInputValidation(sInput) {
  if (!sInput.length) {
    Swal.fire({
      icon: "error",
      title: "Empty value",
      text: "we cant proceed with empty value",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

function inputAmountvalidation(nAmount) {
  if (isNaN(nAmount) || !nAmount) {
    Swal.fire({
      icon: "error",
      title: "Value is not number",
      text: "enter valid number",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

function addressValidation(receiver) {
  if (!web3.utils.isAddress(receiver)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Address",
      text: "enter valid address",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}
