'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { Trash2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const totalMRP = cartTotal + (cartItems.length * 300); // Fake MRP for UI matching
  const discount = cartItems.length * 300;

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-[#0072E3] font-semibold text-sm hover:underline">← Back to Shop</Link>
          <div className="flex-1 text-center pr-24">
            <h1 className="text-2xl font-black text-[#0072E3] tracking-tighter italic">DECATHLON</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto">
          {/* LEFT SIDE: CART ITEMS */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center border-b-2 border-[#0072E3] pb-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cart Items</h2>
              <button 
                onClick={clearCart}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                title="Clear Cart"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-lg p-4 flex items-center gap-4 border border-blue-100">
              <div className="bg-[#0072E3] text-white p-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <p className="text-sm font-semibold text-gray-800 flex-1">Delivery to <span className="text-[#0072E3]">Bangalore Central, Bangalore, 560001, Karnataka</span></p>
              <button className="text-[#0072E3] font-bold text-xs uppercase tracking-wider">Login</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                <Link href="/" className="bg-[#0072E3] text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-32 h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[15px] text-gray-900 leading-snug line-clamp-2 max-w-[80%]">
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500 font-semibold">Qty</span>
                        <div className="flex items-center border border-gray-200 rounded">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">-</button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold">+</button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <span className="font-black text-xl text-gray-900">₹{item.price * item.quantity}</span>
                        <span className="text-xs text-gray-400 font-semibold line-through">MRP ₹{(item.price + 300) * item.quantity}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Heart size={14} />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-gray-600 mt-4 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        Delivery by <span className="font-bold text-black">30th Jun 2026</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6">
            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎁</span>
              </div>
              <p className="text-[11px] font-semibold text-gray-700 leading-relaxed mb-4">
                Oops... You're not logged in! Log in now to unlock more exclusive <span className="font-black">Rewards and Vouchers!</span>
              </p>
              <button className="px-8 py-2 border border-gray-300 rounded-full text-xs font-bold bg-white hover:bg-gray-50">Login</button>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-semibold text-gray-600 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span className="text-gray-900">₹{totalMRP}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount on MRP</span>
                  <span className="text-green-500">-₹{discount}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-normal mt-1">Convenience fee will be calculated on next step</p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-gray-900">₹{cartTotal}</span>
              </div>

              {discount > 0 && (
                <div className="bg-green-50 text-green-700 text-xs font-bold text-center py-2.5 rounded mb-4">
                  You saved ₹{discount} on this order
                </div>
              )}

              <button className="w-full py-4 bg-[#2B3B95] text-white font-bold rounded hover:bg-blue-900 transition-colors text-sm shadow-md">
                Login to Proceed
              </button>
            </div>
            
            <div className="w-full">
               <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=400&h=100&fit=crop" alt="Promo" className="w-full h-auto rounded-xl shadow-sm opacity-90"/>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
