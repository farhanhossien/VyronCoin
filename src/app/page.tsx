import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import { Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-24 relative z-10 bg-black/40 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-red-600">Vyron</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Vyron is not just a cryptocurrency; it&apos;s a comprehensive ecosystem designed for the next era of digital interaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/60 border border-white/10 p-8 rounded-2xl hover:border-red-500/50 transition-colors group box-glow">
              <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-red-500 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra Secure</h3>
              <p className="text-gray-400">
                Built on the robust BNB Smart Chain with audited smart contracts ensuring your assets are protected at all times.
              </p>
            </div>
            
            <div className="bg-black/60 border border-white/10 p-8 rounded-2xl hover:border-red-500/50 transition-colors group box-glow">
              <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-red-500 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">
                Experience near-instant transactions with minimal gas fees, making micro-transactions practical for AI services.
              </p>
            </div>
            
            <div className="bg-black/60 border border-white/10 p-8 rounded-2xl hover:border-red-500/50 transition-colors group box-glow">
              <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-red-500 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Ecosystem</h3>
              <p className="text-gray-400">
                A borderless digital economy connecting AI providers and consumers worldwide without intermediaries.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Tokenomics />
      
      <Roadmap />
      
      {/* FAQ Section */}
      <section id="faq" className="py-24 relative z-10 bg-black/40 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-red-600">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "What is Vyron Coin (VYR)?", a: "Vyron Coin is a premium utility token designed to power a futuristic AI ecosystem on the BNB Smart Chain." },
              { q: "How can I buy VYR?", a: "Currently, VYR is in the testnet phase for educational purposes. You can connect your MetaMask and interact with the contract using test BNB." },
              { q: "What network does Vyron use?", a: "Vyron Coin is deployed on the BNB Smart Chain (BSC) Testnet." },
              { q: "Is the smart contract audited?", a: "The smart contract uses standard, battle-tested OpenZeppelin libraries to ensure maximum security and reliability." }
            ].map((faq, i) => (
              <div key={i} className="bg-black/60 border border-white/10 p-6 rounded-xl hover:border-red-900/50 transition-colors">
                <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
