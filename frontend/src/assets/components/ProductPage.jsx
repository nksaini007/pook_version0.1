// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import Nev from "./Nev";
// import Footer from "./Footer";
// import { CartContext } from "../context/CartContext";
// import { Star, CheckCircle, XCircle } from "lucide-react";

// const ProductPage = () => {
//   const { addToCart } = useContext(CartContext);
//   const { productId } = useParams();
//   const [productInfo, setProductInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [added, setAdded] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("You must be logged in to view products.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();

//         if (data.images && data.images.length > 0) {
//           setSelectedImage(
//             data.images[0].url.startsWith("http")
//               ? data.images[0].url
//               : `http://localhost:5000${data.images[0].url}`
//           );
//         }

//         setProductInfo({
//           ...data,
//           images: data.images.map(img =>
//             img.url.startsWith("http") ? img.url : `http://localhost:5000${img.url}`
//           ),
//         });
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch product. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   const handleAddToCart = () => {
//     addToCart(productInfo);
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-500">
//         Loading product details...
//       </div>
//     );
//   }

//   if (error || !productInfo) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
//         <h2 className="text-3xl font-bold text-red-500 animate-pulse">
//           ❌ {error || "Product not found."}
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Nev />
//       <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen px-6 py-8 text-gray-800 mt-15">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
//           {/* Product Images */}
//           <div>
//             <div className="bg-white p-2 rounded-xl shadow-lg">
//               <img
//                 src={selectedImage}
//                 alt={productInfo.name}
//                 className="rounded-xl w-full max-h-[450px] object-contain shadow-md transition-transform duration-500 hover:scale-105 hover:rotate-1"
//               />
//             </div>
//             {productInfo.images.length > 1 && (
//               <div className="flex mt-4 gap-3 overflow-x-auto">
//                 {productInfo.images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`Thumbnail ${idx}`}
//                     className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 shadow-sm hover:shadow-md transition-all duration-300 ${
//                       selectedImage === img ? "border-orange-500" : "border-gray-200"
//                     }`}
//                     onClick={() => setSelectedImage(img)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="flex flex-col justify-between bg-white p-8 rounded-xl shadow-lg">
//             <div>
//               <h1 className="text-4xl font-bold mb-3 text-gray-800">{productInfo.name}</h1>
//               <p className="text-lg text-gray-600 mb-4">
//                 Brand: <span className="text-blue-500 font-semibold">{productInfo.brand}</span>
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-1 mb-6">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-6 w-6 transition-all ${
//                       i < Math.floor(productInfo.rating)
//                         ? "text-yellow-400 drop-shadow-md"
//                         : "text-gray-300"
//                     }`}
//                     fill={i < Math.floor(productInfo.rating) ? "currentColor" : "none"}
//                   />
//                 ))}
//                 <span className="ml-3 text-sm text-gray-500">
//                   ({productInfo.numOfReviews} reviews)
//                 </span>
//               </div>

//               {/* Price & Stock */}
//               <p className="text-4xl font-extrabold text-gray-700 mb-3">
//                 ₹{productInfo.price.toFixed(2)}
//               </p>
//               <p
//                 className={`font-medium flex items-center gap-2 ${
//                   productInfo.stock > 0 ? "text-green-600" : "text-red-500"
//                 }`}
//               >
//                 {productInfo.stock > 0 ? (
//                   <>
//                     <CheckCircle className="h-5 w-5" /> {productInfo.stock} in stock
//                   </>
//                 ) : (
//                   <>
//                     <XCircle className="h-5 w-5" /> Out of stock
//                   </>
//                 )}
//               </p>

//               {/* Description */}
//               <p className="text-gray-600 mt-6 leading-relaxed">{productInfo.description}</p>

//               {/* Features */}
//               {productInfo.features && productInfo.features.length > 0 && (
//                 <div className="mt-6">
//                   <h3 className="text-xl font-semibold mb-3 text-gray-800">Features:</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {productInfo.features.map((feature, idx) => (
//                       <span
//                         key={idx}
//                         className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm shadow-sm hover:shadow-md hover:scale-105 transition"
//                       >
//                         {feature}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Specifications */}
//               <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50/70 p-4 rounded-xl shadow-inner">
//                 <p><span className="font-semibold text-gray-900">Category:</span> {productInfo.category}</p>
//                 <p><span className="font-semibold text-gray-900">Subcategory:</span> {productInfo.subcategory}</p>
//                 <p><span className="font-semibold text-gray-900">Type:</span> {productInfo.type}</p>
//                 <p><span className="font-semibold text-gray-900">Material:</span> {productInfo.material}</p>
//                 <p><span className="font-semibold text-gray-900">Color:</span> {productInfo.color}</p>
//                 <p><span className="font-semibold text-gray-900">Dimensions:</span> {productInfo.dimensions}</p>
//                 <p><span className="font-semibold text-gray-900">Weight:</span> {productInfo.weight}</p>
//                 <p><span className="font-semibold text-gray-900">Warranty:</span> {productInfo.warranty}</p>
//                 <p><span className="font-semibold text-gray-900">Origin:</span> {productInfo.origin}</p>
//               </div>

//               {/* Care Instructions */}
//               <div className="mt-8">
//                 <h3 className="text-xl font-semibold mb-2 text-gray-800">Care Instructions:</h3>
//                 <p className="text-gray-600">{productInfo.care_instructions}</p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mt-10 relative">
//               <button
//                 onClick={handleAddToCart}
//                 className={`flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform ${added ? "scale-105" : ""}`}
//                 disabled={productInfo.stock === 0}
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={() => {
//                   handleAddToCart();
//                   window.location.href = "/cart";
//                 }}
//                 className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
//                 disabled={productInfo.stock === 0}
//               >
//                 Buy Now
//               </button>

//               {added && (
//                 <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
//                   ✅ Added to Cart!
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductPage;
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Nev from "./Nev";
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";
import { Star, CheckCircle, XCircle, ShieldCheck, Truck, Sparkles } from "lucide-react";

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl shadow-sm p-3">
          <div className="h-[450px] bg-gray-200 rounded-lg" />
          <div className="flex gap-3 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="h-8 bg-gray-200 w-3/4 rounded mb-4" />
          <div className="h-5 bg-gray-200 w-1/3 rounded mb-6" />
          <div className="h-10 bg-gray-200 w-1/4 rounded mb-4" />
          <div className="h-5 bg-gray-200 w-1/5 rounded mb-6" />
          <div className="h-24 bg-gray-200 w-full rounded mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-10 bg-gray-200 w-2/3 rounded mt-8" />
        </div>
      </div>
    </div>
  </div>
);

const RatingStars = ({ rating = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

const Tag = ({ children }) => (
  <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm shadow-sm hover:shadow-md transition">
    {children}
  </span>
);

const InfoRow = ({ label, value }) => (
  <p className="flex items-start gap-2">
    <span className="font-semibold text-gray-900">{label}:</span> <span className="text-gray-700">{value || "-"}</span>
  </p>
);

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const { productId } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view products.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const normalizedImages = (data.images || []).map((img) =>
          img.url?.startsWith("http") ? img.url : `http://localhost:5000${img.url}`
        );

        setSelectedImage(normalizedImages[0] || null);
        setProductInfo({ ...data, images: normalizedImages });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!productInfo) return;
    addToCart(productInfo);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Nev />
        <Skeleton />
        <Footer />
      </>
    );
  }

  if (error || !productInfo) {
    return (
      <>
        <Nev />
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
          <div className="max-w-lg w-full bg-white border border-red-100 rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || "Product not found."}</p>
            <Link
              to="/"
              className="inline-flex items-center bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-black transition"
            >
              Go Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const inStock = productInfo.stock > 0;

  return (
    <>
      <Nev />
      {/* Breadcrumb + header band */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{productInfo.name}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen px-6 py-10 text-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="relative">
                {productInfo.badge && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> {productInfo.badge}
                  </span>
                )}
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={productInfo.name}
                    className="rounded-lg w-full max-h-[520px] object-contain bg-white"
                  />
                ) : (
                  <div className="h-[520px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              {productInfo.images.length > 1 && (
                <div className="flex mt-4 gap-3 overflow-x-auto pb-1">
                  {productInfo.images.map((img, idx) => {
                    const active = selectedImage === img;
                    return (
                      <button
                        key={idx}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg border transition-all ${
                          active ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedImage(img)}
                        aria-label={`Select image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <Truck className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-600">3–5 business days</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">SSL encrypted checkout</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Quality Assured</p>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{productInfo.name}</h1>
                {inStock ? (
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle className="h-4 w-4" /> In stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                    <XCircle className="h-4 w-4" /> Out of stock
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Brand: <span className="text-indigo-600 font-medium">{productInfo.brand}</span>
              </p>

              <div className="mt-4 flex items-center gap-3">
                <RatingStars rating={productInfo.rating} />
                <span className="text-sm text-gray-500">({productInfo.numOfReviews} reviews)</span>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-extrabold text-gray-900">₹{Number(productInfo.price).toFixed(2)}</p>
                {productInfo.mrp && productInfo.mrp > productInfo.price && (
                  <p className="text-sm text-gray-500 mt-1">
                    MRP: <span className="line-through">₹{Number(productInfo.mrp).toFixed(2)}</span>{" "}
                    <span className="text-green-600 font-semibold">
                      Save ₹{(productInfo.mrp - productInfo.price).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed">{productInfo.description}</p>

              {productInfo.features?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-3">
                    {productInfo.features.map((feature, idx) => (
                      <Tag key={idx}>{feature}</Tag>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 bg-gray-50/80 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <InfoRow label="Category" value={productInfo.category} />
                  <InfoRow label="Subcategory" value={productInfo.subcategory} />
                  <InfoRow label="Type" value={productInfo.type} />
                  <InfoRow label="Material" value={productInfo.material} />
                  <InfoRow label="Color" value={productInfo.color} />
                  <InfoRow label="Dimensions" value={productInfo.dimensions} />
                  <InfoRow label="Weight" value={productInfo.weight} />
                  <InfoRow label="Warranty" value={productInfo.warranty} />
                  <InfoRow label="Origin" value={productInfo.origin} />
                </div>
              </div>

              {productInfo.care_instructions && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Care instructions</h3>
                  <p className="text-gray-700">{productInfo.care_instructions}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition ${
                    added ? "ring-2 ring-indigo-300" : ""
                  } disabled:opacity-50`}
                  disabled={!inStock}
                >
                  Add to cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart();
                    window.location.href = "/cart";
                  }}
                  className="flex-1 inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition disabled:opacity-50"
                  disabled={!inStock}
                >
                  Buy now
                </button>
              </div>

              {added && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full border border-green-200">
                  <CheckCircle className="h-5 w-5" /> Added to cart
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
