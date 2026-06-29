'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [isRegistering, setIsRegistering] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Handles both email and phone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    // Construct payload dynamically based on the active tab or auto-detect for registration
    let payloadFields = {};
    if (isRegistering) {
      const isPhone = /^\d{7,15}$/.test(inputValue.trim());
      payloadFields = isPhone ? { phone: inputValue.trim() } : { email: inputValue.trim() };
    } else {
      payloadFields = activeTab === 'phone' ? { phone: inputValue.trim() } : { email: inputValue.trim() };
    }
    
    const body = isRegistering 
      ? { name, password, ...payloadFields } 
      : { password, ...payloadFields };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.success) {
        // Handle successful auth (e.g., store token, redirect)
        if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b border-gray-200 flex items-center px-6 sticky top-0 bg-white z-10">
        <div className="w-1/3">
          <Link href="/" className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-black">
            <ChevronLeft size={20} />
            Back
          </Link>
        </div>
        <div className="w-1/3 flex justify-center">
          <span className="text-[#0072E3] font-black text-2xl tracking-tighter uppercase italic">
            DECATHLON
          </span>
        </div>
        <div className="w-1/3"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-20">
        <div className="w-full max-w-[400px]">
          
          <h1 className="text-2xl font-black mb-8 text-[#363636]">
            {isRegistering ? 'Create your account' : "Let's go!"}
          </h1>

          {/* TABS */}
          {!isRegistering && (
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                onClick={() => setActiveTab('email')}
                className={`flex-1 pb-3 text-sm font-bold text-center ${activeTab === 'email' ? 'border-b-2 border-[#0072E3] text-[#363636]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                E-mail
              </button>
              <button 
                onClick={() => setActiveTab('phone')}
                className={`flex-1 pb-3 text-sm font-bold text-center ${activeTab === 'phone' ? 'border-b-2 border-[#0072E3] text-[#363636]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Phone number
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0072E3] focus:ring-1 focus:ring-[#0072E3]"
                  required
                />
              </div>
            )}

            {activeTab === 'email' || isRegistering ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Enter an email address or phone number
                </label>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Email or phone number"
                  className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0072E3] focus:ring-1 focus:ring-[#0072E3]"
                  required
                />
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Country:
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded p-3 text-sm cursor-pointer">
                    <img src="https://flagcdn.com/w20/in.png" alt="India flag" className="w-5 h-auto rounded-sm shadow-sm" />
                    <span>+91</span>
                    <svg className="w-3 h-3 ml-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="w-2/3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile phone number
                  </label>
                  <input 
                    type="tel" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Mobile phone number"
                    className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0072E3] focus:ring-1 focus:ring-[#0072E3]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0072E3] focus:ring-1 focus:ring-[#0072E3]"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2B3B95] text-white font-bold py-3.5 rounded text-sm tracking-wide hover:bg-blue-900 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? 'PLEASE WAIT...' : (isRegistering ? 'REGISTER' : 'NEXT')}
            </button>
          </form>

          {/* SOCIAL LOGINS */}
          <div className="space-y-3 mb-8">
            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded text-sm font-bold text-[#363636] hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              Continue with Google
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded text-sm font-bold text-[#363636] hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continue with Facebook
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded text-sm font-bold text-[#363636] hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.637-.026 2.62-1.473 3.603-2.925 1.156-1.687 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor"/></svg>
              Continue with Apple
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-[15px] font-bold text-[#363636]">
              {isRegistering ? 'Already have an account?' : 'No account ? Create one !'}
            </h3>
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[#0072E3] text-sm font-bold mt-1 hover:underline text-left"
            >
              {isRegistering ? 'Login to your DECATHLON account' : 'Create your DECATHLON account'}
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-[15px] font-bold text-[#363636] mb-3">It's better when you're signed in</h3>
            <ul className="space-y-2">
              {[
                'Exclusive Deals and Sporty Rewards',
                'Personalised Experiences',
                'Faster Checkout',
                'Easy Returns/Exchange'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#363636]">
                  <Check size={16} className="text-[#363636]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-[#363636]">
            <a href="#" className="hover:underline">Having trouble logging in ?</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>

        </div>
      </main>
    </div>
  );
}
