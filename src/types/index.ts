/**
 * Gig status enum matching smart contract
 */
export enum GigStatus {
  LOCKED = "LOCKED",
  UNLOCKED = "UNLOCKED",
  PENDING = "PENDING",
  MERGED = "MERGED",
  CANCELLED = "CANCELLED",
}

/**
 * Gig data structure
 */
export interface Gig {
  id: number;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  amount: bigint;
  repoOwner: string;
  repoName: string;
  prId: string;
  isOpen: boolean;
  createdAt: number;
  status: GigStatus;
}

/**
 * Terminal log entry
 */
export interface TerminalLog {
  id: string;
  timestamp: number;
  type: "info" | "success" | "error" | "warning" | "command";
  message: string;
  prefix?: string;
}

/**
 * Create gig form data
 */
export interface CreateGigFormData {
  freelancerAddress: string;
  amount: string;
  repoOwner: string;
  repoName: string;
  prId: string;
}

/**
 * Transaction state
 */
export interface TransactionState {
  status: "idle" | "pending" | "confirming" | "success" | "error";
  hash?: `0x${string}`;
  error?: string;
}

/**
 * Demo mode gig for UI development
 */
export interface DemoGig extends Omit<Gig, "amount"> {
  amount: string; // String for demo display
}

/**
 * Chain configuration
 */
export interface ChainConfig {
  id: number;
  name: string;
  contractAddress: `0x${string}`;
  mneeTokenAddress: `0x${string}`;
  explorerUrl: string;
}
