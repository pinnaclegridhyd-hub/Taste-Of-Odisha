'use client';

import { ShieldCheck, Truck, Award, Lock, Zap } from 'lucide-react';

export default function TrustSignals() {
  const signals = [
    { 
      icon: Award, 
      title: 'Authentic Odisha', 
      desc: 'Handmade by Artisans' 
    },
    { 
      icon: ShieldCheck, 
      title: 'Secure Payment', 
      desc: 'SSL Encrypted Gateway' 
    },
    { 
      icon: Truck, 
      title: 'Direct Shipping', 
      desc: 'Safe & Tracked Passage' 
    },
    { 
      icon: Zap, 
      title: 'Trust Verified', 
      desc: 'Quality Guaranteed' 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-heritage-dark/5">
      {signals.map((s, i) => (
        <div key={i} className="flex flex-col items-center text-center gap-4 group animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="w-10 h-10 rounded-lg bg-heritage-bone flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <s.icon className="w-4 h-4" />
          </div>
          <div className="space-y-1">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-heritage-dark">{s.title}</h4>
             <p className="text-[9px] text-heritage-dark/30 font-bold uppercase tracking-widest leading-tight">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
