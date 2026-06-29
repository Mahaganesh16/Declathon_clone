'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Star, Heart, Edit2, Plus, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const similarScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollSimilarLeft = () => {
    if (similarScrollRef.current) {
      similarScrollRef.current.scrollLeft -= 260;
    }
  };

  const scrollSimilarRight = () => {
    if (similarScrollRef.current) {
      similarScrollRef.current.scrollLeft += 260;
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setToastMessage("Product added to cart");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all categories first
        const catRes = await fetch('http://localhost:5000/api/categories?type=standard', { cache: 'no-store' });
        let cats = [];
        if (catRes.ok) {
          cats = await catRes.json();
          setCategories(cats);
        }

        const productRes = await fetch(`http://localhost:5000/api/products/${params.id}`, { cache: 'no-store' });
        if (productRes.ok) {
          const data = await productRes.json();
          setProduct(data);
          return;
        }
        
        // Fallback using the loaded categories
        let found = null;
        for (const cat of cats) {
          if (cat.products) {
            const p = cat.products.find((prod: any) => String(prod.id) === String(params.id));
            if (p) {
              found = p;
              break;
            }
          }
        }
        if (!found) {
          const trendingCat = cats.find((c: any) => c.id === 102);
          if (trendingCat && trendingCat.products && trendingCat.products.length > 3) {
            found = trendingCat.products[3];
          } else if (cats[0]?.products?.length > 0) {
            found = cats[0].products[0];
          }
        }
        
        setProduct(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (params?.id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [params?.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Product not found!</div>;

  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/images/trackpants_main.png'];

  const colors = product.colors && Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : [product.image || '/images/trackpants_main.png'];

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

      <main className="max-w-[1440px] mx-auto w-full px-6 py-4">

        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
          <Link href="/" className="hover:underline">All Sports</Link> <ChevronRightMini />
          <Link href="/" className="hover:underline">Men</Link> <ChevronRightMini />
          <Link href="/" className="hover:underline">Sports Clothing</Link> <ChevronRightMini />
          <Link href="/" className="hover:underline">Trousers & Trackpants</Link> <ChevronRightMini />
          <span className="text-gray-900">Trackpants & Joggers</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT COLUMN: IMAGES */}
          <div className="flex-1 space-y-4 relative">
            <div className="w-full bg-[#F5F5F5] overflow-hidden group">
              <img src={images[0]} alt="Product Main" className="w-full object-cover transition-transform duration-700 hover:scale-105 cursor-crosshair" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F5F5] overflow-hidden group relative">
                <img src={images[1] || images[0]} alt="Product Side" className="w-full object-cover transition-transform duration-700 hover:scale-105 cursor-crosshair" />
                {/* Overlay Text for Feature (simulated) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 bg-black/80 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center space-y-1">
                    <span className="block text-xl font-black">💧</span>
                    <p className="text-[10px] font-black tracking-widest uppercase">Moisture<br />Management</p>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="block text-xl font-black">🎒</span>
                    <p className="text-[10px] font-black tracking-widest uppercase">Pockets</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5F5F5] overflow-hidden group">
                <img src={images[2] || images[0]} alt="Product Back" className="w-full object-cover transition-transform duration-700 hover:scale-105 cursor-crosshair" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-6">

            {/* Title & Brand */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black text-gray-900 tracking-wide uppercase">{product.name.split(' ')[0] || 'DECATHLON'}</span>
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                  ID {8404222 + (product.id || 1)}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </span>
              </div>
              <h1 className="text-[22px] md:text-[26px] font-black text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-3 cursor-pointer">
                <div className="flex text-[#FFCC00]">
                  <Star size={16} fill="currentColor" stroke="none" />
                  <Star size={16} fill="currentColor" stroke="none" />
                  <Star size={16} fill="currentColor" stroke="none" />
                  <Star size={16} fill="currentColor" stroke="none" />
                  <Star size={16} fill="currentColor" fillOpacity={0.5} stroke="none" />
                </div>
                <span className="text-sm font-bold text-gray-900 ml-1">4.4</span>
                <span className="text-sm font-semibold text-[#0072E3] underline">5.1k reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black tracking-tighter text-gray-900">₹{product.price}</span>
              <span className="text-sm text-gray-500 font-bold">MRP <span className="line-through">₹{Number(product.price) + 700}</span></span>
            </div>

            {/* Colors */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-bold text-gray-900">Colour</span>
                <span className="text-xs text-gray-500 font-semibold">{colors.length} {colors.length === 1 ? 'colour' : 'colours'}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((c, i) => (
                  <div key={i} className={`w-full aspect-[3/4] bg-gray-100 rounded cursor-pointer overflow-hidden border-2 ${i === 0 ? 'border-[#0072E3]' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={c} alt="Color variant" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-[13px] font-bold text-gray-900">Select size</h3>
                  <p className="text-[11px] text-gray-500 font-semibold mt-0.5">72% of users say this fits as expected</p>
                </div>
                <button className="text-[13px] font-bold text-[#0072E3] hover:underline">Size chart</button>
              </div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button key={size} className="flex-1 py-2.5 border border-gray-300 rounded text-sm font-bold text-gray-800 hover:border-gray-500 hover:bg-gray-50 transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => toggleWishlist(product)}
                className="w-12 h-12 flex-shrink-0 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:border-black transition-colors"
              >
                <Heart size={20} className={`stroke-[1.5] ${isInWishlist(product?.id) ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#2B3B95] text-white font-bold text-sm rounded shadow-sm hover:bg-[#1E2968] transition-colors"
              >
                Add to cart
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <ShieldCheck size={18} className="text-[#0072E3]" />
                2 year warranty
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0072E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                Made In India
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 w-full mt-1">
                <RotateCcw size={18} className="text-[#0072E3]" />
                30 days return
              </div>
            </div>

            {/* Delivery & Services */}
            <div className="space-y-4">
              <h3 className="text-[13px] font-bold text-gray-900">Delivery & services</h3>
              <p className="text-[11px] text-gray-500 font-semibold -mt-3">Sold and fulfilled by: <span className="text-gray-900">Decathlon Sports India Pvt Ltd</span></p>

              <div className="relative">
                <input
                  type="text"
                  defaultValue="560001"
                  className="w-full py-2.5 px-4 pr-10 border border-gray-200 text-sm font-bold text-gray-900 rounded focus:outline-none focus:border-[#0072E3]"
                />
                <Edit2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0072E3] cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div></div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <Truck size={14} className="stroke-[2]" />
                      Standard delivery by 30th Jun 2026
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Order within <span className="text-[#0072E3]">7hrs 32mins</span></p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div></div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                      Pick up from store within 2 Hours for FREE
                    </div>
                    <p className="text-[11px] text-[#0072E3] font-semibold mt-0.5 underline cursor-pointer">View stores</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div></div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                      Pay on Delivery available *
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Your Kit */}
            <div className="border-t border-gray-100 pt-6 mt-2">
              <h3 className="text-[13px] font-bold text-gray-900 mb-4">Complete your kit</h3>

              <div className="flex items-center justify-between gap-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=200" alt="Gloves" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="w-5 h-5 rounded-full bg-[#2B3B95] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#2B3B95]/30">
                  <Plus size={14} className="stroke-[3]" />
                </div>
                <div className="w-16 h-16 bg-white border border-gray-200 rounded overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200" alt="Mat" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="w-5 h-5 rounded-full bg-[#2B3B95] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#2B3B95]/30">
                  <Plus size={14} className="stroke-[3]" />
                </div>
                <div className="w-16 h-16 bg-white border border-gray-200 rounded overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=200" alt="Ankle Weights" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-[11px] font-bold text-gray-500">4 Items in total</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-black text-gray-900 tracking-tighter">₹1,786</span>
                    <span className="text-xs text-gray-400 font-bold line-through">₹4,296</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded shadow-sm hover:bg-gray-50 transition-colors">
                  Select products
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div className="border-t border-gray-100 pt-12 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT COLUMN: RATING STATISTICS */}
            <div className="space-y-8">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900">4.6</span>
                  <span className="text-sm font-bold text-gray-400">out of 5</span>
                </div>
                <button className="text-sm font-bold text-[#0072E3] hover:underline mt-1 block">8,156 reviews</button>
              </div>

              {/* STAR BREAKDOWN */}
              <div className="space-y-2">
                <RatingBar star={5} count={6177} total={8156} />
                <RatingBar star={4} count={1398} total={8156} />
                <RatingBar star={3} count={238} total={8156} />
                <RatingBar star={2} count={92} total={8156} />
                <RatingBar star={1} count={251} total={8156} />
                <p className="text-xs text-gray-500 font-bold mt-3">6751 customers recommended this product</p>
              </div>

              {/* FIT ANALYSIS */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-black text-gray-900">What our users say about the Fit?</h4>
                  <p className="text-xs text-gray-500 font-bold mt-0.5">93% of users says this fits Just Right</p>
                </div>
                <div className="space-y-3.5">
                  <FitSlider label="Small" value={10} count={162} />
                  <FitSlider label="Moderately small" value={15} count={214} />
                  <FitSlider label="As expected" value={80} count={4291} isHighlighted={true} />
                  <FitSlider label="Moderately large" value={25} count={412} />
                  <FitSlider label="Large" value={20} count={407} />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ATTRIBUTES & REVIEWS LIST */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* ATTRIBUTE CIRCLES */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pb-8 border-b border-gray-100">
                <CircularAttribute label="moisture management" value={5} />
                <CircularAttribute label="easy maintenance" value={5} />
                <CircularAttribute label="stretch" value={5} />
                <CircularAttribute label="lightweight" value={5} />
                <CircularAttribute label="Look / Design" value={5} />
                <CircularAttribute label="Value For Money" value={5} />
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-8">
                
                {/* REVIEW 1 */}
                <div className="space-y-3">
                  <div className="flex text-[#FFCC00]">
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                  </div>
                  <h5 className="text-base font-black text-gray-900">Good quality</h5>
                  
                  {/* Inline Attributes */}
                  <div className="flex flex-wrap gap-4 py-2">
                    <InlineAttribute label="moisture management" value={4} />
                    <InlineAttribute label="stretch" value={5} />
                    <InlineAttribute label="lightweight" value={5} />
                    <InlineAttribute label="Value For Money" value={4} />
                    <InlineAttribute label="Look / Design" value={4} />
                  </div>

                  <p className="text-sm font-bold text-gray-700 leading-relaxed">Good quality</p>
                  <p className="text-xs text-gray-400 font-semibold">
                    Thanseeh <span className="mx-1">|</span> <span className="text-green-600 font-bold">Verified User</span> <span className="mx-1">|</span> Today <span className="mx-1">|</span> India
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* REVIEW 2 */}
                <div className="space-y-3">
                  <div className="flex text-[#FFCC00]">
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                    <Star size={14} fill="currentColor" stroke="none" />
                  </div>
                  <h5 className="text-base font-black text-gray-900">Great product</h5>
                  
                  {/* Inline Attributes */}
                  <div className="flex flex-wrap gap-4 py-2">
                    <InlineAttribute label="moisture management" value={5} />
                    <InlineAttribute label="stretch" value={5} />
                    <InlineAttribute label="lightweight" value={5} />
                    <InlineAttribute label="Value For Money" value={5} />
                    <InlineAttribute label="Look / Design" value={4} />
                  </div>

                  <p className="text-sm font-bold text-gray-700 leading-relaxed">Great product</p>
                  <p className="text-xs text-gray-400 font-semibold">
                    Aniket <span className="mx-1">|</span> <span className="text-green-600 font-bold">Verified User</span> <span className="mx-1">|</span> Yesterday <span className="mx-1">|</span> India
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        <div className="border-t border-gray-100 pt-12 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight text-gray-900">Similar Products</h2>
            <div className="flex items-center gap-2">
              <div 
                onClick={scrollSimilarLeft}
                className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-800 hover:border-black bg-white shadow-sm transition-colors active:scale-95 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </div>
              <div 
                onClick={scrollSimilarRight}
                className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-800 hover:border-black bg-white shadow-sm transition-colors active:scale-95 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </div>

          {/* SIMILAR PRODUCTS CAROUSEL */}
          <div 
            ref={similarScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
          >
            {((categories.find((c: any) => c.id === product?.categoryId)?.products?.filter((p: any) => p.id !== product?.id && Number(p.price) > 0)) || (categories.flatMap((c: any) => c.products || []).filter((p: any) => p.id !== product?.id && Number(p.price) > 0).slice(0, 8))).map((simProduct: any) => (
              <div 
                key={simProduct.id}
                className="w-[240px] flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col justify-between group relative hover:shadow-md transition-shadow"
              >
                <Link href={`/product/${simProduct.id}`} className="block relative aspect-[4/5] bg-[#F8F8F8] overflow-hidden">
                  <img 
                    src={simProduct.image || '/images/trackpants_main.png'} 
                    alt={simProduct.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </Link>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-900 tracking-wider uppercase">{simProduct.name.split(' ')[0]}</span>
                    <Link href={`/product/${simProduct.id}`} className="block text-xs font-bold text-gray-800 line-clamp-2 mt-1 hover:text-[#0072E3] transition-colors">
                      {simProduct.name}
                    </Link>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-gray-800">
                      <div className="flex text-[#FFCC00]">
                        <Star size={12} fill="currentColor" stroke="none" />
                        <Star size={12} fill="currentColor" stroke="none" />
                        <Star size={12} fill="currentColor" stroke="none" />
                        <Star size={12} fill="currentColor" stroke="none" />
                        <Star size={12} fill="currentColor" fillOpacity={0.4} stroke="none" />
                      </div>
                      <span className="text-[11px] text-gray-500 font-semibold">(4.2k)</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-gray-900">₹{simProduct.price}</span>
                      <span className="text-[10px] text-gray-400 font-bold line-through">MRP ₹{Number(simProduct.price) + 500}</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(simProduct);
                        }}
                        className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Heart size={14} className={isInWishlist(simProduct.id) ? "fill-red-500 text-red-500" : ""} />
                      </div>
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(simProduct);
                        }}
                        className="flex-1 py-1.5 bg-white border border-blue-600 text-blue-600 font-extrabold text-[11px] rounded-md shadow-sm tracking-wide hover:bg-blue-600 hover:text-white transition-all text-center cursor-pointer"
                      >
                        Add to cart
                      </div>
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

function ChevronRightMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-gray-800">
      <span className="w-4 flex items-center gap-0.5">{star} <span className="text-[10px]">★</span></span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-black rounded-full" style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-10 text-right text-gray-400">{count.toLocaleString()}</span>
    </div>
  );
}

function FitSlider({ label, value, count, isHighlighted = false }: { label: string; value: number; count: number; isHighlighted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
      <span className="w-28 text-gray-500">{label}</span>
      <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full relative">
        <div 
          className={`absolute h-full rounded-full ${isHighlighted ? 'bg-black' : 'bg-gray-400'}`} 
          style={{ width: `${value}%` }}
        />
        <div 
          className={`absolute w-3 h-3 rounded-full -translate-y-[25%] border-2 border-white shadow-sm ${isHighlighted ? 'bg-black' : 'bg-gray-600'}`} 
          style={{ left: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-500">{count}</span>
    </div>
  );
}

function CircularAttribute({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-gray-200"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-black"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-black text-gray-900">{value}/{max}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-wider leading-tight w-full break-words">
        {label}
      </span>
    </div>
  );
}

function InlineAttribute({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="12"
            cy="12"
            r={radius}
            className="stroke-gray-200"
            strokeWidth="2"
            fill="transparent"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            className="stroke-black"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[8px] font-black text-gray-900">{value}/{max}</span>
      </div>
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
