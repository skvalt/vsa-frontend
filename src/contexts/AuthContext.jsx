import { createContext, useContext, useEffect, useState } from "react";
import Api, { getToken, clearToken, setToken } from "../api/Api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState(null);

  // RESTORE USER ON PAGE LOAD
  useEffect(() => {
    restoreUser();
  }, []);

  async function restoreUser() {
    const token = getToken();
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const profile = await Api.Auth.getProfile();
      setUser(profile);
      localStorage.setItem("vsa_user", JSON.stringify(profile));
    } catch {
      clearToken();
      setUser(null);
      localStorage.removeItem("vsa_user");
    }

    setLoadingUser(false);
  }

  // LOGIN
  async function login(username, password) {
    try {
      const res = await Api.Auth.login(username, password);
      if (res?.token) setToken(res.token);

      const profile = await Api.Auth.getProfile();
      setUser(profile);
      setAuthError(null);

      localStorage.setItem("vsa_user", JSON.stringify(profile));
      return true;
    } catch {
      setAuthError("Invalid username or password");
      return false;
    }
  }

  // REGISTER
  async function register(username, email, password) {
    try {
      const res = await Api.Auth.register(username, email, password);
      if (res?.token) setToken(res.token);

      const profile = await Api.Auth.getProfile();
      setUser(profile);
      setAuthError(null);

      localStorage.setItem("vsa_user", JSON.stringify(profile));
      return true;
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      return false;
    }
  }

  // LOGOUT
  function logout() {
    clearToken();
    setUser(null);
    localStorage.removeItem("vsa_user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
