import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaTruck,
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ConsumerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: "ORD001",
          product: "Ergonomic Chair",
          status: "Delivered",
          location: "Delivered at your address",
          progress: 100,
        },
        {
          id: "ORD002",
          product: "Wooden Desk",
          status: "In Transit",
          location: "Jaipur Warehouse → Alwar",
          progress: 70,
        },
        {
          id: "ORD003",
          product: "LED Lamp",
          status: "Pending",
          location: "Order Confirmed",
          progress: 25,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen flex font-inter bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-800 text-sm relative">
      {/* Sidebar (Desktop + Mobile) */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 80 }}
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-60 bg-white/90 backdrop-blur-md border-r border-indigo-100 shadow-md flex flex-col justify-between z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex justify-between items-center px-4 py-5 border-b border-indigo-100">
            <h1 className="text-2xl font-extrabold text-indigo-500">
              Bilota<span className="text-gray-700">.com</span>
            </h1>
            <button
              className="text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {[
              { to: "/my-orders", icon: <FaShoppingBag />, label: "My Orders" },
              { to: "/wishlist", icon: <FaHeart />, label: "Wishlist" },
              { to: "/profile", icon: <FaUser />, label: "My Profile" },
              { to: "/tracking", icon: <FaTruck />, label: "Track Orders" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg p-2.5 transition-all"
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-indigo-100 p-4">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Section */}
      <main className="flex-1 flex flex-col md:ml-0">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger for Mobile */}
            <button
              className="md:hidden text-indigo-500 text-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>

            <div className="flex items-center bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 w-[150px] sm:w-[220px] md:w-[300px]">
              <FaSearch className="text-indigo-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent outline-none border-none w-full placeholder-indigo-300 text-gray-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <FaBell className="text-indigo-400 hover:text-indigo-500 cursor-pointer text-lg transition" />
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-indigo-400 shadow-sm"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold mb-6 text-gray-700">
            Welcome back,{" "}
            <span className="text-indigo-500 font-bold">Customer</span> 👋
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              {
                title: "Total Orders",
                value: "45",
                icon: <FaShoppingBag />,
                color: "bg-indigo-100 text-indigo-500",
              },
              {
                title: "Wishlist",
                value: "12",
                icon: <FaHeart />,
                color: "bg-pink-100 text-pink-500",
              },
              {
                title: "Delivered",
                value: "36",
                icon: <FaTruck />,
                color: "bg-green-100 text-green-500",
              },
              {
                title: "Pending",
                value: "9",
                icon: <FaClock />,
                color: "bg-yellow-100 text-yellow-500",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    {card.title}
                  </p>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full flex items-center justify-center ${card.color}`}
                >
                  {card.icon}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl border border-indigo-100 p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2 text-indigo-500">
              <FaTruck /> Recent Orders
            </h2>

            {loading ? (
              <p className="text-gray-400 animate-pulse text-sm">
                Loading orders...
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer flex flex-col sm:flex-row items-center justify-between bg-indigo-50 border border-indigo-100 p-3 sm:p-4 rounded-lg hover:bg-indigo-100 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="font-medium text-gray-800 text-xs sm:text-sm">
                        {order.product}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status === "In Transit"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <button className="mt-2 sm:mt-0 text-indigo-500 text-[11px] sm:text-xs font-semibold hover:underline">
                      Track Order
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Order Tracking Modal */}
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
            >
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-base sm:text-lg font-semibold text-indigo-500 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt /> Tracking #{selectedOrder.id}
                </h2>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                  {selectedOrder.location}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 mb-3">
                  <div
                    className="h-2 sm:h-3 rounded-full bg-indigo-400 transition-all duration-700"
                    style={{ width: `${selectedOrder.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Out for Delivery</span>
                  <span>Delivered</span>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConsumerDashboard;
