"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string | number;
  name?: string;
  title?: string;
  price: number | string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Hydrate cart from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("thriftza_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to parse local storage cart:", e);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Sync cart changes back to localStorage after initialization
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("thriftza_cart", JSON.stringify(cart));
    }
  }, [cart, initialized]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity ?? 1 }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("thriftza_cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}