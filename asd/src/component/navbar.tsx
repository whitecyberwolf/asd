// ──────────────────────────────────────────────
// src/components/NavBar.tsx   (updated)
// ──────────────────────────────────────────────
import React, { useRef, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

// local components
import LoginModal from "./navbar/LoginModal";
import CartDrawer from "./navbar/CartDrawer"; // re‑use drawer from previous step
import UserAccountDropdown from "./navbar/UserAccountDropdown";
import { useCart } from "../contexts/CartContext";   // NEW

// ---- Hook to close dropdowns on outside click ----
function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ---- Simple Dropdown component ----
const Dropdown: React.FC<{
  label: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  toggleDropdown: () => void;
}> = ({ label, items, isOpen, toggleDropdown }) => (
  <div className="relative">
    <button
      onClick={toggleDropdown}
      className="flex items-center gap-1 text-sm font-medium text-black hover:text-[#9c7a56] transition"
    >
      {label.toUpperCase()}
      <svg
        className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="absolute left-0 mt-2 bg-white border shadow-md rounded-md w-48 z-20">
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-[#9c7a56]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// ---- Main NavBar ----
const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const auth = getAuth();
  const user = auth.currentUser;

  // cart from context
  const { items: cartItems } = useCart();

  // dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (key: string) =>
    setActiveDropdown((prev) => (prev === key ? null : key));

  // language dropdown
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(langRef, () => setShowLang(false));

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLang(false);
  };

  // modal + drawer
  const [loginOpen, setLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LEFT nav */}
          <div className="flex items-center space-x-6">
            <Dropdown
              label="Men's"
              items={[
                { label: "Chains", href: "/ChainsDetails" },
                { label: "Bracelet", href: "/BraceletList" },
                { label: "Ring", href: "/RingList" },
                { label: "Pendent", href: "/PendentList" },
                { label: "Glasses", href: "/GlassesList" },
                { label: "Earring", href: "/EarringList" },
              ]}
              isOpen={activeDropdown === "men"}
              toggleDropdown={() => toggleDropdown("men")}
            />
            <Dropdown
              label="Women's"
              items={[
                { label: "Chains", href: "/ChainsDetails" },
                { label: "Bracelet", href: "/BraceletList" },
                { label: "Ring", href: "/RingList" },
                { label: "Earring", href: "/EarringList" },
                { label: "Glasses", href: "/GlassesList" },
              ]}
              isOpen={activeDropdown === "women"}
              toggleDropdown={() => toggleDropdown("women")}
            />
            <Link to="/personalized" className="text-sm font-medium hover:text-[#9c7a56]">
              PERSONALIZED
            </Link>
            <Link to="/BlogSection" className="text-sm font-medium hover:text-[#9c7a56]">
              BLOGS
            </Link>
            <Dropdown
              label="More at ASD"
              items={[
                { label: "About Us", href: "/about-us" },
                { label: "Contact", href: "/contact" },
              ]}
              isOpen={activeDropdown === "more"}
              toggleDropdown={() => toggleDropdown("more")}
            />
          </div>

          {/* CENTER logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/Group31.png" alt="ASD" className="h-20 object-contain" />
          </Link>

          {/* RIGHT icons */}
          <div className="flex items-center space-x-6">
            {/* language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-2 text-sm px-3 py-1 border rounded-lg hover:text-[#9c7a56]"
              >
                <HiOutlineGlobeAlt className="w-4 h-4" /> English
                <svg
                  className={`w-3 h-3 transition-transform ${showLang ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-32 z-20">
                  {[
                    { code: "en", label: "English" },
                    { code: "fr", label: "French" },
                    { code: "zh-HK", label: "Chinese" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLanguage(l.code)}
                      className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* wishlist */}
            <button onClick={() => alert("Navigate to wishlist")}
              className="hover:text-[#9c7a56]">
              <AiOutlineHeart className="w-5 h-5" />
            </button>

            {/* user */}
            {user ? (
              <UserAccountDropdown />
            ) : (
              <button onClick={() => setLoginOpen(true)} className="hover:text-[#9c7a56]">
                <FiUser className="w-5 h-5" />
              </button>
            )}

            {/* cart */}
            <div className="relative">
              <button onClick={() => setDrawerOpen(true)} className="hover:text-[#9c7a56]">
                <FaShoppingBag className="w-5 h-5" />
              </button>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default NavBar;
