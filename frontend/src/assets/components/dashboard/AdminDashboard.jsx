// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import Nev from "../Nev";
// import AdminCategoryDashboard from "./AdminCategoryDashboard";
// import {
//   FaUser, FaBox, FaTrash, FaEdit, FaSearch, FaChartBar, FaUsers, FaBell
// } from "react-icons/fa";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
//   LineChart, Line, CartesianGrid, XAxis, YAxis
// } from "recharts";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchUser, setSearchUser] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");

//   useEffect(() => {
//     fetchUsers();
//     fetchProducts();
//   }, []);

//   const fetchUsers = async () => {
//     try { const { data } = await API.get("/users"); setUsers(data); }
//     catch (err) { console.error(err); }
//   };

//   const fetchProducts = async () => {
//     try { const { data } = await API.get("/products"); setProducts(data); }
//     catch (err) { console.error(err); }
//   };

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm("Delete user?")) return;
//     await API.delete(`/users/${id}`);
//     fetchUsers();
//   };

//   const filteredUsers = users.filter(u =>
//     u.name.toLowerCase().includes(searchUser.toLowerCase()) &&
//     (selectedRole ? u.role === selectedRole : true)
//   );

//   const totalUsers = users.length;
//   const activeUsers = users.filter(u => u.isActive).length;
//   const totalProducts = products.length;
//   const lowStockProducts = products.filter(p => p.stock < 5).length;
//   const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

//   const usersByRoleData = Object.values(filteredUsers.reduce((acc, u) => {
//     acc[u.role] = acc[u.role] || { name: u.role, value: 0 };
//     acc[u.role].value += 1;
//     return acc;
//   }, {}));

//   const COLORS = ["#ff6a00", "#ff4500", "#ffa500", "#ff8c00", "#ff7f50"];
//   const userGrowth = users.map((u, i) => ({ day: `Day ${i + 1}`, users: i + 1 }));

//   const userLocations = [
//     { lat: 28.6139, lng: 77.2090, name: "New Delhi" },
//     { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
//     { lat: 12.9716, lng: 77.5946, name: "Bengaluru" }
//   ];

//   return (
//     <>
//       <Nev />
//       <div className="min-h-screen bg-black text-white p-6 font-sans">

//         <h1 className="text-4xl font-bold mb-10 tracking-wide drop-shadow-lg ">Welcome, Ghost</h1>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
//           {[{ title: "Total Users", value: totalUsers, icon: <FaUsers size={28} /> },
//           { title: "Active Users", value: activeUsers, icon: <FaUser size={28} /> },
//           { title: "Total Products", value: totalProducts, icon: <FaBox size={28} /> },
//           { title: "Low Stock", value: lowStockProducts, icon: <FaBell size={28} /> },
//           { title: "Total Stock", value: totalStock, icon: <FaBox size={28} /> }].map((stat, idx) => (
//             <div key={idx} className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-orange-500/50 transition transform hover:-translate-y-1 border border-gray-500/50">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-sm font-semibold text-white">{stat.title}</h3>
//                   <p className="text-2xl font-bold mt-1 ">{stat.value}</p>
//                 </div>
//                 <div className="">{stat.icon}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//               <AdminCategoryDashboard />
//         {/* Charts & Map */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

