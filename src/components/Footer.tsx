import React from "react";
import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <span className="font-bold text-white text-sm">VYR</span>
              </div>
              <span className="font-bold text-xl tracking-wider text-white">VYRON</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              A premium, futuristic ecosystem bridging blockchain technology with artificial intelligence. Built on the BNB Smart Chain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-900/50 hover:text-white transition-colors border border-white/10">
                X
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-900/50 hover:text-white transition-colors border border-white/10">
                <Send size={18} />
              </a>
              <a href="https://github.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-900/50 hover:text-white transition-colors border border-white/10">
                GH
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-red-500 transition-colors">About</a></li>
              <li><a href="#tokenomics" className="text-gray-400 hover:text-red-500 transition-colors">Tokenomics</a></li>
              <li><a href="#roadmap" className="text-gray-400 hover:text-red-500 transition-colors">Roadmap</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-red-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Terms of Service</a></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-red-500 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Vyron Coin. All rights reserved. (Educational Purpose Only)
          </p>
          <div className="text-gray-500 text-sm">
            Contract: <span className="text-gray-400 font-mono">0x... (Testnet)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
