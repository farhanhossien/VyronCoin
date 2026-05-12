"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Inception & Launch",
      status: "completed",
      items: ["Smart Contract Development", "Testnet Deployment", "Website Launch", "Community Building Begins"],
    },
    {
      phase: "Phase 2",
      title: "Expansion",
      status: "active",
      items: ["Wallet Integration", "Marketing Campaign", "Initial DEX Offering", "CoinMarketCap & CoinGecko Listing"],
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Growth",
      status: "upcoming",
      items: ["Staking DApp Release", "Strategic Partnerships", "CEX Listings", "Governance Implementation"],
    },
    {
      phase: "Phase 4",
      title: "AI Integration",
      status: "upcoming",
      items: ["AI Trading Bot Beta", "Vyron AI Ecosystem Launch", "Mobile App Development", "Global Expansion"],
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Development <span className="text-red-600">Roadmap</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our strategic journey to revolutionize the intersection of AI and blockchain.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-red-900 to-transparent opacity-30 rounded-full"></div>

          <div className="space-y-12 relative">
            {phases.map((phase, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Empty space for alternating layout on desktop */}
                <div className="hidden md:block md:w-1/2"></div>
                
                {/* Content */}
                <div className="md:w-1/2 relative pl-12 md:pl-0 flex items-center justify-center flex-col">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 md:left-auto ${index % 2 === 0 ? 'md:-left-12' : 'md:-right-12'} top-0 md:top-6 w-10 h-10 rounded-full bg-black border-4 ${phase.status === 'completed' ? 'border-red-600 box-glow' : phase.status === 'active' ? 'border-red-500 animate-pulse' : 'border-gray-700'} flex items-center justify-center z-10`}>
                    <div className={`w-3 h-3 rounded-full ${phase.status === 'completed' ? 'bg-red-500' : phase.status === 'active' ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                  </div>

                  <div className={`bg-black/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm w-full ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'} hover:border-red-900/50 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-red-500 font-bold tracking-wider uppercase text-sm">{phase.phase}</span>
                      {phase.status === 'completed' && <span className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded-full border border-red-900/50">Done</span>}
                      {phase.status === 'active' && <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-900/50">Active</span>}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6">{phase.title}</h3>
                    
                    <ul className="space-y-3">
                      {phase.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {phase.status === 'completed' ? (
                            <CheckCircle2 className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
                          ) : phase.status === 'active' && idx < 2 ? (
                            <CheckCircle2 className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
                          ) : (
                            <Circle className="text-gray-600 shrink-0 w-5 h-5 mt-0.5" />
                          )}
                          <span className={phase.status === 'completed' || (phase.status === 'active' && idx < 2) ? 'text-gray-300' : 'text-gray-500'}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
