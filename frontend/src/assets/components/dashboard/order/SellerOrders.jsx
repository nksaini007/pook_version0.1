// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import Nev from "../../Nev";
// import {
//   FaBoxOpen,
//   FaRupeeSign,
//   FaTruck,
//   FaUser,
//   FaClipboardList,
// } from "react-icons/fa";

// /**
//  * SellerOrders Component
//  * Displays all seller-specific orders with status management.
//  */
// const SellerOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   /** Fetch all seller orders */
//   const fetchSellerOrders = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("⚠️ Please log in as a seller!");
//         setLoading(false);
//         return;
//       }

//       const { data } = await axios.get(
//         "http://localhost:5000/api/orders/seller/orders",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setOrders(Array.isArray(data) ? data : data.orders || []);
//     } catch (err) {
//       console.error("Error fetching seller orders:", err);
//       toast.error("❌ Failed to load seller orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Update order item status */
//   const handleItemStatusUpdate = async (orderId, productId, newStatus) => {
//     try {
//       setUpdating(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("⚠️ Please log in!");
//         return;
//       }

//       await axios.put(
//         "http://localhost:5000/api/orders/seller/item-status",
//         { orderId, productId, status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success(`✅ Status updated to "${newStatus}"`);
//       fetchSellerOrders();
//     } catch (err) {
//       console.error("Error updating item status:", err);
//       toast.error("⚠️ Failed to update status.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   /** Loading Screen */
//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
//         <FaClipboardList className="text-5xl text-blue-500 mb-3 animate-spin-slow" />
//         <p className="text-gray-700 text-lg font-medium">Loading your orders...</p>
//       </div>
//     );

//   return (
//     <>
//     <Nev />
//       <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">

//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <header className="mb-10 text-center">
//             <motion.h1
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
//             >
//               Seller Orders Dashboard
//             </motion.h1>
//             <p className="text-gray-600 mt-2">
//               Manage your sales, track deliveries, and update statuses in real time.
//             </p>
//           </header>

//           {/* No Orders */}
//           {orders.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex flex-col items-center justify-center py-20 text-gray-500 backdrop-blur-md bg-white/40 rounded-2xl shadow-md"
//             >
//               <FaBoxOpen className="text-7xl text-gray-400 mb-4" />
//               <p className="text-lg font-medium">No orders found yet.</p>
//             </motion.div>
//           ) : (
//             <div className="grid gap-8 md:grid-cols-2">
//               {orders.map((order) => (
//                 <motion.div
//                   key={order._id}
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="rounded-3xl p-6 bg-white/70 backdrop-blur-xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all"
//                 >
//                   {/* Order Header */}
//                   <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
//                     <div>
//                       <h3 className="font-bold text-gray-800 text-lg">
//                         🧾 #{order._id.slice(-6).toUpperCase()}
//                       </h3>
//                       <p className="text-xs text-gray-500">
//                         {new Date(order.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-500">Buyer</p>
//                       <p className="font-medium text-gray-700 flex items-center justify-end gap-1">
//                         <FaUser className="text-gray-400" />
//                         {order.user?.name || "Unknown"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Order Items */}
//                   <div className="space-y-4">
//                     {order.orderItems.map((item) => (
//                       <motion.div
//                         key={item._id}
//                         whileHover={{ scale: 1.02 }}
//                         className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200 shadow-sm"
//                       >
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={item.image || "/placeholder.png"}
//                             alt={item.name}
//                             className="w-14 h-14 rounded-lg border object-cover shadow-sm"
//                           />
//                           <div>
//                             <p className="font-semibold text-gray-800 text-sm">
//                               {item.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               Qty: {item.qty} × ₹{item.price}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Status Dropdown */}
//                         <div className="text-right">
//                           <select
//                             className="border border-gray-300 px-3 py-1 rounded-lg text-sm bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
//                             value={item.itemStatus || "Pending"}
//                             onChange={(e) =>
//                               handleItemStatusUpdate(
//                                 order._id,
//                                 item.product,
//                                 e.target.value
//                               )
//                             }
//                             disabled={updating}
//                           >
//                             <option value="Pending">🕓 Pending</option>
//                             <option value="Processing">⚙️ Processing</option>
//                             <option value="Shipped">🚚 Shipped</option>
//                             <option value="Delivered">✅ Delivered</option>
//                             <option value="Cancelled">❌ Cancelled</option>
//                           </select>

