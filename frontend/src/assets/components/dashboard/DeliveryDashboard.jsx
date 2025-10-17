import React, { useEffect, useState } from "react";
import {
  FaTruck,
  FaRoute,
  FaWallet,
  FaUser,
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const [earningsData] = useState([
    { day: "Mon", amount: 250 },
    { day: "Tue", amount: 300 },
    { day: "Wed", amount: 280 },
    { day: "Thu", amount: 350 },
    { day: "Fri", amount: 400 },
    { day: "Sat", amount: 420 },
    { day: "Sun", amount: 380 },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setDeliveries([
        { id: "DEL001", customer: "Amit Sharma", status: "Delivered", address: "Alwar, Rajasthan" },
        { id: "DEL002", customer: "Riya Mehta", status: "In Transit", address: "Mathura, UP" },
        { id: "DEL003", customer: "Rohit Singh", status: "Pending", address: "Jaipur, Rajasthan" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateStatus = (id, newStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  return (
    <div className="min-h-screen flex font-inter bg-gradient-to-br from-purple-900 via-gray-950 to-black text-gray-100 relative">
     
   
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Area */}
      <main className="flex-1 flex flex-col md:ml-0 z-10">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-gray-900/70 backdrop-blur-md px-6 py-4 border-b border-gray-800 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <FaBars
              className="text-gray-300 text-xl cursor-pointer md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex items-center gap-3 w-full max-w-md bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search deliveries, routes..."
                className="bg-transparent border-none focus:ring-0 outline-none w-full text-sm text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <FaBell className="text-gray-400 hover:text-cyan-400 cursor-pointer text-lg transition" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5 animate-pulse">
                  {notifications}
                </span>
              )}
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-cyan-400 shadow-md"
            />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 tracking-wide glow-text">
            Welcome back,{" "}
            <span className="text-cyan-400 font-bold">Delivery Partner</span>
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Total Deliveries", value: "128", icon: <FaTruck />, color: "bg-cyan-500/30 text-cyan-400" },
              { title: "Pending Orders", value: "8", icon: <FaRoute />, color: "bg-yellow-500/30 text-yellow-400" },
              { title: "Completed Today", value: "14", icon: <FaCheckCircle />, color: "bg-green-500/30 text-green-400" },
              { title: "Earnings (₹)", value: "2,35,990", icon: <FaWallet />, color: "bg-purple-500/30 text-purple-400" },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-800 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 p-5 flex items-center justify-between glow-card"
              >
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <h3 className="text-2xl font-semibold text-gray-100">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${card.color} glow-icon`}>{card.icon}</div>
              </div>
            ))}
          </div>

          {/* Earnings Chart */}
          <div className="bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-800 p-6 shadow-lg mb-10 glow-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
              <FaWallet /> Weekly Earnings Overview
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} />
                <Line type="monotone" dataKey="amount" stroke="#22d3ee" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Deliveries Table */}
          <div className="bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-800 p-6 shadow-lg glow-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
              <FaTruck /> Recent Deliveries
            </h2>
            {loading ? (
              <p className="text-gray-400 animate-pulse">Loading deliveries...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-gray-300">
                  <thead>
                    <tr className="bg-gray-800/50 text-gray-400 uppercase text-xs tracking-wide">
                      <th className="p-3 border-b border-gray-700">Delivery ID</th>
                      <th className="p-3 border-b border-gray-700">Customer</th>
                      <th className="p-3 border-b border-gray-700">Address</th>
                      <th className="p-3 border-b border-gray-700">Status</th>
                      <th className="p-3 border-b border-gray-700 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-800/50 transition-all duration-200">
                        <td className="p-3 border-b border-gray-700 font-medium">{delivery.id}</td>
                        <td className="p-3 border-b border-gray-700">{delivery.customer}</td>
                        <td className="p-3 border-b border-gray-700">{delivery.address}</td>
                        <td className="p-3 border-b border-gray-700">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              delivery.status === "Delivered"
                                ? "bg-green-500/30 text-green-400"
                                : delivery.status === "In Transit"
                                ? "bg-yellow-500/30 text-yellow-400"
                                : "bg-red-500/30 text-red-400"
                            }`}
                          >
                            {delivery.status}
                          </span>
                        </td>
                        <td className="p-3 border-b border-gray-700 text-right">
                          <button
                            onClick={() =>
                              updateStatus(
                                delivery.id,
                                delivery.status === "Delivered"
                                  ? "Pending"
                                  : "Delivered"
                              )
                            }
                            className="text-cyan-400 font-medium hover:underline glow-hover"
                          >
                            {delivery.status === "Delivered" ? "Mark Pending" : "Mark Delivered"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
