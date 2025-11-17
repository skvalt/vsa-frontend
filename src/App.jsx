import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ProductSearch from "./pages/ProductSearch";
import CartPage from "./pages/CartPage";

import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/common/Toast";

import AppLayout from "./components/layout/AppLayout";
import { BackgroundCircles } from "./components/ui/background-circles";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">

      {/* STATIC BACKGROUND AT ROOT LEVEL */}
      <BackgroundCircles className="absolute inset-0 z-0" />

      {/* APP CONTENT ABOVE BACKGROUND */}
      <div className="relative z-10">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<ProductSearch />} />
          </Route>

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toast />
      </div>
    </div>
  );
}