//           {/* Users by Role */}
//           <div className="bg-gray-700 p-5 rounded-xl shadow-lg border border-gray-500/50">
//             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 "><FaChartBar /> Users by Role</h3>
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie data={usersByRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//                   {usersByRoleData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip contentStyle={{ background: '#111', border: '1px solid #555' }} itemStyle={{ color: '#fff' }} />
//                 <Legend wrapperStyle={{ color: '#fff' }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Bigger Map */}
//           <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-500/50 overflow-hidden col-span-1 md:col-span-2 h-[500px]">
//             <h3 className="text-lg font-semibold mb-2 px-4 pt-4 ">User Locations Map</h3>
//             <MapContainer
//               center={[20.5937, 78.9629]}
//               zoom={4}
//               scrollWheelZoom={true}
//               style={{ width: "100%", height: "100%" }}
//             >
//               <TileLayer
//                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//               />
//               {userLocations.map((user, idx) => (
//                 <Marker key={idx} position={[user.lat, user.lng]}>
//                   <Popup>{user.name}</Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>
                
//           {/* User Growth */}
//           <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-500/50">
//             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-400"><FaChartBar /> User Growth</h3>
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={userGrowth}>
//                 <CartesianGrid stroke="#444" strokeDasharray="3 3" />
//                 <XAxis dataKey="day" stroke="#fff" />
//                 <YAxis stroke="#fff" />
//                 <Tooltip contentStyle={{ background: '#111', border: '1px solid #555' }} itemStyle={{ color: '#fff' }} />
//                 <Line type="monotone" dataKey="users" stroke="#ff6a00" strokeWidth={3} dot={{ fill: '#ff6a00' }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Search & Filter */}
//         <div className="mb-8 flex flex-wrap gap-4 items-center">
//           <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 bg-gray-800">
//             <FaSearch className="mr-2 text-orange-500" />
//             <input
//               type="text"
//               placeholder="Search Users..."
//               value={searchUser}
//               onChange={e => setSearchUser(e.target.value)}
//               className="outline-none bg-transparent text-white placeholder-gray-400"
//             />
//           </div>
//           <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
//             className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white">
//             <option value="">All Roles</option>
//             <option value="customer">Customer</option>
//             <option value="seller">Seller</option>
//             <option value="delivery">Delivery</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {/* Users List */}
//         <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredUsers.map(user => (
//             <div key={user._id} className="bg-gray-700 p-5 rounded-xl shadow-lg hover:shadow-orange-500/50 transition transform hover:-translate-y-1 border border-gray-500/50 flex justify-between items-center">
//               <div>
//                 <h4 className="font-semibold text-white">{user.name}</h4>
//                 <p className="text-gray-300 text-sm">{user.email}</p>
//                 <p className="text-gray-400 text-sm">{user.role}</p>
//               </div>
//               <div className="flex gap-3">
//                 <button className="bg-orange-500 text-white hover:bg-orange-600 p-2 rounded-lg transition"><FaEdit /></button>
//                 <button onClick={() => handleDeleteUser(user._id)} className="bg-orange-500 text-white hover:bg-orange-600 p-2 rounded-lg transition"><FaTrash /></button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Categories Dashboard */}
      
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Nev from "../Nev";
import AdminCategoryDashboard from "./AdminCategoryDashboard";
import {
  FaUser, FaBox, FaTrash, FaEdit, FaSearch, FaChartBar, FaUsers, FaBell
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* -----------------------------
   Reusable UI building blocks
------------------------------ */

const Panel = ({ title, icon, children, className = "" }) => (
  <section
    className={`bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}
    aria-label={title}
  >
    <div className="flex items-center gap-2 px-5 pt-4">
      {icon && <span className="text-orange-400">{icon}</span>}
      <h3 className="text-base md:text-lg font-semibold tracking-wide">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const StatCard = ({ title, value, icon }) => (
  <div
    className="group bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[2px]"
    role="figure"
    aria-label={`${title} ${value}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-neutral-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="text-neutral-300 group-hover:text-orange-400 transition-colors">{icon}</div>
    </div>
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <label
    htmlFor="user-search"
    className="flex items-center gap-2 border border-neutral-800 rounded-lg px-3 py-2 bg-neutral-900/70 focus-within:ring-2 focus-within:ring-orange-500"
  >
    <FaSearch className="text-orange-400" aria-hidden="true" />
    <input
      id="user-search"
      type="text"
      placeholder="Search users"
      value={value}
      onChange={onChange}
      className="w-52 md:w-72 bg-transparent text-white placeholder-neutral-500 outline-none"
      aria-label="Search users by name"
    />
  </label>
);

const Select = ({ value, onChange, label, children }) => (
  <div className="flex flex-col">
    <label htmlFor="role-select" className="sr-only">{label}</label>
    <select
      id="role-select"
      value={value}
      onChange={onChange}
      className="border border-neutral-800 rounded-lg px-3 py-2 bg-neutral-900/70 text-white focus:ring-2 focus:ring-orange-500"
      aria-label={label}
    >
      {children}
    </select>
  </div>
);

const UserCard = ({ user, onEdit, onDelete }) => (
  <article
    className="bg-neutral-900/70 backdrop-blur-sm border border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-start"
    aria-labelledby={`user-${user._id}-name`}
  >
    <div>
      <h4 id={`user-${user._id}-name`} className="font-semibold text-white">{user.name}</h4>
      <p className="text-neutral-400 text-sm">{user.email}</p>
      <p className="text-neutral-500 text-sm mt-1">Role: <span className="text-neutral-300">{user.role}</span></p>
      {user.isActive === false && (
        <p className="mt-1 text-xs text-yellow-400">Inactive</p>
      )}
    </div>
    <div className="flex gap-2">
      <button
        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg transition focus:ring-2 focus:ring-orange-500"
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.name}`}
      >
        <FaEdit />
      </button>
      <button
        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg transition focus:ring-2 focus:ring-orange-500"
        onClick={() => onDelete(user._id)}
        aria-label={`Delete ${user.name}`}
      >
        <FaTrash />
      </button>
    </div>
  </article>
);

const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-10">
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-neutral-400 mt-1">{description}</p>
    {action}
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-neutral-800 rounded-lg ${className}`} />
);

/* -----------------------------
   Main dashboard
------------------------------ */

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          API.get("/users"),
          API.get("/products"),
        ]);
        setUsers(usersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleteUser = async (id) => {
    const ok = window.confirm("Delete user?");
    if (!ok) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesName = u.name?.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = selectedRole ? u.role === selectedRole : true;
    return matchesName && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 5).length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  // Chart data
  const usersByRoleData = Object.values(
    filteredUsers.reduce((acc, u) => {
      const role = u.role || "unknown";
      acc[role] = acc[role] || { name: role, value: 0 };
      acc[role].value += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#ff6a00", "#ff8c00", "#ffa500", "#ff7f50", "#ff4500"];
  const userGrowth = users.map((_, i) => ({ day: `Day ${i + 1}`, users: i + 1 }));

  const userLocations = [
    { lat: 28.6139, lng: 77.209, name: "New Delhi" },
    { lat: 19.076, lng: 72.8777, name: "Mumbai" },
    { lat: 12.9716, lng: 77.5946, name: "Bengaluru" },
  ];

  return (
    <>
      <Nev />
      <div className="min-h-screen bg-[#0B0B0F] text-white">
        {/* Page header */}
        <header className="px-6 md:px-8 pt-8 pb-4 border-b border-neutral-900">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <div className="text-sm text-neutral-400">Welcome, Ghost</div>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 md:px-8 py-8 space-y-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : (
              <>
                <StatCard title="Total users" value={totalUsers} icon={<FaUsers size={24} />} />
                <StatCard title="Active users" value={activeUsers} icon={<FaUser size={24} />} />
                <StatCard title="Total products" value={totalProducts} icon={<FaBox size={24} />} />
                <StatCard title="Low stock" value={lowStockProducts} icon={<FaBell size={24} />} />
                <StatCard title="Total stock" value={totalStock} icon={<FaBox size={24} />} />
              </>
            )}
          </div>

          {/* Categories */}
          <Panel title="Categories overview" icon={<FaChartBar />}>
            <AdminCategoryDashboard />
          </Panel>

          {/* Charts + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Panel title="Users by role" icon={<FaChartBar />}>
              {usersByRoleData.length === 0 ? (
                <EmptyState
                  title="No role data"
                  description="Try adjusting filters or adding users."
                />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRoleData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {usersByRoleData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#111", border: "1px solid #333" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend wrapperStyle={{ color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>

            <Panel
              title="User locations map"
              icon={<FaChartBar />}
              className="lg:col-span-2 overflow-hidden"
            >
              <div className="h-[420px] rounded-xl overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={4}
                  scrollWheelZoom
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {userLocations.map((user, idx) => (
                    <Marker key={idx} position={[user.lat, user.lng]}>
                      <Popup>{user.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Panel>

            <Panel title="User growth" icon={<FaChartBar />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid stroke="#2C2C2C" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#CFCFCF" />
                    <YAxis stroke="#CFCFCF" />
                    <Tooltip
                      contentStyle={{ background: "#111", border: "1px solid #333" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#ff6a00"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#ff6a00" }}
                      activeDot={{ r: 5, fill: "#ffa500" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* Filters */}
          <Panel title="Search and filters" icon={<FaSearch />}>
            <div className="flex flex-wrap items-center gap-4">
              <SearchBar
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Filter by role"
              >
                <option value="">All roles</option>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="delivery">Delivery</option>
                <option value="admin">Admin</option>
              </Select>
              {(searchUser || selectedRole) && (
                <button
                  onClick={() => {
                    setSearchUser("");
                    setSelectedRole("");
                  }}
                  className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          </Panel>

          {/* Users list */}
          <Panel title="Users" icon={<FaUsers />}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                title="No users found"
                description="Try changing your search or filters."
                action={
                  <button
                    className="mt-4 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition"
                    onClick={() => {
                      setSearchUser("");
                      setSelectedRole("");
                    }}
                  >
                    Reset filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onEdit={(u) => console.log("Edit user", u)}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            )}
          </Panel>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
