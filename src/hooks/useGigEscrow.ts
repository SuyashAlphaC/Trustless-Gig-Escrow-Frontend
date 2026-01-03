"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseUnits } from "viem";
import { GIG_ESCROW_ABI, ERC20_ABI, getContractAddresses } from "@/config/contracts";
import { Gig, GigStatus, CreateGigFormData, TransactionState } from "@/types";
import { useTerminal } from "@/components/terminal/TerminalContext";
import { DEMO_MODE } from "@/config/wagmi";

/**
 * Demo gigs for UI development without wallet connection
 */
const DEMO_GIGS: Gig[] = [
  {
    id: 1,
    client: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00",
    freelancer: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    amount: BigInt("1000000000000000000000"), // 1000 MNEE
    repoOwner: "ethereum",
    repoName: "go-ethereum",
    prId: "28547",
    isOpen: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400,
    status: GigStatus.LOCKED,
  },
  {
    id: 2,
    client: "0x1234567890123456789012345678901234567890",
    freelancer: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    amount: BigInt("500000000000000000000"), // 500 MNEE
    repoOwner: "vercel",
    repoName: "next.js",
    prId: "12345",
    isOpen: true,
    createdAt: Math.floor(Date.now() / 1000) - 172800,
    status: GigStatus.PENDING,
  },
  {
    id: 3,
    client: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    freelancer: "0xcafebabecafebabecafebabecafebabecafebabe",
    amount: BigInt("2500000000000000000000"), // 2500 MNEE
    repoOwner: "chainlink",
    repoName: "chainlink",
    prId: "9876",
    isOpen: false,
    createdAt: Math.floor(Date.now() / 1000) - 604800,
    status: GigStatus.MERGED,
  },
];

/**
 * Hook for interacting with the GigEscrow contract
 */
