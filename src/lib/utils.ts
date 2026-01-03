import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Ethereum address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals = 18, displayDecimals = 4): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, displayDecimals);
  
  return `${integerPart.toLocaleString()}.${fractionalStr}`;
}

/**
 * Parse token amount from string to bigint
 */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  const [integerPart, fractionalPart = ""] = amount.split(".");
  const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(integerPart + paddedFractional);
}

/**
 * Generate random confetti colors
 */
export function getConfettiColors(): string[] {
  return ["#39d353", "#a371f7", "#58a6ff", "#d29922", "#f85149"];
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

/**
 * Validate GitHub repo URL or owner/repo format
 */
export function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
  // Try URL format: https://github.com/owner/repo
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }
  
  // Try owner/repo format
  const simpleMatch = input.match(/^([^/]+)\/([^/]+)$/);
  if (simpleMatch) {
    return { owner: simpleMatch[1], repo: simpleMatch[2] };
  }
  
  return null;
}

/**
 * Validate PR number
 */
export function isValidPRNumber(prNumber: string): boolean {
  return /^\d+$/.test(prNumber) && parseInt(prNumber) > 0;
}
