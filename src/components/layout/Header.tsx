"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import { DEMO_MODE } from "@/config/wagmi";
import { VscGithub, VscTerminal } from "react-icons/vsc";

/**
 * Logo component with glitch effect
 */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Icon */}
      <motion.div
        className="relative w-8 h-8 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-neon-green rounded-sm rotate-45 group-hover:border-neon-purple transition-colors" />
        {/* Inner symbol */}
        <span className="text-neon-green font-mono font-bold text-lg group-hover:text-neon-purple transition-colors">
          M
        </span>
      </motion.div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-mono font-bold text-terminal-text text-sm tracking-wider">
          MNEE
        </span>
        <span className="font-mono text-xs text-terminal-muted tracking-widest">
          ESCROW
        </span>
      </div>
    </Link>
  );
}

/**
 * Navigation links
 */
function NavLinks() {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: VscTerminal },
    { href: "https://github.com", label: "GitHub", icon: VscGithub, external: true },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-sm",
            "font-mono text-sm text-terminal-muted",
            "hover:text-terminal-text hover:bg-void-100 transition-colors"
          )}
        >
          <link.icon className="w-4 h-4" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/**
 * Demo mode badge
 */
function DemoModeBadge() {
  if (!DEMO_MODE) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-2 py-1 bg-neon-yellow/10 border border-neon-yellow/30 rounded-sm"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow animate-pulse" />
      <span className="font-mono text-xs text-neon-yellow">DEMO MODE</span>
    </motion.div>
  );
}

/**
 * Custom styled connect button wrapper
 */
function WalletButton() {
  const { isConnected } = useAccount();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    onClick={openConnectModal}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-sm",
                      "font-mono text-sm font-semibold",
                      "bg-void-100 border border-void-200 text-terminal-text",
                      "hover:border-neon-green hover:text-neon-green transition-colors"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                    <span>Connect</span>
                  </motion.button>
                );
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    onClick={openChainModal}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-sm",
                      "font-mono text-sm font-semibold",
                      "bg-neon-red/10 border border-neon-red text-neon-red"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Wrong Network</span>
                  </motion.button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain button */}
                  <motion.button
                    onClick={openChainModal}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-sm",
                      "font-mono text-xs",
                      "bg-void-100 border border-void-200 text-terminal-muted",
                      "hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span>{chain.name}</span>
                  </motion.button>

                  {/* Account button */}
                  <motion.button
                    onClick={openAccountModal}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-sm",
                      "font-mono text-sm font-semibold",
                      "bg-neon-green/10 border border-neon-green text-neon-green"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span>{account.displayName}</span>
                  </motion.button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

/**
 * Header - Main navigation header
 */
export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Background with blur */}
      <div className="absolute inset-0 bg-void/80 backdrop-blur-md border-b border-void-200" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Logo />
            <NavLinks />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <DemoModeBadge />
            <WalletButton />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(57, 211, 83, 0.5), transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.header>
  );
}
