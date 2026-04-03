import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../auth/useAuthStore";

const fixImageUrl = (url) => {
  if (!url || typeof url !== "string")
    return "https://placehold.co/400x400?text=No+Preview";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return "https://placehold.co/400x400?text=No+Preview";
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
};

// Skeleton card shown while loading
const SkeletonCard = () => (
  <div className="group flex flex-col animate-pulse">
    <div className="aspect-square rounded-[1.5rem] bg-gray-100" />
    <div className="mt-5 flex flex-col items-center gap-2">
      <div className="h-4 w-32 bg-gray-100 rounded-full" />
    </div>
  </div>
);

function PopularCategories() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/v1/box-types/type-list");
        if (!isMounted) return;

        const raw = response.data;
        let safeData = [];

        if (Array.isArray(raw)) safeData = raw;
        else if (Array.isArray(raw?.data)) safeData = raw.data;
        else if (Array.isArray(raw?.data?.data)) safeData = raw.data.data;
        else {
          const found = Object.values(raw?.data || {}).find(Array.isArray);
          if (found) safeData = found;
        }

        if (safeData.length > 0) {
          setCategories(
            safeData.map((item) => ({
              _id: item._id || item.id || `temp-${Math.random()}`,
              name: item.name || item.title || "Untitled Box",
              query: item.name || item.title || "Untitled Box",
              img: fixImageUrl(item.image),
            })),
          );
          setError(null);
        } else {
          setCategories([]);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load categories.");
          console.error(
            "❌ Failed to fetch categories:",
            err?.response?.data || err.message,
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleCategoryClick = () => {
    navigate(`/allproducts`);
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-8 bg-yellow-500"></span>
              <span className="text-yellow-600 font-bold tracking-[0.2em] text-[10px] uppercase">
                Premium Collection
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.9] uppercase italic">
              Popular <br />{" "}
              <span className="text-gray-300 not-italic">Categories</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-[280px] font-medium leading-relaxed border-l-2 border-gray-100 pl-5">
            Crafting the standard in high-end packaging. Explore our most
            popular formats.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12 text-gray-500 text-sm">{error}</div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category.query)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#f8f9fa] border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:border-gray-200">
                    <img
                      src={category.img}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x400?text=No+Preview";
                      }}
                    />

                    {/* Fade overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* CTA Button */}
                    <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]">
                      <div className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white transition-colors">
                        Explore Now
                        <span className="text-yellow-500 text-base leading-none">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-5 text-center px-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight transition-colors group-hover:text-yellow-600">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No categories available.
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularCategories;
