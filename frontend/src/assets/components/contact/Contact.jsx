import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaStar,
  FaUserTie,
  FaClock,
} from "react-icons/fa";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1c1c1c] overflow-hidden text-white font-sans">
      {/* Glowing Background Circles */}
      <motion.div
        className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#d4af37] rounded-full blur-3xl opacity-20"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-[#b88a44] rounded-full blur-3xl opacity-15"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#d4af37]/10"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaStar size={30} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center py-20 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mb-14"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
            alt="Luxury Logo"
            className="w-24 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4e2ba] mb-4">
            Let’s Build Luxury Experiences with Stinchar
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you’re here to collaborate, consult, or connect — our team is
            ready to craft something timeless with you. Every conversation starts
            with a spark.
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 grid md:grid-cols-2 gap-12 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
        >
          {/* Left Side */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#f4e2ba] mb-3">
                Connect with Our Experts
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Whether it’s a premium partnership or a digital innovation,
                we’ll respond with elegance and efficiency — usually within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <p className="flex items-center gap-3 text-gray-300 text-lg">
                <FaPhoneAlt className="text-[#d4af37]" /> +91 6377011413
              </p>
              <p className="flex items-center gap-3 text-gray-300 text-lg">
                <FaEnvelope className="text-[#d4af37]" /> officialwhitehk@gmail.com
              </p>
              <p className="flex items-center gap-3 text-gray-300 text-lg">
                <FaMapMarkerAlt className="text-[#d4af37]" /> Alwar, Rajasthan, India
              </p>
            </div>

            {/* Socials */}
            <div className="pt-4">
              <h3 className="text-gray-400 font-medium mb-2">Follow Our Journey</h3>
              <div className="flex gap-5">
                <a href="#" className="hover:text-[#d4af37] transition">
                  <FaFacebookF size={22} />
                </a>
                <a href="#" className="hover:text-[#d4af37] transition">
                  <FaInstagram size={22} />
                </a>
                <a href="#" className="hover:text-[#d4af37] transition">
                  <FaTwitter size={22} />
                </a>
                <a href="#" className="hover:text-[#d4af37] transition">
                  <FaLinkedinIn size={22} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-3 bg-transparent border border-[#d4af37]/30 rounded-xl focus:ring-2 focus:ring-[#d4af37] text-white placeholder-gray-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-transparent border border-[#d4af37]/30 rounded-xl focus:ring-2 focus:ring-[#d4af37] text-white placeholder-gray-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full p-3 bg-transparent border border-[#d4af37]/30 rounded-xl focus:ring-2 focus:ring-[#d4af37] text-white placeholder-gray-400 outline-none"
                required
              ></textarea>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[#d4af37] font-semibold text-lg"
              >
                ✅ Thank you for reaching out! We’ll get back to you soon.
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b88a44] text-black py-3 rounded-xl font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition"
              >
                Send Message
              </motion.button>
            )}

            {/* Schedule a Call Button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="block text-center border border-[#d4af37]/50 py-3 rounded-xl font-semibold text-[#d4af37] hover:bg-[#d4af37]/10 transition"
            >
              📅 Schedule a Call
            </motion.a>
          </form>
        </motion.div>

        {/* Animated Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-center max-w-5xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-[#d4af37]/10 backdrop-blur-md shadow-lg"
          >
            <FaUserTie className="mx-auto mb-3 text-[#d4af37]" size={30} />
            <h3 className="text-3xl font-bold text-[#d4af37]">10+</h3>
            <p className="text-gray-400">Years of Expertise</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-[#d4af37]/10 backdrop-blur-md shadow-lg"
          >
            <FaStar className="mx-auto mb-3 text-[#d4af37]" size={30} />
            <h3 className="text-3xl font-bold text-[#d4af37]">1000+</h3>
            <p className="text-gray-400">Happy Clients</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-[#d4af37]/10 backdrop-blur-md shadow-lg"
          >
            <FaClock className="mx-auto mb-3 text-[#d4af37]" size={30} />
            <h3 className="text-3xl font-bold text-[#d4af37]">&lt; 24 hrs</h3>
            <p className="text-gray-400">Average Response Time</p>
          </motion.div>
        </div>

        {/* Map Section */}
        <div className="w-full max-w-5xl mt-16 rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.7858499794453!2d77.31393827534753!3d26.878733060914384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973ff8a7d9e9d8d%3A0x6b3a3a983ed8b6f9!2sAlwar%2C%20Rajasthan%2C%20India!5e0!3m2!1sen!2sin!4v1698668262764!5m2!1sen!2sin"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Footer */}
        <p className="mt-10 text-gray-500 text-sm text-center">
          © {new Date().getFullYear()} Start 2 Pvt. Ltd. — Crafted with
          Excellence by <span className="text-[#d4af37] font-medium">NK Saini</span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
