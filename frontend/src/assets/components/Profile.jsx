import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import img from "../img/profile.gif";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { name, email, phone, address, joined, role } = user || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 text-gray-800 flex flex-col items-center justify-center p-4 md:p-8"
    >
      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-200 overflow-hidden"
      >
        {/* Header Banner */}
        <div className="relative h-40 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400">
          <div className="absolute -bottom-16 left-8">
            <img
              src={user?.profile || img}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* User Details */}
        <div className="mt-20 px-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {name || "Guest User"}
              </h1>
              <p className="text-sm text-amber-600 capitalize mt-1">
                {role || "user"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md text-white"
            >
              <FaEdit /> Edit Profile
            </motion.button>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
            >
              <FaEnvelope className="text-amber-600 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{email || "Not Provided"}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
            >
              <FaPhone className="text-amber-600 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{phone || "Not Provided"}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
            >
              <FaMapMarkerAlt className="text-amber-600 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm">{address || "Not Provided"}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm"
            >
              <FaCalendarAlt className="text-amber-600 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm">{joined || "N/A"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subtle Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
};

export default Profile;
