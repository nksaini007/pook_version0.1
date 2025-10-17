import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShoppingCart, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import img from "../img/profile.gif";

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

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      {/* Profile Image */}
      <img
        src={user?.profile || img}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-green-500 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Guest User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <FaTachometerAlt className="text-green-500" />
              Dashboard
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <FaShoppingCart className="text-green-500" />
              Cart
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <FaUser className="text-green-500" />
              Profile
            </Link>

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
