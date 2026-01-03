"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuccessOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  txHash?: string;
  amount?: string;
}

/**
 * Confetti particle component
 */
function ConfettiParticle({
  color,
  delay,
  startX,
  startY,
}: {
  color: string;
  delay: number;
  startX: number;
  startY: number;
}) {
  const endX = startX + (Math.random() - 0.5) * 400;
  const endY = startY + Math.random() * 600 + 200;
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      className="absolute w-3 h-3"
      style={{
        backgroundColor: color,
        left: "50%",
        top: "30%",
        borderRadius: Math.random() > 0.5 ? "50%" : "0",
      }}
      initial={{
        x: startX,
        y: startY,
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      animate={{
        x: endX,
        y: endY,
        opacity: 0,
        scale: 0,
        rotate: rotation,
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

/**
 * ASCII Art success animation
 */
function ASCIISuccess() {
  const frames = [
    `
    ╔═══════════════════════════════╗
    ║                               ║
    ║      ░░░░░░░░░░░░░░░░░░░      ║
    ║      ░░░░░░░░░░░░░░░░░░░      ║
    ║      ░░░░░░░░░░░░░░░░░░░      ║
    ║                               ║
    ╚═══════════════════════════════╝
    `,
    `
    ╔═══════════════════════════════╗
    ║                               ║
    ║      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      ║
    ║      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      ║
    ║      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      ║
    ║                               ║
    ╚═══════════════════════════════╝
    `,
    `
    ╔═══════════════════════════════╗
    ║                               ║
    ║      ███████████████████      ║
    ║      ██   MERGED!    ██      ║
    ║      ███████████████████      ║
    ║                               ║
    ╚═══════════════════════════════╝
    `,
  ];

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (frameIndex < frames.length - 1) {
      const timer = setTimeout(() => setFrameIndex(frameIndex + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [frameIndex, frames.length]);

  return (
    <pre className="font-mono text-neon-purple text-xs sm:text-sm whitespace-pre text-center">
      {frames[frameIndex]}
    </pre>
  );
}

/**
 * SuccessOverlay - Full-screen celebration overlay
 */
export function SuccessOverlay({
  isVisible,
  onClose,
  title = "PR Merged Successfully!",
  message = "Funds have been released to the freelancer.",
  txHash,
  amount,
}: SuccessOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiColors = ["#39d353", "#a371f7", "#58a6ff", "#d29922", "#f85149"];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 0.5,
    startX: (Math.random() - 0.5) * 100,
    startY: (Math.random() - 0.5) * 50,
  }));

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-void/80"
          />

          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiParticles.map((particle) => (
                <ConfettiParticle key={particle.id} {...particle} />
              ))}
            </div>
          )}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-10 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card */}
            <div className="bg-void border border-neon-purple rounded-sm overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-neon-purple/5 pointer-events-none" />

              {/* Header with animated border */}
              <div className="relative border-b border-void-200 p-4">
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-neon-green via-neon-purple to-neon-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <ASCIISuccess />
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-mono font-bold text-neon-green text-center"
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-terminal-muted text-center text-sm"
                >
                  {message}
                </motion.p>

                {/* Amount */}
                {amount && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 py-3 bg-neon-green/10 border border-neon-green/30 rounded-sm"
                  >
                    <span className="text-terminal-muted text-sm">Released:</span>
                    <span className="text-neon-green font-mono font-bold text-lg">
                      {amount} MNEE
                    </span>
                  </motion.div>
                )}

                {/* Transaction hash */}
                {txHash && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-1"
                  >
                    <span className="text-terminal-muted text-xs uppercase tracking-wider">
                      Transaction Hash
                    </span>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-mono text-xs text-neon-cyan hover:text-neon-cyan/80 truncate transition-colors"
                    >
                      {txHash}
                    </a>
                  </motion.div>
                )}

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className={cn(
                    "w-full py-2 px-4 font-mono text-sm font-semibold",
                    "bg-neon-purple/20 border border-neon-purple text-neon-purple",
                    "hover:bg-neon-purple/30 transition-colors rounded-sm"
                  )}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
