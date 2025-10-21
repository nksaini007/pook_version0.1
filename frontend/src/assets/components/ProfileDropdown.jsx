import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShoppingCart, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import img from "../img/cat.gif";

const ProfileDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt className="text-green-500" />, to: "/dashboard" },
    { label: "Cart", icon: <FaShoppingCart className="text-green-500" />, to: "/cart" },
    { label: "Profile", icon: <FaUser className="text-green-500" />, to: "/profile" },
  ];

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      {/* Profile Image */}
      <img
        src={user?.profile || img}
        alt="Profile"
        className="w-12 h-12 rounded-full border-2 border-green-500 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop for Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-52 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden hidden md:block"
            >
              {/* Desktop Dropdown */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.name || "Guest User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "No email"}</p>
              </div>

              <div className="flex flex-col">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 hover:text-red-700 transition-all rounded-lg"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Mobile Full-Screen Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-t-3xl shadow-2xl p-6 z-50 flex flex-col gap-4 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{user?.name || "Guest User"}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email || "No email"}</p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-xl transition-all font-medium text-base"
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all font-medium text-base"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
