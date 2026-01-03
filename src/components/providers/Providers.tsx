"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/config/wagmi";
import { TerminalProvider } from "@/components/terminal/TerminalContext";
import "@rainbow-me/rainbowkit/styles.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Custom RainbowKit theme matching our cyberpunk aesthetic
 */
const cyberpunkTheme = darkTheme({
  accentColor: "#39d353",
  accentColorForeground: "#0d1117",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

// Override specific theme values
cyberpunkTheme.colors.modalBackground = "#161b22";
cyberpunkTheme.colors.modalBorder = "#30363d";
cyberpunkTheme.colors.modalText = "#c9d1d9";
cyberpunkTheme.colors.modalTextSecondary = "#8b949e";
cyberpunkTheme.colors.actionButtonBorder = "#30363d";
cyberpunkTheme.colors.actionButtonBorderMobile = "#30363d";
cyberpunkTheme.colors.closeButton = "#8b949e";
cyberpunkTheme.colors.closeButtonBackground = "#21262d";
cyberpunkTheme.colors.connectButtonBackground = "#161b22";
cyberpunkTheme.colors.connectButtonBackgroundError = "#f85149";
cyberpunkTheme.colors.connectButtonInnerBackground = "#21262d";
cyberpunkTheme.colors.connectButtonText = "#c9d1d9";
cyberpunkTheme.colors.connectButtonTextError = "#ffffff";
cyberpunkTheme.colors.generalBorder = "#30363d";
cyberpunkTheme.colors.generalBorderDim = "#21262d";
cyberpunkTheme.colors.menuItemBackground = "#21262d";
cyberpunkTheme.colors.profileAction = "#21262d";
cyberpunkTheme.colors.profileActionHover = "#30363d";
cyberpunkTheme.colors.profileForeground = "#161b22";
cyberpunkTheme.colors.selectedOptionBorder = "#39d353";
cyberpunkTheme.colors.standby = "#d29922";
cyberpunkTheme.shadows.connectButton = "0 0 10px rgba(57, 211, 83, 0.2)";
cyberpunkTheme.shadows.dialog = "0 8px 32px rgba(0, 0, 0, 0.5)";
cyberpunkTheme.shadows.profileDetailsAction = "0 2px 6px rgba(0, 0, 0, 0.3)";
cyberpunkTheme.shadows.selectedOption = "0 0 10px rgba(57, 211, 83, 0.3)";
cyberpunkTheme.shadows.selectedWallet = "0 0 10px rgba(57, 211, 83, 0.3)";
cyberpunkTheme.shadows.walletLogo = "0 2px 6px rgba(0, 0, 0, 0.3)";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={cyberpunkTheme}
          modalSize="compact"
          showRecentTransactions={true}
        >
          <TerminalProvider>{children}</TerminalProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
