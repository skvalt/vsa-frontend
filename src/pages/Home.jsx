import { useEffect, useState } from "react";
import Api from "../api/Api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const { cart, loadCart, addToCart } = useCart();

  const [reco, setReco] = useState([]);
  const [loadingReco, setLoadingReco] = useState(true);

  const [voiceText, setVoiceText] = useState("");
  const [commandStatus, setCommandStatus] = useState("");
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();

  const userId = user?._id || user?.id;


  useEffect(() => {
    if (!userId) return;
    loadRecommendations();
    loadCart(userId);
 
  }, [userId]);

  async function loadRecommendations() {
    try {
      const data = await Api.Suggestions.getSuggestions(userId);
      setReco(data || []);
    } catch (err) {
      console.error("Suggestions error:", err);
      setReco([]);
    }
    setLoadingReco(false);
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

    // UI
    setListening(true);
    setCommandStatus("");
    setVoiceText("");

    rec.start();

    rec.onresult = async (e) => {
  const speech = e.results[0][0].transcript;
  setVoiceText(speech);

  try {
    // Translate Hinglish → English
    const { text: eng } = await Api.Translate.toEnglish(speech);

    // Parse command
    const parsed = await Api.Voice.parse(eng);

    const intent = parsed.intent;
    const qty = parsed.entities?.quantity || "1";
    const product = parsed.entities?.product;
    const matches = parsed.matches || [];

    if (!intent || intent === "unknown") {
      setCommandStatus("I didn’t understand what to do.");
      return;
    }

    if (!product && matches.length === 0) {
      setCommandStatus("Couldn't detect the product.");
      return;
    }

    // APPLY to backend
    const applied = await Api.Voice.apply({
      userId: userId,
      intent: intent,
      entities: parsed.entities,
      matches: matches
    });

    // Refresh cart
    await loadCart(userId);

    // UI message based on intent
    if (intent === "add_item") {
      setCommandStatus(`Added ${qty} × ${product}`);
    } else if (intent === "remove_item") {
      setCommandStatus(`Removed ${qty} × ${product}`);
    } else if (intent === "update_quantity") {
      setCommandStatus(`Updated ${product} to quantity ${qty}`);
    } else {
      setCommandStatus("Command applied.");
    }
  } catch (err) {
    console.error("Voice command failed:", err);
    setCommandStatus(err.message || "Command failed");
  }
};



    rec.onerror = (ev) => {
      console.error("Speech error", ev);
      setCommandStatus("Voice recognition error");
    };

    rec.onend = () => {
      setListening(false);
    };
  }

  function goCategory(cat) {
    navigate(`/search?category=${encodeURIComponent(cat)}`);
  }

  return (
    <div className="pb-32">

      {/* TOP */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">
            Welcome, {user?.username}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Your smart shopping assistant is ready.
          </p>
        </div>

        <button
          onClick={voiceSearch}
          className={`p-3 rounded-full ${listening ? "bg-green-600 animate-pulse" : "bg-purple-600 hover:bg-purple-700"} text-white shadow-lg active:scale-95 transition`}
          aria-pressed={listening}
          title={listening ? "Listening…" : "Tap to speak"}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* VOICE STATUS */}
      {voiceText && (
        <div className="mt-6 p-3 bg-gray-800 text-gray-200 rounded-xl text-sm">
          You said: <span className="text-indigo-300">{voiceText}</span>
        </div>
      )}

      {commandStatus && (
        <div className="mt-3 p-3 bg-green-700/40 text-green-300 rounded-xl text-sm">
          {commandStatus}
        </div>
      )}

      {/* CATEGORIES */}
      <div className="flex gap-3 overflow-x-auto mt-6 no-scrollbar">
        {["Vegetables", "Dairy", "Bakery", "Snacks", "Personal Care"].map(
          (c) => (
            <button
              key={c}
              onClick={() => goCategory(c)}
              className="px-4 py-2 rounded-full bg-purple-700 text-purple-100 text-sm whitespace-nowrap shadow hover:bg-purple-800 transition"
            >
              {c}
            </button>
          )
        )}
      </div>

      {/* RECOMMENDED */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-100 mb-3">
          Recommended for You
        </h3>

        {loadingReco ? (
          <div className="text-gray-400 text-sm">Loading recommendations…</div>
        ) : reco.length === 0 ? (
          <div className="text-gray-400 text-sm">No recommendations right now.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {reco.map((p) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="font-medium text-gray-100">{p.name}</div>
                <div className="text-xs text-gray-400">{p.brand || "Generic"}</div>
                <div className="text-purple-300 font-medium mt-1">₹{p.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRENDING */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-100 mb-3">People Also Bought</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {["Chocolate", "Chips", "Cold Drink", "Bread", "Soap"].map((t) => (
            <div key={t} className="min-w-[120px] bg-gray-800 p-4 rounded-xl shadow text-gray-100 text-sm text-center">
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* RECENT */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-100 mb-3">Recently Added</h3>

        {cart.items.length === 0 ? (
          <div className="text-gray-400 text-sm">Your cart is empty.</div>
        ) : (
          <div className="space-y-3">
            {cart.items.slice(0, 5).map((i) => (
              <div key={i.id || i.name} className="bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-100">{i.name}</div>
                  <div className="text-xs text-gray-400">Qty: {i.quantity}</div>
                </div>
                <div className="text-purple-300 font-semibold">₹{i.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
