import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBoxes, FaSearch } from "react-icons/fa";

/**
 * Different style:
 * - Split layout with a compact left sidebar (filters, quick jump)
 * - Right side uses elegant cards with tall aspect, pinned title, and soft shadows
 * - Sticky sidebar on desktop, fluid on mobile
 * - Subcategory chips with overflow counter
 * - Clean, professional typography and spacing
 */

const getImageUrl = (img) => {
  if (!img) return null;
  const cleanImg = img.replace(/^\/+/, "");
  return img.startsWith("http") ? img : `http://192.168.29.252:5000/${cleanImg}`;
};

const SkeletonCards = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl" />
        <div className="mt-4 h-5 w-2/3 bg-gray-200 rounded" />
        <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://192.168.29.252:5000/api/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(t));
  }, [categories, term]);

  const popular = useMemo(
    () =>
      [...categories]
        .sort((a, b) => (b.subcategories?.length || 0) - (a.subcategories?.length || 0))
        .slice(0, 8),
    [categories]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Browse categories</h1>
          <p className="mt-2 text-gray-600">Search, filter, and jump quickly to what you need.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="mt-2 relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Quick jump */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Popular categories</h3>
                  <span className="text-xs text-gray-500">{popular.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {popular.map((cat, i) => (
                    <Link
                      key={cat._id || i}
                      to={`/category/${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-800 truncate capitalize">{cat.name}</span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {cat.subcategories?.length || 0}
                      </span>
                    </Link>
                  ))}
                  {popular.length === 0 && (
                    <p className="text-xs text-gray-500">No popular categories yet.</p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
                <h4 className="text-sm font-semibold text-indigo-900">Tip</h4>
                <p className="mt-1 text-sm text-indigo-800">
                  Use the search to quickly filter categories. Click a chip to explore related items.
                </p>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="lg:col-span-9">
            {loading ? (
              <SkeletonCards count={9} />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <FaBoxes className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No categories match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((category, idx) => {
                  const subs = Array.isArray(category.subcategories) ? category.subcategories : [];
                  const imageUrl = getImageUrl(category.image);
                  const overflow = Math.max(subs.length - 6, 0);

                  return (
                    <Link
                      key={category._id || idx}
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        {/* Image area */}
                        <div className="relative w-full aspect-[3/4] bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={category.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaBoxes className="text-6xl text-gray-300" />
                            </div>
                          )}
                          {/* Pinned title chip */}
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur text-gray-900 text-xs font-semibold border border-gray-200 shadow-sm">
                              {category.name}
                            </span>
                          </div>
                          {/* Subtle gradient bottom for legibility */}
                          <div className="absolute inset-x-0 bottom-0 h-24 " />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Count pill */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Subcategories</span>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {subs.length}
                            </span>
                          </div>

                          {/* Chips */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {subs.slice(0, 6).map((sub, sIdx) => (
                              <span
                                key={sub._id || sIdx}
                                title={sub.name}
                                className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                              >
                                {sub.name}
                              </span>
                            ))}
                            {overflow > 0 && (
                              <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                +{overflow}
                              </span>
                            )}
                          </div>

                          {/* CTA */}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Curated</span>
                            <span className="text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categories;
