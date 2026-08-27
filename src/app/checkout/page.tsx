"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
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

  // Defensive calculation handling both item.name and item.title, alongside numeric price casting
  const totalAmount = cart.reduce((sum, item) => {
    const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
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
        product_id: item.id,
        quantity: item.quantity ?? 1,
        price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
      })),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/orders/checkout/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok && data.checkout_url) {
        clearCart();
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
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-white"
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
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-white"
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
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-white"
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
              className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded mt-1 text-white focus:outline-none focus:border-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-zinc-200 disabled:opacity-50 transition"
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
            {cart.map((item) => {
              const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
              const itemQty = item.quantity ?? 1;
              const itemTitle = item.name || item.title || "Product";
              
              return (
                <div
                  key={item.id}
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