"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatAddress, formatTokenAmount } from "@/lib/utils";
import { Gig, GigStatus } from "@/types";
import { MergeButton } from "@/components/buttons/MergeButton";
import { VscGitPullRequest, VscRepo, VscLock, VscUnlock } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa";

interface RepoCardProps {
  gig: Gig;
  onVerify?: (gigId: number) => void;
  onCancel?: (gigId: number) => void;
  isVerifying?: boolean;
  isCancelling?: boolean;
  isUserClient?: boolean;
  isUserFreelancer?: boolean;
}

/**
 * StatusBadge - Glitch effect status indicator
 */
function StatusBadge({ status }: { status: GigStatus }) {
  const statusConfig: Record<
    GigStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    [GigStatus.LOCKED]: {
      label: "LOCKED",
      className: "status-locked",
      icon: <VscLock className="w-3 h-3" />,
    },
    [GigStatus.UNLOCKED]: {
      label: "UNLOCKED",
      className: "status-unlocked",
      icon: <VscUnlock className="w-3 h-3" />,
    },
    [GigStatus.PENDING]: {
      label: "VERIFYING",
      className: "status-pending",
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </motion.div>
      ),
    },
    [GigStatus.MERGED]: {
      label: "MERGED",
      className: "status-merged",
      icon: <VscGitPullRequest className="w-3 h-3" />,
    },
    [GigStatus.CANCELLED]: {
      label: "CANCELLED",
      className: "text-neon-red bg-neon-red/10 border-neon-red",
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];
  const shouldGlitch = status === GigStatus.LOCKED || status === GigStatus.PENDING;

  return (
    <motion.div
      className={cn(
        "status-badge inline-flex items-center gap-1.5",
        config.className,
        shouldGlitch && "animate-neon-flicker"
      )}
      whileHover={{ scale: 1.05 }}
      data-text={config.label}
    >
      {config.icon}
      <span className={cn(shouldGlitch && "glitch")} data-text={config.label}>
        {config.label}
      </span>
    </motion.div>
  );
}

/**
 * Confetti effect for unlocked status
 */
function ConfettiPop() {
  const colors = ["#39d353", "#a371f7", "#58a6ff", "#d29922", "#f85149"];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 200 - 100,
    y: Math.random() * -100 - 50,
    rotation: Math.random() * 720,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute left-1/2 top-1/2 w-2 h-2"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            rotate: particle.rotation,
            scale: 0,
          }}
          transition={{
            duration: 0.8,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * RepoCard - GitHub Repository-style gig display
 */
export function RepoCard({
  gig,
  onVerify,
  onCancel,
  isVerifying = false,
  isCancelling = false,
  isUserClient = false,
  isUserFreelancer = false,
}: RepoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when status changes to UNLOCKED
  React.useEffect(() => {
    if (gig.status === GigStatus.UNLOCKED || gig.status === GigStatus.MERGED) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [gig.status]);

  const githubUrl = `https://github.com/${gig.repoOwner}/${gig.repoName}/pull/${gig.prId}`;

  return (
    <motion.div
      layout
      layoutId={`gig-${gig.id}`}
      className="repo-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Neon border trace effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #39d353, #a371f7, #58a6ff, #39d353)",
              backgroundSize: "200% 100%",
              animation: "border-trace 3s linear infinite",
              padding: "1px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}
      </AnimatePresence>

      {/* Confetti effect */}
      <AnimatePresence>{showConfetti && <ConfettiPop />}</AnimatePresence>

      {/* Card Content */}
      <div className="p-4 space-y-4">
        {/* Header - Repo info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* GitHub icon */}
            <div className="shrink-0 w-10 h-10 rounded-md bg-void-100 border border-void-200 flex items-center justify-center">
              <FaGithub className="w-5 h-5 text-terminal-text" />
            </div>

            {/* Repo name */}
            <div className="min-w-0">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-neon-cyan hover:text-neon-cyan/80 transition-colors group"
              >
                <VscRepo className="w-4 h-4 shrink-0" />
                <span className="font-mono text-sm truncate group-hover:underline">
                  {gig.repoOwner}/{gig.repoName}
                </span>
              </a>
              <div className="flex items-center gap-2 mt-1">
                <VscGitPullRequest className="w-3.5 h-3.5 text-terminal-muted" />
                <span className="text-terminal-muted text-xs font-mono">
                  PR #{gig.prId}
                </span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <StatusBadge status={gig.status} />
        </div>

        {/* Divider */}
        <div className="h-px bg-void-200" />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Client */}
          <div>
            <span className="text-terminal-muted text-xs uppercase tracking-wider block mb-1">
              Client
            </span>
            <span className="font-mono text-terminal-text">
              {formatAddress(gig.client)}
              {isUserClient && (
                <span className="ml-2 text-xs text-neon-purple">(you)</span>
              )}
            </span>
          </div>

          {/* Freelancer */}
          <div>
            <span className="text-terminal-muted text-xs uppercase tracking-wider block mb-1">
              Freelancer
            </span>
            <span className="font-mono text-terminal-text">
              {formatAddress(gig.freelancer)}
              {isUserFreelancer && (
                <span className="ml-2 text-xs text-neon-green">(you)</span>
              )}
            </span>
          </div>

          {/* Amount */}
          <div>
            <span className="text-terminal-muted text-xs uppercase tracking-wider block mb-1">
              Bounty
            </span>
            <span className="font-mono text-neon-green font-semibold">
              {formatTokenAmount(gig.amount)} MNEE
            </span>
          </div>

          {/* Created */}
          <div>
            <span className="text-terminal-muted text-xs uppercase tracking-wider block mb-1">
              Created
            </span>
            <span className="font-mono text-terminal-text text-xs">
              {new Date(gig.createdAt * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action button */}
        {gig.isOpen && (isUserClient || isUserFreelancer) && (
          <>
            <div className="h-px bg-void-200" />
            <div className="flex items-center justify-between">
              {/* Gasless badge */}
              {isUserFreelancer && (
                <div className="flex items-center gap-1.5 text-xs text-neon-purple">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span>Gasless Claim</span>
                </div>
              )}

              {/* Cancel button - only for client */}
              {isUserClient && (
                <button
                  onClick={() => onCancel?.(gig.id)}
                  disabled={isCancelling}
                  className={cn(
                    "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
                    "border border-neon-red/50 text-neon-red hover:bg-neon-red/10",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isCancelling ? (
                    <span className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                      </motion.div>
                      Cancelling...
                    </span>
                  ) : (
                    "Cancel Gig"
                  )}
                </button>
              )}

              {/* Verify button */}
              <MergeButton
                onClick={() => onVerify?.(gig.id)}
                isLoading={isVerifying}
                status={gig.status}
                disabled={!gig.isOpen || isVerifying}
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background:
            gig.status === GigStatus.MERGED
              ? "#a371f7"
              : gig.status === GigStatus.UNLOCKED
              ? "#39d353"
              : gig.status === GigStatus.PENDING
              ? "#58a6ff"
              : "transparent",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: gig.status !== GigStatus.LOCKED ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
