import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../auth/useAuthStore";
import Footer from "../components/Footer";

const getSafeImage = (product) => {
  if (product.image && typeof product.image === "string") return product.image;
  if (product.media?.[0]) return product.media[0];
  if (product.images?.[0]) return product.images[0];
  return "https://placehold.co/400x400?text=No+Preview";
};

const GUEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWVzdElkIjoiNjlhZTc5M2I4ZWUzNGUyYTZiMjk3YWE1IiwidGltZXN0YW1wIjoxNzczMDQxOTc5MjI3LCJpYXQiOjE3NzMwNDE5Nzl9.sOaSZXDRgywoj-YTvQPwwlFY5ArmMZ0-H7njQoyi0WQ";

const AllProducts = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ price: [], type: [], material: [] });
  const [sort, setSort] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      setFilters((prev) => ({
        ...prev,
        type: prev.type.includes(categoryQuery)
          ? prev.type
          : [...prev.type, categoryQuery],
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    let pollingInterval;

    const fetchProducts = async () => {
      try {
        const activeToken = token || GUEST_TOKEN;

        const response = await api.get(`/v1/box-types/type-list`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!isMounted) return;

        let rawData = response.data;
        let safeData = [];

        if (Array.isArray(rawData)) {
          safeData = rawData;
        } else if (Array.isArray(rawData?.data)) {
          safeData = rawData.data;
        } else if (rawData?.data && typeof rawData.data === "object") {
          const foundArray = Object.values(rawData.data).find((val) =>
            Array.isArray(val),
          );
          if (foundArray) safeData = foundArray;
        }

        if (!safeData || safeData.length === 0) {
          const absoluteFallback = Object.values(rawData).find((val) =>
            Array.isArray(val),
          );
          if (absoluteFallback) safeData = absoluteFallback;
        }

        if (safeData && safeData.length > 0) {
          const formattedData = safeData.map((item) => ({
            ...item,
            _id: item._id || item.id || `temp-${Math.random()}`,
            name: item.name || item.title || "Untitled Box",
            price: Number(item.price) || 0,
          }));

          setProducts(formattedData);
          setError(null);

          if (pollingInterval) clearInterval(pollingInterval);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (isMounted && products.length === 0) {
          setError("Unable to load products. Retrying in background...");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    pollingInterval = setInterval(fetchProducts, 10000);

    return () => {
      isMounted = false;
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [token, products.length]);

  const availableCategories = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.name).filter(Boolean))).sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.type.length > 0 && !filters.type.includes(product.name))
          return false;

        if (filters.price.length > 0) {
          const price = product.price || 0;
          return filters.price.some((range) => {
            if (range === "low") return price <= 1000;
            if (range === "mid") return price > 1000 && price <= 5000;
            if (range === "high") return price > 5000;
            return false;
          });
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, filters, sort]);

  const toggleFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((i) => i !== value)
        : [...prev[key], value],
    }));
  }, []);

  const clearAllFilters = () => {
    setFilters({ price: [], type: [], material: [] });
    setSearchParams({});
    setSort("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <header className="bg-yellow-400 py-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Box Types Catalog
          </h1>
          <p className="mt-2 text-lg text-gray-800 opacity-80">
            Browse our premium packaging solutions
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* UPDATED SIDEBAR */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Price */}
            <div className="border-b border-gray-200">
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Price
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.price.includes("low")}
                    onChange={() => toggleFilter("price", "low")}
                    className="mr-2"
                  />
                  0-1000 Rs.
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.price.includes("mid")}
                    onChange={() => toggleFilter("price", "mid")}
                    className="mr-2"
                  />
                  1000-2000 Rs.
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.price.includes("high")}
                    onChange={() => toggleFilter("price", "high")}
                    className="mr-2"
                  />
                  2000-5000 Rs.
                </label>
              </div>
            </div>

            {/* Box Type */}
            <div className="border-b border-gray-200">
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Box Type
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleFilter("type", "Universal Box")}
                    checked={filters.type.includes("Universal Box")}
                    className="mr-2"
                  />
                  Universal Box
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleFilter("type", "Hamper Boxes")}
                    checked={filters.type.includes("Hamper Boxes")}
                    className="mr-2"
                  />
                  Hamper Boxes
                </label>
              </div>
            </div>

            {/* Size */}
            <div className="border-b border-gray-200">
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Size
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Small
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Medium
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Large
                </label>
              </div>
            </div>

            {/* Material */}
            <div className="border-b border-gray-200">
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Material
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleFilter("material", "Rigid")}
                    checked={filters.material.includes("Rigid")}
                    className="mr-2"
                  />
                  Rigid
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => toggleFilter("material", "Kraft")}
                    checked={filters.material.includes("Kraft")}
                    className="mr-2"
                  />
                  Kraft
                </label>
              </div>
            </div>

            {/* Use Case */}
            <div className="border-b border-gray-200">
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Use Case
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  E-commerce
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Gift
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Electronics
                </label>
              </div>
            </div>

            {/* Other */}
            <div>
              <div className="bg-gray-100 px-5 py-3 font-semibold text-gray-700">
                Other
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Eco-friendly
                </label>

                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Minimal Wastage
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                  <img
                    src={getSafeImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h5 className="font-bold text-gray-900 text-lg mb-2 truncate group-hover:text-yellow-600 transition-colors">
                    {product.name}
                  </h5>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Explore
                    </span>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <span className="text-gray-900 font-bold">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(AllProducts);
