"use client";

import React from "react";
import { motion } from "framer-motion";
import { PieChart, Zap, Users, Droplets, Megaphone, Shield } from "lucide-react";

export default function Tokenomics() {
  const stats = [
    { label: "Token Name", value: "Vyron Coin" },
    { label: "Symbol", value: "VYR" },
    { label: "Total Supply", value: "1,000,000" },
    { label: "Network", value: "BNB Smart Chain" },
    { label: "Decimals", value: "18" },
    { label: "Tax", value: "0%" },
  ];

  const distribution = [
    { name: "Ecosystem", percentage: 40, icon: <Zap className="text-red-500" /> },
    { name: "Community", percentage: 25, icon: <Users className="text-red-500" /> },
    { name: "Liquidity", percentage: 20, icon: <Droplets className="text-red-500" /> },
    { name: "Marketing", percentage: 10, icon: <Megaphone className="text-red-500" /> },
    { name: "Team", percentage: 5, icon: <Shield className="text-red-500" /> },
  ];

  return (
    <section id="tokenomics" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Token<span className="text-red-600">omics</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Sustainable and transparent token distribution designed for long-term growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-red-500/30 transition-colors backdrop-blur-sm">
                <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-white font-bold text-xl">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Distribution List */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-black/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-900/20 rounded-full blur-[80px]"></div>
            
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="text-red-500" /> Allocation
            </h3>
            
            <div className="space-y-6 relative z-10">
              {distribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-gray-300 font-medium">{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-red-800 to-red-500 h-2 rounded-full box-glow"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
