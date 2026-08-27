"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string | number;
  _id?: string | number;
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
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("thriftza_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("thriftza_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (product: CartItem) => {
    const targetId = String(product.id || product._id);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(item.id || item._id) === targetId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity ?? 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + 1,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          id: targetId,
          quantity: product.quantity ?? 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string | number) => {
    const targetId = String(id);
    setCart((prev) =>
      prev.filter((item) => String(item.id || item._id) !== targetId)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("thriftza_cart");
  };

  const totalCount = cart.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalCount }}
    >
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