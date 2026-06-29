'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage or DB on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCartItems(data);
          }
        } catch (e) {
          console.error('Failed to fetch cart from DB', e);
        }
      } else {
        const storedCart = localStorage.getItem('decathlon_cart');
        if (storedCart) {
          try {
            setCartItems(JSON.parse(storedCart));
          } catch (e) {
            console.error('Failed to parse local cart', e);
          }
        }
      }
      setIsLoaded(true);
    };

    fetchCart();
  }, []);

  // Save to LocalStorage whenever cart changes (if not logged in)
  useEffect(() => {
    if (isLoaded) {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.setItem('decathlon_cart', JSON.stringify(cartItems));
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = async (product: any, quantity = 1) => {
    // 1. Update UI state immediately (Optimistic UI)
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image || product.img, 
        quantity 
      }];
    });

    // 2. Sync to DB if logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ productId: product.id, quantity })
        });
      } catch (e) {
        console.error('Failed to sync addToCart to DB', e);
      }
    }
  };

  const removeFromCart = async (productId: number) => {
    // 1. Update UI
    setCartItems(prev => prev.filter(item => item.id !== productId));

    // 2. Sync to DB
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/cart/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Failed to sync removeFromCart to DB', e);
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // 1. Update UI
    setCartItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));

    // 2. Sync to DB
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`http://localhost:5000/api/cart/${productId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ quantity })
        });
      } catch (e) {
        console.error('Failed to sync updateQuantity to DB', e);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Failed to clear DB cart', e);
      }
    } else {
      localStorage.removeItem('decathlon_cart');
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
