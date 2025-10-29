import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Nev from "./Nev";
import Footer from "./Footer";
import { Trash2 } from "lucide-react";
import img from "../img/dance2.gif";
import axios from "axios";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty!");
      return;
    }

    for (let key in shippingAddress) {
      if (!shippingAddress[key]) {
        setMessage(`❌ Please fill your ${key}`);
        return;
      }
    }

    setLoading(true);
    setMessage("");

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.images?.[0],
      price: item.price,
      product: item._id,
      seller: {
        _id: item.seller,
        name: item.sellerName || "Seller",
      },
    }));

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: total,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: total,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      setMessage("✅ Order created successfully!");
      clearCart();
    } catch (err) {
      setLoading(false);
      setMessage(
        `❌ Order failed: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <Nev />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-left text-black">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 text-xl font-medium mt-10">
            <img
              src={img}
              alt="Empty cart"
              className="w-64 object-contain opacity-40 drop-shadow-lg mb-4"
            />
            <p className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-500 text-lg">
              Looks like you haven’t added anything yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 🧡 LEFT SIDE — CART ITEMS */}
            <div className="lg:w-2/3 bg-gray-50 border border-gray-200 rounded-xl shadow-md p-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-col flex-grow p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-orange-500 font-bold text-lg mt-2">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center justify-center gap-3 mt-3">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 border rounded-md">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-center mt-3 font-medium text-gray-600">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 💳 RIGHT SIDE — SHIPPING & PAYMENT */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              {/* Shipping */}
              <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: "Full Name", name: "fullName" },
                    { label: "Address", name: "address" },
                    { label: "City", name: "city" },
                    { label: "Postal Code", name: "postalCode" },
                    { label: "Country", name: "country" },
                    { label: "Phone", name: "phone" },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type="text"
                      name={field.name}
                      placeholder={field.label}
                      value={shippingAddress[field.name]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                      required
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mr-4 font-semibold">Payment Method:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Total: ₹{total.toFixed(2)}
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition shadow"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
                {message && (
                  <p className="mt-4 text-center text-lg font-semibold text-gray-700">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
