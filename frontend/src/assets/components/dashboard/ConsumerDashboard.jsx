import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Nev from "../Nev";
import {
  FaTruck,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaHeart,
  FaUser,
  FaCogs,
  FaSignOutAlt,
  FaList,
} from "react-icons/fa";

// --- Design tokens (keep UI consistent)
const tokens = {
  brand: "bg-blue-600",
  brandText: "text-blue-600",
  subtle: "text-gray-500",
  card: "bg-white rounded-xl shadow-sm hover:shadow-md transition",
  border: "border border-gray-200",
  pill:
    "inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm",
};

// --- Status helpers
const STATUS_META = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50", bar: "bg-yellow-400", icon: <FaClock className="text-yellow-500" /> },
  shipped: { label: "Shipped", color: "text-blue-700", bg: "bg-blue-50", bar: "bg-blue-500", icon: <FaTruck className="text-blue-500" /> },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50", bar: "bg-green-500", icon: <FaCheckCircle className="text-green-500" /> },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50", bar: "bg-red-500", icon: <FaBoxOpen className="text-red-500" /> },
  unknown: { label: "Unknown", color: "text-gray-700", bg: "bg-gray-50", bar: "bg-gray-400", icon: <FaQuestionCircle className="text-gray-400" /> },
};

const statusProgress = (s) => {
  const v = (s || "unknown").toLowerCase();
  if (v === "pending") return 25;
  if (v === "shipped") return 60;
  if (v === "delivered") return 100;
  if (v === "cancelled") return 0;
  return 40;
};

const statusMeta = (s) => STATUS_META[(s || "unknown").toLowerCase()] || STATUS_META.unknown;

const ConsumerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  // UI state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Derived metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;
    const inProgress = orders.filter((o) => ["pending", "shipped"].includes((o.status || "").toLowerCase())).length;
    const spend = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    return { total, delivered, inProgress, spend };
  }, [orders]);

  // Filter + sort + search
  const visibleOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== "all") {
      list = list.filter((o) => (o.status || "").toLowerCase() === statusFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => {
        const id = (o._id || "").toLowerCase();
        const items = (o.orderItems || []).map((i) => i.name?.toLowerCase() || "");
        return id.includes(q) || items.some((n) => n.includes(q));
      });
    }

    list.sort((a, b) => {
      const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
      if (sortBy === "date_desc") return db - da;
      if (sortBy === "date_asc") return da - db;
      if (sortBy === "amount_desc") return (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0);
      if (sortBy === "amount_asc") return (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0);
      return 0;
    });

    return list;
  }, [orders, query, statusFilter, sortBy]);

  // Action placeholders
  const handleViewDetails = (orderId) => {
    // Navigate to order details route if you have one
    // e.g., navigate(`/orders/${orderId}`)
    console.log("view details", orderId);
  };
  const handleDownloadInvoice = (orderId) => {
    // Implement invoice download from your API
    console.log("download invoice", orderId);
  };
  const handleReorder = (order) => {
    // Add items back to cart
    console.log("reorder", order._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nev />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`w-full md:w-64 ${tokens.card} p-6 md:rounded-none md:shadow-none md:${tokens.border} md:bg-white md:border-r`}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-left">Dashboard</h2>
          <ul className="space-y-2 text-gray-700">
            {[
              { key: "orders", label: "My Orders", icon: <FaList /> },
              { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },
              { key: "profile", label: "Profile", icon: <FaUser /> },
              { key: "settings", label: "Settings", icon: <FaCogs /> },
            ].map((tab) => (
              <li
                key={tab.key}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg ${
                  activeTab === tab.key ? "bg-blue-50 " + tokens.brandText + " font-medium" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">
              <FaSignOutAlt />
              <span>Logout</span>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Orders tab */}
          {activeTab === "orders" && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">My orders</h1>
                  <p className={tokens.subtle}>Track, manage, and revisit your purchases.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block text-sm text-gray-600">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="date_desc">Newest</option>
                    <option value="date_asc">Oldest</option>
                    <option value="amount_desc">Amount: High to Low</option>
                    <option value="amount_asc">Amount: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Metrics */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`${tokens.card} p-4`}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Total orders</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{metrics.total}</p>
                </div>
                <div className={`${tokens.card} p-4`}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">In progress</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-700">{metrics.inProgress}</p>
                </div>
                <div className={`${tokens.card} p-4`}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Delivered</p>
                  <p className="mt-1 text-2xl font-semibold text-green-700">{metrics.delivered}</p>
                </div>
                <div className={`${tokens.card} p-4`}>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Total spend</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">₹{metrics.spend.toFixed(2)}</p>
                </div>
              </section>

              {/* Controls */}
              <section className={`${tokens.card} p-4`}>
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by order ID or item name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { key: "all", label: "All" },
                      { key: "pending", label: "Pending" },
                      { key: "shipped", label: "Shipped" },
                      { key: "delivered", label: "Delivered" },
                      { key: "cancelled", label: "Cancelled" },
                    ].map((f) => {
                      const active = statusFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          onClick={() => setStatusFilter(f.key)}
                          className={`${tokens.pill} ${active ? "bg-blue-50 " + tokens.brandText + " border-blue-200" : "bg-white"} hover:bg-gray-50`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Content */}
              {loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`${tokens.card} p-5 animate-pulse`}>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                      <div className="mt-4 h-2 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && visibleOrders.length === 0 && (
                <div className={`${tokens.card} p-8 text-center`}>
                  <p className="text-gray-800 font-medium">No orders found</p>
                  <p className={tokens.subtle}>Try adjusting filters or searching by item name.</p>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setQuery("");
                        setStatusFilter("all");
                        setSortBy("date_desc");
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && visibleOrders.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleOrders.map((order) => {
                    const meta = statusMeta(order.status);
                    const progress = statusProgress(order.status);
                    const created = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
                    const idShort = order._id?.slice(0, 8) || "—";

                    return (
                      <div key={order._id} className={`${tokens.card} p-5`}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Order</p>
                            <h3 className="font-semibold text-gray-900 text-sm">#{idShort}</h3>
                          </div>
                          <div className={`flex items-center gap-2 ${meta.bg} px-3 py-1 rounded-full`}>
                            {meta.icon}
                            <span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="text-sm text-gray-700 space-y-1">
                          <p><span className="text-gray-500">Date:</span> {created}</p>
                          <p><span className="text-gray-500">Total:</span> ₹{order.totalPrice || "N/A"}</p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-500">Items:</span>
                            <span className="text-gray-800">{order.orderItems?.length || 0}</span>
                          </p>
                        </div>

                        {/* Items preview */}
                        <div className="mt-3 space-y-2">
                          {(order.orderItems || []).slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                                  {/* Optional thumbnail: <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> */}
                                  <span className="text-xs text-gray-500">IMG</span>
                                </div>
                                <div className="text-sm">
                                  <p className="text-gray-900 line-clamp-1">{item.name}</p>
                                  <p className="text-gray-500">x{item.qty}</p>
                                </div>
                              </div>
                              <div className="text-gray-800 text-sm">₹{item.price || "-"}</div>
                            </div>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <p className="text-xs text-gray-500">+ {order.orderItems.length - 3} more</p>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="mt-4">
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${statusMeta(order.status).bar}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Order progress: {progress}%</p>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order._id)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm hover:bg-gray-50"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                          >
                            Invoice
                          </button>
                          {(order.status || "").toLowerCase() === "delivered" && (
                            <button
                              onClick={() => handleReorder(order)}
                              className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-black"
                            >
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Wishlist tab */}
          {activeTab === "wishlist" && (
            <section className={`${tokens.card} p-8 text-center`}>
              <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
              <p className={tokens.subtle}>Your saved items will appear here.</p>
            </section>
          )}

          {/* Profile tab */}
          {activeTab === "profile" && (
            <section className={`${tokens.card} p-6`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full name</label>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" placeholder="+91-" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" placeholder="Street, City, State" />
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save changes</button>
              </div>
            </section>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <section className={`${tokens.card} p-6`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">Get updates on order status and offers.</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Dark mode</p>
                    <p className="text-xs text-gray-500">Reduce eye strain at night.</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5" />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
