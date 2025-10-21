import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBoxes, FaSpinner } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert image filename to full URL
  const getImageUrl = (img) => {
    if (!img) return null;
    const cleanImg = img.replace(/^\/+/, ""); // remove leading slashes
    return img.startsWith("http") ? img : `http://localhost:5000/${cleanImg}`;
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        console.log("API Response:", res.data);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20 bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
        <span className="ml-3 text-xl text-gray-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white skew-y-[-3deg] origin-top-left -translate-y-1/2 opacity-70"></div>
      <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-orange-100/50 skew-y-[2deg] origin-top-right translate-y-1/4 opacity-40 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-center mb-12 font-extrabold tracking-tight">
          Discover Our Core Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category._id || index}
              to={`/category/${category.name}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-500 transform hover:shadow-2xl hover:scale-[1.03] hover:border-orange-400/50 flex flex-col h-full cursor-pointer">

                {/* Full-size Image */}
                <div className="w-full h-30 md:h-52 lg:h-40 relative overflow-hidden">
                  {category.image ? (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaBoxes className="text-5xl text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 transition-colors truncate capitalize">
                    {category.name}
                  </h3>

                  {/* Subcategories (first 6) */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {category.subcategories?.slice(0, 6).map((sub, idx) => (
                      <span
                        key={sub._id || idx}
                        className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200 truncate"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {category.subcategories?.length > 6 && (
                      <span className="text-xs font-medium text-gray-400 px-2 py-1">
                        +{category.subcategories.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-400 mt-16 text-xl">
            😔 No categories found. Please check the backend connection.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
