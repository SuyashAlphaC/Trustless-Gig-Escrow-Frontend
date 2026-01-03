"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminal } from "./TerminalContext";
import { cn } from "@/lib/utils";
import { TerminalLog } from "@/types";

/**
 * TypewriterText - Animates text character by character
 */
function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <span className="animate-terminal-blink text-neon-green font-bold">▌</span>
      )}
    </span>
  );
}

/**
 * LogEntry - Single log line with appropriate styling
 */
function LogEntry({ log, isLatest }: { log: TerminalLog; isLatest: boolean }) {
  const typeColors: Record<TerminalLog["type"], string> = {
    info: "text-terminal-info",
    success: "text-neon-green",
    error: "text-neon-red",
    warning: "text-neon-yellow",
    command: "text-neon-purple",
  };

  const typeIcons: Record<TerminalLog["type"], string> = {
    info: "ℹ",
    success: "✓",
    error: "✗",
    warning: "⚠",
    command: "$",
  };

  const timestamp = new Date(log.timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 py-0.5 font-mono text-sm"
    >
      {/* Timestamp */}
      <span className="text-terminal-muted text-xs shrink-0">[{timestamp}]</span>

      {/* Type icon */}
      <span className={cn("shrink-0", typeColors[log.type])}>
        {typeIcons[log.type]}
      </span>

      {/* Prefix */}
      {log.prefix && (
        <span className="text-neon-cyan shrink-0">[{log.prefix}]</span>
      )}

      {/* Message */}
      <span className={cn("flex-1", typeColors[log.type])}>
        {isLatest ? <TypewriterText text={log.message} /> : log.message}
      </span>
    </motion.div>
  );
}

/**
 * TerminalLogger - VS Code-style terminal at the bottom of the screen
 */
export function TerminalLogger() {
  const { logs, clearLogs, isMinimized, toggleMinimize } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isMinimized]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Terminal Container */}
      <div
        className={cn(
          "bg-void border-t border-void-200 transition-all duration-300",
          isMinimized ? "h-8" : "h-48"
        )}
      >
        {/* Terminal Header - VS Code style */}
        <div className="flex items-center justify-between h-8 px-4 bg-void-50 border-b border-void-200">
          {/* Left side - tabs */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-neon-green text-xs">●</span>
              <span className="text-terminal-text text-xs font-mono uppercase tracking-wider">
                Terminal
              </span>
            </div>
            <div className="flex items-center gap-2 text-terminal-muted text-xs">
              <span>PROBLEMS</span>
              <span>OUTPUT</span>
              <span className="text-neon-green">DEBUG CONSOLE</span>
            </div>
          </div>

          {/* Right side - controls */}
          <div className="flex items-center gap-2">
            {/* Clear button */}
            <button
              onClick={clearLogs}
              className="text-terminal-muted hover:text-terminal-text transition-colors p-1"
              title="Clear terminal"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
              </svg>
            </button>

            {/* Minimize/Maximize button */}
            <button
              onClick={toggleMinimize}
              className="text-terminal-muted hover:text-terminal-text transition-colors p-1"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Close button (just minimizes) */}
            <button
              onClick={toggleMinimize}
              className="text-terminal-muted hover:text-neon-red transition-colors p-1"
              title="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={scrollRef}
              className="h-[calc(100%-2rem)] overflow-y-auto p-4 scrollbar-hide"
            >
              {/* Prompt line */}
              <div className="flex items-center gap-2 mb-2 font-mono text-sm">
                <span className="text-neon-green">➜</span>
                <span className="text-neon-cyan">mnee-escrow</span>
                <span className="text-neon-purple">git:(main)</span>
                <span className="text-neon-yellow">✗</span>
              </div>

              {/* Log entries */}
              <div className="space-y-0.5">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, index) => (
                    <LogEntry
                      key={log.id}
                      log={log}
                      isLatest={index === logs.length - 1}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Cursor line */}
              <div className="flex items-center gap-2 mt-2 font-mono text-sm">
                <span className="text-neon-green">➜</span>
                <span className="text-neon-cyan">mnee-escrow</span>
                <span className="animate-terminal-blink text-neon-green">▌</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow effect on hover */}
      <AnimatePresence>
        {isHovered && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
