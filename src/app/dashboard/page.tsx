"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { RepoCard } from "@/components/cards/RepoCard";
import { TerminalLogger } from "@/components/terminal/TerminalLogger";
import { CreateGigForm } from "@/components/forms/CreateGigForm";
import { SuccessOverlay } from "@/components/overlays/SuccessOverlay";
import { useGigEscrow, useMNEEBalance } from "@/hooks/useGigEscrow";
import { Gig, GigStatus, CreateGigFormData } from "@/types";
import { DEMO_MODE } from "@/config/wagmi";
import { VscIssues, VscAdd, VscRefresh, VscFilter } from "react-icons/vsc";

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
  isVerifying,
}: {
  gigs: Gig[];
  onVerify: (gigId: number) => void;
  isVerifying: boolean;
}) {
  if (gigs.length === 0) {
    return <EmptyState filter="all" />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {gigs.map((gig, index) => (
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
              isVerifying={isVerifying}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
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
    verifyWork,
    txState,
    isDemoMode,
  } = useGigEscrow();

  // Local state
  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "merged">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount?: string;
    txHash?: string;
  }>({});

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

  // Handle create gig
  const handleCreateGig = useCallback(
    async (formData: CreateGigFormData) => {
      setIsCreating(true);
      try {
        await createGig(formData);
      } finally {
        setIsCreating(false);
      }
    },
    [createGig]
  );

  // Handle verify work
  const handleVerify = useCallback(
    async (gigId: number) => {
      setIsVerifying(true);
      try {
        await verifyWork(gigId);
        // Show success overlay after verification
        const gig = allGigs.find((g) => g.id === gigId);
        if (gig) {
          setSuccessData({
            amount: formatUnits(gig.amount, 18),
            txHash: txState.hash,
          });
          setShowSuccess(true);
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyWork, allGigs, txState.hash]
  );

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
                  isVerifying={isVerifying}
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

      {/* Success Overlay */}
      <SuccessOverlay
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="PR Merged Successfully!"
        message="Funds have been released to the freelancer."
        amount={successData.amount}
        txHash={successData.txHash}
      />
    </div>
  );
}
