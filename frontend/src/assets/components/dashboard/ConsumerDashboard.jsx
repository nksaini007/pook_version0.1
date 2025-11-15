import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
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
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

/* --------------------------- Design tokens: Neumorphic Pastel --------------------------- */
const tokens = {
  bg: "bg-[#f6f8fb]",
  surface: "bg-white",
  softBorder: "border border-[#e6e9ef]",
  shadowSoft: "shadow-[10px_10px_20px_rgba(163,177,198,0.18)] shadow-inner",
  rounded: "rounded-2xl",
  accent: "text-[#7c83ff]",
  subtleText: "text-[#6b7280]",
  pill:
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
};

/* --------------------------- Status helpers --------------------------- */
const STATUS_META = {
  pending: {
    label: "Pending",
    color: "text-[#f59e0b]",
    bg: "bg-[#fff7ed]",
    bar: "bg-[#f59e0b]",
    icon: <FaClock className="text-[#f59e0b]" />,
  },
  shipped: {
    label: "Shipped",
    color: "text-[#3b82f6]",
    bg: "bg-[#eff6ff]",
    bar: "bg-[#3b82f6]",
    icon: <FaTruck className="text-[#3b82f6]" />,
  },
  delivered: {
    label: "Delivered",
    color: "text-[#10b981]",
    bg: "bg-[#ecfdf5]",
    bar: "bg-[#10b981]",
    icon: <FaCheckCircle className="text-[#10b981]" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-[#ef4444]",
    bg: "bg-[#fff1f2]",
    bar: "bg-[#ef4444]",
    icon: <FaBoxOpen className="text-[#ef4444]" />,
  },
  unknown: {
    label: "Unknown",
    color: "text-[#9ca3af]",
    bg: "bg-[#f3f4f6]",
    bar: "bg-[#9ca3af]",
    icon: <FaQuestionCircle className="text-[#9ca3af]" />,
  },
};

const statusProgress = (s) => {
  const v = (s || "unknown").toLowerCase();
  if (v === "pending") return 20;
  if (v === "shipped") return 65;
  if (v === "delivered") return 100;
  if (v === "cancelled") return 0;
  return 40;
};

const statusMeta = (s) => STATUS_META[(s || "unknown").toLowerCase()] || STATUS_META.unknown;

/* --------------------------- Component --------------------------- */
const ConsumerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to fetch your orders. Please try again later.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetchOrders();
    return () => (mounted = false);
  }, []);

  const metrics = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;
    const inProgress = orders.filter((o) => ["pending", "shipped"].includes((o.status || "").toLowerCase())).length;
    const spend = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    return { total, delivered, inProgress, spend };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => (o.status || "").toLowerCase() === statusFilter);
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

  /* Action placeholders (adapt to your routing/api) */
  const handleViewDetails = (orderId) => console.log("view details", orderId);
  const handleDownloadInvoice = (orderId) => console.log("download invoice", orderId);
  const handleReorder = (order) => console.log("reorder", order._id);

  return (
    <div className={`${tokens.bg} min-h-screen antialiased`}>
      <Nev />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#111827]">Welcome back</h1>
            <p className={`${tokens.subtleText} mt-1`}>Your orders & account at a glance — soft, rounded, calm.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`${tokens.surface} ${tokens.softBorder} ${tokens.rounded} px-3 py-2 flex items-center gap-3`}>
              <FaSearch className="text-[#9aa3bf]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders or items"
                className="bg-transparent outline-none text-sm placeholder:text-[#9aa3bf]"
              />
            </div>

            <div className={`${tokens.surface} ${tokens.softBorder} ${tokens.rounded} px-3 py-2 flex items-center gap-2`}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none text-sm">
                <option value="date_desc">Newest</option>
                <option value="date_asc">Oldest</option>
                <option value="amount_desc">Amount: High to Low</option>
                <option value="amount_asc">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: left sidebar + main */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className={`md:col-span-1 ${tokens.surface} ${tokens.softBorder} p-5 ${tokens.rounded} ${tokens.shadowSoft}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#fce7f3] to-[#e8f0ff] flex items-center justify-center text-xl">🌸</div>
              <div>
                <div className="text-sm font-medium text-[#111827]">Dev Lal</div>
                <div className="text-xs text-[#9aa3bf]">Seller / Buyer</div>
              </div>
            </div>

            <nav className="space-y-2 mt-4">
              {[{ key: "orders", label: "Orders", icon: <FaList /> }, { key: "wishlist", label: "Wishlist", icon: <FaHeart /> }, { key: "profile", label: "Profile", icon: <FaUser /> }, { key: "settings", label: "Settings", icon: <FaCogs /> }].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition ${activeTab === tab.key ? "bg-[#eef2ff] font-semibold" : "hover:bg-white"}`}
                >
                  <span className="text-[#667085]">{tab.icon}</span>
                  <span className="text-sm text-[#111827]">{tab.label}</span>
                </button>
              ))}

              <button className="w-full flex items-center gap-3 px-3 py-2 mt-3 rounded-lg text-sm text-[#ef4444] hover:bg-white">
                <FaSignOutAlt />
                Logout
              </button>
            </nav>

            <div className="mt-6 text-xs text-[#9aa3bf]">
              <div>Account settings · Orders · Help</div>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-3 space-y-6">
            {/* Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -4 }} className={`${tokens.surface} ${tokens.softBorder} p-4 ${tokens.rounded} ${tokens.shadowSoft}`}>
                <div className="text-xs text-[#9aa3bf]">Total orders</div>
                <div className="text-2xl font-semibold text-[#111827] mt-1">{metrics.total}</div>
                <div className="text-xs ${tokens.subtleText} mt-2">Across all time</div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={`${tokens.surface} ${tokens.softBorder} p-4 ${tokens.rounded} ${tokens.shadowSoft}`}>
                <div className="text-xs text-[#9aa3bf]">In progress</div>
                <div className="text-2xl font-semibold text-[#111827] mt-1">{metrics.inProgress}</div>
                <div className="text-xs ${tokens.subtleText} mt-2">Pending & shipped</div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className={`${tokens.surface} ${tokens.softBorder} p-4 ${tokens.rounded} ${tokens.shadowSoft}`}>
                <div className="text-xs text-[#9aa3bf]">Spend</div>
                <div className="text-2xl font-semibold text-[#111827] mt-1">₹{metrics.spend.toFixed(2)}</div>
                <div className="text-xs ${tokens.subtleText} mt-2">Total purchases</div>
              </motion.div>
            </section>

            {/* Filters & controls */}
            <section className={`${tokens.surface} ${tokens.softBorder} p-4 ${tokens.rounded} ${tokens.shadowSoft}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`${tokens.pill} bg-[#fff] ${tokens.softBorder}`}>
                    <span className="text-sm text-[#667085]">Status</span>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent outline-none ml-2">
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className={`${tokens.pill} bg-[#fff] ${tokens.softBorder}`}>
                    <span className="text-sm text-[#667085]">Sort</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none ml-2">
                      <option value="date_desc">Newest</option>
                      <option value="date_asc">Oldest</option>
                      <option value="amount_desc">Amount desc</option>
                      <option value="amount_asc">Amount asc</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#fce7f3] to-[#e8f0ff] text-sm font-semibold">New order</button>
                  <button className="px-3 py-2 rounded-lg border border-[#e6e9ef] text-sm">Export</button>
                </div>
              </div>
            </section>

            {/* Orders list */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && (
                <div className="col-span-full p-6 ${tokens.surface} ${tokens.softBorder} ${tokens.rounded}">Loading...</div>
              )}

              {!loading && error && (
                <div className="col-span-full p-4 bg-[#fff7f7] border border-[#fde2e2] rounded">{error}</div>
              )}

              {!loading && !error && visibleOrders.length === 0 && (
                <div className={`${tokens.surface} p-6 ${tokens.rounded} ${tokens.softBorder} text-center`}>No orders found</div>
              )}

              {!loading && !error && visibleOrders.map((order) => {
                const meta = statusMeta(order.status);
                const progress = statusProgress(order.status);
                const created = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
                const idShort = order._id?.slice(0, 8) || "—";

                return (
                  <motion.article key={order._id} whileHover={{ y: -6 }} className={`${tokens.surface} ${tokens.softBorder} p-4 ${tokens.rounded} ${tokens.shadowSoft}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-[#9aa3bf]">Order</div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-[#111827]">#{idShort}</h3>
                          <div className={`${meta.bg} px-2 py-0.5 text-xs rounded-full`}>{meta.icon} <span className={`${meta.color} ml-2`}>{meta.label}</span></div>
                        </div>
                        <div className="text-xs text-[#9aa3bf] mt-1">{created}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#111827]">₹{order.totalPrice || "0.00"}</div>
                        <div className="text-xs text-[#9aa3bf]">{order.orderItems?.length || 0} items</div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {(order.orderItems || []).slice(0,3).map((it, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fbfbfe] flex items-center justify-center text-xs text-[#9aa3bf]">IMG</div>
                            <div>
                              <div className="text-sm text-[#111827] line-clamp-1">{it.name}</div>
                              <div className="text-xs text-[#9aa3bf]">Qty: {it.qty}</div>
                            </div>
                          </div>
                          <div className="text-sm text-[#111827]">₹{it.price || "-"}</div>
                        </div>
                      ))}

                      {order.orderItems?.length > 3 && <div className="text-xs text-[#9aa3bf]">+{order.orderItems.length - 3} more</div>}

                      <div className="mt-2">
                        <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className={`${meta.bar} h-2 rounded-full`} style={{ width: `${progress}%` }} />
                        </div>
                        <div className="text-xs text-[#9aa3bf] mt-1">Order progress: {progress}%</div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => handleViewDetails(order._id)} className="px-3 py-2 rounded-lg border border-[#e6e9ef] text-sm">Details</button>
                        <button onClick={() => handleDownloadInvoice(order._id)} className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#fce7f3] to-[#e8f0ff] text-sm font-semibold">Invoice</button>
                        {(order.status || "").toLowerCase() === "delivered" && (
                          <button onClick={() => handleReorder(order)} className="px-3 py-2 rounded-lg bg-[#111827] text-white text-sm">Reorder</button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </section>

            {/* Footer note */}
            <div className="text-xs text-[#9aa3bf]">Tip: Click an order to view more details or download invoice.</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
