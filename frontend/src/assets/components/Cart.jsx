import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Nev from "./Nev";
import Footer from "./Footer";
import { Trash2 } from "lucide-react";
import  img  from '../img/dance2.gif';

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

  return (
    <div className="bg-white min-h-screen text-black">
      <Nev />

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-left text-blak">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
        <p className="flex flex-col items-center justify-center text-gray-600 text-xl font-medium mt-10">
  <img
    src={img}
    alt="Empty cart illustration"
    className="w-64  object-contain opacity-30 drop-shadow-lg transition-transform duration-300 hover:scale-105"
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
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between transition hover:shadow-lg hover:scale-[1.02]"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover shadow-sm mb-3 sm:mb-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 text-center justify-center flex flex-col sm:ml-4">
                    <h3 className="text-lg font-semibold text-black">
                      {item.name}
                    </h3>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border rounded-md">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-black transition"
                      >
                        +
                      </button>
                    </div>


                    <p className="text-orange-500 font-bold text-lg mt-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Trash Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-3 sm:mt-0 sm:ml-4 p-3 bg-gray-200 hover:bg-orange-600 text-white rounded-lg transition shadow flex items-center justify-center"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-6 rounded-2xl shadow-md border border-gray-200">
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
                  onClick={() => alert("Proceed to Checkout")}
                  className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-semibold transition shadow"
                >
                  Pay
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
