import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Nev from "./Nev";
import Footer from "./Footer";
import { Trash2 } from "lucide-react";
import img from "../img/dance2.gif";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getImageUrl = (image) => {
    if (!image) return img;
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/${image}`;
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove "${name}" from your cart?`)) {
      removeFromCart(id);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Nev />

      <div className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800">
          🛍️ Shopping Cart
        </h2>

        {/* ✅ Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center">
            <img
              src={img}
              alt="Empty cart"
              className="w-60 opacity-70 mb-6 hover:scale-105 transition-transform"
            />
            <p className="text-2xl font-semibold text-gray-700 mb-1">
              Your cart is empty
            </p>
            <p className="text-gray-500">Add some products to get started.</p>
          </div>
        ) : (
          <>
            {/* ✅ Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cartItems.map((item, i) => (
                <div
                  key={item._id || item.id || i}
                  className="relative bg-white shadow-md hover:shadow-lg transition rounded-xl border border-gray-100 overflow-hidden"
                >
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(item._id || item.id, item.name)}
                    className="absolute top-3 right-3 bg-red-100 hover:bg-red-500 p-2 rounded-full transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-white transition" />
                  </button>

                  {/* Product Image */}
                  <img
                    src={getImageUrl(
                      Array.isArray(item.images) ? item.images[0] : item.image
                    )}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      ID: {item._id?.slice(-6) || "custom"}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-500">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex justify-between items-center mt-4 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => decreaseQuantity(item._id || item.id)}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold transition"
                      >
                        −
                      </button>
                      <span className="text-gray-800 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id || item.id)}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Summary Section */}
            <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-5">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Total:{" "}
                <span className="text-orange-500">₹{total.toFixed(2)}</span>
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={clearCart}
                  className="px-5 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => alert('Proceed to Checkout')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
