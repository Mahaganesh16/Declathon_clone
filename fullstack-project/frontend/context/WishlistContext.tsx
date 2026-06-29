'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage or DB on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setWishlistItems(data);
          }
        } catch (e) {
          console.error('Failed to fetch wishlist from DB', e);
        }
      } else {
        const storedWishlist = localStorage.getItem('decathlon_wishlist');
        if (storedWishlist) {
          try {
            setWishlistItems(JSON.parse(storedWishlist));
          } catch (e) {
            console.error('Failed to parse local wishlist', e);
          }
        }
      }
      setIsLoaded(true);
    };

    fetchWishlist();
  }, []);

  // Save to LocalStorage whenever wishlist changes (if not logged in)
  useEffect(() => {
    if (isLoaded) {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.setItem('decathlon_wishlist', JSON.stringify(wishlistItems));
      }
    }
  }, [wishlistItems, isLoaded]);

  const toggleWishlist = async (product: any) => {
    const isPresent = wishlistItems.some(item => item.id === product.id);

    // 1. Update UI state immediately (Optimistic UI)
    if (isPresent) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.img
      }]);
    }

    // 2. Sync to DB if logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/api/wishlist/toggle', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (e) {
        console.error('Failed to sync toggleWishlist to DB', e);
      }
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
