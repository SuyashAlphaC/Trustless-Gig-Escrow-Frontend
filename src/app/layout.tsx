"use client";

import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/components/providers/Providers";
import { TerminalLogger } from "@/components/terminal/TerminalLogger";
import { AnimatePresence } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${GeistSans.variable}`}>
      <head>
        <title>Trustless Gig Escrow | MNEE</title>
        <meta name="description" content="Decentralized escrow for GitHub-verified freelance work. Get paid when your PR merges." />
        <meta name="theme-color" content="#0d1117" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-void-grid min-h-screen font-mono antialiased">
        {/* Scan line overlay effect */}
        <div className="scan-lines" />
        
        <Providers>
          <AnimatePresence mode="wait">
            <main className="relative z-10">
              {children}
            </main>
          </AnimatePresence>
          
          {/* Global Terminal Logger */}
          <TerminalLogger />
        </Providers>
      </body>
    </html>
  );
}
