"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { CONTRACT_ADDRESS, VYRON_ABI } from "@/lib/contracts";
import toast from "react-hot-toast";
import { LogOut, Activity, PauseCircle, PlayCircle, Plus, Flame, Wallet, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface TokenStats {
  totalSupply: string;
  isPaused: boolean;
  owner: string;
  contractAddress: string;
  network: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { address, isConnected, connect } = useWallet();
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Forms state
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic check if token exists to verify auth
    const checkAuth = async () => {
      // In a real app we'd verify the cookie, here we just assume if they reached this page
      // without being redirected by middleware, they are auth'd, or we check auth API
      setIsAuthenticated(true);
      fetchStats();
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const executeContractAction = async (action: (contract: Contract) => Promise<unknown>, successMessage: string) => {
    if (!isConnected) {
      toast.error("Please connect wallet first");
      return;
    }
    
    if (stats?.contractAddress === "Not Deployed" || stats?.contractAddress === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract not deployed yet. Please update .env");
      return;
    }

    try {
      setActionLoading(true);
      const provider = new BrowserProvider(window.ethereum as unknown as import("ethers").Eip1193Provider);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, VYRON_ABI, signer);
      
      const tx = await action(contract);
      toast.loading("Transaction pending...", { id: "tx" });
      await (tx as import("ethers").ContractTransactionResponse).wait();
      toast.success(successMessage, { id: "tx" });
      
      // Refresh stats
      fetchStats();
    } catch (error: unknown) {
      console.error("Contract action error:", error);
      const err = error as { reason?: string, message?: string };
      toast.error(err.reason || err.message || "Transaction failed", { id: "tx" });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = () => {
    executeContractAction(
      (contract) => contract.pause(),
      "Contract paused successfully"
    );
  };

  const handleUnpause = () => {
    executeContractAction(
      (contract) => contract.unpause(),
      "Contract unpaused successfully"
    );
  };

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAddress || !mintAmount) return;
    
    executeContractAction(
      (contract) => contract.mint(mintAddress, parseUnits(mintAmount, 18)),
      `Successfully minted ${mintAmount} VYR`
    );
    setMintAddress("");
    setMintAmount("");
  };

  const handleBurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!burnAmount) return;
    
    executeContractAction(
      (contract) => contract.burn(parseUnits(burnAmount, 18)),
      `Successfully burned ${burnAmount} VYR`
    );
    setBurnAmount("");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <span className="font-bold text-white text-xs">VYR</span>
              </div>
            </Link>
            <h1 className="text-xl font-bold text-white hidden sm:block">Admin Dashboard</h1>
            <span className="bg-red-900/30 text-red-500 text-xs px-2 py-1 rounded border border-red-900/50 ml-2">
              Protected
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {!isConnected ? (
              <button
                onClick={connect}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-600 flex items-center gap-2"
              >
                <Wallet size={16} /> Connect Admin Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 px-4 py-2 rounded-md">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-mono text-gray-300">
                  {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Warning if not deployed */}
        {stats?.contractAddress === "Not Deployed" && (
          <div className="mb-8 bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg flex items-start gap-3">
            <ShieldAlert className="text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-500 font-bold">Contract Not Configured</h3>
              <p className="text-yellow-200/70 text-sm mt-1">
                The smart contract address is not configured in the `.env` file. Please deploy the contract using Remix IDE and update the environment variables to enable token interactions.
              </p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-black/60 border border-white/10 p-6 rounded-xl box-glow">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
              <Activity size={18} className="text-red-500" />
              <h3 className="font-medium">Total Supply</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {loading ? "..." : Number(stats?.totalSupply).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">VYR</p>
          </div>
          
          <div className="bg-black/60 border border-white/10 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
              {stats?.isPaused ? <PauseCircle size={18} className="text-yellow-500" /> : <PlayCircle size={18} className="text-green-500" />}
              <h3 className="font-medium">Status</h3>
            </div>
            <p className="text-xl font-bold text-white mt-2">
              {loading ? "..." : stats?.isPaused ? (
                <span className="text-yellow-500 flex items-center gap-2"><PauseCircle size={16}/> Paused</span>
              ) : (
                <span className="text-green-500 flex items-center gap-2"><CheckCircle2 size={16}/> Active</span>
              )}
            </p>
          </div>

          <div className="bg-black/60 border border-white/10 p-6 rounded-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
              <ShieldAlert size={18} className="text-red-500" />
              <h3 className="font-medium">Contract Info</h3>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address:</span>
                <span className="font-mono text-gray-300 truncate w-2/3 text-right">{stats?.contractAddress || "Loading..."}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Owner:</span>
                <span className="font-mono text-gray-300 truncate w-2/3 text-right">{stats?.owner || "Loading..."}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Network:</span>
                <span className="text-gray-300">{stats?.network || "Loading..."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mint Panel */}
          <div className="bg-black/60 border border-white/10 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-900/10 rounded-full blur-[50px]"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-900/30 rounded-lg border border-green-500/30">
                <Plus className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Mint Tokens</h2>
            </div>
            
            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (VYR)</label>
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  placeholder="1000"
                  min="1"
                  step="any"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading || !isConnected}
                className="w-full bg-green-900/50 hover:bg-green-800/80 text-green-400 font-bold py-2 px-4 rounded-lg border border-green-500/50 transition-all disabled:opacity-50 mt-4"
              >
                Mint Tokens
              </button>
            </form>
          </div>

          {/* Burn Panel */}
          <div className="bg-black/60 border border-white/10 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-900/10 rounded-full blur-[50px]"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-900/30 rounded-lg border border-orange-500/30">
                <Flame className="text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Burn Tokens</h2>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              Burning removes tokens from circulation permanently. You can only burn tokens from your connected wallet balance.
            </p>
            
            <form onSubmit={handleBurn} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount to Burn (VYR)</label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="1000"
                  min="1"
                  step="any"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading || !isConnected}
                className="w-full bg-orange-900/50 hover:bg-orange-800/80 text-orange-400 font-bold py-2 px-4 rounded-lg border border-orange-500/50 transition-all disabled:opacity-50 mt-4"
              >
                Burn Tokens
              </button>
            </form>
          </div>

          {/* Emergency Controls Panel */}
          <div className="bg-black/60 border border-red-900/30 p-8 rounded-2xl md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-[80px]"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-900/30 rounded-lg border border-red-500/30">
                <ShieldAlert className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Emergency Controls</h2>
            </div>
            
            <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Pause/Unpause Contract</h3>
                <p className="text-gray-400 text-sm">
                  Pausing the contract will stop all token transfers immediately. Use only in case of emergency or critical bugs.
                </p>
              </div>
              
              <div className="shrink-0 w-full md:w-auto">
                {stats?.isPaused ? (
                  <button
                    onClick={handleUnpause}
                    disabled={actionLoading || !isConnected}
                    className="w-full md:w-auto bg-green-900/50 hover:bg-green-800/80 text-green-400 font-bold py-3 px-6 rounded-lg border border-green-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18} /> Unpause Contract
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    disabled={actionLoading || !isConnected}
                    className="w-full md:w-auto bg-red-900/50 hover:bg-red-800/80 text-red-400 font-bold py-3 px-6 rounded-lg border border-red-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <PauseCircle size={18} /> Pause Contract
                  </button>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
