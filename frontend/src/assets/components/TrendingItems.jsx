import React from "react";
import cetogry from "../json/Itom.json";
// Dummy data - replace this with props or API data


const TrendingItems = () => {
  return (
    <section className="py-3 px-5 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-500 mb-4">
         Trending Items for you
      </h2>

      {/* Scrollable container */}
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {cetogry.map((item) => (
          <div
            key={item.id}
            className="min-w-[160px] my-5 sm:min-w-[200px] bg-white rounded-lg p-3 shadow hover:shadow-lg transition transform hover:-translate-y-1 flex-shrink-0"
          >
            <div className="h-23 w-full overflow-hidden rounded-md mb-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-gray-500 text-sm sm:text-base font-semibold mb-1">
              {item.name}
            </h3>
            <p className="text-orange-400 text-sm font-bold">{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingItems;
