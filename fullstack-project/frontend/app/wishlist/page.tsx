'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWishlist } from '../../context/WishlistContext';
import { useQuickAdd } from '../../context/QuickAddContext';
import { Star, X, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { openModal } = useQuickAdd();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRemove = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(product);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-black text-white px-6 py-3 rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-5 flex items-center gap-3 font-semibold text-sm">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          {toastMessage}
        </div>
      )}

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 flex-1">
        
        {/* Header Section */}
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Wishlist</h1>
          <span className="text-sm font-semibold text-gray-700">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</span>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">Save items you like to your wishlist by clicking the heart icon on any product.</p>
            <Link href="/" className="px-8 py-3 bg-[#0072E3] text-white font-bold rounded shadow-sm hover:bg-[#005bb5] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group relative flex flex-col border border-transparent hover:border-gray-200 p-2 rounded-lg transition-all cursor-pointer">
                
                {/* Remove Button */}
                <button 
                  onClick={(e) => handleRemove(e, product)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-gray-500 hover:text-black hover:bg-white transition-colors"
                >
                  <X size={16} className="stroke-[2.5]" />
                </button>

                {/* Image */}
                <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden rounded-md mb-4 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                    <span className="text-xs text-gray-500 font-semibold ml-1">4.5k</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-black text-gray-900">₹{product.price}</span>
                    <span className="text-xs text-gray-500 font-bold line-through">MRP ₹{Number(product.price) + 700}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full py-2.5 border border-gray-300 rounded text-sm font-bold text-gray-800 hover:border-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
