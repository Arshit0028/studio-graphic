import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../auth/useAuthStore";
import Footer from "../components/Footer";
import { categories } from "../constants/categories";
import { useProductsStore } from "../store/productsStore";

/* ─── Fix image URL for both dev and production ─── */
const fixImageUrl = (url) => {
  if (!url) return "/placeholder.png";

  // Rewrite http://3.110.128.94:8181/uploads/... → /uploads/...
  // Dev: Vite proxy handles /uploads | Production: Vercel rewrite handles /uploads
  if (url.includes("3.110.128.94:8181")) {
    return url.replace(/^https?:\/\/3\.110\.128\.94:8181/, "");
  }

  if (url.startsWith("http")) return url;

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://54.252.174.35:9000";
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/* ─── Size classifier from dimensions ─── */
const classifySize = (dimension) => {
  if (!dimension) return "medium";
  const vol =
    (dimension.length || 0) * (dimension.width || 0) * (dimension.height || 0);
  if (vol <= 120) return "small";
  if (vol <= 600) return "medium";
  return "large";
};

/* ─── Collapsible filter section ─── */
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-yellow-50 transition-colors duration-150 text-left group"
      >
        <span className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400 group-hover:text-yellow-600 transition-colors">
          {title}
        </span>
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${open ? "bg-yellow-400 rotate-180" : "bg-gray-100"}`}
        >
          <svg
            className={`w-2.5 h-2.5 ${open ? "text-gray-900" : "text-gray-400"}`}
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M2 3.5l3 3 3-3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && <div className="mt-1 mx-2 mb-3 space-y-0.5">{children}</div>}
    </div>
  );
};

/* ─── Checkbox ─── */
const FilterOption = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group select-none transition-all duration-150 hover:bg-yellow-50">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <span
      className={`w-[18px] h-[18px] rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150 ${
        checked
          ? "bg-yellow-400 border-yellow-400 shadow-sm shadow-yellow-200"
          : "border-gray-200 bg-white group-hover:border-yellow-300"
      }`}
    >
      {checked && (
        <svg
          className="w-2.5 h-2.5 text-gray-900"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
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
      className={`text-sm leading-none transition-colors ${
        checked
          ? "text-gray-900 font-semibold"
          : "text-gray-500 group-hover:text-gray-800"
      }`}
    >
      {label}
    </span>
    {checked && (
      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
    )}
  </label>
);

/* ─── Divider ─── */
const Divider = () => (
  <div className="mx-4 my-1 border-t border-dashed border-gray-100" />
);

/* ─── Filter panel ─── */
const FilterPanel = ({
  filters,
  toggleFilter,
  clearAllFilters,
  activeFilterCount,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    {/* Header */}
    <div className="px-5 pt-5 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M7 9h10M11 14h2"
            />
          </svg>
        </div>
        <span className="text-sm font-black text-gray-900 tracking-tight">
          Filters
        </span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-black">
            {activeFilterCount}
          </span>
        )}
      </div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
          </svg>
          Clear all
        </button>
      )}
    </div>

    <Divider />

    <div className="py-2">
      <FilterSection title="Price Range">
        <FilterOption
          label="Under ₹25"
          checked={filters.price.includes("low")}
          onChange={() => toggleFilter("price", "low")}
        />
        <FilterOption
          label="₹25 – ₹50"
          checked={filters.price.includes("mid")}
          onChange={() => toggleFilter("price", "mid")}
        />
        <FilterOption
          label="Above ₹50"
          checked={filters.price.includes("high")}
          onChange={() => toggleFilter("price", "high")}
        />
      </FilterSection>

      <Divider />

      <FilterSection title="Box Type">
        {categories.map((cat) => (
          <FilterOption
            key={cat}
            label={cat}
            checked={filters.type.includes(cat)}
            onChange={() => toggleFilter("type", cat)}
          />
        ))}
      </FilterSection>

      <Divider />

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

      <Divider />

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

      <Divider />

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

      <Divider />

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

    {/* Active filter tags */}
    {activeFilterCount > 0 && (
      <>
        <Divider />
        <div className="px-4 py-3 flex flex-wrap gap-1.5">
          {Object.entries(filters).map(([key, values]) =>
            values.map((val) => (
              <span
                key={`${key}-${val}`}
                className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                {val}
                <button
                  type="button"
                  onClick={() => toggleFilter(key, val)}
                  className="hover:text-red-500 transition-colors text-yellow-600 ml-0.5 leading-none"
                >
                  ×
                </button>
              </span>
            )),
          )}
        </div>
      </>
    )}
  </div>
);

/* ─── Product Card ─── */
const ProductCard = React.memo(({ product, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden flex flex-col"
  >
    {/* Image */}
    <div className="relative aspect-square bg-gray-50 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x400?text=No+Preview";
        }}
      />
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {product.ecoFriendly && (
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <svg
              className="w-2.5 h-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            Eco
          </span>
        )}
        {product.minimalWastage && (
          <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ♻ Low Waste
          </span>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <h5 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-yellow-600 transition-colors leading-snug">
        {product.name}
      </h5>
      {product.shortDescription && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Variant info */}
      {product.basePrice > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs text-gray-400 font-medium">From</span>
          <span className="text-sm font-black text-gray-900">
            ₹{product.basePrice}
          </span>
          <span className="text-[10px] text-gray-400">/ unit</span>
          {product.moq > 0 && (
            <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              MOQ: {product.moq}
            </span>
          )}
        </div>
      )}

      {/* Size chip */}
      {product.dimensionLabel && (
        <div className="mb-3">
          <span className="text-[10px] bg-yellow-50 border border-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
            {product.dimensionLabel}
          </span>
        </div>
      )}

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
));

/* ─── Main Page ─── */
const AllProducts = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchProducts } = useProductsStore();

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
    fetchProducts(token);
  }, [token, fetchProducts]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "v1/boxes/related/69a7237d0b3d4d8d324a26af",
        );
        if (!isMounted) return;

        const raw = response.data;
        let safeData = [];

        if (Array.isArray(raw?.data?.related)) {
          safeData = raw.data.related;
        }

        if (safeData.length > 0) {
          setProducts(
            safeData.map((item) => {
              const box = item.box || {};
              const images = item.images || [];
              const variants = item.variants || [];

              // Pick cheapest variant for price display
              const cheapestVariant =
                variants.length > 0
                  ? variants.reduce((a, b) =>
                      (a.basePrice || 0) <= (b.basePrice || 0) ? a : b,
                    )
                  : null;

              const primaryImage =
                images.length > 0 ? images[0].imageUrl : null;

              return {
                ...box,
                _id: box._id || box.id || `temp-${Math.random()}`,
                name: box.name || box.title || "Untitled Box",
                basePrice: cheapestVariant?.basePrice || 0,
                moq: cheapestVariant?.moq || 0,
                dimensionLabel: cheapestVariant?.dimension?.label || "",
                sizeClass: classifySize(cheapestVariant?.dimension),
                ecoFriendly: box.ecoFriendly || false,
                minimalWastage: box.minimalWastage || false,
                // ✅ strips IP:port → /uploads/... path for Vercel + Vite proxy
                image: fixImageUrl(primaryImage),
                _variants: variants,
              };
            }),
          );
          setError(null);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load products. Please try again.");
          console.error(
            "❌ Failed to fetch products:",
            err?.response?.data || err.message,
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Type / category filter
        if (filters.type.length > 0 && !filters.type.includes(product.category))
          return false;

        // Price filter (against basePrice from variant)
        if (filters.price.length > 0) {
          const price = product.basePrice || 0;
          const match = filters.price.some((range) => {
            if (range === "low") return price < 25;
            if (range === "mid") return price >= 25 && price <= 50;
            if (range === "high") return price > 50;
            return false;
          });
          if (!match) return false;
        }

        // Size filter (classified from dimension volume)
        if (
          filters.size.length > 0 &&
          !filters.size.includes(product.sizeClass)
        )
          return false;

        // Features filter
        if (filters.other.length > 0) {
          if (filters.other.includes("eco") && !product.ecoFriendly)
            return false;
          if (filters.other.includes("minimal") && !product.minimalWastage)
            return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.basePrice - b.basePrice;
        if (sort === "price-desc") return b.basePrice - a.basePrice;
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
      {/* ── Header ── */}
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
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <FilterPanel
              filters={filters}
              toggleFilter={toggleFilter}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </aside>

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center gap-3">
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

        {/* MOBILE FILTER DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-[85%] max-w-sm h-full bg-[#f8f7f4] shadow-2xl flex flex-col">
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
              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel
                  filters={filters}
                  toggleFilter={toggleFilter}
                  clearAllFilters={clearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
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

        {/* PRODUCTS GRID */}
        <main className="flex-1 min-w-0">
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-900 font-semibold text-lg">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-semibold text-yellow-600 underline underline-offset-2"
              >
                Reload page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => navigate(`/product/${product._id}`)}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && !error && (
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
