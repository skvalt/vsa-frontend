import { useEffect, useState } from "react";
import Api from "../api/Api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Mic, Lightbulb, TrendingUp, Clock, Package, Tag, LayoutList } from "lucide-react";

import ProductMiniCard from "../components/common/ProductMiniCard.jsx";

export default function Home() {
  const { user } = useAuth();
  const { cart, loadCart } = useCart();

  const [reco, setReco] = useState([]);
  const [loadingReco, setLoadingReco] = useState(true);

  const [voiceText, setVoiceText] = useState("");
  const [commandStatus, setCommandStatus] = useState("");
  const [listening, setListening] = useState(false);

  const userId = user?._id || user?.id;

  const [lastFetchTime, setLastFetchTime] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const now = Date.now();

    if (now - lastFetchTime > 180000) {
      loadRecommendations();
      setLastFetchTime(now);
    }

    loadCart(userId);

  }, [userId]);


  async function loadRecommendations() {
    setLoadingReco(true);
    try {
      const data = await Api.Suggestions.getSuggestions(userId);
      setReco(data || []);
    } catch (err) {
      console.error("Suggestions error:", err);
      setReco([]);
    } finally {
      setLoadingReco(false);
    }
  }


  function voiceSearch() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Speech();
    rec.lang = "en-IN";
    rec.interimResults = false;

    setListening(true);
    setCommandStatus("");
    setVoiceText("");

    rec.start();

    rec.onresult = async (e) => {
      const speech = e.results[0][0].transcript;
      setVoiceText(speech);

      try {
        const { text: eng } = await Api.Translate.toEnglish(speech);
        const parsed = await Api.Voice.parse(eng);

        const intent = parsed.intent;
        const qty = parsed.entities?.quantity || "1";
        const product = parsed.entities?.product;
        const matches = parsed.matches || [];

        if (!intent || intent === "unknown") {
          setCommandStatus("I didn't understand what to do.");
          return;
        }

        if (!product && matches.length === 0) {
          setCommandStatus("Couldn't detect the product.");
          return;
        }

        await Api.Voice.apply({
          userId,
          intent,
          entities: parsed.entities,
          matches
        });

        await loadCart(userId);

        if (intent === "add_item") setCommandStatus(`Added ${qty} × ${product}`);
        else if (intent === "remove_item") setCommandStatus(`Removed ${qty} × ${product}`);
        else if (intent === "update_quantity") setCommandStatus(`Updated ${product} to quantity ${qty}`);
        else setCommandStatus("Command applied.");
      } catch (err) {
        console.error("Voice command failed:", err);
        setCommandStatus(err.message || "Command failed");
      }
    };

    rec.onerror = () => setCommandStatus("Voice recognition error");
    rec.onend = () => setListening(false);
  }

  function goCategory(cat) {
    window.location.href = `/search?category=${encodeURIComponent(cat)}`;
  }

  return (
    <div className="pb-32 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* PREMIUM TOP SECTION */}
      <div className="relative mt-6 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-sky-600/20 blur-3xl"></div>
        
        <div className="relative flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Welcome, {user?.username}
              </h2>
            </div>
            <p className="text-gray-400 text-base">
              Your smart shopping assistant is ready.
            </p>
          </div>

          <button
            onClick={voiceSearch}
            className={`relative group ${
              listening 
                ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                : "bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
            } p-4 rounded-2xl text-white shadow-2xl active:scale-95 transition-all duration-300 border border-white/20`}
          >
            {listening && (
              <div className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-20"></div>
            )}
            <Mic size={24} className="relative z-10" />
          </button>
        </div>
      </div>

      {voiceText && (
        <div className="mb-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-blue-500/20 p-4 rounded-2xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Mic size={18} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">You said:</div>
                <div className="text-base text-cyan-300 font-medium">{voiceText}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {commandStatus && (
        <div className="mb-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl border border-green-500/30 p-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-300 font-medium">{commandStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-100">Categories</h3>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {["Vegetables", "Dairy", "Bakery", "Snacks", "Personal Care"].map((c, idx) => (
            <button
              key={c}
              onClick={() => goCategory(c)}
              className="group relative px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/50 text-blue-100 text-sm font-medium whitespace-nowrap shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                animation: `slideIn 0.4s ease-out ${idx * 0.05}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-blue-500/30">
            <Lightbulb className="text-blue-400" size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100">Recommended for You</h3>
            <p className="text-xs text-gray-500">Curated just for you</p>
          </div>
        </div>

        {loadingReco ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-2xl"></div>
            <div className="relative bg-gray-900/40 border border-blue-500/20 rounded-2xl p-8 text-center backdrop-blur-xl">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center animate-pulse">
                <Package className="text-blue-400" size={24} />
              </div>
              <div className="text-gray-400 text-sm">Loading recommendations…</div>
            </div>
          </div>
        ) : reco.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-2xl"></div>
            <div className="relative bg-gray-900/40 border border-blue-500/20 rounded-2xl p-8 text-center backdrop-blur-xl">
              <div className="text-gray-400 text-sm">No recommendations right now.</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {reco.map((p) => (
              <ProductMiniCard key={p.id} product={{ ...p, userId }} />
            ))}
          </div>
        )}
      </div>

      {/* TRENDING */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-sky-600/20 flex items-center justify-center border border-cyan-500/30">
            <TrendingUp className="text-cyan-400" size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100">People Also Bought</h3>
            <p className="text-xs text-gray-500">Trending picks</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {["Chocolate", "Chips", "Cold Drink", "Bread", "Soap"].map((t, idx) => (
            <div
              key={t}
              className="group relative min-w-[140px]"
              style={{
                animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-sky-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 p-5 rounded-2xl shadow-xl text-gray-100 text-sm font-medium text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 flex items-center justify-center">
                  <Tag className="text-cyan-400" size={20} />
                </div>
                {t}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600/20 to-blue-600/20 flex items-center justify-center border border-sky-500/30">
            <Clock className="text-sky-400" size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100">Recently Added</h3>
            <p className="text-xs text-gray-500">Your latest items</p>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 to-blue-600/10 blur-2xl"></div>
            <div className="relative bg-gray-900/40 border border-sky-500/20 rounded-2xl p-8 text-center backdrop-blur-xl">
              <div className="text-gray-400 text-sm">Your cart is empty.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.items.slice(0, 5).map((i, idx) => (
              <div
                key={i.id || i.name}
                className="group relative"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 to-blue-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-sky-500/20 group-hover:border-sky-400/40 p-5 rounded-2xl shadow-xl flex justify-between items-center transition-all duration-300 group-hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 flex items-center justify-center border border-sky-500/20">
                      <LayoutList className="text-sky-400" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-100 text-base">{i.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Quantity: {i.quantity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      ₹{i.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}