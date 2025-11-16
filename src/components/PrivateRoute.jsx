import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading…
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
