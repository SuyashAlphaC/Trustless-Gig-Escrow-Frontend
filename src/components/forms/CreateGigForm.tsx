"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreateGigFormData } from "@/types";
import { useTerminal } from "@/components/terminal/TerminalContext";

interface CreateGigFormProps {
  onSubmit: (data: CreateGigFormData) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * CodeInput - Input field styled like a code editor line
 */
function CodeInput({
  lineNumber,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  error,
}: {
  lineNumber: number;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  prefix?: string;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group">
      {/* Label as comment */}
      <div className="flex items-center gap-3 text-sm font-mono">
        <span className="w-8 text-right text-terminal-muted select-none">
          {lineNumber}
        </span>
        <span className="text-terminal-muted">{"// "}</span>
        <span className="text-neon-green">{label}</span>
      </div>

      {/* Input line */}
      <div className="flex items-center gap-3 mt-1">
        <span className="w-8 text-right text-terminal-muted select-none font-mono text-sm">
          {lineNumber + 1}
        </span>
        <div
          className={cn(
            "flex-1 flex items-center gap-2 px-3 py-2 rounded-sm border transition-all duration-200",
            "bg-void-50 font-mono text-sm",
            isFocused
              ? "border-neon-cyan shadow-[0_0_10px_rgba(88,166,255,0.2)]"
              : "border-void-200 hover:border-void-300",
            error && "border-neon-red"
          )}
        >
          {prefix && <span className="text-neon-purple">{prefix}</span>}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-terminal-text placeholder:text-terminal-muted/50 outline-none"
          />
          {isFocused && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-neon-cyan"
            >
              |
            </motion.span>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 mt-1"
          >
            <span className="w-8" />
            <span className="text-neon-red text-xs font-mono">
              {"// Error: "}{error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * CreateGigForm - Code editor styled form for creating new gigs
 */
export function CreateGigForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: CreateGigFormProps) {
  const { addLog } = useTerminal();
  const [formData, setFormData] = useState<CreateGigFormData>({
    freelancerAddress: "",
    amount: "",
    repoOwner: "",
    repoName: "",
    prId: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateGigFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateGigFormData, string>> = {};

    if (!formData.freelancerAddress) {
      newErrors.freelancerAddress = "Address required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.freelancerAddress)) {
      newErrors.freelancerAddress = "Invalid Ethereum address";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Must be a positive number";
    }

    if (!formData.repoOwner) {
      newErrors.repoOwner = "Owner required";
    }

    if (!formData.repoName) {
      newErrors.repoName = "Repo name required";
    }

    if (!formData.prId) {
      newErrors.prId = "PR number required";
    } else if (!/^\d+$/.test(formData.prId)) {
      newErrors.prId = "Must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addLog("error", "Form validation failed", "form");
      return;
    }

    addLog("info", "Submitting new gig...", "form");

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        freelancerAddress: "",
        amount: "",
        repoOwner: "",
        repoName: "",
        prId: "",
      });
      setErrors({});
    } catch (error) {
      addLog("error", `Form submission failed: ${error}`, "form");
    }
  };

  const updateField = (field: keyof CreateGigFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* File header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-void-50 border-b border-void-200 rounded-t-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-neon-red/80" />
          <span className="w-3 h-3 rounded-full bg-neon-yellow/80" />
          <span className="w-3 h-3 rounded-full bg-neon-green/80" />
        </div>
        <span className="text-terminal-muted text-xs font-mono ml-2">
          new-gig.sol
        </span>
      </div>

      {/* Code editor body */}
      <div className="bg-void border border-void-200 border-t-0 rounded-b-sm p-4 space-y-4">
        {/* Contract declaration */}
        <div className="flex items-center gap-3 text-sm font-mono">
          <span className="w-8 text-right text-terminal-muted select-none">1</span>
          <span className="text-neon-purple">contract</span>
          <span className="text-neon-yellow">NewGig</span>
          <span className="text-terminal-text">{"{"}</span>
        </div>

        {/* Form fields */}
        <div className="pl-4 space-y-4">
          <CodeInput
            lineNumber={2}
            label="Freelancer wallet address"
            value={formData.freelancerAddress}
            onChange={(v) => updateField("freelancerAddress", v)}
            placeholder="0x..."
            prefix="address"
            error={errors.freelancerAddress}
          />

          <CodeInput
            lineNumber={4}
            label="Bounty amount in MNEE"
            value={formData.amount}
            onChange={(v) => updateField("amount", v)}
            placeholder="1000"
            type="number"
            prefix="uint256"
            error={errors.amount}
          />

          <CodeInput
            lineNumber={6}
            label="GitHub repository owner"
            value={formData.repoOwner}
            onChange={(v) => updateField("repoOwner", v)}
            placeholder="ethereum"
            prefix="string"
            error={errors.repoOwner}
          />

          <CodeInput
            lineNumber={8}
            label="GitHub repository name"
            value={formData.repoName}
            onChange={(v) => updateField("repoName", v)}
            placeholder="go-ethereum"
            prefix="string"
            error={errors.repoName}
          />

          <CodeInput
            lineNumber={10}
            label="Pull Request number"
            value={formData.prId}
            onChange={(v) => updateField("prId", v)}
            placeholder="12345"
            prefix="uint256"
            error={errors.prId}
          />
        </div>

        {/* Closing brace */}
        <div className="flex items-center gap-3 text-sm font-mono">
          <span className="w-8 text-right text-terminal-muted select-none">12</span>
          <span className="text-terminal-text">{"}"}</span>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-void-200">
          <motion.button
            type="submit"
            disabled={disabled || isLoading}
            className={cn(
              "w-full py-3 px-4 font-mono text-sm font-semibold rounded-sm",
              "border transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void",
              disabled || isLoading
                ? "bg-void-100 border-void-200 text-terminal-muted cursor-not-allowed"
                : "bg-neon-green/20 border-neon-green text-neon-green hover:bg-neon-green/30 hover:shadow-neon-green focus:ring-neon-green"
            )}
            whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.99 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⟳
                </motion.span>
                <span>Deploying...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>{">"}</span>
                <span>Deploy Gig Contract</span>
              </span>
            )}
          </motion.button>

          {/* Gasless badge */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neon-purple">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>MNEE tokens enable gasless transactions</span>
          </div>
        </div>
      </div>
    </form>
  );
}
