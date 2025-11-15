import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import userImg from "../img/g_house.png";
import adminImg from "../img/fb.gif";
import sellerImg from "../img/bird.gif";
import { AuthContext } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Navigation hook

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://192.168.29.252:5000/api/products/public?search=${searchQuery}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  let backgroundImage;
  if (isAdmin) backgroundImage = adminImg;
  else if (isSeller) backgroundImage = sellerImg;
  else backgroundImage = userImg;

  return (
    <div
      style={{
        ...styles.page,
        background: isAdmin
          ? `linear-gradient(to bottom right, rgba(10,10,10,0.36), rgba(30,30,30,0.9)), url(${backgroundImage}) center/cover no-repeat`
          : isSeller
          ? `linear-gradient(to bottom right, rgba(5,10,20,0.85), rgba(20,30,50,0.95)), url(${backgroundImage}) center/cover no-repeat`
          : `linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,240,220,0.6)), url(${backgroundImage}) center/cover no-repeat`,
      }}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 backdrop-blur-md -z-10"></div>

      {/* Profile Dropdown */}
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown user={user} logout={() => console.log("Logout")} />
      </div>

      {/* Hero Section */}
      <motion.div
        style={{ ...styles.hero, zIndex: 10 }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          style={
            isAdmin
              ? styles.adminHeading
              : isSeller
              ? styles.sellerHeading
              : styles.heading
          }
          animate={isSeller ? { y: [0, -5, 0] } : {}}
          transition={
            isSeller
              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          Welcome{" "}
          <span
            style={
              isAdmin
                ? styles.adminHighlight
                : isSeller
                ? styles.sellerHighlight
                : styles.highlight
            }
          >
            {user?.name || "Guest"}
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          style={
            isAdmin
              ? styles.adminSubtext
              : isSeller
              ? styles.sellerSubtext
              : styles.subtext
          }
        >
          {isAdmin ? (
            <span></span>
          ) : isSeller ? (
            <span>Seller Dashboard - Manage Your Products</span>
          ) : (
            "Find the best products for your home"
          )}
        </motion.p>

        {/* Search Input (Only for users) */}
        {!isAdmin && !isSeller && (
          <motion.form
            variants={itemVariants}
            style={styles.searchForm}
            onSubmit={handleSearch}
          >
            <div className="relative w-full  mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white text-gray-800 text-sm border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-orange-300 transition-all duration-300 focus:shadow-md shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition text-lg"
              >
                <FaSearch />
              </button>
            </div>
          </motion.form>
        )}

        {/* Search Results */}
        {!isAdmin && !isSeller && (
          <div className="mt-6 relative z-10">
            {loading && (
              <p className="text-orange-500 font-medium">Searching...</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && results.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {results.map((product) => (
                  <motion.div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-lg p-4 text-left hover:shadow-xl border border-orange-100 transition transform hover:-translate-y-1"
                    variants={itemVariants}
                  >
                    <div className="overflow-hidden rounded-xl mb-3">
                      <img
                        src={
                          product.images?.[0]?.url
                            ? `http://192.168.29.252:5000${product.images[0].url}`
                            : product.image
                        }
                        alt={product.name}
                        className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="font-bold text-orange-500 mt-2 text-lg">
                      ₹{product.price}
                    </p>

                    {/* ✅ Buy Now Button → Redirects to Product Page */}
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="mt-2 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-sm"
                    >
                      Buy Now
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && results.length === 0 && searchQuery && !error && (
              <p className="text-gray-500 mt-4">
                No products found for "{searchQuery}".
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    position: "relative",
  },
  hero: {
    textAlign: "center",
    maxWidth: "1000px",
    width: "100%",
    position: "relative",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#333",
  },
  adminHeading: {
    fontSize: "3rem",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#f9f9f9",
    textShadow: "0 0 10px rgba(255, 165, 0, 0.8)",
    letterSpacing: "1px",
  },
  sellerHeading: {
    fontSize: "3.2rem",
    marginBottom: "1rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #00bfff, #00e6ac)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "1px",
    textShadow: "0 0 20px rgba(0, 255, 200, 0.4)",
  },
  highlight: { color: "#ff7a00" },
  adminHighlight: {
    color: "#ffae00",
    textShadow: "0 0 20px rgba(255, 150, 0, 0.9)",
  },
  sellerHighlight: {
    color: "#00e6ff",
    textShadow: "0 0 20px rgba(0, 200, 255, 0.9)",
    fontWeight: "700",
  },
  subtext: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#555",
  },
  adminSubtext: {
    fontSize: "1.4rem",
    color: "#ffdd99",
    fontWeight: "600",
    marginBottom: "2rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  sellerSubtext: {
    fontSize: "1.25rem",
    color: "#a0e7ff",
    fontWeight: "500",
    marginBottom: "2rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    textShadow: "0 0 10px rgba(0, 180, 255, 0.5)",
  },
  searchForm: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
};

export default LandingPage;
// import React, { useContext, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import userImg from "../img/g_house.png";
// import adminImg from "../img/fb.gif";
// import sellerImg from "../img/bird.gif";
// import { AuthContext } from "../context/AuthContext";
// import ProfileDropdown from "./ProfileDropdown";

// const fade = {
//   hidden: { opacity: 0, y: 12 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
// };

// const LandingPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const isAdmin = user?.role === "admin";
//   const isSeller = user?.role === "seller";

//   const bg = isAdmin
//     ? "from-stone-100 via-stone-50 to-stone-100"
//     : isSeller
//     ? "from-teal-50 via-cyan-50 to-sky-50"
//     : "from-rose-50 via-peach-50 to-amber-50"; // peach alias; ensure tailwind safelist or replace with rose/amber

//   const onSearch = async (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `http://192.168.29.252:5000/api/products/public?search=${encodeURIComponent(searchQuery)}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setResults(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong while searching.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className=" bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50">
//       {/* top bar */}
//       <div className="fixed top-4 right-4 z-50">
//         <ProfileDropdown user={user} logout={() => console.log("Logout")} />
//       </div>

//       {/* container */}
//       <motion.div
//         className="mx-auto max-w-7xl px-6 lg:px-8 py-16"
//         initial="hidden"
//         animate="visible"
//         variants={fade}
//       >
//         {/* hero */}
//         <section className="grid lg:grid-cols-12 gap-10 items-center">
//           <div className="lg:col-span-7 space-y-6">
//             <span className="inline-block text-xs font-medium text-gray-500">
//               {isAdmin ? "Admin" : isSeller ? "Seller" : "Customer"} space
//             </span>
//             <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 tracking-tight">
//               Welcome{" "}
//               <span className="underline decoration-amber-300 decoration-4 underline-offset-8">
//                 {user?.name || "Guest"}
//               </span>
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl">
//               {isAdmin
//                 ? "Review usage, users, and performance gracefully."
//                 : isSeller
//                 ? "Manage listings and track sales with clarity."
//                 : "Discover thoughtful designs for a home you love."}
//             </p>

//             {!isAdmin && !isSeller && (
//               <form onSubmit={onSearch} className="mt-2">
//                 <div className="relative max-w-xl">
//                   <input
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search products, brands, styles"
//                     className="w-full rounded-xl border border-amber-200 bg-white px-5 py-3 pr-12 text-gray-900 shadow-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-200 outline-none"
//                   />
//                   <button
//                     type="submit"
//                     aria-label="Search"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-black transition"
//                   >
//                     <FaSearch />
//                   </button>
//                 </div>
//                 <div className="mt-2 flex gap-2 text-xs text-gray-500">
//                   <span className="px-2 py-1 rounded-full bg-white border border-gray-200">sofa</span>
//                   <span className="px-2 py-1 rounded-full bg-white border border-gray-200">lamp</span>
//                   <span className="px-2 py-1 rounded-full bg-white border border-gray-200">planter</span>
//                 </div>
//               </form>
//             )}
//           </div>

//           <div className="lg:col-span-5">
//             <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 p-6 sm:p-8">
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
//                   <p className="text-xs text-amber-800">Orders</p>
//                   <p className="text-2xl font-bold text-amber-900">128</p>
//                 </div>
//                 <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
//                   <p className="text-xs text-emerald-800">Delivered</p>
//                   <p className="text-2xl font-bold text-emerald-900">96</p>
//                 </div>
//                 <div className="rounded-xl bg-fuchsia-50 p-4 ring-1 ring-fuchsia-100">
//                   <p className="text-xs text-fuchsia-800">Wishlist</p>
//                   <p className="text-2xl font-bold text-fuchsia-900">42</p>
//                 </div>
//               </div>
//               <div className="mt-6">
//                 <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
//                   <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
//                 </div>
//                 <p className="mt-2 text-xs text-gray-500">Monthly goal: 66% reached</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* results */}
//         {!isAdmin && !isSeller && (
//           <section className="mt-12">
//             {loading && <p className="text-gray-700">Searching...</p>}
//             {error && (
//               <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
//                 {error}
//               </div>
//             )}

//             {!loading && results.length > 0 && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {results.map((product) => (
//                   <div
//                     key={product._id}
//                     className="group overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition"
//                   >
//                     <div className="relative h-44">
//                       <img
//                         src={
//                           product.images?.[0]?.url
//                             ? `http://192.168.29.252:5000${product.images[0].url}`
//                             : product.image
//                         }
//                         alt={product.name}
//                         className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
//                         {product.name}
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
//                       <div className="mt-3 flex items-center justify-between">
//                         <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
//                         <button
//                           onClick={() => navigate(`/product/${product._id}`)}
//                           className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-black transition"
//                         >
//                           Buy now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!loading && results.length === 0 && searchQuery && !error && (
//               <p className="text-gray-600 mt-4">No products found for “{searchQuery}”.</p>
//             )}
//           </section>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default LandingPage;
