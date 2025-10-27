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

    // Check all shipping fields filled
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
        name: item.sellerName || "Seller", // make sure sellerName exists
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
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-left text-black">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="flex flex-col items-center justify-center text-gray-600 text-xl font-medium mt-10">
            <img
              src={img}
              alt="Empty cart illustration"
              className="w-64 object-contain opacity-30 drop-shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <span className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </span>
            <span className="text-gray-500 text-lg">
              Looks like you haven’t added anything yet.
            </span>
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between transition hover:shadow-lg hover:scale-[1.02]"
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover shadow-sm mb-3 sm:mb-0"
                  />

                  <div className="flex-1 text-center justify-center flex flex-col sm:ml-4">
                    <h3 className="text-lg font-semibold text-black">{item.name}</h3>

                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border rounded-md">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-orange-500 font-bold text-lg mt-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-3 sm:mt-0 sm:ml-4 p-3 bg-gray-200 hover:bg-orange-600 text-white rounded-lg transition shadow flex items-center justify-center"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Shipping & Payment */}
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md border border-gray-200 mb-6">
              <h3 className="text-2xl font-bold mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none"
                    required
                  />
                ))}
              </div>

              <div className="mt-4">
                <label className="mr-4 font-semibold">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="p-2 border border-gray-300 rounded-xl"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>
            </div>

            {/* Total & Checkout */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-6 rounded-2xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4 sm:mb-0">
                Total: ₹{total.toFixed(2)}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-gray-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition shadow"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-semibold transition shadow"
                >
                  {loading ? "Processing..." : "Pay & Place Order"}
                </button>
              </div>
            </div>

            {message && (
              <p className="mt-4 text-center text-lg font-semibold">{message}</p>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
