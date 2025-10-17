import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import image from '../img/dance2.gif'
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [customerDetails, setCustomerDetails] = useState({
    phone: "",
    address: "",
    pincode: "",
  });

  const [sellerDetails, setSellerDetails] = useState({
    phone: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    businessAddress: "",
    businessCategory: "",
    bankAccount: "",
    ifscCode: "",
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    phone: "",
    vehicleType: "",
    licenseNumber: "",
    deliveryAreaPincode: "",
  });

  const [adminDetails, setAdminDetails] = useState({
    phone: "",
    adminAccessCode: "",
  });

  const navigate = useNavigate();

  const inputClasses =
    "w-full px-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition duration-200";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    let roleDetails = {};
    switch (form.role) {
      case "customer":
        roleDetails = customerDetails;
        break;
      case "seller":
        roleDetails = sellerDetails;
        break;
      case "delivery":
        roleDetails = deliveryDetails;
        break;
      case "admin":
        roleDetails = adminDetails;
        break;
      default:
        break;
    }

    const finalData = { ...baseData, ...roleDetails };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
        finalData
      );
      alert(res.data.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-400 via-orange-100 to-white flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-2xl m-5 overflow-hidden">
        {/* Left Section (Visuals / Branding) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-orange-500 to-orange-700 text-white p-10">
          <h1 className="text-4xl font-extrabold mb-4 text-center">
            Welcome to <span className="text-yellow-200">whitehuk</span>
          </h1>
          <p className="text-lg opacity-90 text-center leading-relaxed">
            Create your account to join our platform as a <br />
            <span className="font-semibold">Customer, Seller, Delivery Partner,</span> or <span className="font-semibold">Admin</span>.
          </p>
          <img
            src={image}
            alt="signup"
            className="mt-10 w-72 h-72 rounded-xl object-cover "
          />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-screen">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign up as Customer, Seller, Delivery Partner or Admin
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={inputClasses}
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={inputClasses}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className={inputClasses}
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Role Selector */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery Partner</option>
              <option value="admin">Admin</option>
            </select>

            {/* Conditional Inputs */}
            {form.role === "customer" && (
              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={inputClasses}
                  value={customerDetails.phone}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      phone: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className={inputClasses}
                  value={customerDetails.address}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      address: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className={inputClasses}
                  value={customerDetails.pincode}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      pincode: e.target.value,
                    })
                  }
                  required
                />
              </div>
            )}

            {form.role === "seller" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(sellerDetails).map(([key, value]) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={
                      key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (c) => c.toUpperCase())
                    }
                    className={inputClasses}
                    value={value}
                    onChange={(e) =>
                      setSellerDetails({
                        ...sellerDetails,
                        [key]: e.target.value,
                      })
                    }
                    required
                  />
                ))}
              </div>
            )}

            {form.role === "delivery" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(deliveryDetails).map(([key, value]) => (
                  <input
                    key={key}
                    type="text"
                    placeholder={
                      key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (c) => c.toUpperCase())
                    }
                    className={inputClasses}
                    value={value}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        [key]: e.target.value,
                      })
                    }
                    required
                  />
                ))}
              </div>
            )}

            {form.role === "admin" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={inputClasses}
                  value={adminDetails.phone}
                  onChange={(e) =>
                    setAdminDetails({
                      ...adminDetails,
                      phone: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Admin Access Code"
                  className={inputClasses}
                  value={adminDetails.adminAccessCode}
                  onChange={(e) =>
                    setAdminDetails({
                      ...adminDetails,
                      adminAccessCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02]"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
