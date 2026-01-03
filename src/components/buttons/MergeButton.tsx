"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GigStatus } from "@/types";

interface MergeButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  status: GigStatus;
  disabled?: boolean;
  className?: string;
}

/**
 * CI/CD Pipeline stages for the loading animation
 */
const PIPELINE_STAGES = [
  { id: "fetch", label: "Fetching PR data...", duration: 1500 },
  { id: "verify", label: "Verifying merge status...", duration: 2000 },
  { id: "oracle", label: "Chainlink oracle responding...", duration: 2500 },
  { id: "confirm", label: "Confirming on-chain...", duration: 1500 },
];

/**
 * PipelineProgress - CI/CD style progress indicator
 */
function PipelineProgress({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center gap-1 w-full">
      {PIPELINE_STAGES.map((stage, index) => (
        <React.Fragment key={stage.id}>
          {/* Stage dot */}
          <motion.div
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              index < currentStage
                ? "bg-neon-green"
                : index === currentStage
                ? "bg-neon-cyan"
                : "bg-void-200"
            )}
            animate={
              index === currentStage
                ? {
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(88, 166, 255, 0)",
                      "0 0 8px 2px rgba(88, 166, 255, 0.5)",
                      "0 0 0 0 rgba(88, 166, 255, 0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Connector line */}
          {index < PIPELINE_STAGES.length - 1 && (
            <div className="flex-1 h-0.5 bg-void-200 relative overflow-hidden">
              {index < currentStage && (
                <motion.div
                  className="absolute inset-0 bg-neon-green"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
              {index === currentStage && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: PIPELINE_STAGES[index].duration / 1000 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * MergeButton - GitHub-style merge button with CI/CD pipeline animation
 */
export function MergeButton({
  onClick,
  isLoading = false,
  status,
  disabled = false,
  className,
}: MergeButtonProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [showPipeline, setShowPipeline] = useState(false);

  // Simulate pipeline progress when loading
  useEffect(() => {
    if (isLoading) {
      setShowPipeline(true);
      setCurrentStage(0);

      let stageIndex = 0;
      const advanceStage = () => {
        if (stageIndex < PIPELINE_STAGES.length - 1) {
          stageIndex++;
          setCurrentStage(stageIndex);
        }
      };

      // Set up timers for each stage
      const timers: NodeJS.Timeout[] = [];
      let accumulatedTime = 0;

      PIPELINE_STAGES.forEach((stage, index) => {
        if (index > 0) {
          accumulatedTime += PIPELINE_STAGES[index - 1].duration;
          timers.push(setTimeout(advanceStage, accumulatedTime));
        }
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    } else {
      // Reset after a delay when loading stops
      const timer = setTimeout(() => {
        setShowPipeline(false);
        setCurrentStage(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Determine button state and styling
  const isMerged = status === GigStatus.MERGED || status === GigStatus.UNLOCKED;
  const isPending = status === GigStatus.PENDING || isLoading;

  const buttonStyles = cn(
    "relative overflow-hidden font-mono text-sm font-semibold transition-all duration-300",
    "border rounded-sm px-4 py-2 min-w-[160px]",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void",
    {
      // Merged state - Purple like GitHub
      "bg-neon-purple/20 border-neon-purple text-neon-purple hover:bg-neon-purple/30 focus:ring-neon-purple":
        isMerged,
      // Pending state - Cyan/Blue
      "bg-neon-cyan/10 border-neon-cyan text-neon-cyan cursor-wait": isPending,
      // Default state - Green like GitHub merge button
      "bg-neon-green/20 border-neon-green text-neon-green hover:bg-neon-green/30 hover:shadow-neon-green focus:ring-neon-green":
        !isMerged && !isPending && !disabled,
      // Disabled state
      "bg-void-100 border-void-200 text-terminal-muted cursor-not-allowed opacity-50":
        disabled && !isPending,
    },
    className
  );

  const getButtonContent = () => {
    if (isMerged) {
      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>Merged</span>
        </motion.span>
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-xs">{PIPELINE_STAGES[currentStage]?.label}</span>
          <PipelineProgress currentStage={currentStage} />
        </div>
      );
    }

    return (
      <span className="flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M6 21V9a9 9 0 009 9" />
        </svg>
        <span>Verify & Merge</span>
      </span>
    );
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isPending}
      className={buttonStyles}
      whileHover={!disabled && !isPending ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isPending ? { scale: 0.98 } : {}}
    >
      {/* Animated background gradient */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Neon glow effect on hover */}
      {!disabled && !isPending && !isMerged && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            boxShadow: "inset 0 0 20px rgba(57, 211, 83, 0.3)",
          }}
        />
      )}

      {/* Button content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isPending ? "loading" : isMerged ? "merged" : "default"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {getButtonContent()}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * ConnectWalletButton - Styled wallet connection button
 */
export function ConnectWalletButton({
  onClick,
  isConnected,
  address,
  className,
}: {
  onClick: () => void;
  isConnected: boolean;
  address?: string;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden font-mono text-sm font-semibold",
        "border rounded-sm px-4 py-2",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void",
        isConnected
          ? "bg-neon-green/10 border-neon-green text-neon-green"
          : "bg-void-100 border-void-200 text-terminal-text hover:border-neon-green hover:text-neon-green",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center gap-2">
        {isConnected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M22 10H18a2 2 0 000 4h4" />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </span>
    </motion.button>
  );
}
