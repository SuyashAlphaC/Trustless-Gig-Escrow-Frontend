"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { RepoCard } from "@/components/cards/RepoCard";
import { TerminalLogger } from "@/components/terminal/TerminalLogger";
import { CreateGigForm } from "@/components/forms/CreateGigForm";
import { SuccessOverlay } from "@/components/overlays/SuccessOverlay";
import { useGigEscrow, useMNEEBalance, useMNEEAllowance } from "@/hooks/useGigEscrow";
import { Gig, CreateGigFormData } from "@/types";
import { VscIssues, VscAdd, VscRefresh } from "react-icons/vsc";

/**
 * Filter tabs for gig status
 */
function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: "all" | "open" | "merged";
  onFilterChange: (filter: "all" | "open" | "merged") => void;
  counts: { all: number; open: number; merged: number };
}) {
  const tabs = [
    { id: "all" as const, label: "All", count: counts.all },
    { id: "open" as const, label: "Open", count: counts.open },
    { id: "merged" as const, label: "Merged", count: counts.merged },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-void-50 border border-void-200 rounded-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs transition-colors",
            activeFilter === tab.id
              ? "bg-void-100 text-terminal-text"
              : "text-terminal-muted hover:text-terminal-text"
          )}
        >
          <span>{tab.label}</span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-sm text-[10px]",
              activeFilter === tab.id
                ? "bg-neon-green/20 text-neon-green"
                : "bg-void-200 text-terminal-muted"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Balance display component
 */
function BalanceDisplay() {
  const { balance } = useMNEEBalance();
  const formattedBalance = balance
    ? parseFloat(formatUnits(balance, 18)).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    : "0";

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-void-50 border border-void-200 rounded-sm">
      <span className="text-terminal-muted text-xs font-mono">Balance:</span>
      <span className="text-neon-green font-mono font-bold">
        {formattedBalance} MNEE
      </span>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ filter }: { filter: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-sm bg-void-100 border border-void-200 flex items-center justify-center mb-4">
        <VscIssues className="w-8 h-8 text-terminal-muted" />
      </div>
      <h3 className="font-mono font-bold text-terminal-text mb-2">
        No {filter === "all" ? "" : filter} gigs found
      </h3>
      <p className="text-terminal-muted text-sm max-w-sm">
        {filter === "all"
          ? "Create your first gig to get started with trustless escrow."
          : `No ${filter} gigs at the moment.`}
      </p>
    </motion.div>
  );
}

/**
 * Gig list component
 */
