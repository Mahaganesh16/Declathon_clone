'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Header() {
  const [activeBar, setActiveBar] = useState(0); // 0 = Red Notice, 1 = Blue Promo
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  // Alternating announcement notice bar ticker loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBar((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Full-scale structured mega layout directory data matrix
  const megaMenuData: Record<string, { title: string; items: string[] }[]> = {
    'All Sports': [
      { title: 'Fitness & Gym Gear', items: ['Trackpants', 'Compression T-shirts', 'Gym Shoes', 'Shorts', 'Training Jackets', 'Hex Dumbbells', 'Kettlebells', 'Yoga Mats', 'Exercise Bikes', 'Treadmills'] },
      { title: 'Racket Sports', items: ['Badminton Rackets', 'Tennis Rackets', 'Nylon Shuttlecocks', 'Feather Shuttles', 'Racket Strings', 'Replacement Grips', 'Racket Bags', 'Table Tennis Bats', 'Ping Pong Balls'] },
      { title: 'Running & Walking', items: ['Road Running Shoes', 'Trail Running', 'Jogging Pants', 'Cushioned Socks', 'Fitness Trackers', 'Hydration Packs', 'Marathon Gel Packs', 'Walking Poles'] },
      { title: 'Water Sports', items: ['Swimming Costumes', 'Swim Goggles', 'Silicone Caps', 'Microfiber Towels', 'Snorkeling Masks', 'Life Jackets', 'Inflatable Kayaks', 'Waterproof Bags'] },
      { title: 'Team Sports', items: ['Football Boots', 'Footballs', 'Cricket Bats', 'Leather Balls', 'Cricket Pads', 'Jersey Sets', 'Basketball Rings', 'Basketballs', 'Volleyball Nets'] },
      { title: 'Outdoor Adventure', items: ['Hiking Backpacks', 'Trekking Shoes', 'Waterproof Tents', 'Sleeping Bags', 'Camping Chairs', 'Headlamps', 'Trek Compass', 'Binoculars'] },
      { title: 'Cycling', items: ['Mountain Bikes', 'Hybrid Bicycles', 'Road Bikes', 'Cycling Helmets', 'Air Pumps', 'Gel Saddle Covers', 'Chain Lubes', 'Bicycle Lights'] },
      { title: 'Target Sports', items: ['Archery Bows', 'Steel Tip Arrows', 'Dartboards', 'Brass Darts', 'Carrom Boards', 'Carrom Coins', 'Carrom Powder'] }
    ],
    'Men': [
      { title: 'Apparel', items: ['T-Shirts', 'Polos', 'Shorts', 'Trackpants', 'Sweatshirts', 'Raincoats & Windcheaters'] },
      { title: 'Footwear', items: ['Running Shoes', 'Walking Shoes', 'Football Boots', 'Badminton Shoes', 'Sandals & Flip Flops'] },
      { title: 'Accessories', items: ['Gym Bags', 'Socks', 'Caps & Hats', 'Sports Sunglasses', 'Supplements'] }
    ],
    'Women': [
      { title: 'Clothing', items: ['Sports Bras', 'Tights & Leggings', 'T-Shirts', 'Tops & Tanks', 'Skirts & Dresses', 'Shorts'] },
      { title: 'Shoes', items: ['Fitness Shoes', 'Running Shoes', 'Walking Shoes', 'Tennis Footwear', 'Socks'] },
      { title: 'Sports Equipment', items: ['Yoga Blocks', 'Resistance Bands', 'Pilates Balls', 'Light Dumbbells'] }
    ],
    'Kids': [
      { title: 'Boys Gear', items: ['Active T-shirts', 'Shorts', 'Tracksuits', 'Football Shoes', 'School Shoes'] },
      { title: 'Girls Gear', items: ['Sports Crop Tops', 'Leggings', 'Skater Dresses', 'Tennis Shoes', 'Hairbands'] },
      { title: 'Baby & Toddler', items: ['Baby Swimwear', 'Mini Skates', 'Kids Helmets', 'Lightweight Backpacks'] }
    ]
  };

  return (
    <div className="sticky top-0 bg-white z-50 border-b border-gray-200 shadow-sm">
      <header className="bg-white relative">
        
        {/* Top Header Navigation Row */}
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center">
            <Link href="/" className="text-[#0072E3] font-black text-4xl tracking-tighter uppercase italic cursor-pointer hover:opacity-90">
              DECATHLON
            </Link>
          </div>

          <div className="flex-1 max-w-[720px] relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} className="stroke-[2.5]" />
            </div>
            <input 
              suppressHydrationWarning
              type="text" 
              placeholder='Search for "Football", "Shoes", "T-shirt"' 
              className="w-full py-3.5 pl-12 pr-4 bg-[#F2F4F7] rounded-md text-sm font-normal border border-transparent focus:outline-none focus:bg-white focus:border-gray-300 transition-all text-gray-800"
            />
          </div>

          <div className="flex items-center gap-8 text-xs font-bold text-[#363636]">
            <div 
              className="relative"
              onMouseEnter={() => setIsAccountHovered(true)}
              onMouseLeave={() => setIsAccountHovered(false)}
            >
              <Link href={user ? "/account" : "/login"} className="flex flex-col items-center gap-1 hover:text-[#0072E3] py-2">
                <User size={22} className={`stroke-[1.5] ${user ? 'text-[#0072E3]' : ''}`} />
                <span className={user ? 'text-[#0072E3]' : ''}>{user ? 'Account' : 'Sign In'}</span>
              </Link>
              
              {/* ACCOUNT DROPDOWN */}
              {user && isAccountHovered && (
                <div className="absolute top-full right-0 mt-0 w-56 bg-white border border-gray-200 shadow-xl rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-black">
                    <User size={18} />
                    <span className="text-[13px] font-semibold">My Profile</span>
                  </Link>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-black">
                    <ShoppingCart size={18} />
                    <span className="text-[13px] font-semibold">Orders & Returns</span>
                  </Link>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-black">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    <span className="text-[13px] font-semibold">Wallet</span>
                  </Link>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-black">
                    <Heart size={18} />
                    <span className="text-[13px] font-semibold">Sporty Rewards</span>
                  </Link>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-black">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span className="text-[13px] font-semibold">My Addresses</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-red-600">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span className="text-[13px] font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1 hover:text-[#0072E3] cursor-pointer">
              <HelpCircle size={22} className="stroke-[1.5]" />
              <span>Support</span>
            </div>
            <Link href="/wishlist" className="flex flex-col items-center gap-1 relative hover:text-[#0072E3]">
              <Heart size={22} className="stroke-[1.5]" />
              <span>Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0072E3] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/checkout/cart" className="flex flex-col items-center gap-1 relative hover:text-[#0072E3]">
              <ShoppingCart size={22} className="stroke-[1.5]" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0072E3] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Sub-Header Menu Trigger Row Links Track */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between text-sm font-bold text-[#363636]">
            
            <div className="flex items-center gap-8 h-full">
              {['All Sports', 'Men', 'Women', 'Kids'].map((menuName) => (
                <div
                  key={menuName}
                  onMouseEnter={() => setHoveredMenu(menuName)}
                  onMouseLeave={() => setHoveredMenu(null)}
                  className="h-full flex items-center cursor-pointer group"
                >
                  <span className={`transition-colors py-3 ${
                    hoveredMenu === menuName 
                      ? 'text-[#0072E3] border-b-2 border-[#0072E3]' 
                      : 'text-[#363636] hover:text-[#0072E3]'
                  }`}>
                    {menuName}
                  </span>

                  {/* FIXED: DYNAMIC SCREEN FULL-WIDTH (W-SCREEN) EXPANDED OVERLAY DROPDOWN GRID */}
                  {hoveredMenu === menuName && megaMenuData[menuName] && (
                    <div className="fixed left-0 right-0 top-[129px] bg-white shadow-2xl border-t border-gray-100 w-screen max-h-[calc(100vh-140px)] overflow-y-auto z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-3">
                      <div className="max-w-[1440px] mx-auto px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-left">
                        {megaMenuData[menuName].map((section, sIdx) => (
                          <div key={sIdx} className="space-y-4">
                            <h4 className="text-gray-950 font-black text-[13px] uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
                              <span>{section.title}</span>
                              <ChevronRight size={12} className="text-[#0072E3]" />
                            </h4>
                            <ul className="space-y-2.5">
                              {section.items.map((item, iIdx) => (
                                <li 
                                  key={iIdx} 
                                  className="text-gray-600 text-[13px] font-semibold hover:text-[#0072E3] hover:translate-x-1 transition-all cursor-pointer"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs font-semibold text-gray-600">
              Delivery to <strong className="text-[#0072E3] font-bold cursor-pointer underline ml-1">Bangalore Central, 560001</strong>
            </div>
          </div>
        </div>
      </header>

      {/* TOP ALTERNATING NOTICE HEADER BAR CONTEXT SLIDER LINE */}
      <div className="max-w-[1440px] mx-auto px-6 w-full pb-3 bg-white">
        <div className="w-full h-10 bg-[#2B3B95] relative overflow-hidden select-none rounded-sm shadow-sm">
          <div className={`absolute inset-0 w-full h-full bg-red-600 text-white text-xs font-bold flex items-center justify-center text-center tracking-wide transition-all duration-700 ease-in-out transform ${activeBar === 0 ? 'translate-y-0 opacity-100 z-10' : '-translate-y-full opacity-0 z-0'}`}><span className="px-4 truncate">Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact us: <strong className="underline">7676798989</strong></span></div>
          <div className={`absolute inset-0 w-full h-full bg-[#2B3B95] text-white text-xs font-bold flex items-center justify-center text-center tracking-wide transition-all duration-700 ease-in-out transform ${activeBar === 1 ? 'translate-y-0 opacity-100 z-10' : 'translate-y-full opacity-0 z-0'}`}><span className="px-4 truncate">App-Exclusive: Your welcome offer awaits. <span className="underline cursor-pointer ml-1 font-extrabold">Download the app now!</span></span></div>
        </div>
      </div>
    </div>
  );
}