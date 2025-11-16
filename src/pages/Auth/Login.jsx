import { Link, useNavigate } from "react-router-dom";
import useAuthForm from "../../hooks/useAuthForm";

export default function Login() {
  const navigate = useNavigate();

  const {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleLogin,
  } = useAuthForm("login");

  async function submit(e) {
    e.preventDefault();
    const ok = await handleLogin();
    if (ok) navigate("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      {/* GLASS CARD */}
      <div className="w-full max-w-sm p-8 rounded-2xl shadow-xl
        bg-white/5 backdrop-blur-xl border border-white/10
        text-gray-200">

        <h1 className="text-3xl font-bold text-center mb-6
          bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <form onSubmit={submit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20
              text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20
              text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          {(localError || authError) && (
            <div className="text-red-300 text-sm bg-red-900/30
              p-2 rounded border border-red-700/40">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:opacity-90 transition active:scale-95">
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          New here?{" "}
          <Link
            to="/register"
            className="text-purple-300 font-medium hover:text-purple-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
