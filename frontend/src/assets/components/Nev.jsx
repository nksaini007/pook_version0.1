import React, { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import img2 from "../img/homewobg1.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Nev = () => {
  const { user, logout } = useContext(AuthContext);
  const links = ["Home", "Appliances", "RawMaterials", "Services", "Contact"];

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* 🌑 NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-colors duration-500 ${
          isAdmin
            ? "bg-[#0d0d0d] text-white border-b border-gray-800 shadow-[0_4px_20px_rgba(255,106,0,0.1)]"
            : "bg-white/90 backdrop-blur-md text-gray-800 border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center py-3">
            {/* LOGO */}
            <div className="flex items-center gap-3 text-2xl font-bold tracking-wider">
              <img
                src={img2}
                alt="Logo"
                height={40}
                width={40}
                className="rounded-full shadow-md"
              />
              <span className={`${isAdmin ? "text-orange-400" : "text-gray-800"}`}>
                mkigns
              </span>
            </div>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center gap-6">
              <div
                className={`flex items-center rounded-xl px-2 py-1 transition-all duration-300 ${
                  isAdmin
                    ? "bg-[#1a1a1a] border border-gray-700 shadow-inner"
                    : "bg-gray-100"
                }`}
              >
                {links.map((link, i) => {
                  const path = `/${link.toLowerCase()}`;
                  return (
                    <NavLink
                      key={i}
                      to={path}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? isAdmin
                              ? "bg-orange-500 text-white shadow-md"
                              : "bg-orange-500 text-white"
                            : isAdmin
                            ? "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                            : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                        }`
                      }
                    >
                      {link}
                    </NavLink>
                  );
                })}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-4">
                <Link
                  to="/cart"
                  aria-label="Shopping Cart"
                  className={`p-3 rounded-full text-lg flex items-center justify-center transition-all ${
                    isAdmin
                      ? "bg-gray-800 text-orange-400 hover:bg-orange-500 hover:text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }`}
                >
                  <FaShoppingCart />
                </Link>

                {!user ? (
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all shadow-md ${
                      isAdmin
                        ? "bg-orange-500 text-white hover:bg-orange-400"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    Login
                  </Link>
                ) : (
                  <ProfileDropdown user={user} logout={logout} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE NAVBAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 border-t ${
          isAdmin
            ? "bg-[#111] border-gray-800 text-white"
            : "bg-white/90 border-gray-200 text-gray-700"
        } shadow-lg md:hidden z-50`}
      >
        {[
          { to: "/home", icon: "fa-house", label: "Home" },
          { to: "/appliances", icon: "fa-blender", label: "Appliances" },
          { to: "/services", icon: "fa-handshake", label: "Services" },
          { to: "/cart", icon: "fa-cart-shopping", label: "Cart" },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs p-1 transition ${
                isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-300"
              }`
            }
          >
            <i className={`fa-solid ${icon} text-lg`}></i>
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}

        {/* MOBILE PROFILE ICON */}
        {user ? (
          <ProfileDropdown user={user} logout={logout} mobile={true} />
        ) : (
          <NavLink
            to="/login"
            className="flex flex-col items-center text-xs p-1 text-gray-400 hover:text-orange-300"
          >
            <i className="fa-solid fa-user text-lg"></i>
            <span className="text-xs">Login</span>
          </NavLink>
        )}
      </div>
    </>
  );
};

export default Nev;
