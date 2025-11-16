import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, LogIn, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

import Footer from "../common/Footer";
import { BackgroundCircles } from "../ui/background-circles";

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
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden z-10">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundCircles variant="secondary" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl shadow-sm border-b border-white/10 dark:border-gray-700/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          <Link
            to="/"
            className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent"
          >
            VoiceCart
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              {user ? (
                <User size={22} className="text-gray-900 dark:text-gray-200" />
              ) : (
                <LogIn size={22} className="text-gray-900 dark:text-gray-200" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-xl p-2 border border-white/20 dark:border-gray-700/20 animate-fade">

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
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 pb-32 relative z-20">
        <Outlet />
        <Footer />
      </main>

      {/* BOTTOM NAV */}
      <footer className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl border-t border-white/20 dark:border-gray-700/20 px-6 py-3 flex justify-between">

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
          color: #777;
          transition: all 0.2s ease;
        }
        .nav-btn.active {
          color: #6d28d9;
          font-weight: 600;
          transform: scale(1.08);
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
