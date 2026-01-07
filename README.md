# 💻 Trustless Gig Escrow (Frontend)

The interactive dashboard for the Trustless Gig Escrow platform. Built with a "Cyberpunk / GitHub Dark" aesthetic, it provides a seamless interface for clients to fund gigs and freelancers to claim payments.

![Landing Page Preview](./public/homeview.png)
![Dashboard Preview](./public/dashboardPage.png)

## ✨ Features

* **Interactive Terminal:** A real-time logger at the bottom of the screen that visualizes blockchain transactions as they happen.
* **GitHub Integration:** "Repo Cards" that mimic GitHub's UI, complete with neon status indicators (Locked, Merged, Paid).
* **Gasless UX:** Visual cues indicating MNEE's gas-efficient transfer capabilities.
* **Demo Mode:** A built-in simulation mode to demonstrate the full flow without needing a wallet connection (perfect for judges).
* **Real-Time Animations:** Framer Motion animations for "CI/CD Pipeline" verification steps.

---

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Shadcn/UI
* **Web3:** Wagmi v2 + Viem + RainbowKit
* **Animations:** Framer Motion

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
cd trustless-gig-escrow-frontend
```

### 2. Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SEPOLIA_RPC_URL=[https://ethereum-sepolia.publicnode.com](https://ethereum-sepolia.publicnode.com)

# Set to 'true' to run without blockchain connection
NEXT_PUBLIC_DEMO_MODE=false 

```

### 3. Update Contract Addresses

Open `src/config/contracts.ts` and paste your deployed contract addresses:

```typescript
[sepolia.id]: {
  escrow: "0xYourEscrowContract",
  mneeToken: "0xYourMockToken",
}

```

### 4. Run Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to see the app.

---

## 🎮 How to Demo

### Option A: Simulation Mode

Set `NEXT_PUBLIC_DEMO_MODE=true` in your `.env.local`.

* This populates the dashboard with fake data.
* Transactions (Create, Verify) are simulated with delays to show animations.
* **Best for:** Quick video walkthroughs where speed is key.

### Option B: Live Testnet Mode

Set `NEXT_PUBLIC_DEMO_MODE=false`.

1. Connect your MetaMask wallet (Sepolia).
2. **Approve MNEE:** Use the yellow "Approve" button on the Create Gig form.
3. **Create Gig:** Deposit Mock MNEE.
4. **Verify:** Click "Verify & Merge" (requires LINK in the contract).
5. **Cancel:** Use the "Cancel Gig" button.

## 🚀 Mainnet Deployment Guide

For this hackathon submission, we used a **Mock MNEE Token** on Sepolia Testnet to simulate the payment flow.

To deploy this project on **Ethereum Mainnet** using the official MNEE Stablecoin, follow these simple steps:

1. **Locate the Official MNEE Contract:**
The official MNEE token address on Ethereum Mainnet is:
`0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf`
2. **Update Configuration:**
Open `src/config/contracts.ts` and paste the MNEE token address:
```typescript
mneeToken: "0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf",
```
---

## 📂 Project Structure

```bash
src/
├── app/              # Next.js Pages (Dashboard, Landing)
├── components/       # React Components
|   ├── buttons/      # Buttons
|   ├── layout/       # UI Layout
|   ├── overlays/     # Popups
│   ├── cards/        # RepoCard, GigStatus
│   ├── forms/        # CreateGigForm (Code-editor style)
│   └── terminal/     # The "Matrix" style logger
|   ├── providers/
├── hooks/            # Custom Wagmi Hooks (useGigEscrow.ts)
└── config/           # Contract ABIs and Addresses

```

```

```
