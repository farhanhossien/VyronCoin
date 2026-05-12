"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { ChevronRight, PlusCircle } from "lucide-react";

export default function Hero() {
  const { isConnected, addTokenToMetaMask } = useWallet();

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-semibold mb-6 tracking-widest uppercase">
            The Future of Decentralized AI
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 text-glow">Vyron Coin</span>
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            A premium, futuristic ecosystem bridging blockchain technology with artificial intelligence. Experience the next generation of digital assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#about"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-red-700 to-red-900 text-white font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 box-glow"
            >
              Explore Ecosystem <ChevronRight size={20} />
            </a>
            
            {isConnected && (
              <button 
                onClick={addTokenToMetaMask}
                className="px-8 py-4 rounded-full bg-black/50 border border-red-500/50 text-white font-bold text-lg transition-all hover:bg-red-900/20 flex items-center gap-2"
              >
                Add to MetaMask <PlusCircle size={20} />
              </button>
            )}
          </div>
        </motion.div>
        
        {/* Floating elements animation */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mt-20 mx-auto w-64 h-64 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-black rounded-full box-glow animate-spin-slow opacity-80" style={{ animationDuration: '10s' }}></div>
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center border border-red-900/50">
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-700 text-glow">VYR</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
