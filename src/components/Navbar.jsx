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

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);

  const cartCount = useMemo(() => cart.length, [cart]);
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const handleProtectedNavigation = useCallback(
    (path) => {
      if (!isLoggedIn) navigate("/login");
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
    `relative text-[14px] font-semibold transition-all duration-300 py-2 !no-underline ${
      isActive ? "!text-gray-900" : "!text-gray-500 hover:!text-gray-900"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 !no-underline ${
      isActive
        ? "bg-gray-900/5 !text-gray-900 shadow-sm"
        : "!text-gray-500 hover:bg-gray-50 hover:!text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-[22px] font-black !text-gray-900 !no-underline tracking-tight hover:opacity-80 transition-opacity flex items-center"
            >
              Studio Graphics
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button
                onClick={() => toggleDropdown("shop")}
                className="flex items-center gap-1.5 text-[14px] font-semibold !text-gray-500 hover:!text-gray-900 transition-colors focus:outline-none bg-transparent border-none p-0 !no-underline"
              >
                Shop
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    dropdownOpen === "shop" ? "rotate-180 !text-gray-900" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                  <div className="absolute left-1/2 -translate-x-1/2 mt-5 w-64 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {categories.map((cat, idx) => (
                      <Link
                        key={idx}
                        to={`/allproducts?category=${encodeURIComponent(cat)}`}
                        className="block px-5 py-2.5 text-[14px] font-medium !text-gray-600 hover:bg-gray-50 hover:!text-gray-900 !no-underline transition-colors"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleCustomDesignScroll}
              className="text-[14px] font-semibold !text-gray-500 hover:!text-gray-900 !no-underline transition-colors focus:outline-none bg-transparent border-none p-0"
            >
              Custom Design
            </button>

            {/* PREMIUM BUTTON WITH GAP & SEPARATOR */}
            <div className="flex items-center pl-6 ml-2 border-l border-gray-200/80">
              <Link
                to="/studio"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-[14px] font-bold text-white transition-all duration-300 rounded-full bg-gray-900 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] hover:bg-black hover:shadow-[0_10px_25px_-6px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 !no-underline overflow-hidden"
              >
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                <span className="relative flex items-center">
                  <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                    🎨
                  </span>
                  Box Designer
                </span>
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6 ml-4">
              <button
                onClick={() => handleProtectedNavigation("/wishlist")}
                className="relative p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 focus:outline-none"
              >
                <svg
                  className="h-[22px] w-[22px]"
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
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleProtectedNavigation("/cart")}
                className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 focus:outline-none"
              >
                <svg
                  className="h-[22px] w-[22px]"
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
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile / Auth Desktop */}
            <div className="ml-2">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("user")}
                    className="flex items-center space-x-2.5 bg-white border border-gray-200 rounded-full py-1.5 pl-1.5 pr-4 hover:border-gray-300 hover:shadow-md transition-all duration-300 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-[13px] font-bold border border-gray-200">
                      {userInitial}
                    </div>
                    <span className="text-[14px] font-semibold !text-gray-800 max-w-[100px] truncate">
                      {userFirstName}
                    </span>
                  </button>

                  {dropdownOpen === "user" && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(null)}
                      />
                      <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2.5 text-[14px] font-medium !text-gray-700 hover:bg-gray-50 rounded-xl !no-underline transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          <span className="mr-3 opacity-70">👤</span> Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2.5 text-[14px] font-medium !text-gray-700 hover:bg-gray-50 rounded-xl !no-underline transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          <span className="mr-3 opacity-70">📦</span> Orders
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setDropdownOpen(null);
                          }}
                          className="w-full text-left flex items-center px-4 py-2.5 text-[14px] font-medium !text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <span className="mr-3 opacity-70">🚪</span> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-gray-900 text-[14px] font-bold rounded-full !text-gray-900 bg-transparent hover:bg-gray-900 hover:!text-white transition-all duration-300 !no-underline"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Header Elements */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleProtectedNavigation("/wishlist")}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="h-[22px] w-[22px]"
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
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleProtectedNavigation("/cart")}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="h-[22px] w-[22px]"
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
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 ml-1 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
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
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Floating Mobile Menu Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden flex justify-end">
            <div
              className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <div className="relative w-[85%] max-w-[360px] h-full bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="text-[18px] font-black !text-gray-900 tracking-tight">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
                <NavLink to="/" className={mobileLinkClass}>
                  Home
                </NavLink>

                <div className="bg-gray-50/50 rounded-2xl border border-gray-100/50 p-1">
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-semibold !text-gray-600 hover:bg-white hover:shadow-sm hover:!text-gray-900 transition-all"
                  >
                    Shop
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${mobileShopOpen ? "rotate-180 !text-gray-900" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {mobileShopOpen && (
                    <div className="pb-3 px-3 mt-1 space-y-1 animate-in fade-in slide-in-from-top-2">
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/allproducts?category=${encodeURIComponent(cat)}`}
                          className="block px-4 py-2.5 rounded-lg text-[14px] font-medium !text-gray-500 hover:bg-white hover:shadow-sm hover:!text-gray-900 !no-underline transition-all"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleCustomDesignScroll();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-4 py-3.5 rounded-xl text-[15px] font-semibold !text-gray-600 hover:bg-gray-50 hover:!text-gray-900 transition-colors"
                >
                  Custom Design
                </button>

                {/* MOBILE PREMIUM BUTTON */}
                <div className="pt-6 pb-2 px-1">
                  <Link
                    to="/studio"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center px-4 py-3.5 text-[15px] font-bold text-white transition-all duration-300 rounded-xl bg-gray-900 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] active:scale-[0.98] !no-underline"
                  >
                    <span className="mr-2">🎨</span> Box Designer
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-gray-50/80 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-[15px] font-bold flex-shrink-0 border border-gray-200">
                        {userInitial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold !text-gray-900 truncate">
                          {userFirstName}
                        </span>
                        <span className="text-[12px] text-gray-500">
                          Welcome back
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 rounded-xl text-[14px] font-semibold !text-gray-700 hover:bg-white hover:shadow-sm !no-underline transition-all"
                    >
                      <span className="mr-3 text-lg opacity-80">👤</span>{" "}
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 rounded-xl text-[14px] font-semibold !text-gray-700 hover:bg-white hover:shadow-sm !no-underline transition-all"
                    >
                      <span className="mr-3 text-lg opacity-80">📦</span> Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setIsOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-3 mt-2 rounded-xl text-[14px] font-bold !text-red-600 bg-red-50/80 hover:bg-red-100 transition-all"
                    >
                      <span className="mr-3 text-lg opacity-80">🚪</span> Sign
                      Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-3.5 text-[15px] font-bold rounded-xl text-white bg-gray-900 hover:bg-black shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] !no-underline transition-all active:scale-[0.98]"
                  >
                    Sign In
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