//                           <span
//                             className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${item.itemStatus === "Delivered"
//                               ? "bg-green-100 text-green-700"
//                               : item.itemStatus === "Shipped"
//                                 ? "bg-blue-100 text-blue-700"
//                                 : item.itemStatus === "Cancelled"
//                                   ? "bg-red-100 text-red-700"
//                                   : "bg-yellow-100 text-yellow-700"
//                               }`}
//                           >
//                             {item.itemStatus}
//                           </span>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* Order Footer */}
//                   <footer className="flex justify-between items-center mt-5 pt-3 border-t border-gray-200 text-sm text-gray-600">
//                     <div className="flex items-center gap-2">
//                       <FaTruck className="text-gray-400" />
//                       <span>
//                         {order.shippingAddress?.city},{" "}
//                         {order.shippingAddress?.country}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
//                       <FaRupeeSign /> {order.totalPrice?.toFixed(2)}
//                     </div>
//                   </footer>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SellerOrders;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Nev from "../../Nev";
import {
  FaBoxOpen,
  FaRupeeSign,
  FaTruck,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  /** Fetch only orders related to this seller */
  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Please log in as a seller!");
        setLoading(false);
        return;
      }

      // ✅ Fetch orders only for this seller (API should filter backend-side)
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/seller/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Some APIs send all orders — filter locally as safety fallback
      const decodedToken = parseJwt(token);
      const sellerId = decodedToken?.id || decodedToken?._id;
      setSellerId(sellerId);

      const filteredOrders = (data.orders || data).filter((order) =>
        order.orderItems.some(
          (item) => item.seller === sellerId || item.seller?._id === sellerId
        )
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      toast.error("❌ Failed to load seller orders.");
    } finally {
      setLoading(false);
    }
  };

  /** Update order item status */
  const handleItemStatusUpdate = async (orderId, productId, newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ Please log in!");
        return;
      }

      await axios.put(
        "http://localhost:5000/api/orders/seller/item-status",
        { orderId, productId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`✅ Status updated to "${newStatus}"`);
      fetchSellerOrders();
    } catch (err) {
      console.error("Error updating item status:", err);
      toast.error("⚠️ Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  /** Decode JWT to extract sellerId */
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  /** Loading Screen */
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <FaClipboardList className="text-5xl text-blue-500 mb-3 animate-spin-slow" />
        <p className="text-gray-700 text-lg font-medium">Loading your orders...</p>
      </div>
    );

  return (
    <>
      <Nev />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
            >
              Seller Orders Dashboard
            </motion.h1>
            <p className="text-gray-600 mt-2">
              Manage your sales, track deliveries, and update statuses in real time.
            </p>
          </header>

          {/* No Orders */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-gray-500 backdrop-blur-md bg-white/40 rounded-2xl shadow-md"
            >
              <FaBoxOpen className="text-7xl text-gray-400 mb-4" />
              <p className="text-lg font-medium">No orders found for you yet.</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl p-6 bg-white/70 backdrop-blur-xl shadow-xl border border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        🧾 #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Buyer</p>
                      <p className="font-medium text-gray-700 flex items-center justify-end gap-1">
                        <FaUser className="text-gray-400" />
                        {order.user?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Order Items (only seller's items) */}
                  <div className="space-y-4">
                    {order.orderItems
                      .filter(
                        (item) =>
                          item.seller === sellerId ||
                          item.seller?._id === sellerId
                      )
                      .map((item) => (
                        <motion.div
                          key={item._id}
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg border object-cover shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.qty} × ₹{item.price}
                              </p>
                            </div>
                          </div>

                          {/* Status Dropdown */}
                          <div className="text-right">
                            <select
                              className="border border-gray-300 px-3 py-1 rounded-lg text-sm bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
                              value={item.itemStatus || "Pending"}
                              onChange={(e) =>
                                handleItemStatusUpdate(
                                  order._id,
                                  item.product,
                                  e.target.value
                                )
                              }
                              disabled={updating}
                            >
                              <option value="Pending">🕓 Pending</option>
                              <option value="Processing">⚙️ Processing</option>
                              <option value="Shipped">🚚 Shipped</option>
                              <option value="Delivered">✅ Delivered</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>

                            <span
                              className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                                item.itemStatus === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : item.itemStatus === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : item.itemStatus === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.itemStatus}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Order Footer */}
                  <footer className="flex justify-between items-center mt-5 pt-3 border-t border-gray-200 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaTruck className="text-gray-400" />
                      <span>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                      <FaRupeeSign /> {order.totalPrice?.toFixed(2)}
                    </div>
                  </footer>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerOrders;
