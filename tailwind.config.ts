import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Cyberpunk Color Palette - GitHub Dark meets Neon
      colors: {
        // Base colors (GitHub Dark)
        void: {
          DEFAULT: "#0d1117",
          50: "#161b22",
          100: "#21262d",
          200: "#30363d",
          300: "#484f58",
          400: "#6e7681",
          500: "#8b949e",
        },
        // Neon accents
        neon: {
          green: "#39d353",
          "green-dim": "#238636",
          "green-glow": "#2ea043",
          purple: "#a371f7",
          "purple-dim": "#8957e5",
          "purple-glow": "#bc8cff",
          cyan: "#58a6ff",
          "cyan-dim": "#388bfd",
          yellow: "#d29922",
          "yellow-glow": "#e3b341",
          red: "#f85149",
          "red-dim": "#da3633",
          orange: "#db6d28",
        },
        // Terminal colors
        terminal: {
          bg: "#0d1117",
          border: "#30363d",
          text: "#c9d1d9",
          muted: "#8b949e",
          prompt: "#39d353",
          error: "#f85149",
          warning: "#d29922",
          info: "#58a6ff",
        },
        // Status colors
        status: {
          locked: "#d29922",
          unlocked: "#39d353",
          pending: "#58a6ff",
          merged: "#a371f7",
          failed: "#f85149",
        },
      },
      // Custom fonts
      fontFamily: {
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "Fira Code", "monospace"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      // Animations
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "border-trace": "border-trace 3s linear infinite",
        "glitch": "glitch 0.3s ease-in-out infinite",
        "typewriter": "typewriter 0.1s steps(1) infinite",
        "scan-line": "scan-line 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "confetti": "confetti 0.5s ease-out forwards",
        "terminal-blink": "terminal-blink 1s step-end infinite",
        "neon-flicker": "neon-flicker 0.15s ease-in-out infinite alternate",
        "progress-flow": "progress-flow 2s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
          },
          "50%": {
            boxShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "border-trace": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "confetti": {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(180deg)", opacity: "0" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "neon-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "progress-flow": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      // Box shadows for neon effects
      boxShadow: {
        "neon-green": "0 0 5px #39d353, 0 0 10px #39d353, 0 0 20px #39d353",
        "neon-purple": "0 0 5px #a371f7, 0 0 10px #a371f7, 0 0 20px #a371f7",
        "neon-cyan": "0 0 5px #58a6ff, 0 0 10px #58a6ff, 0 0 20px #58a6ff",
        "neon-yellow": "0 0 5px #d29922, 0 0 10px #d29922, 0 0 20px #d29922",
        "neon-red": "0 0 5px #f85149, 0 0 10px #f85149, 0 0 20px #f85149",
        "inner-glow": "inset 0 0 20px rgba(57, 211, 83, 0.1)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(57, 211, 83, 0.5)",
      },
      // Background images
      backgroundImage: {
        "grid-pattern": `
          linear-gradient(rgba(48, 54, 61, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(48, 54, 61, 0.3) 1px, transparent 1px)
        `,
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "neon-border": "linear-gradient(90deg, #39d353, #a371f7, #58a6ff, #39d353)",
        "progress-gradient": "linear-gradient(90deg, transparent, #39d353, #a371f7, transparent)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
      // Border radius (keeping it sharp/industrial)
      borderRadius: {
        "sm": "2px",
        "DEFAULT": "4px",
        "md": "6px",
        "lg": "8px",
      },
      // Spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
