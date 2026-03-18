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

const GUEST_TOKEN = import.meta.env.VITE_GUEST_TOKEN || "";

/* ─── Collapsible filter section ─── */
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
          {title}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M2 4.5l4 4 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="pb-5 px-5 space-y-5">{children}</div>}
    </div>
  );
};

/* ─── Checkbox — label is the entire clickable area ─── */
const FilterOption = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none py-0.5">
    {/* Hidden native checkbox drives the state */}
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    {/* Custom visual checkbox — pointer-events-none so label handles clicks */}
    <span
      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center pointer-events-none transition-all duration-150
        ${checked ? "bg-yellow-400 border-yellow-400" : "border-gray-300 bg-white group-hover:border-yellow-400"}`}
    >
      {checked && (
        <svg
          className="w-2.5 h-2.5 text-gray-900"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M2 5l2.5 2.5L8 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span
      className={`text-sm transition-colors ${checked ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
    >
      {label}
    </span>
  </label>
);

/* ─── Shared filter panel content ─── */
const FilterPanel = ({
  filters,
  toggleFilter,
  clearAllFilters,
  activeFilterCount,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
      <span className="text-sm font-bold text-gray-900">Filters</span>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-[11px] font-semibold text-yellow-600 hover:text-yellow-700 underline underline-offset-2 transition-colors"
        >
          Clear all ({activeFilterCount})
        </button>
      )}
    </div>

    <FilterSection title="Price">
      <FilterOption
        label="Under ₹1,000"
        checked={filters.price.includes("low")}
        onChange={() => toggleFilter("price", "low")}
      />
      <FilterOption
        label="₹1,000 – ₹2,000"
        checked={filters.price.includes("mid")}
        onChange={() => toggleFilter("price", "mid")}
      />
      <FilterOption
        label="₹2,000 – ₹5,000"
        checked={filters.price.includes("high")}
        onChange={() => toggleFilter("price", "high")}
      />
    </FilterSection>

    <FilterSection title="Box Type">
      <FilterOption
        label="Universal Box"
        checked={filters.type.includes("Universal Box")}
        onChange={() => toggleFilter("type", "Universal Box")}
      />
      <FilterOption
        label="Hamper Boxes"
        checked={filters.type.includes("Hamper Boxes")}
        onChange={() => toggleFilter("type", "Hamper Boxes")}
      />
    </FilterSection>

    <FilterSection title="Size">
      <FilterOption
        label="Small"
        checked={filters.size.includes("small")}
        onChange={() => toggleFilter("size", "small")}
      />
      <FilterOption
        label="Medium"
        checked={filters.size.includes("medium")}
        onChange={() => toggleFilter("size", "medium")}
      />
      <FilterOption
        label="Large"
        checked={filters.size.includes("large")}
        onChange={() => toggleFilter("size", "large")}
      />
    </FilterSection>

    <FilterSection title="Material">
      <FilterOption
        label="Rigid"
        checked={filters.material.includes("Rigid")}
        onChange={() => toggleFilter("material", "Rigid")}
      />
      <FilterOption
        label="Kraft"
        checked={filters.material.includes("Kraft")}
        onChange={() => toggleFilter("material", "Kraft")}
      />
    </FilterSection>

    <FilterSection title="Use Case">
      <FilterOption
        label="E-commerce"
        checked={filters.useCase.includes("ecommerce")}
        onChange={() => toggleFilter("useCase", "ecommerce")}
      />
      <FilterOption
        label="Gift"
        checked={filters.useCase.includes("gift")}
        onChange={() => toggleFilter("useCase", "gift")}
      />
      <FilterOption
        label="Electronics"
        checked={filters.useCase.includes("electronics")}
        onChange={() => toggleFilter("useCase", "electronics")}
      />
    </FilterSection>

    <FilterSection title="Features">
      <FilterOption
        label="Eco-friendly"
        checked={filters.other.includes("eco")}
        onChange={() => toggleFilter("other", "eco")}
      />
      <FilterOption
        label="Minimal Wastage"
        checked={filters.other.includes("minimal")}
        onChange={() => toggleFilter("other", "minimal")}
      />
    </FilterSection>
  </div>
);

/* ─── Main Page ─── */
const AllProducts = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    price: [],
    type: [],
    material: [],
    size: [],
    useCase: [],
    other: [],
  });
  const [sort, setSort] = useState("");

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

        if (Array.isArray(rawData)) safeData = rawData;
        else if (Array.isArray(rawData?.data)) safeData = rawData.data;
        else if (rawData?.data && typeof rawData.data === "object") {
          const found = Object.values(rawData.data).find(Array.isArray);
          if (found) safeData = found;
        }
        if (!safeData.length) {
          const fallback = Object.values(rawData).find(Array.isArray);
          if (fallback) safeData = fallback;
        }

        if (safeData.length > 0) {
          setProducts(
            safeData.map((item) => ({
              ...item,
              _id: item._id || item.id || `temp-${Math.random()}`,
              name: item.name || item.title || "Untitled Box",
              price: Number(item.price) || 0,
            })),
          );
          setError(null);
        } else {
          setProducts([]);
        }
      } catch {
        if (isMounted) setError("Unable to load products. Retrying…");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    pollingInterval = setInterval(fetchProducts, 10000);
    return () => {
      isMounted = false;
      clearInterval(pollingInterval);
    };
  }, [token]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.type.length > 0 && !filters.type.includes(product.name))
          return false;
        if (filters.price.length > 0) {
          const price = product.price || 0;
          return filters.price.some((range) => {
            if (range === "low") return price <= 1000;
            if (range === "mid") return price > 1000 && price <= 2000;
            if (range === "high") return price > 2000 && price <= 5000;
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
    setFilters({
      price: [],
      type: [],
      material: [],
      size: [],
      useCase: [],
      other: [],
    });
    setSearchParams({});
    setSort("");
  };

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f4] font-sans">
      {/* Header */}
      <header className="bg-yellow-400 py-10 md:py-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Box Types Catalog
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-800 opacity-80">
            Browse our premium packaging solutions
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col lg:flex-row gap-8">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-8">
            <FilterPanel
              filters={filters}
              toggleFilter={toggleFilter}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </aside>

        {/* ── MOBILE TOP BAR ── */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center gap-3">
            {/* Filter button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h18M7 9h10M11 14h2"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) =>
                values.map((val) => (
                  <span
                    key={`${key}-${val}`}
                    className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => toggleFilter(key, val)}
                      className="hover:text-yellow-600 text-base leading-none"
                    >
                      ×
                    </button>
                  </span>
                )),
              )}
            </div>
          )}
        </div>

        {/* ── MOBILE FILTER DRAWER ── */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            {/* Slide-in panel from right */}
            <div className="relative ml-auto w-[85%] max-w-sm h-full bg-[#f8f7f4] shadow-2xl flex flex-col">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                <span className="font-bold text-gray-900">
                  Filters{" "}
                  {activeFilterCount > 0 && (
                    <span className="text-yellow-500">
                      ({activeFilterCount})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable filters */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel
                  filters={filters}
                  toggleFilter={toggleFilter}
                  clearAllFilters={clearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              {/* Apply CTA */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-colors"
                >
                  Show {filteredProducts.length} Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS GRID ── */}
        <main className="flex-1 min-w-0">
          {/* Desktop sort bar */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            >
              <option value="">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Loading skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
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
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
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
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-semibold text-lg">
                No products found
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your filters
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 text-sm font-semibold text-yellow-600 underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(AllProducts);
