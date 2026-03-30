# ARX — Autonomous Lending Agent on Mantle

> Monitor DeFi lending positions, analyze risk with AI, and execute protective actions autonomously via Account Abstraction.

🔗 **Live Demo:** https://mantle-arx.vercel.app
📦 **GitHub:** https://github.com/rio-schumacer/arx

---

## The Problem

DeFi lending is powerful — but dangerous if left unmonitored. Health Factors drop silently. Liquidations happen fast. Users can't watch their positions 24/7, and every protective action (repay, rebalance) requires manual wallet approval.

**ARX solves this with three layers:**
1. **See** — real-time position monitoring from Aave V3 on Mantle
2. **Think** — Groq AI analyzes risk and decides what action to take
3. **Act** — ZeroDev session keys let the agent execute within user-defined limits, no repeated signatures

---

## Core Features

### 🔍 Watch Any Wallet
Track any Mantle address's Aave V3 position live from chain — collateral, debt, available borrow, LTV, and Health Factor. Risk alert fires automatically when HF < 1.5.

> **Status: ✅ Live** — data fetched directly from Aave V3 Pool contract on Mantle mainnet

### 🤖 AI Risk Analysis
Groq-powered agent (llama-3.1-8b-instant) reads position data and returns a decision: **HOLD / REPAY / SUPPLY / REBALANCE / OPTIMIZE** — with urgency level and specific dollar-amount recommendations. Terminal-style typing animation delivers the analysis line by line.

> **Status: ✅ Live** — real Groq API calls with position-aware prompting

### 📊 Yield + Borrow Simulator
Live APY/APR rates from both **Aave V3** and **Lendle** on Mantle, fetched via direct contract calls.
- **Supply mode:** daily / monthly / yearly earnings
- **Borrow mode:** max borrow capacity, borrow cost, net yield, estimated Health Factor

> **Status: ✅ Live** — APY from contract calls (not hardcoded)
> **Note:** LTV values use standard per-asset estimates, not fetched from contract

### 🔐 Account Abstraction via ZeroDev
User approves once. Agent is granted a session key with scoped permissions:
- Max $500 per transaction
- Aave V3 contract only
- 24-hour expiry

This is the core of ARX's autonomous execution model — the agent can act within safe bounds without requiring the user to be present.

> **Status: 🔧 Integration complete, execution in demo mode**
> ZeroDev SDK is integrated (Mantle Sepolia). Live onchain execution requires a funded testnet wallet — faucet access was blocked during development (requires mainnet MNT). The execution flow, session key schema, and smart account setup are production-ready code.

### 📡 Live Whale Ticker
Scrolling feed of real Aave V3 whale positions on Mantle — auto-refreshes every 60 seconds.

> **Status: ✅ Live** — 3 verified active addresses with real position data

---

## Tech Stack

- **Frontend:** Next.js 16, Tailwind CSS
- **Wallet:** Wagmi v2, injected connector (MetaMask/Rabby)
- **AI:** Groq API — llama-3.1-8b-instant
- **Account Abstraction:** ZeroDev SDK, ECDSA Validator, Session Keys, Kernel v3.1
- **Onchain Data:** Direct eth_call to Aave V3 + Lendle on Mantle mainnet RPC
- **Deployment:** Vercel

---

## Relevant Contracts (Mantle Mainnet)

- **Aave V3 Pool:** `0x458F293454fE0d67EC0655f3672301301DD51422`
- **Lendle Pool:** `0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3`

---

## Local Development

git clone https://github.com/rio-schumacer/arx.git
cd arx
npm install --legacy-peer-deps
Create .env.local:

NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=5003
GROQ_API_KEY=your_groq_api_key

npm run dev

───

Vision
ARX is a proof-of-concept for ERC-8183 autonomous agent infrastructure on Mantle. The architecture is designed to scale:

• Swap mock session execution for live ZeroDev execution with paymaster
• Extend AI agent to monitor multiple protocols (Lendle, Merchant Moe)
• Add webhook alerts for Health Factor drops
• Support multi-wallet monitoring dashboards

───
Built on Mantle · Powered by Aave V3, Groq AI & ZeroDev AA
