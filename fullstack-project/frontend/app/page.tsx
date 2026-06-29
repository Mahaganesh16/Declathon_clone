'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQuickAdd } from '../context/QuickAddContext';
import Header from './components/Header';
import Footer from './components/Footer';

export default function DecathlonHome() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carousel Layout References
  const trendingContainerRef = useRef<HTMLDivElement>(null);
  const checklistContainerRef = useRef<HTMLDivElement>(null);

  const isDraggingTrending = useRef(false);
  const isDraggingChecklist = useRef(false);
  const isAnimatingTrending = useRef(false);
  const isAnimatingChecklist = useRef(false);

  const startXTrending = useRef(0);
  const startXChecklist = useRef(0);
  const scrollLeftStartTrending = useRef(0);
  const scrollLeftStartChecklist = useRef(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openModal } = useQuickAdd();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(product);
  };

  // FETCH CORE DATABASE CATALOG RECORDS
  useEffect(() => {
    async function fetchDatabaseCatalog() {
      try {
        const response = await fetch('http://localhost:5000/api/categories', { cache: 'no-store' });
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading records from API:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDatabaseCatalog();
  }, []);

  // HERO SLIDER LOGIC (Category ID: 100)
  const carouselCategory = categories.find(c => Number(c.id) === 100);
  const sliderItems = carouselCategory && carouselCategory.products ? carouselCategory.products : [];

  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderItems.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  };

  // TRENDING NEAR YOU CAROUSEL ENGINE (Category ID: 102)
  const trendingCategory = categories.find(c => Number(c.id) === 102);
  const baseTrendingProducts = trendingCategory && trendingCategory.products ? trendingCategory.products : [];

  const trendingProducts = [...baseTrendingProducts, ...baseTrendingProducts, ...baseTrendingProducts];

  useEffect(() => {
    const el = trendingContainerRef.current;
    if (!el || baseTrendingProducts.length === 0) return;
    el.scrollLeft = el.scrollWidth / 3;
  }, [baseTrendingProducts.length]);

  const handleTrendingScrollWrap = () => {
    const el = trendingContainerRef.current;
    if (!el || baseTrendingProducts.length === 0 || isDraggingTrending.current || isAnimatingTrending.current) return;
    const segmentWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 10) {
      el.scrollLeft = segmentWidth + el.scrollLeft;
    } else if (el.scrollLeft >= (segmentWidth * 2) - 10) {
      el.scrollLeft = el.scrollLeft - segmentWidth;
    }
  };

  const scrollTrendingOneByOne = (direction: 'left' | 'right') => {
    const el = trendingContainerRef.current;
    if (!el || isAnimatingTrending.current) return;

    const firstCard = el.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const cardWidthWithGap = firstCard.offsetWidth + 16;
    const targetScroll = direction === 'left' ? el.scrollLeft - cardWidthWithGap : el.scrollLeft + cardWidthWithGap;

    isAnimatingTrending.current = true;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });

    setTimeout(() => {
      isAnimatingTrending.current = false;
      handleTrendingScrollWrap();
    }, 400);
  };

  const handleTrendingDragStart = (e: React.MouseEvent) => {
    const el = trendingContainerRef.current;
    if (!el || isAnimatingTrending.current) return;
    isDraggingTrending.current = true;
    startXTrending.current = e.pageX - el.offsetLeft;
    scrollLeftStartTrending.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleTrendingDragMove = (e: React.MouseEvent) => {
    const el = trendingContainerRef.current;
    if (!el || !isDraggingTrending.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXTrending.current) * 1.5;
    el.scrollLeft = scrollLeftStartTrending.current - walk;
  };

  const handleTrendingDragEnd = () => {
    isDraggingTrending.current = false;
    const el = trendingContainerRef.current;
    if (!el) return;
    el.style.cursor = 'grab';
    const segmentWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 10) el.scrollLeft = segmentWidth + el.scrollLeft;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollLeft = el.scrollLeft - segmentWidth;
  };

  // DYNAMIC PRICE BUDGET TIERS DATA FILTERING (Category ID: 103)
  const priceCategory = categories.find(c => Number(c.id) === 103);
  const priceBudgets = priceCategory && priceCategory.products ? priceCategory.products : [];

  // WORKOUT CHECKLIST CAROUSEL ENGINE (Category ID: 99)
  const workoutCategory = categories.find(c => Number(c.id) === 99);
  const baseChecklistProducts = workoutCategory && workoutCategory.products ? workoutCategory.products : [];

  const checklistProducts = [...baseChecklistProducts, ...baseChecklistProducts, ...baseChecklistProducts];

  useEffect(() => {
    const el = checklistContainerRef.current;
    if (!el || baseChecklistProducts.length === 0) return;
    el.scrollLeft = el.scrollWidth / 3;
  }, [baseChecklistProducts.length]);

  const handleChecklistScrollWrap = () => {
    const el = checklistContainerRef.current;
    if (!el || baseChecklistProducts.length === 0 || isDraggingChecklist.current || isAnimatingChecklist.current) return;
    const segmentWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 10) {
      el.scrollLeft = segmentWidth + el.scrollLeft;
    } else if (el.scrollLeft >= (segmentWidth * 2) - 10) {
      el.scrollLeft = el.scrollLeft - segmentWidth;
    }
  };

  const scrollChecklistOneByOne = (direction: 'left' | 'right') => {
    const el = checklistContainerRef.current;
    if (!el || isAnimatingChecklist.current) return;

    const firstCard = el.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const cardWidthWithGap = firstCard.offsetWidth + 16;
    const targetScroll = direction === 'left' ? el.scrollLeft - cardWidthWithGap : el.scrollLeft + cardWidthWithGap;

    isAnimatingChecklist.current = true;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });

    setTimeout(() => {
      isAnimatingChecklist.current = false;
      handleChecklistScrollWrap();
    }, 400);
  };

  const handleChecklistDragStart = (e: React.MouseEvent) => {
    const el = checklistContainerRef.current;
    if (!el || isAnimatingChecklist.current) return;
    isDraggingChecklist.current = true;
    startXChecklist.current = e.pageX - el.offsetLeft;
    scrollLeftStartChecklist.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleChecklistDragMove = (e: React.MouseEvent) => {
    const el = checklistContainerRef.current;
    if (!el || !isDraggingChecklist.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXChecklist.current) * 1.5;
    el.scrollLeft = scrollLeftStartChecklist.current - walk;
  };

  const handleChecklistDragEnd = () => {
    isDraggingChecklist.current = false;
    const el = checklistContainerRef.current;
    if (!el) return;
    el.style.cursor = 'grab';
    const segmentWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 10) el.scrollLeft = segmentWidth + el.scrollLeft;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollLeft = el.scrollLeft - segmentWidth;
  };

  // AFTER SALES SERVICES DATA (Category ID: 101)
  const servicesCategory = categories.find(c => Number(c.id) === 101);
  const serviceCards = servicesCategory && servicesCategory.products ? servicesCategory.products : [];

  const regularCategories = categories.filter(
    c => ![99, 100, 101, 102, 103].includes(Number(c.id))
  );

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col justify-between">
      <Header />

      <main className="max-w-[1440px] mx-auto px-6 pt-6 pb-8 space-y-12 flex-1 w-full overflow-hidden">
        
        {/* TICKET COUPON BANNER ROW */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch select-none">
          <div className="flex-1 p-6 flex items-center gap-5 min-w-[280px]">
            <div className="border border-gray-200 p-2.5 rounded-lg bg-white shadow-sm flex-shrink-0">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=DecathlonApp" alt="QR" className="w-16 h-16" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug">Get your <br />first-order coupon!</h3>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Scan to download the app now.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600')" }}>
            {[
              { amt: "100", min: "1499", code: "NC100" },
              { amt: "200", min: "2499", code: "NC200" },
              { amt: "300", min: "3499", code: "NC300" }
            ].map((coupon, index) => (
              <div key={index} className="flex items-stretch h-full relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 rounded-full bg-white z-20 border-r border-gray-100 hidden sm:block"></div>
                <div className="bg-[#0072E3] text-white px-3.5 flex items-center justify-center border-r border-dashed border-white/30 relative">
                  <span className="font-black text-sm tracking-widest uppercase font-mono [writing-mode:vertical-lr] rotate-180 py-4">{coupon.code}</span>
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-6 py-5 flex flex-col justify-between items-center text-center w-[190px] border-r border-gray-100/50">
                  <div className="space-y-0.5">
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{coupon.amt} OFF</p>
                    <p className="text-[10px] text-gray-500 font-bold tracking-tight">On purchase <span className="text-blue-600 font-extrabold">above</span></p>
                    <p className="text-sm font-black text-blue-800 tracking-tight">₹{coupon.min}</p>
                  </div>
                  <div className="mt-3 w-full py-1.5 px-3 bg-[#0072E3] text-white text-[11px] font-extrabold rounded-md shadow-sm tracking-wide uppercase hover:bg-blue-700 transition-colors cursor-pointer">Use Code - {coupon.code}</div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 w-6 h-6 rounded-full bg-white z-20 border-l border-gray-100 hidden sm:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING NEAR YOU CAROUSEL SECTION */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-gray-900">Trending Near You</h2>
            <div className="flex items-center gap-2">
              <div onClick={() => scrollTrendingOneByOne('left')} className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-800 hover:border-black bg-white shadow-sm transition-colors active:scale-95 cursor-pointer"><ChevronLeft size={16} /></div>
              <div onClick={() => scrollTrendingOneByOne('right')} className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-800 hover:border-black bg-white shadow-sm transition-colors active:scale-95 cursor-pointer"><ChevronRight size={16} /></div>
            </div>
          </div>
          
          <div 
            ref={trendingContainerRef}
            onScroll={handleTrendingScrollWrap}
            onMouseDown={handleTrendingDragStart}
            onMouseMove={handleTrendingDragMove}
            onMouseUp={handleTrendingDragEnd}
            onMouseLeave={handleTrendingDragEnd}
            style={{ cursor: 'grab' }}
            className="w-full flex gap-4 overflow-x-auto select-none pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {trendingProducts.map((product, index) => (
              <Link href={`/product/${product.id || 1}`} key={index} className="w-[calc(100%-16px)] sm:w-[calc(50%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] flex-shrink-0 bg-white flex flex-col justify-between group relative rounded-lg p-1 snap-start transition-all cursor-pointer">
                {product.description && (
                  <span className="absolute top-3 left-3 bg-[#F2F4F7] text-gray-800 font-extrabold text-[10px] px-2 py-0.5 tracking-tight rounded-sm z-10">{product.description}</span>
                )}
                <div className="w-full h-56 bg-gray-50 overflow-hidden rounded-md relative pointer-events-none">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[13px] text-gray-900 font-bold tracking-tight leading-snug line-clamp-2 select-text">{product.name}</h4>
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
                      <div 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          toggleWishlist(product);
                        }}
                        className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Heart size={15} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />
                      </div>
                      <div 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 py-2 bg-white border border-blue-600 text-blue-600 font-extrabold text-xs rounded-md shadow-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all text-center cursor-pointer"
                      >
                        Add to cart
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SHOP BY SPORT & CATEGORY */}
        <div>
          <h2 className="text-xl font-black tracking-tight text-gray-900 mb-6">Shop by Sport & Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 bg-gray-50 p-2 rounded-lg">
            {regularCategories.length > 0 ? (
              regularCategories.map((cat: any, index) => {
                const imageSource = cat.products && cat.products.length > 0 && cat.products[0].image ? cat.products[0].image : "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400";
                return (
                  <div key={cat.id || index} className="bg-white p-1.5 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md flex flex-col group cursor-pointer">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img src={imageSource} alt={cat.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-4 pt-10 flex items-end justify-center h-full">
                        <p className="text-white text-[13px] font-extrabold tracking-tight text-center leading-tight drop-shadow-md">{cat.name}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center py-10 text-gray-400 text-sm">No layout categories found in database.</p>
            )}
          </div>
        </div>

        {/* ==================== NEW SECTION: PICK WHAT YOU LOVE, AT YOUR PRICE! ==================== */}
        <div className="w-full space-y-5">
          <h2 className="text-xl font-black tracking-tight text-gray-900">Pick what you love, at your price!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {priceBudgets.map((tier: any, index) => (
              <Link href={`/price/${tier.price || 499}`} key={index}>
                <div 
                  className="bg-[#2B3B95] h-64 rounded-2xl relative p-6 overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer group hover:bg-[#202c70] transition-colors"
                >
                  {/* Embedded vector circle mesh backdrop patterns */}
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-white/[0.03] pointer-events-none" />

                  {/* Text Context Frame */}
                  <div className="space-y-1.5 z-10">
                    <p className="text-white/60 font-black tracking-widest text-xs uppercase opacity-90">
                      {tier.name || 'UNDER'}
                    </p>
                    <p className="text-white font-black text-5xl tracking-tighter">
                      {tier.description}
                    </p>
                  </div>

                  {/* Explore Pill Button Trigger */}
                  <div className="z-10">
                    <button suppressHydrationWarning className="bg-white text-gray-950 font-extrabold text-xs px-5 py-2.5 rounded-full tracking-normal hover:bg-gray-100 transition-colors shadow-sm">
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* HERO CAROUSEL BLOCK */}
        <div className="w-full bg-[#1A1A1A] rounded-[32px] overflow-hidden relative min-h-[460px] md:min-h-[540px] flex items-center group select-none shadow-sm">
          {sliderItems.map((item, i) => (
            <div key={i} className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${i === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
              <div className="absolute inset-y-0 right-0 md:right-16 lg:right-24 flex flex-col justify-center items-end text-right p-8 z-20 max-w-[600px] text-white">
                <h1 className="text-4xl md:text-6xl font-light tracking-tight italic drop-shadow-lg leading-none">
                  {item.name} <br />
                  <span className="font-extrabold tracking-normal normal-case block mt-2 text-white">{item.description}</span>
                </h1>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-200 uppercase tracking-widest">Starting From</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter mt-1 text-white">₹{item.price} <span className="text-sm font-medium tracking-normal ml-0.5">Onwards</span></p>
                </div>
                <div className="mt-6 bg-white text-gray-950 font-black px-8 py-3.5 rounded-full text-xs tracking-wider uppercase shadow-lg hover:bg-gray-100 transition-colors cursor-pointer inline-block">Shop Now</div>
              </div>
              <img src={item.image} alt="Slide" className="w-full h-full object-cover object-left md:object-center brightness-90" />
            </div>
          ))}
          <div onClick={handlePrevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-md cursor-pointer"><ChevronLeft size={22} /></div>
          <div onClick={handleNextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-md cursor-pointer"><ChevronRight size={22} /></div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
            {sliderItems.map((_, i) => (<div key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide ? 'w-5 bg-white' : 'w-2 bg-white/40'}`} />))}
          </div>
        </div>

        {/* AFTER SALES SERVICES GRID */}
        <div className="w-full space-y-4">
          <h2 className="text-xl font-black tracking-tight text-gray-900">After Sales Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCards.map((service, index) => (
              <div key={service.id || index} className="relative rounded-xl overflow-hidden h-[280px] group cursor-pointer shadow-sm border border-gray-100">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-center items-center">
                  <h3 className="text-white font-black text-2xl tracking-tight drop-shadow-md leading-tight mb-4">{service.name}</h3>
                  <div className="px-5 py-2.5 bg-[#0072E3] text-white font-black text-xs uppercase rounded-md tracking-wider shadow hover:bg-blue-700 transition-colors cursor-pointer">{service.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORKOUT CHECKLIST SYSTEM CAROUSEL */}
        <div className="w-full flex items-stretch gap-6 pt-6 border-t border-gray-100">
          <div className="w-[240px] flex-shrink-0 flex flex-col justify-center space-y-4 pr-4">
            <h2 className="text-3xl font-black tracking-tight leading-none text-gray-900">
              Shop your <br /><span className="text-gray-950 block mt-1 font-extrabold">Workout Checklist</span>
            </h2>
            <div className="flex items-center gap-2">
              <div onClick={() => scrollChecklistOneByOne('left')} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors active:scale-95 cursor-pointer"><ChevronLeft size={18} /></div>
              <div onClick={() => scrollChecklistOneByOne('right')} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors active:scale-95 cursor-pointer"><ChevronRight size={18} /></div>
            </div>
          </div>

          <div 
            ref={checklistContainerRef}
            onScroll={handleChecklistScrollWrap}
            onMouseDown={handleChecklistDragStart}
            onMouseMove={handleChecklistDragMove}
            onMouseUp={handleChecklistDragEnd}
            onMouseLeave={handleChecklistDragEnd}
            style={{ cursor: 'grab' }}
            className="flex-1 flex gap-4 overflow-x-auto select-none pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {checklistProducts.map((product, index) => (
              <Link href={`/product/${product.id || 1}`} key={index} className="w-[calc(100%-16px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)] flex-shrink-0 bg-white flex flex-col justify-between group relative rounded-lg p-2 snap-start transition-all cursor-pointer">
                <div className="w-full h-64 bg-gray-50 overflow-hidden rounded-md relative pointer-events-none">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[13px] text-gray-900 font-bold tracking-tight leading-snug line-clamp-2 select-text">{product.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      {[...Array(5)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}
                      <span className="text-[11px] text-gray-400 font-semibold ml-0.5">4.5k</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                      <span className="text-[10px] text-gray-400 font-bold line-through">MRP ₹{Number(product.price) + 500}</span>
                    </div>
                    <div className="mt-3.5 flex items-center gap-2">
                      <div 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          toggleWishlist(product);
                        }}
                        className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Heart size={16} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />
                      </div>
                      <div 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 py-2 bg-white border border-blue-600 text-blue-600 font-extrabold text-xs rounded-md shadow-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all text-center cursor-pointer"
                      >
                        Add to cart
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />

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