import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Nev from "./Nev";
import Footer from "./Footer";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        const matched = res.data.find(
          (item) => item.name.toLowerCase() === categoryName.toLowerCase()
        );
        setCategory(matched || null);
      } catch (err) {
        console.error("Error fetching category:", err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Nev />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 text-center">
          <p className="text-gray-500 text-lg">Category not found.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-orange-500 font-semibold hover:text-orange-600 transition"
          >
            Go back home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800 flex flex-col">
      <Nev />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 relative"
        >
          <h1 className="relative text-5xl sm:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight capitalize">
            {category.name}
          </h1>

          <div className="relative mt-4 text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-yellow-500 font-medium transition duration-300"
            >
              Home
            </Link>{" "}
            / <span className="text-gray-600 font-semibold">{category.name}</span>
          </div>
        </motion.div>

        {/* Subcategories */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {category.subcategories && category.subcategories.length > 0 ? (
            category.subcategories.map((sub, index) => (
              <motion.div
                key={sub._id || index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={`/category/${categoryName}/${sub.name.toLowerCase()}`}
                  className="block bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
                    {sub.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explore all “{sub.name}” items.
                  </p>
                  <div className="mt-3 text-yellow-500 font-medium">Browse →</div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No subcategories available.
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
