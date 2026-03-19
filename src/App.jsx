import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import api from "./api/axios";
import useAuthStore from "./auth/useAuthStore";

// 🔹 1. STANDARD IMPORT FOR THE LCP PAGE (HOME)
import Home from "./pages/Home";

// 🔹 2. LAZY LOAD ALL OTHER ROUTES
const AllProducts = lazy(() => import("./pages/AllProducts"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Order"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="w-full h-1 bg-gray-100 overflow-hidden">
    <div className="w-full h-full bg-gray-900 animate-progress origin-left"></div>
  </div>
);

function App() {
  const { token, setToken } = useAuthStore();

  // 🔹 3. FETCH GUEST TOKEN ON APP LOAD IF NO TOKEN EXISTS
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        try {
          const username = import.meta.env.VITE_BASIC_USER;
          const password = import.meta.env.VITE_BASIC_PASS;

          const res = await api.post(
            "/v1/users/guest-login",
            {},
            {
              auth: { username, password },
            },
          );

          // Handle different possible response shapes from backend
          const guestToken =
            res.data?.token || res.data?.accessToken || res.data?.data?.token;

          if (guestToken) {
            setToken(guestToken);
          }
        } catch (err) {
          console.error(
            "❌ Guest token fetch failed:",
            err?.response?.data || err.message,
          );
        }
      }
    };

    initAuth();
  }, []); // Runs once on mount

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <div className="page-wrapper">
        {/* 🔹 4. SUSPENSE WRAPPER FOR SMOOTH CHUNKING */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes — require actual login */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <div className="text-center mt-5">404 - Page Not Found</div>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default React.memo(App);
