'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronDown, Star, Heart, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Format slug for title
  const categoryTitle = typeof params.slug === 'string' 
    ? params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Products';

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/categories?type=standard', { cache: 'no-store' });
        if (res.ok) {
          const cats = await res.json();
          const regularCats = cats; // No longer need to filter layout IDs manually
          
          // Just aggregate all products for demo purposes so the grid looks full
          const allProducts = regularCats.flatMap((c: any) => c.products || []).filter((p: any) => Number(p.price) > 0);
          
          // Try to find matching category first, else just use all products as fallback
          const matchingCat = regularCats.find((c: any) => c.name.toLowerCase().includes(typeof params.slug === 'string' ? params.slug.replace(/-/g, ' ') : ''));
          
          if (matchingCat && matchingCat.products && matchingCat.products.length > 0) {
            setProducts([...matchingCat.products.filter((p: any) => Number(p.price) > 0), ...allProducts].slice(0, 16)); // Pad with all products to show grid
          } else {
            // Duplicate to show many items
            setProducts([...allProducts, ...allProducts, ...allProducts].slice(0, 20));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [params.slug]);

  const [priceRange, setPriceRange] = useState([199, 4999]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      {/* Top Breadcrumb & Filters Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          {/* Breadcrumb - Optional, skipping to match exact UI of top filter bar */}
          
          {/* Horizontal Top Filters */}
          <div className="flex items-center gap-4 text-[13px] font-semibold text-gray-800 flex-wrap">
            <div className="flex items-center justify-between w-60 border-r border-gray-200 pr-4">
              <span className="font-bold">Filters (1)</span>
              <button className="text-[#0072E3] hover:underline flex items-center gap-1">Clear all <X size={14} /></button>
            </div>
            
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap px-2 flex-1">
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Fit <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Number of pockets <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Neck type <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Main material <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Pocket <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Style <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Sleeves length <ChevronDown size={14} /></button>
              <button className="flex items-center gap-1.5 hover:text-[#0072E3]">Pattern <ChevronDown size={14} /></button>
            </div>
            
            <div className="flex items-center gap-6 border-l border-gray-200 pl-4">
               <span className="text-gray-500">{products.length} items</span>
               <button className="flex items-center gap-1.5 font-bold">Most relevant <ChevronDown size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto w-full px-6 py-6 flex gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-60 flex-shrink-0 space-y-6">
          
          {/* Price Filter */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between font-bold text-[15px] mb-2 cursor-pointer">
              <span>Price</span>
              <Minus size={16} />
            </div>
            <p className="text-[13px] text-gray-500 mb-4">From ₹199 to ₹4,999</p>
            
            {/* Custom Range Slider Track */}
            <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
              <div className="absolute left-0 right-0 h-full bg-[#2B3B95] rounded-full"></div>
              <div className="absolute left-0 -top-2 w-5 h-5 bg-[#2B3B95] rounded-full border-2 border-white shadow cursor-pointer"></div>
              <div className="absolute right-0 -top-2 w-5 h-5 bg-[#2B3B95] rounded-full border-2 border-white shadow cursor-pointer"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-gray-600">₹</span>
                  <input type="text" value="199" readOnly className="w-full pl-6 py-2 border border-gray-300 rounded text-[13px] font-bold focus:outline-none" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-gray-600">₹</span>
                  <input type="text" value="4,999" readOnly className="w-full pl-6 py-2 border border-gray-300 rounded text-[13px] font-bold focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Accordions */}
          {['Gender', 'Category', 'Size', 'Sport', 'Brand', 'Color'].map((filterName) => (
             <div key={filterName} className="border-b border-gray-200 pb-4">
               <div className="flex items-center justify-between font-bold text-[15px] cursor-pointer hover:text-[#0072E3] transition-colors">
                 <span>{filterName}</span>
                 <Plus size={16} />
               </div>
             </div>
          ))}

        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {/* Active Filters Tag (Exclude out of stock) */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors">
              Exclude out of stock <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {loading ? (
              <div className="col-span-full py-20 text-center font-bold">Loading products...</div>
            ) : products.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="flex flex-col group relative">
                
                {/* Product Image Box */}
                <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden rounded-sm cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
                  {product.sale && (
                    <div className="absolute top-2 left-2 bg-[#E2001A] text-white text-[10px] font-black px-2 py-0.5 uppercase z-10 rounded-sm shadow-sm">
                      Sale
                    </div>
                  )}
                  <img 
                    src={product.image || '/images/trackpants_main.png'} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Product Details */}
                <div className="pt-3 flex flex-col flex-1">
                  {/* Brand & Name */}
                  <span className="text-[11px] font-black uppercase text-gray-900 tracking-wide line-clamp-1">
                    {product.name.split(' ')[0] || 'DOMYOS'}
                  </span>
                  <Link href={`/product/${product.id}`} className="text-[13px] text-gray-800 font-semibold leading-tight line-clamp-2 mt-0.5 hover:text-[#0072E3] min-h-[36px]">
                    {product.name}
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1.5 mb-2">
                    <div className="flex text-[#FFCC00]">
                      <Star size={12} fill="currentColor" stroke="none" />
                      <Star size={12} fill="currentColor" stroke="none" />
                      <Star size={12} fill="currentColor" stroke="none" />
                      <Star size={12} fill="currentColor" stroke="none" />
                      <Star size={12} fill="currentColor" fillOpacity={0.5} stroke="none" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600">4.5k</span>
                  </div>
                  
                  <div className="mt-auto">
                    {/* Price & Colors Row */}
                    <div className="flex items-end justify-between mt-1">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-gray-900 tracking-tight">₹{product.price}</span>
                          {product.sale && <span className="text-[10px] font-black text-[#E2001A] bg-[#FDE9EC] px-1 py-0.5 rounded-sm">68% off</span>}
                        </div>
                        <span className="text-[11px] font-bold text-gray-500">MRP <span className="line-through">₹{Number(product.price) + 600}</span></span>
                      </div>
                      
                      {/* Colors */}
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-black border border-gray-300 cursor-pointer shadow-sm"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-400 border border-gray-300 cursor-pointer shadow-sm"></div>
                        <span className="text-[10px] font-bold text-gray-500 ml-0.5">+14</span>
                      </div>
                    </div>
                    
                    {/* Add to Cart Actions */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded hover:border-black bg-white transition-colors"
                      >
                        <Heart size={16} className={`stroke-[2] ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="flex-1 h-9 flex items-center justify-center bg-white border border-gray-300 rounded text-[13px] font-bold text-gray-800 hover:border-black transition-colors"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
