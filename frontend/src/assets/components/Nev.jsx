import React, { useContext, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import img2 from "../img/logox.png";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Nev = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  const links = ["Home", "Appliances", "RawMaterials", "Services", "Contact"];

  const isAdmin = user?.role === "admin";
  const navBgClass = isAdmin
    ? "bg-blue-950 text-white"
    : "bg-white/95 backdrop-blur-md text-gray-800";

  return (
    <>
      {/* 🌟 Top Navigation (Desktop) */}
      <nav
        className={`${navBgClass} shadow-md top-0 z-50 w-full border-b border-gray-200 fixed transition-colors duration-300 hidden md:block`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
              <img src={img2} alt="" height={40} width={40} />
              <span className={isAdmin ? "text-white" : "text-gray-800"}>
              mkigns 
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link, i) => (
                <NavLink
                  key={i}
                  to={`/${link.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full ${
                      isActive
                        ? isAdmin
                          ? "text-white after:w-full after:bg-white"
                          : "text-orange-500 after:w-full after:bg-orange-500"
                        : isAdmin
                        ? "text-blue-100 hover:text-white after:bg-white"
                        : "text-gray-400 hover:text-gray-600 after:bg-gray-500"
                    }`
                  }
                >
                  {link}
                </NavLink>
              ))}

              <Link
                to="/cart"
                className={`px-4 py-1.5 rounded-full font-medium flex items-center gap-2 ${
                  isAdmin
                    ? "bg-white text-blue-700 hover:bg-blue-100"
                    : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                <FaShoppingCart /> Cart
              </Link>

              {!user ? (
                <Link
                  to="/login"
                  className={`px-4 py-1.5 rounded-full font-medium ${
                    isAdmin
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "bg-gray-200 text-gray-800 hover:bg-green-100"
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
      </nav>

      {/* 🌟 Bottom Mobile Navigation (like app style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-300 shadow-md md:hidden flex justify-around items-center py-2 z-50">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-orange-500" : "text-gray-600"
            }`
          }
        >
          <i className="fa-solid fa-house text-lg"></i>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/appliances"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-orange-500" : "text-gray-600"
            }`
          }
        >
          <i className="fa-solid fa-blender text-lg"></i>
          <span>Appliances</span>
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-orange-500" : "text-gray-600"
            }`
          }
        >
          <i className="fa-solid fa-handshake text-lg"></i>
          <span>Services</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-orange-500" : "text-gray-600"
            }`
          }
        >
          <i className="fa-solid fa-cart-shopping text-lg"></i>
          <span>Cart</span>
        </NavLink>

        <NavLink
          to={user ? "/profile" : "/login"}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-orange-500" : "text-gray-600"
            }`
          }
        >
          <i className="fa-solid fa-user text-lg"></i>
          <span>{user ? "Profile" : "Login"}</span>
        </NavLink>
      </div>
    </>
  );
};

export default Nev;
