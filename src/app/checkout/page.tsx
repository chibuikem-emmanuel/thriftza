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

  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity ?? 1),
    0
  );

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
        price: item.price,
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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Checkout Details</h2>
        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded">
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
              className="w-full border p-2 rounded mt-1"
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
              className="w-full border p-2 rounded mt-1"
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
              className="w-full border p-2 rounded mt-1"
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
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()}`}
          </button>
        </form>
      </div>

      <div className="border p-6 rounded bg-gray-50 h-fit">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity ?? 1} x ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <p className="font-bold">
                  ₦{((item.quantity ?? 1) * item.price).toLocaleString()}
                </p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}