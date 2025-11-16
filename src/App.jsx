import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import ProductSearch from "./pages/ProductSearch";
import CartPage from "./pages/CartPage";

import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/common/Toast";

import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">

      <Routes>

        {/* PUBLIC ROUTES ALWAYS UNDER LAYOUT */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProductSearch />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* DEFAULT FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast />
    </div>
  );
}
