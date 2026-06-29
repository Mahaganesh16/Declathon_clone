'use client';

import React, { useEffect, useState, use } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Star, Heart, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useQuickAdd } from '../../../context/QuickAddContext';

export default function PricePage({ params }: { params: Promise<{ amount: string }> }) {
  const unwrappedParams = use(params);
  const amount = unwrappedParams.amount;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openModal } = useQuickAdd();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    openModal(product);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`http://localhost:5000/api/products?maxPrice=${amount}`, { cache: 'no-store' });
        const data = await res.json();
        // Filter out zero-price products and layout mock items
        const filteredData = Array.isArray(data) ? data.filter((p: any) => Number(p.price) > 0 && p.name !== 'UNDER') : [];
        setProducts(filteredData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [amount]);

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6 hidden md:block">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-sm">Filters (1)</h3>
            <button suppressHydrationWarning className="text-blue-600 font-semibold text-sm">Clear all ×</button>
          </div>
          
          <div className="flex gap-2 mb-6">
            <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
              Exclude out of stock ×
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <h4 className="font-bold text-sm">Price</h4>
              <ChevronDown size={16} />
            </div>
            <p className="text-xs text-gray-500 mb-4">From ₹49 to ₹{amount}</p>
            
            {/* Fake Slider */}
            <div className="h-1 bg-gray-200 w-full relative rounded-full mb-6 mt-2">
              <div className="absolute left-0 top-0 h-full bg-[#2B3B95] w-full rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2B3B95] rounded-full border-2 border-white shadow"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2B3B95] rounded-full border-2 border-white shadow"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mb-1">Minimum</label>
                <div className="border border-gray-300 rounded px-3 py-2 text-sm font-semibold">₹49</div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mb-1">Maximum</label>
                <div className="border border-gray-300 rounded px-3 py-2 text-sm font-semibold">₹{amount}</div>
              </div>
            </div>
          </div>

          {['Gender', 'Category', 'Size', 'Sport', 'Brand', 'Color'].map((filter) => (
            <div key={filter} className="border-t border-gray-200 pt-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
              <h4 className="font-medium text-sm text-gray-800">{filter}</h4>
              <span className="text-xl font-light text-gray-400">+</span>
            </div>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group relative flex flex-col cursor-pointer bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all rounded-lg p-2">
                  <Link href={`/product/${product.id}`} className="block relative w-full aspect-[4/5] bg-gray-50 rounded-md overflow-hidden mb-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-[13px] text-gray-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <div className="flex text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" fillOpacity={0.5} />
                      </div>
                      <span className="text-xs text-gray-500">4.5k</span>
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-[15px]">₹{product.price}</span>
                        <span className="text-[11px] text-gray-400 font-semibold line-through">MRP ₹{product.price + 300}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Heart size={16} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="flex-1 py-2 text-xs font-bold border border-[#0072E3] text-[#0072E3] rounded hover:bg-[#0072E3] hover:text-white transition-colors"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">No products found under ₹{amount}</h2>
              <p className="text-gray-500">Try checking a different price category.</p>
            </div>
          )}
        </div>

      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-black text-white px-6 py-3 rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-5 flex items-center gap-3 font-semibold text-sm">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          {toastMessage}
        </div>
      )}

      <Footer />
    </main>
  );
}
