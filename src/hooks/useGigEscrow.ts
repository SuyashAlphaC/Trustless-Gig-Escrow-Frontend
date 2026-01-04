"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useConfig,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt, readContract } from "wagmi/actions";
import { parseUnits, formatUnits, decodeEventLog } from "viem";
import { GIG_ESCROW_ABI, ERC20_ABI, getContractAddresses } from "@/config/contracts";
import { Gig, GigStatus, CreateGigFormData, TransactionState } from "@/types";
import { useTerminal } from "@/components/terminal/TerminalContext";
import { DEMO_MODE } from "@/config/wagmi";

/**
 * Verification result type
 */
export interface VerificationResult {
  status: "pending" | "submitted" | "verified" | "not_merged" | "error";
  txHash?: string;
  gigId?: number;
  amount?: string;
  freelancer?: string;
  error?: string;
}

/**
 * Type for contract gig response (struct returned by getGig)
 */
interface ContractGig {
  client: `0x${string}`;
  freelancer: `0x${string}`;
  amount: bigint;
  repoOwner: string;
  repoName: string;
  prId: string;
  isOpen: boolean;
  createdAt: bigint;
}

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
  const config = useConfig();
  const { addLog } = useTerminal();

  // Get contract addresses for current chain
  const { escrow: escrowAddress, mneeToken: tokenAddress } = getContractAddresses(chainId);

  // Transaction state
  const [txState, setTxState] = useState<TransactionState>({ status: "idle" });

  // Demo mode state
  const [demoGigs, setDemoGigs] = useState<Gig[]>(DEMO_GIGS);

  // Production mode state - store fetched gigs
  const [productionGigs, setProductionGigs] = useState<Gig[]>([]);
  const [isLoadingGigs, setIsLoadingGigs] = useState(false);

  // Verification state - tracks pending verifications and their results
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const pendingVerificationGigId = useRef<number | null>(null);

  // Contract write hooks
  const { writeContractAsync, data: txHash, isPending: isWritePending, error: writeError } = useWriteContract();

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

  // Watch for WorkVerified events
  useWatchContractEvent({
    address: escrowAddress,
    abi: GIG_ESCROW_ABI,
    eventName: "WorkVerified",
    onLogs(logs) {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: GIG_ESCROW_ABI,
            data: log.data,
            topics: log.topics,
          });
          
          if (decoded.eventName === "WorkVerified") {
            const { gigId, isMerged } = decoded.args as { gigId: bigint; requestId: `0x${string}`; isMerged: boolean };
            const gigIdNum = Number(gigId);
            
            addLog("info", `WorkVerified event: Gig #${gigIdNum}, merged: ${isMerged}`, "chainlink");
            
            // If this is for our pending verification and PR is NOT merged
            if (pendingVerificationGigId.current === gigIdNum && !isMerged) {
              setVerificationResult({
                status: "not_merged",
                gigId: gigIdNum,
                error: "PR is not merged yet. Please merge the PR first and try again.",
              });
              pendingVerificationGigId.current = null;
              addLog("warning", `Gig #${gigIdNum}: PR is not merged yet`, "chainlink");
            }
            // If merged, we wait for PaymentReleased event
          }
        } catch (err) {
          console.error("Failed to decode WorkVerified event:", err);
        }
      });
    },
    enabled: !DEMO_MODE && isConnected,
  });

  // Watch for PaymentReleased events
  useWatchContractEvent({
    address: escrowAddress,
    abi: GIG_ESCROW_ABI,
    eventName: "PaymentReleased",
    onLogs(logs) {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: GIG_ESCROW_ABI,
            data: log.data,
            topics: log.topics,
          });
          
          if (decoded.eventName === "PaymentReleased") {
            const { gigId, freelancer, amount } = decoded.args as { gigId: bigint; freelancer: `0x${string}`; amount: bigint };
            const gigIdNum = Number(gigId);
            const amountFormatted = formatUnits(amount, 18);
            
            addLog("success", `PaymentReleased: Gig #${gigIdNum}, ${amountFormatted} MNEE to ${freelancer.slice(0, 10)}...`, "escrow");
            
            // If this is for our pending verification, mark as verified/success
            if (pendingVerificationGigId.current === gigIdNum) {
              setVerificationResult({
                status: "verified",
                gigId: gigIdNum,
                amount: amountFormatted,
                freelancer: freelancer,
                txHash: log.transactionHash,
              });
              pendingVerificationGigId.current = null;
              
              // Update local gig state
              setProductionGigs((prev) =>
                prev.map((gig) =>
                  gig.id === gigIdNum
                    ? { ...gig, status: GigStatus.MERGED, isOpen: false }
                    : gig
                )
              );
            }
          }
        } catch (err) {
          console.error("Failed to decode PaymentReleased event:", err);
        }
      });
    },
    enabled: !DEMO_MODE && isConnected,
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
   * Fetch all gigs from the contract
   */
  const fetchAllGigs = useCallback(async () => {
    if (DEMO_MODE || !isConnected || !gigCount) return;

    setIsLoadingGigs(true);
    try {
      const count = Number(gigCount);
      const gigs: Gig[] = [];

      for (let i = 1; i <= count; i++) {
        try {
          const gigData = await readContract(config, {
            address: escrowAddress,
            abi: GIG_ESCROW_ABI,
            functionName: "getGig",
            args: [BigInt(i)],
          }) as ContractGig;

          if (gigData) {
            // Determine status based on isOpen
            let status = GigStatus.LOCKED;
            if (!gigData.isOpen) {
              status = GigStatus.MERGED; // Assuming closed means merged/paid
            }

            gigs.push({
              id: i,
              client: gigData.client,
              freelancer: gigData.freelancer,
              amount: gigData.amount,
              repoOwner: gigData.repoOwner,
              repoName: gigData.repoName,
              prId: gigData.prId,
              isOpen: gigData.isOpen,
              createdAt: Number(gigData.createdAt),
              status,
            });
          }
        } catch (err) {
          console.error(`Failed to fetch gig ${i}:`, err);
        }
      }

      setProductionGigs(gigs);
    } catch (error) {
      console.error("Failed to fetch gigs:", error);
    } finally {
      setIsLoadingGigs(false);
    }
  }, [config, escrowAddress, gigCount, isConnected]);

  // Fetch gigs when gigCount changes
  useEffect(() => {
    if (!DEMO_MODE && isConnected && gigCount) {
      fetchAllGigs();
    }
  }, [gigCount, isConnected, fetchAllGigs]);

  /**
   * Approve MNEE tokens for the escrow contract
   * Waits for transaction confirmation before returning
   */
  const approveTokens = useCallback(
    async (amount: string) => {
      if (DEMO_MODE) {
        addLog("info", `[DEMO] Approving ${amount} MNEE tokens...`, "token");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLog("success", "[DEMO] Token approval simulated", "token");
        return;
      }

      addLog("info", `Approving ${amount} MNEE tokens for escrow contract...`, "token");

      try {
        const amountWei = parseUnits(amount, 18);
        const hash = await writeContractAsync({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [escrowAddress, amountWei],
          gas: BigInt(100000), // Explicit gas limit for approval
        });
        addLog("info", `Approval tx submitted: ${hash.slice(0, 10)}... Waiting for confirmation...`, "token");
        
        // Wait for the approval transaction to be confirmed
        const receipt = await waitForTransactionReceipt(config, { hash });
        
        if (receipt.status === "success") {
          addLog("success", `Token approval confirmed! Block: ${receipt.blockNumber}`, "token");
        } else {
          throw new Error("Approval transaction failed");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLog("error", `Approval failed: ${errorMessage}`, "token");
        throw error;
      }
    },
    [writeContractAsync, tokenAddress, escrowAddress, addLog, config]
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
        addLog("info", `Sending transaction with gas limit: 300000`, "tx");
        const hash = await writeContractAsync({
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
          gas: BigInt(300000),
        });
        addLog("info", `Transaction submitted: ${hash.slice(0, 10)}... Waiting for confirmation...`, "tx");
        
        // Wait for the transaction to be confirmed
        const receipt = await waitForTransactionReceipt(config, { hash });
        
        if (receipt.status === "success") {
          addLog("success", `Gig created successfully! Block: ${receipt.blockNumber}`, "escrow");
          // Refetch gig count and gigs to update the UI
          await refetchGigCount();
        } else {
          throw new Error("Transaction failed on-chain");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addLog("error", `Failed to create gig: ${errorMessage}`, "escrow");
        throw error;
      }
    },
    [writeContractAsync, escrowAddress, addLog, address, demoGigs.length, config, refetchGigCount]
  );

  /**
   * Verify work and trigger Chainlink Functions
   * Returns a promise that resolves when the verification request is submitted
   * The actual verification result comes via events (WorkVerified, PaymentReleased)
   */
  const verifyWork = useCallback(
    async (gigId: number): Promise<{ txHash: string; status: "submitted" | "error" }> => {
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

        // Set demo verification result
        setVerificationResult({
          status: "verified",
          gigId,
          amount: "1000",
          txHash: "0xdemo123456789",
        });

        addLog("success", `[DEMO] Gig #${gigId} verified! PR is merged. Funds released.`, "escrow");
        return { txHash: "0xdemo123456789", status: "submitted" };
      }

      addLog("command", `verifyWork(${gigId})`, "contract");
      addLog("info", "Initiating work verification...", "chainlink");

      // Reset verification result and set pending gig ID
      setVerificationResult({ status: "pending", gigId });
      pendingVerificationGigId.current = gigId;

      try {
        const hash = await writeContractAsync({
          address: escrowAddress,
          abi: GIG_ESCROW_ABI,
          functionName: "verifyWork",
          args: [BigInt(gigId)],
          gas: BigInt(5000000), // Increased gas limit for Chainlink Functions call
        });
        
        addLog("info", `Verification tx submitted: ${hash.slice(0, 10)}... Waiting for confirmation...`, "chainlink");
        
        // Wait for the transaction to be confirmed
        const receipt = await waitForTransactionReceipt(config, { hash });
        
        if (receipt.status === "success") {
          addLog("success", `Verification request confirmed! Block: ${receipt.blockNumber}`, "chainlink");
          addLog("info", "Waiting for Chainlink oracle response... This may take 1-2 minutes.", "chainlink");
          
          // Update verification result to submitted (waiting for oracle)
          setVerificationResult({
            status: "submitted",
            txHash: hash,
            gigId,
          });
          
          return { txHash: hash, status: "submitted" };
        } else {
          // Transaction failed on-chain
          const errorMsg = "Verification transaction failed on-chain";
          setVerificationResult({
            status: "error",
            gigId,
            error: errorMsg,
          });
          pendingVerificationGigId.current = null;
          addLog("error", errorMsg, "chainlink");
          throw new Error(errorMsg);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setVerificationResult({
          status: "error",
          gigId,
          error: errorMessage,
        });
        pendingVerificationGigId.current = null;
        addLog("error", `Verification failed: ${errorMessage}`, "chainlink");
        throw error;
      }
    },
    [writeContractAsync, escrowAddress, addLog, config]
  );

  /**
   * Clear verification result (call after handling the result in UI)
   */
  const clearVerificationResult = useCallback(() => {
    setVerificationResult(null);
    pendingVerificationGigId.current = null;
  }, []);

  /**
   * Get a specific gig by ID
   */
  const getGig = useCallback(
    async (gigId: number): Promise<Gig | null> => {
      if (DEMO_MODE) {
        return demoGigs.find((g) => g.id === gigId) || null;
      }

      // Check local cache first
      const cachedGig = productionGigs.find((g) => g.id === gigId);
      if (cachedGig) return cachedGig;

      // Fetch from contract
      try {
        const gigData = await readContract(config, {
          address: escrowAddress,
          abi: GIG_ESCROW_ABI,
          functionName: "getGig",
          args: [BigInt(gigId)],
        }) as ContractGig;

        if (gigData) {
          let status = GigStatus.LOCKED;
          if (!gigData.isOpen) {
            status = GigStatus.MERGED;
          }

          return {
            id: gigId,
            client: gigData.client,
            freelancer: gigData.freelancer,
            amount: gigData.amount,
            repoOwner: gigData.repoOwner,
            repoName: gigData.repoName,
            prId: gigData.prId,
            isOpen: gigData.isOpen,
            createdAt: Number(gigData.createdAt),
            status,
          };
        }
      } catch (err) {
        console.error(`Failed to fetch gig ${gigId}:`, err);
      }

      return null;
    },
    [demoGigs, productionGigs, config, escrowAddress]
  );

  /**
   * Get all gigs (demo mode returns mock data, production returns fetched gigs)
   */
  const getAllGigs = useCallback((): Gig[] => {
    if (DEMO_MODE) {
      return demoGigs;
    }
    return productionGigs;
  }, [demoGigs, productionGigs]);

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
    isLoadingGigs,
    verificationResult,

    // Actions
    approveTokens,
    createGig,
    verifyWork,
    getGig,
    getAllGigs,
    resetTxState,
    refetchGigCount,
    fetchAllGigs,
    clearVerificationResult,
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
