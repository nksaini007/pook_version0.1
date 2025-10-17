import React, { useEffect, useState } from "react";
import API from "../../api/api";
import Nev from "../Nev";
import { 
  FaUser, FaBox, FaTrash, FaEdit, FaSearch, FaChartBar, FaUsers, FaBell 
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";

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

  const handleDeleteUser = async (id) => { if (!window.confirm("Delete user?")) return; await API.delete(`/users/${id}`); fetchUsers(); };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) &&
    (selectedRole ? u.role === selectedRole : true)
  );

  // Stats
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

  const COLORS = ["#00CFFF","#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#9B5DE5"];
  const userGrowth = users.map((u,i)=>({day:`Day ${i+1}`, users:i+1}));

  return (
    <>
      
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">

        <h1 className="text-4xl font-bold mb-8 tracking-wide text-white drop-shadow-lg">Welcome Ghost</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {[
            {title:"Total Users", value:totalUsers, color:"cyan", icon:<FaUsers size={28}/>},
            {title:"Active Users", value:activeUsers, color:"blue", icon:<FaUser size={28}/>},
            {title:"Total Products", value:totalProducts, color:"green", icon:<FaBox size={28}/>},
            {title:"Low Stock", value:lowStockProducts, color:"yellow", icon:<FaBell size={28}/>},
            {title:"Total Stock", value:totalStock, color:"purple", icon:<FaBox size={28}/>}
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gray-800/70 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 border-l-4 border-${stat.color}-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-semibold text-${stat.color}-400`}>{stat.title}</h3>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="text-gray-300">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800/70 p-5 rounded-2xl shadow-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center gap-2"><FaChartBar/> Users by Role</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={usersByRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {usersByRoleData.map((entry,index)=><Cell key={index} fill={COLORS[index%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#111', border:'none'}} itemStyle={{color:'#fff'}}/>
                <Legend wrapperStyle={{color:'#fff'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/70 p-5 rounded-2xl shadow-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2"><FaChartBar/> Products by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productsByCategory} margin={{top:5,right:20,left:-10,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
                <XAxis dataKey="name" stroke="#fff"/>
                <YAxis stroke="#fff"/>
                <Tooltip contentStyle={{background:'#111', border:'none'}} itemStyle={{color:'#fff'}}/>
                <Bar dataKey="value" fill="#FF6B6B"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/70 p-5 rounded-2xl shadow-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2"><FaChartBar/> User Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3"/>
                <XAxis dataKey="day" stroke="#fff"/>
                <YAxis stroke="#fff"/>
                <Tooltip contentStyle={{background:'#111', border:'none'}} itemStyle={{color:'#fff'}}/>
                <Line type="monotone" dataKey="users" stroke="#FFD93D" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Users */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800/70 shadow-sm">
            <FaSearch className="mr-2 text-gray-400"/>
            <input type="text" placeholder="Search Users..." value={searchUser} onChange={e=>setSearchUser(e.target.value)}
              className="outline-none bg-transparent text-white placeholder-gray-400"/>
          </div>
          <select value={selectedRole} onChange={e=>setSelectedRole(e.target.value)}
            className="border border-gray-700 rounded-lg px-3 py-2 bg-gray-800/70 text-white shadow-sm">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="delivery">Delivery</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Users List */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user._id} className="bg-gray-800/70 p-5 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-700 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-white">{user.name}</h4>
                <p className="text-gray-300 text-sm">{user.email}</p>
                <p className="text-gray-400 text-sm">{user.role}</p>
              </div>
              <div className="flex gap-3">
                <button className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg transition"><FaEdit/></button>
                <button onClick={()=>handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg transition"><FaTrash/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
