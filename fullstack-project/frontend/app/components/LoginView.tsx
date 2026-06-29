'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
}

export default function LoginView({ onBack }: LoginViewProps) {
  const [loginTab, setLoginTab] = useState<'email' | 'phone'>('email');

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans antialiased pb-12">
      {/* Top Header Controls Bar */}
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        
        {/* Logo centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-[#0072E3] font-black text-3xl tracking-tighter uppercase italic">
            DECATHLON
          </span>
        </div>
        <div className="w-16"></div> {/* Empty spacer for layout balancing */}
      </div>

      {/* Main Container Layout */}
      <main className="max-w-[420px] mx-auto px-4 pt-10 space-y-6">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Login</h1>

        {/* E-mail / Phone number tabs selector */}
        <div className="w-full flex border-b border-gray-200 text-sm font-bold text-gray-400">
          <button 
            onClick={() => setLoginTab('email')}
            className={`flex-1 text-center pb-3 border-b-2 transition-colors ${
              loginTab === 'email' ? 'border-blue-700 text-gray-900 font-black' : 'border-transparent hover:text-gray-600'
            }`}
          >
            E-mail
          </button>
          <button 
            onClick={() => setLoginTab('phone')}
            className={`flex-1 text-center pb-3 border-b-2 transition-colors ${
              loginTab === 'phone' ? 'border-blue-700 text-gray-900 font-black' : 'border-transparent hover:text-gray-600'
            }`}
          >
            Phone number
          </button>
        </div>

        {/* Input fields panel conditional routing */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-800">
            {loginTab === 'email' ? 'Enter an email address' : 'Enter a phone number'}
          </p>
          <input 
            type={loginTab === 'email' ? 'email' : 'tel'} 
            placeholder={loginTab === 'email' ? 'Email' : 'Phone number'} 
            className="w-full px-4 py-3.5 border border-gray-400 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
          <button className="w-full py-4 bg-[#2B3B95] text-white font-black text-sm tracking-widest uppercase rounded-sm hover:bg-blue-800 transition-colors shadow-sm">
            NEXT
          </button>
        </div>

        {/* Third-Party Social OAuth Matrix Block */}
        <div className="space-y-3 pt-2">
          <button className="w-full py-3.5 border border-gray-300 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/355037/google-icon.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-bold text-gray-900">Continue with Google</span>
          </button>
          <button className="w-full py-3.5 border border-gray-300 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/512120/facebook-176.svg" alt="Facebook" className="w-5 h-5" />
            <span className="text-sm font-bold text-gray-900">Continue with Facebook</span>
          </button>
          <button className="w-full py-3.5 border border-gray-300 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/448204/apple.svg" alt="Apple" className="w-5 h-5" />
            <span className="text-sm font-bold text-gray-900">Continue with Apple</span>
          </button>
        </div>

        {/* No Account Link Creation Row */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          <p className="text-sm font-bold text-gray-900">No account ? Create one !</p>
          <button className="text-sm font-bold text-blue-700 underline hover:text-blue-800 text-left">
            Create your DECATHLON account
          </button>
        </div>

        {/* Benefits microcopy checklist foot section */}
        <div className="pt-4 space-y-3">
          <p className="text-sm font-black text-gray-900 tracking-tight">It&apos;s better when you&apos;re signed in</p>
          <ul className="space-y-2.5 text-xs text-gray-700 font-bold">
            <li className="flex items-center gap-2.5">
              <Check size={16} className="text-gray-900 stroke-[3]" />
              <span>Exclusive Deals and Sporty Rewards</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check size={16} className="text-gray-900 stroke-[3]" />
              <span>Personalised Experiences</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check size={16} className="text-gray-900 stroke-[3]" />
              <span>Faster Checkouts</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}