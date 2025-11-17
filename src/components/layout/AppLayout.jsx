import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  ShoppingCart,
  UserPlus,
  UserRoundCog,
  LogOut
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import Footer from "../common/Footer";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const tab = loc.pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl shadow-sm border-b border-white/10 dark:border-gray-700/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/VoiceCart.png"
              alt="vc-logo"
              className="w-8 h-8 rounded-full shadow-sm"
            />

            <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              VoiceCart
            </span>
          </Link>

          {/* USER MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              {!user ? (
                <UserPlus size={22} className="text-gray-900 dark:text-gray-200" />
              ) : (
                <UserRoundCog size={22} className="text-gray-900 dark:text-gray-200" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-xl p-2 border border-white/20 dark:border-gray-700/20 animate-fade">
                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      Register
                    </Link>
                  </>
                )}

                {user && (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Hello, <span className="font-semibold">{user.username}</span>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 pb-32 relative z-10">
        <Outlet />
        <Footer />
      </main>

      {/* FLOATING NAVIGATION ISLAND */}
      <footer className="fixed bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div
          className="
            pointer-events-auto
            flex justify-between items-center
            w-[93%] max-w-md
            px-6 py-3
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-2xl
            shadow-2xl
            rounded-full
            border border-white/10 dark:border-gray-700/30
            transition-all
          "
        >
          <Link to="/" className={`nav-btn ${tab === "/" ? "active" : ""}`}>
            <Home size={22} />
            <span>Home</span>
          </Link>

          <Link to="/search" className={`nav-btn ${tab === "/search" ? "active" : ""}`}>
            <Search size={22} />
            <span>Search</span>
          </Link>

          <Link to="/cart" className={`nav-btn ${tab === "/cart" ? "active" : ""}`}>
            <ShoppingCart size={22} />
            <span>Cart</span>
          </Link>
        </div>
      </footer>

      <style>{`
        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #6c6c6c;
          transition: all 0.2s ease;
        }
        .nav-btn.active {
          color: #3ea2ff;
          font-weight: 600;
          transform: scale(1.10);
        }
        @keyframes fade {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade {
          animation: fade 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
