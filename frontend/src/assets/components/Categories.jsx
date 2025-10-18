import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories directly from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data || []); // ✅ direct array, not res.data.homeCategories
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
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden py-4 px-3">
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-gray-600 text-center mb-8 font-semibold tracking-wide">
          Explore Categories
        </h2>

        {/* Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category._id || index}
              to={`/category/${category.name}`}
              className="block"
            >
              <div className="group bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
                
                {/* Image fallback */}
                <div className="h-32 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={
                      category.image ||
                      "https://cdn-icons-png.flaticon.com/512/679/679922.png"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center mb-2 group-hover:text-orange-500 transition-colors truncate capitalize">
                    {category.name}
                  </h3>

                  {/* Subcategories */}
                  <div className="flex flex-wrap justify-center gap-1 mt-auto">
                    {category.subcategories?.slice(0, 6).map((sub, idx) => (
                      <span
                        key={sub._id || idx}
                        className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded-md border border-gray-200 hover:text-orange-500 hover:border-orange-400 transition-colors truncate"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
