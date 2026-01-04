import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet, polygon, arbitrum, base } from "wagmi/chains";
import { http } from "wagmi";

/**
 * Wagmi configuration for RainbowKit
 * Configured for Sepolia testnet as primary chain
 */
export const config = getDefaultConfig({
  appName: "Trustless Gig Escrow",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
  chains: [sepolia, mainnet, polygon, arbitrum, base],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/LfKXerIDAvp3ToDzzjfD8"
    ),
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/LfKXerIDAvp3ToDzzjfD8"
    ),
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/demo"
    ),
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "https://arb-mainnet.g.alchemy.com/v2/demo"
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://base-mainnet.g.alchemy.com/v2/demo"
    ),
  },
  ssr: true,
});

/**
 * Demo mode flag - enables mock data when true
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