export function useGigEscrow() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { addLog } = useTerminal();

  // Get contract addresses for current chain
  const { escrow: escrowAddress, mneeToken: tokenAddress } = getContractAddresses(chainId);

  // Transaction state
  const [txState, setTxState] = useState<TransactionState>({ status: "idle" });

  // Demo mode state
  const [demoGigs, setDemoGigs] = useState<Gig[]>(DEMO_GIGS);

  // Contract write hooks
  const { writeContract, data: txHash, isPending: isWritePending, error: writeError } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read gig count
  const { data: gigCount, refetch: refetchGigCount } = useReadContract({
    address: escrowAddress,
    abi: GIG_ESCROW_ABI,
    functionName: "s_gigCounter",
    query: {
      enabled: isConnected && !DEMO_MODE,
    },
  });

  // Update transaction state based on write status
  useEffect(() => {
    if (isWritePending) {
      setTxState({ status: "pending" });
    } else if (isConfirming && txHash) {
      setTxState({ status: "confirming", hash: txHash });
    } else if (isConfirmed && txHash) {
      setTxState({ status: "success", hash: txHash });
      addLog("success", `Transaction confirmed: ${txHash.slice(0, 10)}...`, "tx");
    } else if (writeError) {
      setTxState({ status: "error", error: writeError.message });
      addLog("error", `Transaction failed: ${writeError.message}`, "tx");
    }
  }, [isWritePending, isConfirming, isConfirmed, txHash, writeError, addLog]);

  /**
   * Approve MNEE tokens for the escrow contract
   */
  const approveTokens = useCallback(
    async (amount: string) => {
      if (DEMO_MODE) {
        addLog("info", `[DEMO] Approving ${amount} MNEE tokens...`, "token");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLog("success", "[DEMO] Token approval simulated", "token");
        return;
      }

      addLog("info", `Approving ${amount} MNEE tokens...`, "token");

      try {
        const amountWei = parseUnits(amount, 18);
        writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [escrowAddress, amountWei],
        });
      } catch (error) {
        addLog("error", `Approval failed: ${error}`, "token");
        throw error;
      }
    },
    [writeContract, tokenAddress, escrowAddress, addLog]
  );

  /**
   * Create a new gig
   */
  const createGig = useCallback(
    async (formData: CreateGigFormData) => {
      if (DEMO_MODE) {
        addLog("command", `createGig("${formData.freelancerAddress}", ${formData.amount}, "${formData.repoOwner}/${formData.repoName}", "#${formData.prId}")`, "contract");
        addLog("info", "[DEMO] Creating new gig...", "escrow");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add demo gig
        const newGig: Gig = {
          id: demoGigs.length + 1,
          client: address || "0x0000000000000000000000000000000000000000",
          freelancer: formData.freelancerAddress as `0x${string}`,
          amount: parseUnits(formData.amount, 18),
          repoOwner: formData.repoOwner,
          repoName: formData.repoName,
          prId: formData.prId,
          isOpen: true,
          createdAt: Math.floor(Date.now() / 1000),
          status: GigStatus.LOCKED,
        };
        setDemoGigs((prev) => [newGig, ...prev]);

        addLog("success", `[DEMO] Gig #${newGig.id} created successfully!`, "escrow");
        return newGig.id;
      }

      addLog("command", `createGig("${formData.freelancerAddress}", ${formData.amount}, "${formData.repoOwner}/${formData.repoName}", "#${formData.prId}")`, "contract");
      addLog("info", "Creating new gig...", "escrow");

      try {
        const amountWei = parseUnits(formData.amount, 18);
        writeContract({
          address: escrowAddress,
          abi: GIG_ESCROW_ABI,
          functionName: "createGig",
          args: [
            formData.freelancerAddress as `0x${string}`,
            amountWei,
            formData.repoOwner,
            formData.repoName,
            formData.prId,
          ],
        });
      } catch (error) {
        addLog("error", `Failed to create gig: ${error}`, "escrow");
        throw error;
      }
    },
    [writeContract, escrowAddress, addLog, address, demoGigs.length]
  );

  /**
   * Verify work and trigger Chainlink Functions
   */
  const verifyWork = useCallback(
    async (gigId: number) => {
      if (DEMO_MODE) {
        addLog("command", `verifyWork(${gigId})`, "contract");
        addLog("info", "[DEMO] Initiating work verification...", "chainlink");
        addLog("info", "[DEMO] Calling Chainlink Functions DON...", "chainlink");

        // Simulate verification process
        await new Promise((resolve) => setTimeout(resolve, 1500));
        addLog("info", "[DEMO] Fetching PR data from GitHub API...", "github");

        await new Promise((resolve) => setTimeout(resolve, 2000));
        addLog("info", "[DEMO] Oracle response received", "chainlink");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update demo gig status
        setDemoGigs((prev) =>
          prev.map((gig) =>
            gig.id === gigId
              ? { ...gig, status: GigStatus.MERGED, isOpen: false }
              : gig
          )
        );

        addLog("success", `[DEMO] Gig #${gigId} verified! PR is merged. Funds released.`, "escrow");
        return;
      }

      addLog("command", `verifyWork(${gigId})`, "contract");
      addLog("info", "Initiating work verification...", "chainlink");

      try {
        writeContract({
          address: escrowAddress,
          abi: GIG_ESCROW_ABI,
          functionName: "verifyWork",
          args: [BigInt(gigId)],
        });
      } catch (error) {
        addLog("error", `Verification failed: ${error}`, "chainlink");
        throw error;
      }
    },
    [writeContract, escrowAddress, addLog]
  );

  /**
   * Get a specific gig by ID
   */
  const getGig = useCallback(
    async (gigId: number): Promise<Gig | null> => {
      if (DEMO_MODE) {
        return demoGigs.find((g) => g.id === gigId) || null;
      }

      // This would use readContract in production
      return null;
    },
    [demoGigs]
  );

  /**
   * Get all gigs (demo mode returns mock data)
   */
  const getAllGigs = useCallback((): Gig[] => {
    if (DEMO_MODE) {
      return demoGigs;
    }
    // In production, this would fetch from contract events or indexer
    return [];
  }, [demoGigs]);

  /**
   * Reset transaction state
   */
  const resetTxState = useCallback(() => {
    setTxState({ status: "idle" });
  }, []);

  return {
    // State
    isConnected,
    address,
    chainId,
    txState,
    gigCount: gigCount ? Number(gigCount) : demoGigs.length,
    isDemoMode: DEMO_MODE,

    // Actions
    approveTokens,
    createGig,
    verifyWork,
    getGig,
    getAllGigs,
    resetTxState,
    refetchGigCount,
  };
}

/**
 * Hook for reading MNEE token balance
 */
export function useMNEEBalance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { mneeToken: tokenAddress } = getContractAddresses(chainId);

  const { data: balance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && !DEMO_MODE,
    },
  });

  // Demo mode balance
  if (DEMO_MODE) {
    return {
      balance: BigInt("10000000000000000000000"), // 10,000 MNEE
      refetch: () => Promise.resolve({ data: BigInt("10000000000000000000000") }),
    };
  }

  return {
    balance: balance as bigint | undefined,
    refetch,
  };
}

/**
 * Hook for checking token allowance
 */
export function useMNEEAllowance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { escrow: escrowAddress, mneeToken: tokenAddress } = getContractAddresses(chainId);

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, escrowAddress] : undefined,
    query: {
      enabled: isConnected && !!address && !DEMO_MODE,
    },
  });

  // Demo mode allowance
  if (DEMO_MODE) {
    return {
      allowance: BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"), // Max uint256
      refetch: () => Promise.resolve({ data: BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935") }),
    };
  }

  return {
    allowance: allowance as bigint | undefined,
    refetch,
  };
}
