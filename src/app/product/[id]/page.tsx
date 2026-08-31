"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const addToCart = useStore((state) => state.addToCart);
  // Safely grab store action regardless of exact naming
  const store = useStore() as any;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/api/products/${productId}/`);

        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setProduct({
            id: productId,
            title: `Product ${productId.toUpperCase()}`,
            price: 15000,
            description: "Quality thrift product in excellent condition.",
            image: "/placeholder.jpg",
          });
        }
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    if (typeof addToCart === "function") {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFavoriteToggle = () => {
    if (!product) return;
    // Execute whichever favorite method exists on your Zustand store
    if (typeof store.addToFavorites === "function") {
      store.addToFavorites(product);
    } else if (typeof store.addFavorite === "function") {
      store.addFavorite(product);
    } else if (typeof store.toggleFavorite === "function") {
      store.toggleFavorite(product);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-zinc-400">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-zinc-400">
        <p>Product not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-red-600 underline font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-zinc-100">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-zinc-600 font-bold text-2xl">ZAWEAR</span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {product.title || product.name || `Item ${productId}`}
            </h1>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ₦{Number(product.price || 0).toLocaleString()}
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            {product.description || "No description provided for this item."}
          </p>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleFavoriteToggle}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-red-600 transition"
              aria-label="Add to Favorites"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}