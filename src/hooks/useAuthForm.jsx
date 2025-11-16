import { useState } from "react";
import { useAuth } from "./useAuth";

export default function useAuthForm(type = "login") {
  const { login, register, authError, setAuthError } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // LOGIN
  async function handleLogin() {
    setLocalError(null);
    setAuthError(null);

    if (!form.username || !form.password) {
      setLocalError("Username and password are required");
      return false;
    }

    const ok = await login(form.username, form.password);

    if (ok) {
      setLocalError(null);
      setAuthError(null);
    }

    return ok;
  }

  // REGISTER
  async function handleRegister() {
    setLocalError(null);
    setAuthError(null);
    setLoading(true);

    if (!form.username || !form.email || !form.password) {
      setLocalError("All fields are required");
      setLoading(false);
      return false;
    }

    const ok = await register(form.username, form.email, form.password);

    // FIX: CLEAN ERRORS ON SUCCESS
    if (ok) {
      setLocalError(null);
      setAuthError(null);
    }

    setLoading(false);
    return ok;
  }

  return {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleLogin,
    handleRegister,
  };
}
