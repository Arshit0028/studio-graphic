import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import { useCartStore } from "../auth/cartStore";
import useAuthStore from "../auth/useAuthStore";

import Footer from "../components/Footer";
import TopSellingProducts from "../components/TopSellingProducts";

// ✅ API returns: "image": "http://3.110.128.94:8181/uploads/boxTypes/file.png"
// Strip backend origin → /uploads/boxTypes/file.png → Vercel rewrite handles it
const fixImageUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname; // → /uploads/boxTypes/file.png
    } catch {
      return null;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
};

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/eeeeee/333333?text=No+Image";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // ✅ not !!token

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedGsm, setSelectedGsm] = useState("");

  // ✅ Wait for token before fetching
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Axios interceptor attaches token automatically
        const response = await api.get(`/v1/box-types/${id}`);
        if (!isMounted) return;

        let rawData = response.data;
        let safeData = null;

        if (rawData && typeof rawData === "object") {
          if (rawData._id || rawData.name || rawData.title) {
            safeData = rawData;
          } else if (rawData.data) {
            if (Array.isArray(rawData.data) && rawData.data.length > 0) {
              safeData = rawData.data[0];
            } else if (typeof rawData.data === "object") {
              if (rawData.data._id || rawData.data.name || rawData.data.title) {
                safeData = rawData.data;
              } else if (rawData.data.data) {
                // ✅ Handle nested data.data shape
                const inner = rawData.data.data;
                if (Array.isArray(inner) && inner.length > 0)
                  safeData = inner[0];
                else if (inner._id || inner.name) safeData = inner;
              } else {
                safeData = Object.values(rawData.data).find(
                  (val) =>
                    val &&
                    typeof val === "object" &&
                    (val._id || val.name || val.title),
                );
              }
            }
          }

          if (!safeData) {
            safeData = Object.values(rawData).find(
              (val) =>
                val &&
                typeof val === "object" &&
                (val._id || val.name || val.title),
            );
          }
        }

        if (safeData) {
          // ✅ API uses single "image" field, not array
          const imageUrl = fixImageUrl(safeData.image) || FALLBACK_IMAGE;

          const formattedProduct = {
            id: safeData._id || safeData.id || id,
            name: safeData.name || safeData.title || "Untitled Box",
            sku: safeData.sku || `SKU-${id.slice(0, 5)}`,
            price: Number(safeData.price) || 0,
            oldPrice: safeData.oldPrice ? Number(safeData.oldPrice) : null,
            stock: safeData.stock !== undefined ? safeData.stock : true,
            description: safeData.description || "No description available.",
            type: safeData.type || "Packaging",
            material: safeData.material || "Standard Corrugated",
            useCase: safeData.useCase || "General Purpose",
            eco: safeData.eco || ["Recyclable"],
            // ✅ Single image field — wrap in array for gallery UI
            images: [imageUrl],
            dimensions: safeData.dimensions?.length
              ? safeData.dimensions
              : ["Standard Size"],
            gsmOptions: safeData.gsmOptions?.length
              ? safeData.gsmOptions
              : ["Standard GSM"],
          };

          setProduct(formattedProduct);
          setActiveImage(formattedProduct.images[0]);
          setSelectedDimension(formattedProduct.dimensions[0]);
          setSelectedGsm(formattedProduct.gsmOptions[0]);
        } else {
          throw new Error("Product data not found in response");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(
          "❌ Failed to fetch product:",
          err?.response?.data || err.message,
        );
        setError("Unable to load product details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductDetails();
    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const discount = useMemo(() => {
    if (!product || !product.oldPrice) return 0;
    return Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100,
    );
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    if (product) {
      addToCart({
        id: `${product.id}-${selectedDimension}-${selectedGsm}`,
        productId: product.id,
        sku: product.sku,
        title: product.name,
        price: product.price,
        image: activeImage,
        dimension: selectedDimension,
        gsm: selectedGsm,
      });
      alert("Added to Cart!");
    }
  }, [
    isLoggedIn,
    addToCart,
    product,
    selectedDimension,
    selectedGsm,
    activeImage,
    navigate,
    id,
  ]);

  const handleBuyNow = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    handleAddToCart();
    navigate("/cart");
  }, [isLoggedIn, handleAddToCart, navigate, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h3>
        <p className="text-gray-500 mb-6">
          {error || "This product doesn't exist or was removed."}
        </p>
        <button
          onClick={() => navigate("/allproducts")}
          className="bg-gray-900 text-white px-8 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <section className="bg-yellow-400 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">
            {product.type} Box
          </h2>
          <nav className="text-sm text-gray-800 mt-1 opacity-80">
            Home / {product.type} /{" "}
            <span className="font-semibold">{product.name}</span>
          </nav>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-visible">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all ${
                    activeImage === img
                      ? "border-yellow-500 ring-2 ring-yellow-200"
                      : "border-gray-100 hover:border-gray-300"
                  } overflow-hidden bg-gray-50`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-auto aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-gray-400 text-sm font-mono tracking-tighter">
                SKU: {product.sku}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
              <span className="text-3xl font-black text-gray-900">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    ₹{product.oldPrice}
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div
              className={`flex items-center gap-2 font-bold ${product.stock ? "text-emerald-600" : "text-rose-600"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${product.stock ? "bg-emerald-600" : "bg-rose-600"}`}
              ></span>
              {product.stock
                ? "In Stock & Ready to Ship"
                : "Currently Out of Stock"}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
              <div>
                <span className="text-gray-400 block mb-1">Material</span>
                <span className="font-bold text-gray-900">
                  {product.material}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Best For</span>
                <span className="font-bold text-gray-900">
                  {product.useCase}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.eco.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100"
                >
                  🌿 {tag}
                </span>
              ))}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">
                Select Dimensions
              </label>
              <div className="flex flex-wrap gap-2">
                {product.dimensions.map((dim, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDimension(dim)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      selectedDimension === dim
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-900 block mb-3 uppercase tracking-wider">
                Strength (GSM)
              </label>
              <div className="flex flex-wrap gap-2">
                {product.gsmOptions.map((gsm, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGsm(gsm)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      selectedGsm === gsm
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {gsm}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                disabled={!product.stock}
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                {isLoggedIn ? "Add to Cart" : "Login to Buy"}
              </button>
              <button
                disabled={!product.stock}
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 rounded-xl bg-yellow-400 text-gray-900 font-bold shadow-[0_4px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                {isLoggedIn ? "Buy It Now" : "Login to Buy"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <TopSellingProducts />
      <Footer />
    </div>
  );
};

export default React.memo(ProductDetails);
