import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Nev from "../Nev";
import AdminCategoryDashboard from "./AdminCategoryDashboard";
import {
  FaUser, FaBox, FaTrash, FaEdit, FaSearch, FaChartBar, FaUsers, FaBell
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try { const { data } = await API.get("/users"); setUsers(data); }
    catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try { const { data } = await API.get("/products"); setProducts(data); }
    catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) &&
    (selectedRole ? u.role === selectedRole : true)
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const usersByRoleData = Object.values(filteredUsers.reduce((acc, u) => {
    acc[u.role] = acc[u.role] || { name: u.role, value: 0 };
    acc[u.role].value += 1;
    return acc;
  }, {}));

  const productsByCategory = Object.values(products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || { name: p.category, value: 0 };
    acc[p.category].value += 1;
    return acc;
  }, {}));

  const COLORS = ["#9aa2a8ff", "#fa913cff", "#ffd43b", "#51cf66", "#748ffc", "#845ef7"];
  const userGrowth = users.map((u, i) => ({ day: `Day ${i + 1}`, users: i + 1 }));

  // Mock user locations for map chart
  const userLocations = [
    { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
    { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
    { lat: 12.9716, lng: 77.5946, name: "Bengaluru" }
  ];

  return (
    <>
      <Nev />
      <div className="min-h-screen bg-black text-white p-6 font-sans">

        <h1 className="text-4xl font-bold mb-10 tracking-wide drop-shadow-sm">Welcome, Ghost</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {[{ title: "Total Users", value: totalUsers, icon: <FaUsers size={28} /> },
          { title: "Active Users", value: activeUsers, icon: <FaUser size={28} /> },
          { title: "Total Products", value: totalProducts, icon: <FaBox size={28} /> },
          { title: "Low Stock", value: lowStockProducts, icon: <FaBell size={28} /> },
          { title: "Total Stock", value: totalStock, icon: <FaBox size={28} /> }].map((stat, idx) => (
            <div key={idx} className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Users by Role */}
          <div className="bg-gray-800 p-5 rounded-xl shadow border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FaChartBar /> Users by Role</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={usersByRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {usersByRoleData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#222', border: '1px solid #555' }} itemStyle={{ color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Map Chart */}
          <div className="bg-gray-800 rounded-xl shadow border border-gray-700 overflow-hidden">
            <h3 className="text-lg font-semibold mb-2 px-4 pt-4">User Locations Map</h3>
            <div className="w-full h-56"> {/* full width container with fixed height */}
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={4}
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {userLocations.map((user, idx) => (
                  <Marker key={idx} position={[user.lat, user.lng]}>
                    <Popup>{user.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-gray-800 p-5 rounded-xl shadow border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FaChartBar /> User Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth}>
                <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ background: '#222', border: '1px solid #555' }} itemStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="users" stroke="#ffa500" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 bg-gray-800">
            <FaSearch className="mr-2 text-white" />
            <input
              type="text"
              placeholder="Search Users..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="outline-none bg-transparent text-white placeholder-gray-400"
            />
          </div>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
            className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="delivery">Delivery</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Users List */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user._id} className="bg-gray-700 p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-700 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{user.name}</h4>
                <p className="text-gray-300 text-sm">{user.email}</p>
                <p className="text-gray-400 text-sm">{user.role}</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-orange-500 text-white hover:bg-orange-600 p-2 rounded-lg transition"><FaEdit /></button>
                <button onClick={() => handleDeleteUser(user._id)} className="bg-orange-500 text-white hover:bg-orange-600 p-2 rounded-lg transition"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Dashboard */}
        <AdminCategoryDashboard />
      </div>
    </>
  );
};

export default AdminDashboard;
