import React, { useMemo, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../auth/useAuthStore";
import { useCartStore } from "../auth/cartStore";
import { useWishlistStore } from "../auth/wishlistStore";
import { categories } from "../constants/categories";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // ✅ use isLoggedIn not token
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  const cartCount = useMemo(() => cart.length, [cart]);
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const handleProtectedNavigation = useCallback(
    (path) => {
      if (!isLoggedIn)
        navigate("/login"); // ✅ use isLoggedIn
      else navigate(path);
    },
    [isLoggedIn, navigate],
  );

  const handleCustomDesignScroll = () => {
    if (location.pathname !== "/") {
      navigate("/#customdesign");
    } else {
      const section = document.getElementById("customdesign");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userFirstName = user?.name ? user.name.split(" ")[0] : "Profile";

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(null);
    setMobileShopOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleDropdown = (name) => {
    setDropdownOpen(dropdownOpen === name ? null : name);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 !no-underline ${
      isActive ? "!text-gray-900" : "!text-gray-500 hover:!text-gray-900"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium !no-underline ${
      isActive
        ? "bg-gray-50 !text-gray-900"
        : "!text-gray-500 hover:bg-gray-50 hover:!text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-black !text-gray-900 !no-underline tracking-tight hover:opacity-80 transition-opacity"
            >
              Studio Graphics
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <div className="relative group">
              <button
                onClick={() => toggleDropdown("shop")}
                className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors focus:outline-none bg-transparent border-none p-0"
              >
                Shop
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dropdownOpen === "shop" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen === "shop" && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(null)}
                  />
                  <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white border border-gray-100 ring-1 ring-black ring-opacity-5 z-20 py-2">
                    {categories.map((cat, idx) => (
                      <Link
                        key={idx}
                        to={`/allproducts?category=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2.5 text-sm !text-gray-600 hover:bg-gray-50 hover:!text-gray-900 !no-underline transition-colors"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* <NavLink
              to="/allproducts"
              className="block px-4 py-2.5 text-sm !text-gray-600 hover:bg-gray-50 hover:!text-gray-900 !no-underline transition-colors"
            >
              Box Types
            </NavLink> */}

            <NavLink
              to="/#custom-design"
              onClick={handleCustomDesignScroll}
              className="block px-4 py-2.5 text-sm !text-gray-600 hover:bg-gray-50 hover:!text-gray-900 !no-underline transition-colors"
            >
              Custom Design
            </NavLink>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleProtectedNavigation("/wishlist")}
                className="relative group p-1"
              >
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleProtectedNavigation("/cart")}
                className="relative group p-1"
              >
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="ml-4">
              {isLoggedIn ? ( // ✅ use isLoggedIn
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("user")}
                    className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-1.5 pr-4 hover:bg-white hover:shadow-md transition-all focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {userInitial}
                    </div>
                    <span className="text-sm font-semibold !text-gray-700 max-w-[100px] truncate">
                      {userFirstName}
                    </span>
                  </button>

                  {dropdownOpen === "user" && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-20">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 !no-underline"
                          onClick={() => setDropdownOpen(null)}
                        >
                          👤 My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 !no-underline"
                          onClick={() => setDropdownOpen(null)}
                        >
                          📦 My Orders
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setDropdownOpen(null);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-gray-900 hover:bg-black transition-transform hover:scale-105 !no-underline shadow-lg shadow-gray-900/20"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => handleProtectedNavigation("/wishlist")}
              className="relative p-1"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleProtectedNavigation("/cart")}
              className="relative p-1"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                <span className="text-lg font-black text-gray-900 tracking-tight">
                  Studio Graphics
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <NavLink to="/" className={mobileLinkClass}>
                  Home
                </NavLink>

                <div>
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Shop
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {mobileShopOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-yellow-400 space-y-1">
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/allproducts?category=${encodeURIComponent(cat)}`}
                          className="block px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 !no-underline transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink to="/allproducts" className={mobileLinkClass}>
                  Box Types
                </NavLink>

                <button
                  type="button"
                  onClick={() => {
                    handleCustomDesignScroll();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Custom Design
                </button>
              </div>

              <div className="border-t border-gray-100 px-4 py-4">
                {isLoggedIn ? ( // ✅ use isLoggedIn
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <div className="h-9 w-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {userInitial}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {userFirstName}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 !no-underline"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 !no-underline"
                    >
                      📦 My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setIsOpen(false);
                      }}
                      className="w-full text-left block px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full px-6 py-3 text-sm font-bold rounded-full text-white bg-gray-900 hover:bg-black !no-underline transition-colors"
                  >
                    Login / Signup
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}

export default React.memo(Navbar);
