import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import productdata from "../json/Products.json";
import Nev from "./Nev";
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";
import { Star, CheckCircle, XCircle } from "lucide-react";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const { productName } = useParams();
  const productId = parseInt(productName, 10);
  const productInfo = productdata.find((product) => product.id === productId);

  const [added, setAdded] = useState(false);

  if (!productInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
        <h2 className="text-3xl font-bold text-red-500 animate-pulse">
          ❌ Product not found.
        </h2>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Nev />

      {/* Full-Screen Container */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen px-6 py-8 text-gray-800">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Product Image */}
        {/* Product Image */}
<div className="flex   bg-white p-1 rounded-xl shadow-lg">
  <img
    src={productInfo.image}
    alt={productInfo.name}
    className="rounded-xl w-full max-h-[450px] object-contain shadow-md transition-transform duration-500 hover:scale-105 hover:rotate-1"
  />
</div>


          {/* Product Info */}
          <div className="flex flex-col justify-between bg-white p-8 rounded-xl shadow-lg">
            <div>
              {/* Name & Brand */}
              <h1 className="text-4xl font-bold mb-3 text-gray-800">
                {productInfo.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Brand:{" "}
                <span className="text-blue-500 font-semibold">
                  {productInfo.brand}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 transition-all ${
                      i < Math.floor(productInfo.rating)
                        ? "text-yellow-400 drop-shadow-md"
                        : "text-gray-300"
                    }`}
                    fill={i < Math.floor(productInfo.rating) ? "currentColor" : "none"}
                  />
                ))}
                <span className="ml-3 text-sm text-gray-500">
                  ({productInfo.reviews} reviews)
                </span>
              </div>

              {/* Price & Stock */}
              <p className="text-4xl font-extrabold text-gray-700 mb-3">
                ₹{productInfo.price.toFixed(2)}
              </p>
              <p
                className={`font-medium flex items-center gap-2 ${
                  productInfo.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {productInfo.stock > 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5" /> {productInfo.stock} in stock
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" /> Out of stock
                  </>
                )}
              </p>

              {/* Details */}
              <p className="text-gray-600 mt-6 leading-relaxed">
                {productInfo.details}
              </p>

              {/* Features */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Features:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {productInfo.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm shadow-sm hover:shadow-md hover:scale-105 transition"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50/70 p-4 rounded-xl shadow-inner">
                <p><span className="font-semibold text-gray-900">Category:</span> {productInfo.category}</p>
                <p><span className="font-semibold text-gray-900">Subcategory:</span> {productInfo.subcategory}</p>
                <p><span className="font-semibold text-gray-900">Type:</span> {productInfo.type}</p>
                <p><span className="font-semibold text-gray-900">Material:</span> {productInfo.material}</p>
                <p><span className="font-semibold text-gray-900">Color:</span> {productInfo.color}</p>
                <p><span className="font-semibold text-gray-900">Dimensions:</span> {productInfo.dimensions}</p>
                <p><span className="font-semibold text-gray-900">Weight:</span> {productInfo.weight}</p>
                <p><span className="font-semibold text-gray-900">Warranty:</span> {productInfo.warranty}</p>
                <p><span className="font-semibold text-gray-900">Origin:</span> {productInfo.origin}</p>
              </div>

              {/* Care Instructions */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Care Instructions:
                </h3>
                <p className="text-gray-600">{productInfo.care_instructions}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 relative">
              <button
                onClick={() => handleAddToCart(productInfo)}
                className={`flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition transform ${
                  added ? "scale-105" : ""
                }`}
                disabled={productInfo.stock === 0}
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart(productInfo);
                  window.location.href = "/cart";
                }}
                className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition disabled:opacity-50"
                disabled={productInfo.stock === 0}
              >
                Buy Now
              </button>

              {/* Toast Notification */}
              {added && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
                  ✅ Added to Cart!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
