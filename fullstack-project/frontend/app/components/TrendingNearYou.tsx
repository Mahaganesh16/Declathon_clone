'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image: string;
}

interface TrendingNearYouProps {
  products: Product[];
}

export default function TrendingNearYou({ products }: TrendingNearYouProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Create an infinite loop track by tripling the products array length
  const infiniteProducts = [...products, ...products, ...products];
  const totalOriginalItems = products.length;

  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setToastMessage("Product(s) added to cart");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Drag tracking variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Position scrollbar at the middle clone set initially so user can go both ways infinitely
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || totalOriginalItems === 0) return;

    // Estimate item width + gap to center the middle copy
    const itemWidth = el.scrollWidth / 3;
    el.scrollLeft = itemWidth;
  }, [products, totalOriginalItems]);

  // Infinite snap handler to loop track resetting index landmarks invisibly
  const handleScrollReset = () => {
    const el = scrollContainerRef.current;
    if (!el || totalOriginalItems === 0) return;

    const segmentWidth = el.scrollWidth / 3;

    // Left boundary reset
    if (el.scrollLeft <= 5) {
      el.scrollLeft = segmentWidth + el.scrollLeft;
    } 
    // Right boundary reset
    else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      el.scrollLeft = el.scrollLeft - segmentWidth;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
      handleScrollReset();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
    handleScrollReset();
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    const el = scrollContainerRef.current;
    if (el) el.style.cursor = 'grab';
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-gray-900">Trending Near You</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-9 h-9 border border-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm select-none bg-white hover:bg-gray-50 hover:border-black active:scale-95"
          >
            <ChevronLeft size={16} className="stroke-[2.5]" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-9 h-9 border border-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm select-none bg-white hover:bg-gray-50 hover:border-black active:scale-95"
          >
            <ChevronRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScrollReset}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: 'grab' }}
        className="w-full flex gap-4 overflow-x-auto select-none snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {infiniteProducts.map((product, index) => (
          <div 
            key={index} 
            className="w-[calc(100%-16px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-12px)] lg:w-[calc(20%-13px)] flex-shrink-0 bg-white flex flex-col justify-between rounded-lg p-1 snap-start transition-all"
          >
            <div className="w-full h-56 bg-gray-50 overflow-hidden rounded-md relative pointer-events-none">
              {product.description && (
                <span className="absolute top-3 left-3 bg-[#F2F4F7] text-gray-800 font-extrabold text-[10px] px-2 py-0.5 tracking-tight rounded-sm z-10 uppercase">
                  {product.description}
                </span>
              )}
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[13px] text-gray-900 font-bold tracking-tight leading-snug line-clamp-2 select-text">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                  {[...Array(5)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                  <span className="text-[11px] text-gray-400 font-semibold ml-0.5">4.5k</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                  <span className="text-[10px] text-gray-400 font-bold line-through">MRP ₹{Number(product.price) + 700}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">
                    <Heart size={15} />
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 bg-white border border-blue-600 text-blue-600 font-extrabold text-xs rounded-md shadow-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
    </div>
  );
}