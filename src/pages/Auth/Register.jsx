import { Link, useNavigate } from "react-router-dom";
import useAuthForm from "../../hooks/useAuthForm";
import { UserPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleRegister,
  } = useAuthForm("register");

  async function submit(e) {
    e.preventDefault();
    const ok = await handleRegister();
    if (ok) setTimeout(() => navigate("/home"), 150);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6
      bg-gradient-to-br from-[#0a0f1f] via-[#1b2343] to-[#0a0f1f]">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-400/10 to-blue-600/10 blur-3xl"></div>

      <div className="relative w-full max-w-sm p-8 rounded-2xl shadow-2xl
        bg-white/5 backdrop-blur-2xl border border-white/10 text-gray-200
        animate-[fadeUp_0.6s_ease]">

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500
            flex items-center justify-center shadow-xl shadow-purple-500/40 mb-3">
            <UserPlus size={32} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400
            bg-clip-text text-transparent">
            Create Account
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20
              text-gray-100 placeholder-gray-400
              focus:ring-2 focus:ring-purple-500 focus:bg-white/20 transition-all"
            value={form.username || ""}
            onChange={(e) => updateField("username", e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20
              text-gray-100 placeholder-gray-400
              focus:ring-2 focus:ring-purple-500 focus:bg-white/20 transition-all"
            value={form.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20
              text-gray-100 placeholder-gray-400
              focus:ring-2 focus:ring-purple-500 focus:bg-white/20 transition-all"
            value={form.password || ""}
            onChange={(e) => updateField("password", e.target.value)}
          />

          {(localError || authError) && (
            <div className="text-red-300 text-sm bg-red-900/40
              p-2 rounded-xl border border-red-700/40">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600
              hover:opacity-90 transition-all active:scale-95 shadow-xl
              hover:shadow-purple-500/40">
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-5">
          Already have an account?{" "}
          <Link to="/login"
            className="text-purple-300 font-medium hover:text-purple-200">
            Login
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
