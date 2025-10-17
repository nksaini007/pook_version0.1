import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import userImg from '../img/city.jpg';
import adminImg from '../img/220821.gif';
import { FaSearch, FaCrown } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 0.5,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
//http://192.168.29.252:5000

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://192.168.29.252:5000/api/products/public?search=${searchQuery}`);
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

  const isAdmin = user?.role === 'admin';
  const backgroundImage = isAdmin ? adminImg : userImg;

  return (
    <div
      style={{
        ...styles.page,
        background: isAdmin
          ? `linear-gradient(to bottom right, rgba(10, 10, 10, 0.36), rgba(30,30,30,0.9)), url(${backgroundImage}) center/cover no-repeat`
          : `linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,240,220,0.6)), url(${backgroundImage}) center/cover no-repeat`
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md -z-10"></div>

      <motion.div
        style={styles.hero}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          style={isAdmin ? styles.adminHeading : styles.heading}
        >
          Welcome{" "}
          <span style={isAdmin ? styles.adminHighlight : styles.highlight}>
            {user?.name || "Guest"}
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          style={isAdmin ? styles.adminSubtext : styles.subtext}
        >
          {isAdmin ? (
            <span className="flex items-center justify-center gap-2">
              {/* <FaCrown className="text-yellow-400 text-2xl" /> */}
              Admin Dashboard Control Center
            </span>
          ) : (
            "Find the best products for your home"
          )}
        </motion.p>

        {/* Non-admin search form */}
        {!isAdmin && (
          <motion.form
            variants={itemVariants}
            style={styles.searchForm}
            onSubmit={handleSearch}
          >
            <div className="relative w-full max-w-md mx-auto">
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

        {/* Admin Buttons */}
        

        {/* Non-admin search results */}
        {!isAdmin && (
          <div className="mt-6">
            {loading && <p className="text-orange-500 font-medium">Searching...</p>}
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <p className="font-bold text-orange-500 mt-2 text-lg">₹{product.price}</p>
                    <button className="mt-2 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-sm">
                      Buy Now
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && results.length === 0 && searchQuery && !error && (
              <p className="text-gray-500 mt-4">No products found for "{searchQuery}".</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    position: 'relative'
  },
  hero: {
    textAlign: 'center',
    maxWidth: '1000px',
    width: '100%',
    position: 'relative',
    zIndex: 10
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#333'
  },
  adminHeading: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#f9f9f9',
    textShadow: '0 0 10px rgba(255, 165, 0, 0.8)',
    letterSpacing: '1px'
  },
  highlight: {
    color: '#ff7a00'
  },
  adminHighlight: {
    color: '#ffae00',
    textShadow: '0 0 20px rgba(255, 150, 0, 0.9)'
  },
  subtext: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#555'
  },
  adminSubtext: {
    fontSize: '1.4rem',
    color: '#ffdd99',
    fontWeight: '600',
    marginBottom: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }
};

export default LandingPage;
