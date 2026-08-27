"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart) || [];
  const clearCart = useStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    city: "Lagos",
    state: "Lagos State",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAmount = cart.reduce((sum, item) => {
    const rawPrice = item.price ?? 0;
    const priceNum = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
    const qtyNum = item.quantity ?? 1;
    return sum + (isNaN(priceNum) ? 0 : priceNum) * qtyNum;
  }, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const payload = {
      ...formData,
      total_amount: totalAmount,
      items: cart.map((item) => ({
        product_id: item.id || (item as any)._id,
        quantity: item.quantity ?? 1,
        price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
      })),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://thriftza-back-8vlw.onrender.com"}/api/orders/checkout/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok && data.checkout_url) {
        if (typeof clearCart === "function") {
          clearCart();
        }
        window.location.href = data.checkout_url;
      } else {
        setErrorMessage(data.error || "Failed to initialize payment gateway.");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-zinc-400">
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-100">
      <div>
        <h2 className="text-2xl font-bold mb-4">Checkout Details</h2>
        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="customer_name"
              required
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="customer_email"
              required
              value={formData.customer_email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="customer_phone"
              required
              value={formData.customer_phone}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Delivery Address</label>
            <input
              type="text"
              name="shipping_address"
              required
              value={formData.shipping_address}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()}`}
          </button>
        </form>
      </div>

      <div className="border border-zinc-800 p-6 rounded bg-zinc-900/50 h-fit">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cart.length === 0 ? (
          <p className="text-zinc-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => {
              const rawPrice = item.price ?? 0;
              const itemPrice = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
              const itemQty = item.quantity ?? 1;
              const itemTitle = (item as any).name || item.title || "Product";
              const key = item.id || (item as any)._id || idx;

              return (
                <div
                  key={key}
                  className="flex justify-between items-center border-b border-zinc-800 pb-2"
                >
                  <div>
                    <p className="font-semibold">{itemTitle}</p>
                    <p className="text-sm text-zinc-400">
                      Qty: {itemQty} x ₦{itemPrice.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold">
                    ₦{(itemQty * itemPrice).toLocaleString()}
                  </p>
                </div>
              );
            })}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-700">
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}