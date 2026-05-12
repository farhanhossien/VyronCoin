"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, formatUnits } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID, VYRON_ABI } from "@/lib/contracts";
import { Contract } from "ethers";
import { toast } from "react-hot-toast";

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
  on: (eventName: string, handler: (params: unknown) => void) => void;
  removeListener: (eventName: string, handler: (params: unknown) => void) => void;
  removeAllListeners: (eventName?: string) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

interface WalletContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  wrongNetwork: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  addTokenToMetaMask: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    try {
      const provider = new BrowserProvider(window.ethereum as unknown as import("ethers").Eip1193Provider);
      const network = await provider.getNetwork();
      const isCorrect = Number(network.chainId) === CHAIN_ID;
      setWrongNetwork(!isCorrect);
      return isCorrect;
    } catch (error) {
      console.error("Failed to check network", error);
      return false;
    }
  };

  const getBalance = async (userAddress: string) => {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum as unknown as import("ethers").Eip1193Provider);
      const contract = new Contract(CONTRACT_ADDRESS, VYRON_ABI, provider);
      const bal = await contract.balanceOf(userAddress);
      setBalance(formatUnits(bal, 18));
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  const refreshBalance = async () => {
    if (address) await getBalance(address);
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new BrowserProvider(window.ethereum as unknown as import("ethers").Eip1193Provider);
      const accounts = await provider.send("eth_requestAccounts", []) as string[];
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const isCorrectNetwork = await checkNetwork();
        if (isCorrectNetwork) {
          await getBalance(accounts[0]);
          toast.success("Wallet connected!");
        } else {
          toast.error("Please switch to BNB Smart Chain Testnet");
          await switchNetwork();
        }
      }
    } catch (error: unknown) {
      console.error("Connection error:", error);
      const err = error as { message?: string };
      toast.error(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
      setWrongNetwork(false);
      if (address) await getBalance(address);
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      // This error code indicates that the chain has not been added to MetaMask.
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: "BNB Smart Chain Testnet",
                rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/"],
                nativeCurrency: {
                  name: "tBNB",
                  symbol: "tBNB",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet.bscscan.com"],
              },
            ],
          });
          setWrongNetwork(false);
        } catch (addError) {
          console.error("Failed to add network", addError);
        }
      }
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance("0");
    setIsConnected(false);
    toast.success("Wallet disconnected");
  };

  const addTokenToMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: CONTRACT_ADDRESS,
            symbol: "VYR",
            decimals: 18,
            image: "https://cryptologos.cc/logos/bnb-bnb-logo.png", // Using BNB logo as placeholder
          },
        },
      });

      if (wasAdded) {
        toast.success("Token added to MetaMask!");
      } else {
        toast.error("Token not added.");
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("Failed to add token to MetaMask");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum as unknown as import("ethers").Eip1193Provider);
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
            setIsConnected(true);
            const isCorrect = await checkNetwork();
            if (isCorrect) {
              await getBalance(accounts[0].address);
            }
          }
        } catch {
          console.log("Not connected");
        }

        const handleAccountsChanged = (accounts: unknown) => {
          const accs = accounts as string[];
          if (accs.length > 0) {
            setAddress(accs[0]);
            setIsConnected(true);
            getBalance(accs[0]);
          } else {
            disconnect();
          }
        };

        const handleChainChanged = () => {
          window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
          }
        };
      }
    };

    init();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected,
        isConnecting,
        wrongNetwork,
        connect,
        disconnect,
        addTokenToMetaMask,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
