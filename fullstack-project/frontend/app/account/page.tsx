'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, User, Wallet, Heart, MapPin, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col font-sans">
      <Header />
      
      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-6 flex-1">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-[300px] flex-shrink-0 space-y-4">
          
          {/* User Profile Card */}
          <div className="bg-[#2B3B95] text-white p-6 rounded-md shadow-sm">
            <h2 className="text-[17px] font-black tracking-tight">{user.name}</h2>
            <p className="text-xs font-semibold text-white/80 mt-1">{user.email || user.phone}</p>
          </div>

          {/* Loyalty Points */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100">
            <div className="flex items-center justify-between font-black text-gray-900">
              <span className="text-sm tracking-tight">Loyalty Points</span>
              <span className="flex items-center gap-1 text-[15px]">0 pts <ChevronRightMini /></span>
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-3 leading-relaxed">
              Start shopping today to earn & redeem points for direct savings on purchases!
            </p>
            <button className="w-full mt-4 py-2 border border-gray-900 text-gray-900 text-xs font-black tracking-widest hover:bg-gray-50 transition-colors">
              LEARN MORE
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 py-3">
            <nav className="flex flex-col text-sm font-bold text-gray-700">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#EAEAF3] text-[#2B3B95] cursor-pointer">
                <div className="flex items-center gap-4">
                  <Package size={18} className="stroke-[1.5]" />
                  <span>My Orders</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <User size={18} className="stroke-[1.5] text-gray-400" />
                  <span>My Profile</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Wallet size={18} className="stroke-[1.5] text-gray-400" />
                  <span>Wallet</span>
                </div>
                <span className="text-gray-900">₹ 0</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Heart size={18} className="stroke-[1.5] text-gray-400" />
                  <span>Sporty Rewards</span>
                </div>
                <span className="text-gray-900">₹ 0</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <MapPin size={18} className="stroke-[1.5] text-gray-400" />
                  <span>Address</span>
                </div>
              </div>
              <div 
                onClick={handleLogout}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 cursor-pointer text-gray-700 mt-2"
              >
                <div className="flex items-center gap-4">
                  <Power size={18} className="stroke-[1.5] text-[#2B3B95]" />
                  <span>Logout</span>
                </div>
              </div>
            </nav>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-100 flex flex-col h-[550px]">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4 pl-6">
            <div className="flex items-center gap-6">
              <h1 className="text-[17px] font-black text-gray-900 tracking-tight">Orders & Returns</h1>
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded">
                <button className="px-3 py-1 bg-[#EAEAF3] text-[#2B3B95] text-xs font-black rounded shadow-sm tracking-wide">ONLINE ORDER</button>
                <button className="px-3 py-1 text-gray-500 text-xs font-black tracking-wide hover:text-gray-900">STORE ORDER</button>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:border-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Last 1 month
            </button>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-4 relative">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2B3B95" strokeWidth="1" strokeDasharray="3 3">
                <path d="M20.38 3.46L16 2a8.59 8.59 0 0 0-3.9 0L7.7 3.46a2.18 2.18 0 0 0-1.12 1.22l-4.4 10.43a2 2 0 0 0 2.85 2.5l3.85-2.22a2 2 0 0 1 2.37.16l4.47 3.76a2 2 0 0 0 2.56 0l4.47-3.76a2 2 0 0 1 2.37-.16l3.85 2.22a2 2 0 0 0 2.85-2.5l-4.4-10.43a2.18 2.18 0 0 0-1.14-1.22z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#FFC700] text-3xl font-black mb-2 block shadow-sm">?</span>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-700">No items are available</p>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}

function ChevronRightMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
