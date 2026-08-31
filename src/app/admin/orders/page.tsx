"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, RefreshCw, Send, CheckCircle, Clock, Users, ShoppingBag, AlertCircle } from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  size: string;
}

interface Order {
  id: number;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkMessage, setBulkMessage] = useState<string>(
    "Hello {name}, thank you for choosing Zawear! We have an update regarding your order #{ref}."
  );
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://thriftza-back-8vlw.onrender.com";

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Updated to match your unchanged order/urls.py route
      const endpoint = `${API_URL.replace(/\/$/, "")}/api/orders/admin/orders/`;
      
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
        setTotalUsers(0);
      } else if (data && typeof data === "object") {
        setOrders(data.orders || []);
        setTotalUsers(typeof data.total_users === "number" ? data.total_users : 0);
      }
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
      setErrorMsg(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0") && clean.length === 11) {
      clean = "234" + clean.slice(1);
    }
    return clean;
  };

  const createWhatsAppUrl = (phone: string, text: string) => {
    const cleanPhone = formatPhone(phone);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const sendWelcomeWA = (order: Order) => {
    const text = `Hello ${order.customer_name || "Customer"},\n\nWelcome to Zawear! Your order #${order.reference} has been received. We will keep in touch as we prepare your items.\n\nThank you for shopping with us!`;
    window.open(createWhatsAppUrl(order.customer_phone, text), "_blank");
  };

  const sendStatusWA = (order: Order) => {
    const text = `Hi ${order.customer_name || "Customer"},\n\nUpdate on your Zawear Order #${order.reference}: Your current status is *${order.status}*.\nLet us know if you have any questions!`;
    window.open(createWhatsAppUrl(order.customer_phone, text), "_blank");
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const toggleSelectOrder = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeBulkDispatch = () => {
    const selectedList = orders.filter((o) => selectedOrders.includes(o.id));
    selectedList.forEach((order, index) => {
      if (!order.customer_phone) return;
      const text = bulkMessage
        .replace(/{name}/g, order.customer_name || "Customer")
        .replace(/{ref}/g, order.reference);
      
      const url = createWhatsAppUrl(order.customer_phone, text);
      setTimeout(() => {
        window.open(url, "_blank");
      }, index * 800);
    });
    setShowBulkModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-zinc-100 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Zawear Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Track orders and dispatch customer WhatsApp messages.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            disabled={selectedOrders.length === 0}
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <Send className="w-4 h-4" /> Send Bulk WA ({selectedOrders.length})
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-950/50 border border-red-800 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Registered Users</p>
            <h2 className="text-3xl font-bold text-white mt-1">{loading ? "..." : totalUsers}</h2>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Orders</p>
            <h2 className="text-3xl font-bold text-white mt-1">{loading ? "..." : orders.length}</h2>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold border-b border-zinc-800">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    className="rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-0"
                  />
                </th>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading order list...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-0"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-zinc-200">{order.reference}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{order.customer_name || "Guest"}</div>
                      <div className="text-xs text-zinc-400">{order.customer_email}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{order.customer_phone || "N/A"}</td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₦{Number(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "SUCCESSFUL"
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950/80 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {order.status === "SUCCESSFUL" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          disabled={!order.customer_phone}
                          onClick={() => sendWelcomeWA(order)}
                          className="flex items-center gap-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Welcome WA
                        </button>
                        <button
                          disabled={!order.customer_phone}
                          onClick={() => sendStatusWA(order)}
                          className="flex items-center gap-1 bg-teal-600/20 text-teal-400 hover:bg-teal-600/30 border border-teal-800/50 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40"
                        >
                          <Send className="w-3.5 h-3.5" /> Status WA
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold text-white">Bulk WhatsApp Broadcast</h3>
            <p className="text-sm text-zinc-400">
              Customize your message for <strong>{selectedOrders.length}</strong> recipient(s). Placeholders: <code>{"{name}"}</code> and <code>{"{ref}"}</code>.
            </p>

            <textarea
              rows={5}
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkDispatch}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Start Dispatch Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}