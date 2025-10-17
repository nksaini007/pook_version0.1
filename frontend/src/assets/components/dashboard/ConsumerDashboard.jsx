import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaTruck,
  FaBell,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ConsumerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        { id: "ORD001", product: "Ergonomic Chair", status: "Delivered" },
        { id: "ORD002", product: "Wooden Desk", status: "In Transit" },
        { id: "ORD003", product: "LED Lamp", status: "Pending" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex font-inter bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between border-r border-orange-200">
        <div>
          <div className="text-3xl font-bold text-center py-6 border-b border-orange-200 text-orange-500">
            Bilota.com
          </div>
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            {[
              { to: "/my-orders", icon: <FaShoppingBag />, label: "My Orders" },
              { to: "/wishlist", icon: <FaHeart />, label: "Wishlist" },
              { to: "/profile", icon: <FaUser />, label: "My Profile" },
              { to: "/tracking", icon: <FaTruck />, label: "Track Orders" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg p-3 transition-all duration-200"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-orange-200 p-4">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-orange-200 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 w-full max-w-md bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
            <FaSearch className="text-orange-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="bg-transparent border-none focus:ring-0 outline-none w-full text-sm text-gray-800 placeholder-orange-300"
            />
          </div>
          <div className="flex items-center gap-6">
            <FaBell className="text-orange-400 hover:text-orange-500 cursor-pointer text-lg transition" />
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-orange-400 shadow"
            />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-8">
            Welcome back,{" "}
            <span className="text-orange-500 font-bold">Customer</span>
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Total Orders",
                value: "45",
                icon: <FaShoppingBag />,
                color: "bg-orange-100 text-orange-500",
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
                icon: <FaUser />,
                color: "bg-yellow-100 text-yellow-500",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-full flex items-center justify-center ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-orange-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-500">
              <FaShoppingBag /> Recent Orders
            </h2>
            {loading ? (
              <p className="text-gray-400 animate-pulse">Loading orders...</p>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row items-center justify-between bg-orange-50 p-4 rounded-lg border border-orange-100 hover:bg-orange-100 transition shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                      <h3 className="font-semibold text-gray-800">{order.product}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
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
                    <button className="mt-3 sm:mt-0 text-orange-500 font-medium hover:underline">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsumerDashboard;
