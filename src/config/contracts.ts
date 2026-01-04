import { sepolia, mainnet, polygon, arbitrum, base } from "wagmi/chains";

/**
 * GigEscrow Contract ABI
 * Generated from the Foundry project
 */
export const GIG_ESCROW_ABI =   [
    {
      "type": "constructor",
      "inputs": [
        { "name": "router", "type": "address", "internalType": "address" },
        { "name": "mneeToken", "type": "address", "internalType": "address" },
        {
          "name": "subscriptionId",
          "type": "uint64",
          "internalType": "uint64"
        },
        { "name": "donId", "type": "bytes32", "internalType": "bytes32" },
        {
          "name": "callbackGasLimit",
          "type": "uint32",
          "internalType": "uint32"
        },
        { "name": "source", "type": "string", "internalType": "string" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "acceptOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "cancelGig",
      "inputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createGig",
      "inputs": [
        { "name": "freelancer", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" },
        { "name": "repoOwner", "type": "string", "internalType": "string" },
        { "name": "repoName", "type": "string", "internalType": "string" },
        { "name": "prId", "type": "string", "internalType": "string" }
      ],
      "outputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getChainlinkConfig",
      "inputs": [],
      "outputs": [
        {
          "name": "subscriptionId",
          "type": "uint64",
          "internalType": "uint64"
        },
        { "name": "donId", "type": "bytes32", "internalType": "bytes32" },
        {
          "name": "callbackGasLimit",
          "type": "uint32",
          "internalType": "uint32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getGig",
      "inputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct GigEscrow.Gig",
          "components": [
            { "name": "client", "type": "address", "internalType": "address" },
            {
              "name": "freelancer",
              "type": "address",
              "internalType": "address"
            },
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "repoOwner", "type": "string", "internalType": "string" },
            { "name": "repoName", "type": "string", "internalType": "string" },
            { "name": "prId", "type": "string", "internalType": "string" },
            { "name": "isOpen", "type": "bool", "internalType": "bool" },
            {
              "name": "createdAt",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getGigCount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getMneeToken",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "handleOracleFulfillment",
      "inputs": [
        { "name": "requestId", "type": "bytes32", "internalType": "bytes32" },
        { "name": "response", "type": "bytes", "internalType": "bytes" },
        { "name": "err", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasPendingRequest",
      "inputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "i_mneeToken",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address", "internalType": "contract IERC20" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_callbackGasLimit",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint32", "internalType": "uint32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_donId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_gigCounter",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_gigHasPendingRequest",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_gigs",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [
        { "name": "client", "type": "address", "internalType": "address" },
        { "name": "freelancer", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" },
        { "name": "repoOwner", "type": "string", "internalType": "string" },
        { "name": "repoName", "type": "string", "internalType": "string" },
        { "name": "prId", "type": "string", "internalType": "string" },
        { "name": "isOpen", "type": "bool", "internalType": "bool" },
        { "name": "createdAt", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_pendingRequests",
      "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "outputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" },
        { "name": "exists", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_source",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_subscriptionId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint64", "internalType": "uint64" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "to", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateChainlinkConfig",
      "inputs": [
        {
          "name": "subscriptionId",
          "type": "uint64",
          "internalType": "uint64"
        },
        { "name": "donId", "type": "bytes32", "internalType": "bytes32" },
        {
          "name": "callbackGasLimit",
          "type": "uint32",
          "internalType": "uint32"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateSource",
      "inputs": [
        { "name": "newSource", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "verifyWork",
      "inputs": [
        { "name": "gigId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "requestId", "type": "bytes32", "internalType": "bytes32" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ChainlinkConfigUpdated",
      "inputs": [
        {
          "name": "subscriptionId",
          "type": "uint64",
          "indexed": false,
          "internalType": "uint64"
        },
        {
          "name": "donId",
          "type": "bytes32",
          "indexed": false,
          "internalType": "bytes32"
        },
        {
          "name": "callbackGasLimit",
          "type": "uint32",
          "indexed": false,
          "internalType": "uint32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "GigCancelled",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "client",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "GigCreated",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "client",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "freelancer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "repoOwner",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "repoName",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "prId",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "GigFunded",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferRequested",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PaymentReleased",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "freelancer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RequestFulfilled",
      "inputs": [
        {
          "name": "id",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RequestSent",
      "inputs": [
        {
          "name": "id",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "SourceUpdated",
      "inputs": [
        {
          "name": "newSource",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WorkVerificationRequested",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "requestId",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "requester",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WorkVerified",
      "inputs": [
        {
          "name": "gigId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "requestId",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "isMerged",
          "type": "bool",
          "indexed": false,
          "internalType": "bool"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "EmptyArgs", "inputs": [] },
    { "type": "error", "name": "EmptySource", "inputs": [] },
    { "type": "error", "name": "GigEscrow__EmptyRepoInfo", "inputs": [] },
    { "type": "error", "name": "GigEscrow__EmptySource", "inputs": [] },
    { "type": "error", "name": "GigEscrow__GigAlreadyClosed", "inputs": [] },
    { "type": "error", "name": "GigEscrow__GigNotOpen", "inputs": [] },
    { "type": "error", "name": "GigEscrow__GigTooRecent", "inputs": [] },
    { "type": "error", "name": "GigEscrow__InvalidAddress", "inputs": [] },
    { "type": "error", "name": "GigEscrow__InvalidAmount", "inputs": [] },
    { "type": "error", "name": "GigEscrow__InvalidGigId", "inputs": [] },
    {
      "type": "error",
      "name": "GigEscrow__RequestAlreadyPending",
      "inputs": []
    },
    { "type": "error", "name": "GigEscrow__RequestNotFound", "inputs": [] },
    { "type": "error", "name": "GigEscrow__TransferFailed", "inputs": [] },
    { "type": "error", "name": "GigEscrow__UnauthorizedCaller", "inputs": [] },
    { "type": "error", "name": "NoInlineSecrets", "inputs": [] },
    { "type": "error", "name": "OnlyRouterCanFulfill", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    }
  ] as const;




  export const ERC20_ABI = [
    {
      "type": "function",
      "name": "allowance",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "spender", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approve",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        { "name": "to", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferFrom",
      "inputs": [
        { "name": "from", "type": "address", "internalType": "address" },
        { "name": "to", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "spender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "ERC20InsufficientAllowance",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" },
        { "name": "allowance", "type": "uint256", "internalType": "uint256" },
        { "name": "needed", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InsufficientBalance",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" },
        { "name": "balance", "type": "uint256", "internalType": "uint256" },
        { "name": "needed", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidApprover",
      "inputs": [
        { "name": "approver", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidReceiver",
      "inputs": [
        { "name": "receiver", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidSender",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidSpender",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" }
      ]
    }
  ] as const;

/**
 * Contract addresses per chain
 * Update these after deployment
 */
export const CONTRACT_ADDRESSES: Record<
  number,
  { escrow: `0x${string}`; mneeToken: `0x${string}` }
> = {
  // Sepolia Testnet
  [sepolia.id]: {
    escrow: "0x74F93b26a93B6B7d72cD4bd61c922eb1c8fd393f", // Deploy and update
    mneeToken: "0xAE11Ef2C367644Ba662c7662237FC0349A7e4211", // MNEE token address
  },
  // Ethereum Mainnet
  [mainnet.id]: {
    escrow: "0x0000000000000000000000000000000000000000",
    mneeToken: "0x0000000000000000000000000000000000000000",
  },
  // Polygon
  [polygon.id]: {
    escrow: "0x0000000000000000000000000000000000000000",
    mneeToken: "0x0000000000000000000000000000000000000000",
  },
  // Arbitrum
  [arbitrum.id]: {
    escrow: "0x0000000000000000000000000000000000000000",
    mneeToken: "0x0000000000000000000000000000000000000000",
  },
  // Base
  [base.id]: {
    escrow: "0x0000000000000000000000000000000000000000",
    mneeToken: "0x0000000000000000000000000000000000000000",
  },
};

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: number) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[sepolia.id];
}

/**
 * Block explorer URLs
 */
export const EXPLORER_URLS: Record<number, string> = {
  [sepolia.id]: "https://sepolia.etherscan.io",
  [mainnet.id]: "https://etherscan.io",
  [polygon.id]: "https://polygonscan.com",
  [arbitrum.id]: "https://arbiscan.io",
  [base.id]: "https://basescan.org",
};

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[sepolia.id];
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(chainId: number, address: string): string {
  const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[sepolia.id];
  return `${baseUrl}/address/${address}`;
}
