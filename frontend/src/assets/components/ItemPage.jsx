import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nev from './Nev';
import Footer from './Footer';
import productData from '../json/Products.json';

function ItemPage() {
  const { categoryName, itemName } = useParams();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const filtered = productData.filter(
        (item) =>
          item.category.toLowerCase() === categoryName.toLowerCase() &&
          item.subcategory.toLowerCase() === itemName.toLowerCase()
      );

      const uniqueTypesMap = new Map();
      filtered.forEach((item) => {
        const typeKey = item.type.toLowerCase();
        if (!uniqueTypesMap.has(typeKey)) {
          uniqueTypesMap.set(typeKey, {
            type: item.type,
            image: item.image || null,
          });
        }
      });

      setTypes(Array.from(uniqueTypesMap.values()));
    };

    fetchData();
  }, [categoryName, itemName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800">
      <Nev />

      <div className="max-w-7xl min-h-screen mx-auto px-4 py-10">
        {/* Header */}
        <div className="relative text-left mb-14">
          {/* Soft Background Glow */}
          <div className="absolute inset-0 -top-10 h-40 bg-gradient-to-r from-orange-200 via-purple-200 to-orange-200 opacity-30 blur-3xl rounded-3xl"></div>

          {/* Heading */}
          <h1 className="relative text-5xl font-extrabold bg-gray-400 bg-clip-text text-transparent drop-shadow-md">
            {itemName} 
          </h1>

          {/* Subtext */}
          <p className="relative mt-3 text-gray-600 text-lg tracking-wide">
            Category: <span className="font-semibold text-gray-400">{categoryName}</span>
          </p>

          {/* Breadcrumb */}
          <div className="relative mt-4 flex justify-left space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-400 transition">Home</Link>
            <span>/</span>
            <Link to={`/category/${categoryName}`} className="hover:text-pink-400 transition">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{itemName}</span>
          </div>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {types.length > 0 ? (
            types.map(({ type, image }, idx) => (
              <Link
                key={idx}
                to={`/category/${categoryName}/${itemName}/${type.toLowerCase()}`}
                className="bg-white/70 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Section */}
                {image ? (
                  <img
                    src={image}
                    alt={`${type} ${itemName}`}
                    className="w-full h-48 object-cover p-1 rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    No image available
                  </div>
                )}

                {/* Text Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                    {type}
                  </h2>
                  <p className="text-gray-600 text-sm mt-auto">
                    See all {type.toLowerCase()} {itemName.toLowerCase()}s
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No types found for this item.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ItemPage;
