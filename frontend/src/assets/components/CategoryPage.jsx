import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import categoryData from "../json/Catogry.json";
import Nev from "./Nev";
import Footer from "./Footer";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const matchedCategories = categoryData.homeCategories.filter(
    (item) => item.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800 flex flex-col">
      <Nev />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12">
        {/* --- Page Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 relative"
        >
          <div className="absolute inset-0 -top-6 h-40 to-transparent blur-3xl opacity-70 rounded-full"></div>

          <h1 className="relative text-5xl sm:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-salet-800 via-green-700 to-salet-900 drop-shadow-md">
              {categoryName}
            </span>
          </h1>

          {/* <p className="relative text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Explore the most exciting picks in{" "}
            <span className="text-yellow-500 font-semibold">
              “{categoryName}”
            </span>{" "}
            and discover products you’ll love.
          </p> */}

          <div className="relative mt-4 text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-yellow-500 font-medium transition duration-300"
            >
              Home
            </Link>{" "}
            /{" "}
            <span className="text-gray-600 font-semibold">{categoryName}</span>
          </div>
        </motion.div>

        {/* --- Category Section --- */}
        {matchedCategories.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No matching category found.
          </p>
        ) : (
          matchedCategories.map((category) => (
            <section key={category.id} className="mb-20">
              {/* Banner */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-[400px] object-cover rounded-3xl transform transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-8 left-8 text-white">
                  <h2 className="text-3xl font-bold mb-1">{category.name}</h2>
                  <p className="text-sm text-gray-200">
                    Discover handpicked products from this category.
                  </p>
                </div>
              </motion.div>

              {/* Subcategories */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {category.subcategories && category.subcategories.length > 0 ? (
                  category.subcategories.map((sub, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link
                        to={`/category/${categoryName}/${sub.toLowerCase()}`}
                        className="block bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
                          {sub}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Explore all “{sub}” items.
                        </p>
                        <div className="mt-3 text-yellow-500 font-medium">
                          Browse →
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">
                    No subcategories available.
                  </p>
                )}
              </motion.div>
            </section>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
