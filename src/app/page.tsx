"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { VscGitPullRequest, VscLock, VscCheck, VscGithub } from "react-icons/vsc";

/**
 * ASCII Art Hero - Animated code block floating in space
 */
function ASCIIHero() {
  const asciiArt = `
 ███╗   ███╗███╗   ██╗███████╗███████╗
 ████╗ ████║████╗  ██║██╔════╝██╔════╝
 ██╔████╔██║██╔██╗ ██║█████╗  █████╗  
 ██║╚██╔╝██║██║╚██╗██║██╔══╝  ██╔══╝  
 ██║ ╚═╝ ██║██║ ╚████║███████╗███████╗
 ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
      TRUSTLESS GIG ESCROW
  `;

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const lines = asciiArt.trim().split("\n");

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setDisplayedLines((prev) => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Glow effect behind */}
      <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-neon-green via-neon-purple to-neon-cyan" />

      {/* ASCII container */}
      <div className="relative bg-void/50 border border-void-200 rounded-sm p-6 backdrop-blur-sm">
        {/* Window controls */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-void-200">
          <span className="w-3 h-3 rounded-full bg-neon-red/80" />
          <span className="w-3 h-3 rounded-full bg-neon-yellow/80" />
          <span className="w-3 h-3 rounded-full bg-neon-green/80" />
          <span className="ml-4 text-terminal-muted text-xs font-mono">
            mnee-escrow.sol
          </span>
        </div>

        {/* ASCII art */}
        <pre className="font-mono text-xs sm:text-sm md:text-base text-neon-green whitespace-pre overflow-x-auto">
          {displayedLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                i === lines.length - 1 && "text-neon-purple mt-2"
              )}
            >
              {line}
            </motion.div>
          ))}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-neon-cyan"
          >
            █
          </motion.span>
        </pre>
      </div>
    </motion.div>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, borderColor: "rgba(57, 211, 83, 0.5)" }}
      className="bg-void/50 border border-void-200 rounded-sm p-6 backdrop-blur-sm transition-colors"
    >
      <div className="w-12 h-12 rounded-sm bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-neon-green" />
      </div>
      <h3 className="font-mono font-bold text-terminal-text mb-2">{title}</h3>
      <p className="text-terminal-muted text-sm">{description}</p>
    </motion.div>
  );
}

/**
 * Animated code snippet showing the flow
 */
function CodeFlow() {
  const steps = [
    { code: "client.deposit(1000 MNEE)", label: "Client deposits bounty" },
    { code: "freelancer.submitPR(#123)", label: "Freelancer submits work" },
    { code: "chainlink.verifyMerge()", label: "Oracle verifies PR merge" },
    { code: "escrow.release(freelancer)", label: "Funds auto-released" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-void/50 border border-void-200 rounded-sm p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-4 text-xs text-terminal-muted font-mono">
        <VscGitPullRequest className="w-4 h-4" />
        <span>escrow-flow.ts</span>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex items-center gap-3 p-2 rounded-sm transition-colors",
              i === activeStep
                ? "bg-neon-green/10 border border-neon-green/30"
                : "opacity-50"
            )}
            animate={i === activeStep ? { x: [0, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span className="w-6 text-right text-terminal-muted text-xs font-mono">
              {i + 1}
            </span>
            <code className="text-sm font-mono">
              <span className="text-neon-purple">await </span>
              <span className="text-neon-cyan">{step.code}</span>
              <span className="text-terminal-muted">;</span>
            </code>
            {i === activeStep && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto text-xs text-neon-green"
              >
                {"// "}{step.label}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Stats display
 */
function Stats() {
  const stats = [
    { value: "100%", label: "Trustless" },
    { value: "0", label: "Gas Fees*" },
    { value: "∞", label: "Possibilities" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="grid grid-cols-3 gap-4"
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-neon-green">
            {stat.value}
          </div>
          <div className="text-xs text-terminal-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

/**
 * CTA Button
 */
function CTAButton() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return (
      <Link href="/dashboard">
        <motion.button
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-sm",
            "font-mono text-lg font-bold",
            "bg-neon-green/20 border-2 border-neon-green text-neon-green",
            "hover:bg-neon-green/30 hover:shadow-neon-green transition-all"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <VscGitPullRequest className="w-5 h-5" />
          <span>Open Dashboard</span>
        </motion.button>
      </Link>
    );
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <motion.button
          onClick={openConnectModal}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-sm",
            "font-mono text-lg font-bold",
            "bg-neon-green/20 border-2 border-neon-green text-neon-green",
            "hover:bg-neon-green/30 hover:shadow-neon-green transition-all"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{">"}</span>
          <span>Connect Wallet to Start</span>
        </motion.button>
      )}
    </ConnectButton.Custom>
  );
}

/**
 * Landing Page
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void">
      <Header />

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left side - Text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded-sm">
                  <VscGithub className="w-4 h-4 text-neon-purple" />
                  <span className="text-xs font-mono text-neon-purple">
                    Powered by Chainlink Functions
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-terminal-text leading-tight">
                  Commit Code.
                  <br />
                  <span className="text-neon-green">Get Paid.</span>
                </h1>

                <p className="text-lg text-terminal-muted max-w-lg">
                  Trustless escrow for freelance developers. Funds are automatically
                  released when your Pull Request is merged. No middlemen. No disputes.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CTAButton />
                <p className="text-xs text-terminal-muted mt-3">
                  *MNEE tokens enable gasless transactions for freelancers
                </p>
              </motion.div>

              {/* Stats */}
              <Stats />
            </div>

            {/* Right side - ASCII Art & Code */}
            <div className="space-y-6">
              <ASCIIHero />
              <CodeFlow />
            </div>
          </div>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl font-mono font-bold text-terminal-text mb-2">
                How It Works
              </h2>
              <p className="text-terminal-muted">
                Three simple steps to trustless payments
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={VscLock}
                title="1. Lock Funds"
                description="Client deposits MNEE tokens into the escrow smart contract, specifying the GitHub PR to track."
                delay={1.3}
              />
              <FeatureCard
                icon={VscGitPullRequest}
                title="2. Submit Work"
                description="Freelancer completes the work and gets their PR merged into the target repository."
                delay={1.4}
              />
              <FeatureCard
                icon={VscCheck}
                title="3. Auto Release"
                description="Chainlink Functions verifies the merge via GitHub API and automatically releases funds."
                delay={1.5}
              />
            </div>
          </motion.section>

          {/* Bottom CTA */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-24 text-center"
          >
            <div className="bg-void/50 border border-void-200 rounded-sm p-8 backdrop-blur-sm">
              <h2 className="text-xl font-mono font-bold text-terminal-text mb-4">
                Ready to ship trustless?
              </h2>
              <CTAButton />
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-void-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-terminal-muted text-sm font-mono">
              Built for hackathon with ❤️
            </div>
            <div className="flex items-center gap-4 text-terminal-muted text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-green transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://chain.link"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-cyan transition-colors"
              >
                Chainlink
              </a>
              <a
                href="#"
                className="hover:text-neon-purple transition-colors"
              >
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
