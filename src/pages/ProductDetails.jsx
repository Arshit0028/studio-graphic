import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

import { useCartStore } from "../auth/cartStore";
import useAuthStore from "../auth/useAuthStore";

import Footer from "../components/Footer";
import TopSellingProducts from "../components/TopSellingProducts";

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/eeeeee/333333?text=No+Image";

/* ─── Fix image URL for both dev and production ─── */
const fixImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;

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

const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const addToCart = useCartStore((s) => s.addToCart);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [selectedGsm, setSelectedGsm] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/v1/boxes/related/69a7237d0b3d4d8d324a26af`);
      const item = res.data?.data?.related.find((b) => b.box?._id === id);

      // ✅ Apply fixImageUrl to every image
      const images = item.images?.map((i) => fixImageUrl(i.imageUrl)) || [
        FALLBACK_IMAGE,
      ];

      const allDimensions = [
        ...new Map(
          item.variants?.map((v) => [v.dimension?.label, v.dimension?.label]),
        ).values(),
      ].filter(Boolean);

      const allGsms = [
        ...new Set(item.variants?.map((v) => v.gsm).filter(Boolean)),
      ];

      const variants =
        item.variants?.map((v) => ({
          id: v._id,
          sku: v.sku,
          price: v.basePrice,
          moq: v.moq,
          gsm: v.gsm,
          dimension: v.dimension?.label,
        })) || [];

      const data = {
        id: item.box._id,
        name: item.box.name,
        category: item.box.category || "Box",
        description: item.box.longDescription,
        images,
        variants,
        allDimensions,
        allGsms,
        accordions: item.accordions || [],
        features: item.features || [
          "Free Shipping on all orders. No Terms & conditions Apply.",
          "In stock, ready to ship",
          "Eco-friendly",
        ],
      };

      setProduct(data);
      setActiveImage(images[0]);
      setSelectedDimension(allDimensions[0] || null);
      setSelectedGsm(allGsms[0] || null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const selectedVariant =
    product?.variants.find(
      (v) => v.dimension === selectedDimension && v.gsm === selectedGsm,
    ) ||
    product?.variants.find((v) => v.dimension === selectedDimension) ||
    product?.variants[0];

  const handleAdd = () => {
    if (!isLoggedIn) return navigate("/login");
    addToCart({
      id: product.id,
      title: product.name,
      price: selectedVariant?.price,
      image: activeImage,
    });
  };

  const prevImage = () => {
    const idx = product.images.indexOf(activeImage);
    setActiveImage(
      product.images[(idx - 1 + product.images.length) % product.images.length],
    );
  };

  const nextImage = () => {
    const idx = product.images.indexOf(activeImage);
    setActiveImage(product.images[(idx + 1) % product.images.length]);
  };

  const selectorBtn = (active) => ({
    padding: "5px 13px",
    border: active ? "1.5px solid #1a1a1a" : "1.5px solid #ccc",
    background: "#fff",
    borderRadius: 3,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#1a1a1a",
    fontWeight: active ? 600 : 400,
    whiteSpace: "nowrap",
  });

  const arrowBtn = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid #ccc",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 18,
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div style={{ height: 80, background: "#F5A623" }} />
        <div style={{ padding: "32px 16px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <div
              style={{
                width: "100%",
                maxWidth: 500,
                aspectRatio: "1/1",
                background: "#f3f3f3",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[80, 40, 60, 100, 60].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: 16,
                    background: "#f3f3f3",
                    borderRadius: 4,
                    width: `${w}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* YELLOW HEADER */}
      <div style={{ background: "#F5A623", padding: "18px 20px 16px" }}>
        <h2
          style={{
            fontSize: isMobile ? 18 : 20,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 4px",
          }}
        >
          {product.category}
        </h2>
        <p style={{ fontSize: 13, color: "#5a3a00", margin: 0 }}>
          Home &nbsp;/&nbsp; {product.category} &nbsp;/&nbsp;
          <span style={{ color: "#1a1a1a" }}>{product.name}</span>
        </p>
      </div>

      {/* PRODUCT BODY */}
      <div style={{ padding: isMobile ? "20px 16px" : "36px 20px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 20 : 24,
            alignItems: "flex-start",
          }}
        >
          {/* IMAGE BLOCK */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 10 : 14,
              width: isMobile ? "100%" : "auto",
              flexShrink: 0,
            }}
          >
            {/* Mobile: horizontal thumbs below image */}
            {isMobile && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      overflow: "hidden",
                      border:
                        activeImage === img
                          ? "2px solid #F5A623"
                          : "2px solid #ddd",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: "#fafafa",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main image */}
            <div
              style={{
                position: "relative",
                width: isMobile ? "100%" : 460,
                flexShrink: 0,
                background: "#fafafa",
                borderRadius: 4,
                overflow: "hidden",
                order: isMobile ? -1 : 0,
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} style={{ ...arrowBtn, left: 10 }}>
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    style={{ ...arrowBtn, right: 10 }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Desktop: vertical thumbs on left */}
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  order: -1,
                }}
              >
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 72,
                      height: 72,
                      overflow: "hidden",
                      border:
                        activeImage === img
                          ? "2px solid #F5A623"
                          : "2px solid #ddd",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: "#fafafa",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: isMobile ? 18 : 22,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {product.name}
            </h1>

            {/* ── PRICE ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? 26 : 30,
                  fontWeight: 800,
                  color: "#1a1a1a",
                  lineHeight: 1,
                }}
              >
                ₹{selectedVariant?.price ?? "—"}
              </span>
              {selectedVariant?.moq && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#92400E",
                    background: "#FEF3C7",
                    border: "1px solid #FDE68A",
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  MOQ: {selectedVariant.moq} units
                </span>
              )}
            </div>

            {/* Divider below price */}
            <div style={{ height: 1, background: "#f0f0f0" }} />

            {/* Description */}
            <p
              style={{
                fontSize: 14,
                color: "#555",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {product.description}
            </p>

            {/* Dimension */}
            {product.allDimensions.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 8 : 16,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    minWidth: 110,
                    flexShrink: 0,
                  }}
                >
                  Dimension
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.allDimensions.map((dim) => (
                    <button
                      key={dim}
                      onClick={() => setSelectedDimension(dim)}
                      style={selectorBtn(selectedDimension === dim)}
                    >
                      {dim}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GSM */}
            {product.allGsms.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 8 : 16,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    minWidth: 110,
                    flexShrink: 0,
                  }}
                >
                  Strength/GSM
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.allGsms.map((gsm) => (
                    <button
                      key={gsm}
                      onClick={() => setSelectedGsm(gsm)}
                      style={selectorBtn(selectedGsm === gsm)}
                    >
                      {gsm} GSM
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#F5A623",
                  border: "none",
                  borderRadius: 4,
                  color: "#fff",
                  fontSize: isMobile ? 14 : 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Add to cart
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#5a6270",
                  border: "none",
                  borderRadius: 4,
                  color: "#fff",
                  fontSize: isMobile ? 14 : 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Enquire for Bulk
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                style={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  border: "1.5px solid #ddd",
                  background: "#fff",
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: wishlisted ? "#e05555" : "#ccc",
                }}
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {product.features.map((f, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 16 }}>
                    {i === 0 ? "🚚" : i === 1 ? "📦" : "🌿"}
                  </span>
                  <span style={{ fontSize: 13, color: "#555" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#eee" }} />

            {/* Accordions */}
            {product.accordions.map((acc) => (
              <div key={acc._id} style={{ borderBottom: "1px solid #eee" }}>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === acc._id ? null : acc._id)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    textAlign: "left",
                  }}
                >
                  {acc.title}
                  <span
                    style={{
                      fontSize: 20,
                      color: "#999",
                      lineHeight: 1,
                      fontWeight: 300,
                      flexShrink: 0,
                    }}
                  >
                    {openAccordion === acc._id ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === acc._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          color: "#666",
                          lineHeight: 1.75,
                          paddingBottom: 12,
                          margin: 0,
                        }}
                      >
                        {acc.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <TopSellingProducts />
      <Footer />
    </div>
  );
};

export default ProductDetails;
