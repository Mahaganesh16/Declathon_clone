'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#2B3B95] text-white pt-10 pb-6 select-none mt-12">
      
      {/* Top Feature Utilities Value Bar Row */}
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 border-b border-white/10 pb-8 text-sm font-bold tracking-tight">
        <div className="flex items-center gap-3"><span className="text-xl">🔄</span><span>Easy Returns*</span></div>
        <div className="flex items-center gap-3"><span className="text-xl">🏢</span><span>Collect in-store</span></div>
        <div className="flex items-center gap-3"><span className="text-xl">⚡</span><span>Express Delivery *</span></div>
        <div className="flex items-center gap-3"><span className="text-xl">😊</span><span>1 Mn+ happy customers</span></div>
        <div className="flex items-center gap-3"><span className="text-xl">🤝</span><span>We buy back</span></div>
      </div>

      {/* Links Navigation Matrix block */}
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pt-10 text-sm">
        <div className="space-y-4">
          <h3 className="font-extrabold text-base tracking-tight">Download the app</h3>
          <h3 className="font-extrabold text-base tracking-tight cursor-pointer hover:underline">Become a member</h3>
          <div className="flex items-center gap-4 pt-2 text-xl">
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">f</span>
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">𝕏</span>
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">▶</span>
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">📸</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-black text-xs text-white/50 uppercase tracking-widest mb-1">Services</h4>
          {['Decathlon for Schools', 'Decathlon for Corporates', 'Decathlon for Sport Clubs', 'Giftcard', 'Affiliate Program', 'Playo Summer', 'Second life', 'Buy back', 'Installation & assembly'].map((l, i) => (
            <p key={i} className="text-white/80 font-medium hover:text-white cursor-pointer hover:underline">{l}</p>
          ))}
        </div>

        <div className="space-y-2.5">
          <h4 className="font-black text-xs text-white/50 uppercase tracking-widest mb-1">Help</h4>
          {['Find a store', 'Return Policy', 'Shipping policy', 'Sitemap'].map((l, i) => (
            <p key={i} className="text-white/80 font-medium hover:text-white cursor-pointer hover:underline">{l}</p>
          ))}
        </div>

        <div className="space-y-2.5">
          <h4 className="font-black text-xs text-white/50 uppercase tracking-widest mb-1">About</h4>
          {['About us', 'Made In India', 'Social & CSR Initiatives', 'Careers', 'Blog'].map((l, i) => (
            <p key={i} className="text-white/80 font-medium hover:text-white cursor-pointer hover:underline">{l}</p>
          ))}
        </div>
      </div>

      {/* Corporate Meta copyright layout subfoot row */}
      <div className="max-w-[1440px] mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-white/60">
        <div className="flex items-center gap-2 font-bold">
          <span className="text-white tracking-tighter uppercase italic text-2xl font-black mr-4">DECATHLON</span>
          <span className="hover:text-white cursor-pointer">Terms and Conditions</span>
          <span className="mx-2">|</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-1.5 cursor-pointer bg-white/5 px-3 py-1.5 rounded border border-white/10 hover:bg-white/10 text-white">
            <span>🇮🇳</span><span>India</span><span>▼</span>
          </div>
          <p className="mt-1">© 2026 Decathlon Sports India Pvt Ltd. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}