function GigList({
  gigs,
  onVerify,
  onCancel,
  isVerifying,
  isCancelling,
  userAddress,
}: {
  gigs: Gig[];
  onVerify: (gigId: number) => void;
  onCancel: (gigId: number) => void;
  isVerifying: boolean;
  isCancelling: boolean;
  userAddress?: `0x${string}`;
}) {
  if (gigs.length === 0) {
    return <EmptyState filter="all" />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {gigs.map((gig, index) => {
          const isUserClient = userAddress?.toLowerCase() === gig.client.toLowerCase();
          const isUserFreelancer = userAddress?.toLowerCase() === gig.freelancer.toLowerCase();
          
          return (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <RepoCard
                gig={gig}
                onVerify={() => onVerify(gig.id)}
                onCancel={() => onCancel(gig.id)}
                isVerifying={isVerifying}
                isCancelling={isCancelling}
                isUserClient={isUserClient}
                isUserFreelancer={isUserFreelancer}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Verification waiting overlay component
 */
function VerificationWaitingOverlay({
  isVisible,
  onCancel,
  status,
}: {
  isVisible: boolean;
  onCancel: () => void;
  status: "pending" | "submitted";
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-void-50 border border-void-200 rounded-sm p-8 max-w-md w-full mx-4 text-center"
          >
            {/* Animated spinner */}
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-2 border-void-200 rounded-full" />
              <div className="absolute inset-0 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 border-2 border-neon-purple border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>

            <h3 className="font-mono font-bold text-terminal-text text-lg mb-2">
              {status === "pending" ? "Submitting Verification..." : "Waiting for Oracle Response"}
            </h3>
            
            <p className="text-terminal-muted text-sm mb-4">
              {status === "pending" 
                ? "Please confirm the transaction in your wallet."
                : "Chainlink Functions is verifying the PR merge status. This may take 1-2 minutes."}
            </p>

            {status === "submitted" && (
              <div className="bg-void-100 border border-void-200 rounded-sm p-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-terminal-muted">
                  <span className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
                  <span>Chainlink DON is processing your request...</span>
                </div>
              </div>
            )}

            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-mono text-terminal-muted hover:text-terminal-text transition-colors"
            >
              Close (verification continues in background)
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Verification error overlay component
 */
function VerificationErrorOverlay({
  isVisible,
  onClose,
  error,
}: {
  isVisible: boolean;
  onClose: () => void;
  error?: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-void-50 border border-neon-red/30 rounded-sm p-8 max-w-md w-full mx-4 text-center"
          >
            {/* Error icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-neon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h3 className="font-mono font-bold text-neon-red text-lg mb-2">
              Verification Failed
            </h3>
            
            <p className="text-terminal-muted text-sm mb-6">
              {error || "An error occurred during verification. Please try again."}
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-void-100 border border-void-200 rounded-sm font-mono text-sm text-terminal-text hover:bg-void-200 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Dashboard Page
 */
export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const {
    getAllGigs,
    createGig,
    approveTokens,
    verifyWork,
    cancelGig,
    isDemoMode,
    verificationResult,
    clearVerificationResult,
    fetchAllGigs,
  } = useGigEscrow();
  const { allowance, refetch: refetchAllowance } = useMNEEAllowance();

  // Local state
  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "merged">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount?: string;
    txHash?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Watch for verification result changes
  useEffect(() => {
    if (!verificationResult) return;

    switch (verificationResult.status) {
      case "pending":
        setShowWaiting(true);
        setShowError(false);
        setShowSuccess(false);
        break;
      
      case "submitted":
        setShowWaiting(true);
        setIsVerifying(false); // Transaction submitted, no longer "verifying" in the button sense
        break;
      
      case "verified":
        // Payment released! Show success
        setShowWaiting(false);
        setShowError(false);
        setSuccessData({
          amount: verificationResult.amount,
          txHash: verificationResult.txHash,
        });
        setShowSuccess(true);
        setIsVerifying(false);
        // Refresh gigs to update the UI
        fetchAllGigs();
        break;
      
      case "not_merged":
        // PR not merged yet
        setShowWaiting(false);
        setErrorMessage(verificationResult.error || "PR is not merged yet. Please merge the PR first and try again.");
        setShowError(true);
        setIsVerifying(false);
        break;
      
      case "error":
        // Transaction or verification error
        setShowWaiting(false);
        setErrorMessage(verificationResult.error || "Verification failed. Please try again.");
        setShowError(true);
        setIsVerifying(false);
        break;
    }
  }, [verificationResult, fetchAllGigs]);

  // Get all gigs
  const allGigs = getAllGigs();

  // Filter gigs
  const filteredGigs = allGigs.filter((gig) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "open") return gig.isOpen;
    if (activeFilter === "merged") return !gig.isOpen;
    return true;
  });

  // Calculate counts
  const counts = {
    all: allGigs.length,
    open: allGigs.filter((g) => g.isOpen).length,
    merged: allGigs.filter((g) => !g.isOpen).length,
  };

  // Handle create gig with token approval
  const handleCreateGig = useCallback(
    async (formData: CreateGigFormData) => {
      setIsCreating(true);
      try {
        // Parse the amount to wei for comparison
        const amountWei = BigInt(parseFloat(formData.amount) * 10 ** 18);
        
        // Check if we need to approve tokens first
        const currentAllowance = allowance ?? BigInt(0);
        
        if (currentAllowance < amountWei) {
          // Need to approve tokens first
          await approveTokens(formData.amount);
          
          // Wait a bit for the approval to be indexed, then refetch
          await new Promise(resolve => setTimeout(resolve, 2000));
          await refetchAllowance();
        }
        
        // Now create the gig
        await createGig(formData);
      } finally {
        setIsCreating(false);
      }
    },
    [createGig, approveTokens, allowance, refetchAllowance]
  );

  // Handle verify work
  const handleVerify = useCallback(
    async (gigId: number) => {
      setIsVerifying(true);
      setShowError(false);
      setShowSuccess(false);
      
      try {
        // This will submit the verification request
        // The actual result comes via events (WorkVerified, PaymentReleased)
        await verifyWork(gigId);
        // Note: We don't show success here anymore!
        // Success is shown when PaymentReleased event is received
      } catch {
        // Error is already handled in the hook and will update verificationResult
        setIsVerifying(false);
      }
    },
    [verifyWork]
  );

  const handleCancel = useCallback(async (gigId: number) => {
  if (!confirm("Are you sure? This will refund the MNEE to your wallet.")) return;
  
  setIsCancelling(true);
  try {
    await cancelGig(gigId);
    // Success notification is handled by the hook's logs or you can add one here
  } catch (e) {
    console.error(e);
  } finally {
    setIsCancelling(false);
  }
}, [cancelGig]);

  // Handle closing the waiting overlay
  const handleCloseWaiting = useCallback(() => {
    setShowWaiting(false);
    // Don't clear verification result - we still want to listen for events
  }, []);

  // Handle closing the error overlay
  const handleCloseError = useCallback(() => {
    setShowError(false);
    setErrorMessage("");
    clearVerificationResult();
  }, [clearVerificationResult]);

  // Handle closing the success overlay
  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    setSuccessData({});
    clearVerificationResult();
  }, [clearVerificationResult]);

  return (
    <div className="min-h-screen bg-void">
      <Header />

      {/* Main content */}
      <main className="pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl font-mono font-bold text-terminal-text">
                Dashboard
              </h1>
              <p className="text-terminal-muted text-sm mt-1">
                Manage your gigs and escrow contracts
              </p>
            </div>

            <div className="flex items-center gap-3">
              <BalanceDisplay />
              {isDemoMode && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-neon-yellow/10 border border-neon-yellow/30 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow animate-pulse" />
                  <span className="font-mono text-xs text-neon-yellow">
                    DEMO
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Split view layout */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left side - Gig list (3 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-4"
            >
              {/* Section header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-terminal-text">
                    <VscIssues className="w-5 h-5" />
                    <span className="font-mono font-bold">Open Issues</span>
                  </div>
                  <FilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    counts={counts}
                  />
                </div>

                <button
                  onClick={() => {}}
                  className="p-2 text-terminal-muted hover:text-terminal-text transition-colors"
                  title="Refresh"
                >
                  <VscRefresh className="w-4 h-4" />
                </button>
              </div>

              {/* Gig list */}
              <div className="bg-void/50 border border-void-200 rounded-sm p-4 min-h-[400px]">
                <GigList
                  gigs={filteredGigs}
                  onVerify={handleVerify}
                  onCancel={handleCancel}
                  isCancelling={isCancelling}
                  isVerifying={isVerifying}
                  userAddress={address}
                />
              </div>
            </motion.div>

            {/* Right side - Create form (2 columns) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 text-terminal-text">
                <VscAdd className="w-5 h-5" />
                <span className="font-mono font-bold">Create New Issue</span>
              </div>

              {/* Form */}
              {isConnected || isDemoMode ? (
                <CreateGigForm
                  onSubmit={handleCreateGig}
                  isLoading={isCreating}
                  disabled={!isConnected && !isDemoMode}
                />
              ) : (
                <div className="bg-void/50 border border-void-200 rounded-sm p-8 text-center">
                  <div className="w-16 h-16 rounded-sm bg-void-100 border border-void-200 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-terminal-muted"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M22 10H18a2 2 0 000 4h4" />
                    </svg>
                  </div>
                  <h3 className="font-mono font-bold text-terminal-text mb-2">
                    Connect Wallet
                  </h3>
                  <p className="text-terminal-muted text-sm">
                    Connect your wallet to create and manage gigs
                  </p>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-void/50 border border-void-200 rounded-sm p-4">
                  <div className="text-2xl font-mono font-bold text-neon-green">
                    {counts.open}
                  </div>
                  <div className="text-xs text-terminal-muted mt-1">
                    Active Gigs
                  </div>
                </div>
                <div className="bg-void/50 border border-void-200 rounded-sm p-4">
                  <div className="text-2xl font-mono font-bold text-neon-purple">
                    {counts.merged}
                  </div>
                  <div className="text-xs text-terminal-muted mt-1">
                    Completed
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Terminal Logger */}
      <TerminalLogger />

      {/* Verification Waiting Overlay */}
      <VerificationWaitingOverlay
        isVisible={showWaiting}
        onCancel={handleCloseWaiting}
        status={verificationResult?.status === "submitted" ? "submitted" : "pending"}
      />

      {/* Verification Error Overlay */}
      <VerificationErrorOverlay
        isVisible={showError}
        onClose={handleCloseError}
        error={errorMessage}
      />

      {/* Success Overlay */}
      <SuccessOverlay
        isVisible={showSuccess}
        onClose={handleCloseSuccess}
        title="PR Merged Successfully!"
        message="Funds have been released to the freelancer."
        amount={successData.amount}
        txHash={successData.txHash}
      />
    </div>
  );
}
