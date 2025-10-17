import React from "react";
import cetogry from "../json/Catogry.json";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden py-4 px-3">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl  text-gray-500 text-center mb-8 ">
          Explore Categories
        </h2>

        {/* Grid → 2 on mobile, 3 on md, 4 on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {cetogry.homeCategories.map((category) => (
            <Link key={category.id} to={`/category/${category.name}`} className="block">
              <div className="group bg-white/30 backdrop-blur-lg rounded-xl overflow-hidden shadow-md border border-white/20 transition-all duration-300 hover:scale-105 flex flex-col h-full">
                
                {/* Image (smaller) */}
                <div className="h-28 sm:h-32 w-full overflow-hidden rounded-t-xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover p-1 rounded-lg drop-shadow-lg  transition-transform duration-900 group-hover:scale-110"
                  />
                </div>

                {/* Content (smaller padding + fonts) */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center mb-2 group-hover:text-yellow-500 transition-colors truncate">
                    {category.name}
                  </h3>

                  {/* Subcategories (smaller tags, max 4) */}
                  <div className="flex flex-wrap justify-center gap-2 mt-auto">
                    {category.subcategories.slice(0,6).map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded-md hover:text-yellow-500 transition-colors truncate"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
