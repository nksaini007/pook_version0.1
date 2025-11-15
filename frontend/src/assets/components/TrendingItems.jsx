import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import cetogry from "../json/Itom.json"; // fallback

const FocusCarousel = ({ items = cetogry, title = "Trending right now", autoplay = false }) => {
  const nav = useNavigate();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(Boolean(autoplay));

  // Ensure index bounds
  useEffect(() => {
    if (!items || items.length === 0) return;
    setIndex((i) => Math.max(0, Math.min(i, items.length - 1)));
  }, [items]);

  // Autoplay
  useEffect(() => {
    if (!playing || !items.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3500);
    return () => clearInterval(id);
  }, [playing, items.length]);

  // Scroll to center active card
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const active = el.querySelector(`[data-idx="${index}"]`);
    if (!active) return;
    const offset = active.offsetLeft - (el.clientWidth - active.clientWidth) / 2;
    el.scrollTo({ left: offset, behavior: "smooth" });
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, items.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <section className="py-2 px-0
       bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-sm text-gray-500">No trending items available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-1 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked products trending today</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              aria-label="Previous"
              className="p-2 rounded-md bg-white shadow-sm hover:shadow-md border"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(i + 1, items.length - 1))}
              aria-label="Next"
              className="p-2 rounded-md bg-white shadow-sm hover:shadow-md border"
            >
              <FaChevronRight />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className={`px-3 py-1 rounded-md text-sm ${playing ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}
            >
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="relative flex gap-6 overflow-x-auto no-scrollbar py-6 snap-x snap-mandatory"
          role="list"
          aria-label="Trending items carousel"
        >
          {items.map((it, i) => {
            const active = i === index;
            return (
              <article
                key={it.id || i}
                data-idx={i}
                role="listitem"
                className={`snap-center flex-shrink-0 w-[70%] sm:w-[48%] md:w-[32%] lg:w-[28%] transition-transform duration-300 ${
                  active ? "scale-105 z-30" : "scale-95 opacity-80"
                }`}
                aria-current={active ? "true" : "false"}
              >
                <div className={`rounded-xl overflow-hidden shadow-lg ${active ? "border-2 border-amber-400" :"border-0"} bg-white`}>
                  <div className="relative h-56 md:h-64 bg-gray-100">
                    <img
                      src={it.image}
                      alt={it.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {it.tag && (
                      <span className="absolute left-3 top-3 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        {it.tag}
                      </span>
                    )}
                    <div className="absolute right-3 bottom-3 bg-white/90 text-xs text-gray-800 px-2 py-1 rounded">
                      <span className="font-semibold">₹{it.price}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{it.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{it.description}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => nav(`/product/${it.id || i}`)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm ${active ? "bg-amber-500 text-white" : "bg-gray-900 text-white"}`}
                        >
                          View
                        </button>
                        <button
                          onClick={() => console.log("addtocart", it.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-800 border"
                        >
                          <FaShoppingCart />
                        </button>
                      </div>

                      <button
                        onClick={() => console.log("wishlist", it.id)}
                        aria-label={`Add ${it.name} to wishlist`}
                        className="p-2 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to item ${i + 1}`}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-amber-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusCarousel;
