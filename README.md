# Vyron Coin (VYR) - Premium Next.js + Solidity Web3 Application

![Vyron Coin Dashboard](public/favicon.ico)

A complete, beginner-friendly crypto token project with a modern premium futuristic ecosystem. Built for educational and testing purposes using completely free tools.

## Features

- **Smart Contract**: ERC20 Token (Mintable, Burnable, Pausable)
- **Blockchain**: BNB Smart Chain Testnet
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Web3**: ethers.js v6, MetaMask Integration
- **Admin Portal**: Protected dashboard for managing the smart contract

---

## 🚀 Beginner's Deployment Guide

Follow these steps to deploy your own complete crypto ecosystem for free.

### Step 1: Deploy the Smart Contract (Remix IDE)

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a new file named `VyronCoin.sol` in the `contracts` folder.
3. Copy the code from `contracts/VyronCoin.sol` in this repository and paste it into Remix.
4. Go to the **Solidity Compiler** tab (left sidebar).
   - Set Compiler version to `0.8.20`.
   - Click **Compile VyronCoin.sol**.
5. Set up MetaMask for BNB Testnet:
   - Go to [ChainList](https://chainlist.org/chain/97) and click "Connect Wallet" -> "Add to MetaMask".
   - Get free test BNB from the [BNB Smart Chain Faucet](https://testnet.binance.org/faucet-smart) or [QuickNode Faucet](https://faucet.quicknode.com/binance-smart-chain/bnb-testnet).
6. Go to the **Deploy & Run Transactions** tab in Remix.
   - Set Environment to **Injected Provider - MetaMask**.
   - Make sure your MetaMask address shows up.
   - Expand the Deploy section next to "VyronCoin".
   - Enter your MetaMask wallet address in the `initialOwner` field.
   - Click **Deploy** and confirm the transaction in MetaMask.
7. Under "Deployed Contracts", copy your new **Contract Address**. Save this!

### Step 2: Set Up the Frontend Locally

1. Install Node.js (v18+) if you haven't already.
2. Clone or download this repository.
3. Open a terminal in the project folder and run `npm install`.
4. Copy the environment variables example file using `cp .env.example .env.local`.
5. Edit `.env.local` and paste your Contract Address from Step 1:
   `NEXT_PUBLIC_CONTRACT_ADDRESS="0xYourContractAddressHere"`
6. Start the local server with the development command (e.g. npm start dev).
7. Open `http://localhost:3000` in your browser.

### Step 3: Use the Admin Portal

1. Go to `http://localhost:3000/admin`.
2. Login with the default password: `farhan81567`.
   *(You can change this password in your `.env.local` file under `ADMIN_PASSWORD`)*
3. Connect your Admin Wallet (the one you used to deploy the contract).
4. You can now Mint new tokens, Burn tokens, and Pause the contract.

### Step 4: Deploy for Free to Vercel

1. Create a free account on [GitHub](https://github.com/) and [Vercel](https://vercel.com/).
2. Create a new GitHub repository and push your project code there.
3. Go to Vercel, click "Add New" -> "Project".
4. Import your GitHub repository.
5. In the Vercel configuration, open **Environment Variables** and add:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `your_contract_address`
   - `NEXT_PUBLIC_CHAIN_ID` = `97`
   - `NEXT_PUBLIC_RPC_URL` = `https://data-seed-prebsc-1-s1.binance.org:8545/`
   - `ADMIN_PASSWORD` = `farhan81567` (or your chosen password)
6. Click **Deploy**. Your premium crypto website is now live!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Web3 Connection**: ethers.js v6
- **Smart Contracts**: Solidity ^0.8.20, OpenZeppelin v5
- **Network**: BNB Smart Chain Testnet

## ⚠️ Disclaimer

This project is created strictly for **educational and testing purposes**. Do not use this for real financial projects on mainnet without conducting a professional security audit. Never share your private keys or hardcode sensitive information in public repositories.
