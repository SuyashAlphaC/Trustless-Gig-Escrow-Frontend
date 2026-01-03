"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { TerminalLog } from "@/types";
import { generateId } from "@/lib/utils";

interface TerminalContextType {
  logs: TerminalLog[];
  addLog: (type: TerminalLog["type"], message: string, prefix?: string) => void;
  clearLogs: () => void;
  isMinimized: boolean;
  toggleMinimize: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: generateId(),
      timestamp: Date.now(),
      type: "info",
      message: "Trustless Gig Escrow v1.0.0",
      prefix: "system",
    },
    {
      id: generateId(),
      timestamp: Date.now(),
      type: "info",
      message: "Initializing Web3 connection...",
      prefix: "web3",
    },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const maxLogs = useRef(50);

  const addLog = useCallback(
    (type: TerminalLog["type"], message: string, prefix?: string) => {
      const newLog: TerminalLog = {
        id: generateId(),
        timestamp: Date.now(),
        type,
        message,
        prefix,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        // Keep only the last maxLogs entries
        if (updated.length > maxLogs.current) {
          return updated.slice(-maxLogs.current);
        }
        return updated;
      });
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([
      {
        id: generateId(),
        timestamp: Date.now(),
        type: "info",
        message: "Terminal cleared",
        prefix: "system",
      },
    ]);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return (
    <TerminalContext.Provider
      value={{ logs, addLog, clearLogs, isMinimized, toggleMinimize }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
