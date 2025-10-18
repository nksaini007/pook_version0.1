import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nev from "./Nev";
import Footer from "./Footer";
import Categories from "./Categories";

const ItemList = () => {
  const { categoryName, itemName, itemList } = useParams();
  const [mainProducts, setMainProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view products.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products/public", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const products = Array.isArray(data) ? data : data.products || [];

        const category = categoryName.toLowerCase();
        const subcategory = itemName.toLowerCase();
        const type = decodeURIComponent(itemList).toLowerCase();

        const matched = products.filter(
          (product) =>
            product.category.toLowerCase() === category &&
            product.subcategory.toLowerCase() === subcategory &&
            product.type.toLowerCase() === type
        );

        const related = products.filter(
          (product) =>
            product.category.toLowerCase() === category &&
            product.subcategory.toLowerCase() === subcategory &&
            product.type.toLowerCase() !== type
        );

        // Ensure image URL works
        const formatImage = (product) => {
          if (product.images && product.images.length > 0) {
            const imgUrl = product.images[0].url;
            return imgUrl.startsWith("http") ? imgUrl : `http://localhost:5000${imgUrl}`;
          }
          return null;
        };

        setMainProducts(matched.map((p) => ({ ...p, image: formatImage(p) })));
        setRelatedProducts(related.map((p) => ({ ...p, image: formatImage(p) })));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, itemName, itemList]);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 min-h-screen">
      <Nev />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="relative text-left mb-14">
          <div className="absolute inset-0 -top-10 h-40 bg-gray-200 opacity-30 blur-3xl rounded-3xl"></div>

          <h1 className="relative text-4xl font-extrabold bg-gray-400 bg-clip-text text-transparent drop-shadow-md animate-fade-in">
            {itemList} {itemName}s
          </h1>

          <p className="relative mt-2 text-gray-600 text-base tracking-wide">
            Category: <span className="font-semibold text-gray-400">{categoryName}</span>
          </p>

          <div className="relative mt-3 flex justify-left space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-pink-400 transition">Home</Link>
            <span>/</span>
            <Link to={`/category/${categoryName}`} className="hover:text-orange-400 transition">
              {categoryName}
            </Link>
            <span>/</span>
            <Link to={`/category/${categoryName}/${itemName}`} className="hover:text-orange-400 transition">
              {itemName}
            </Link>
            <span>/</span>
            <span className="text-orange-400 font-medium">{itemList}</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading products...</p>
        ) : (
          <>
            {/* Main Products */}
            {mainProducts.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Product Details</h2>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {mainProducts.map((product, index) => (
                    <Link
                      key={index}
                      to={`/category/${categoryName}/${itemName}/${itemList}/${product._id}`}
                      className="bg-white/70 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 block overflow-hidden"
                    >
                      <div className="overflow-hidden rounded-xl">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full rounded-xl p-1 h-40 object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No image available
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="text-lg font-bold text-gray-950">{product.name}</h3>
                          <p className="text-gray-600 mt-1 text-sm line-clamp-2">{product.description}</p>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-orange-500 font-semibold text-sm">
                              ₹{product.price.toFixed(2)}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                product.stock > 50
                                  ? "bg-orange-200 text-orange-900"
                                  : product.stock > 10
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {product.stock > 50
                                ? "In Stock"
                                : product.stock > 10
                                ? "Limited"
                                : "Low"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center mb-16">No products found in this type.</p>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-16 mb-6 text-gray-700">
                  You may also like
                </h2>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {relatedProducts.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white/70 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition transform duration-300 overflow-hidden"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-36 object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-orange-500 font-bold text-sm">₹{product.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Categories />
      <Footer />
    </div>
  );
};

export default ItemList;
