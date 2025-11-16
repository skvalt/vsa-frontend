import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { useCart } from "../contexts/CartContext";
import { Mic } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";



function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ProductSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const qparams = new URLSearchParams(location.search);

  const [query, setQuery] = useState(qparams.get("voice") || qparams.get("q") || "");
  const [transcript, setTranscript] = useState(qparams.get("voice") || "");
  const [results, setResults] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const [loading, setLoading] = useState(false);

  const [maxPrice, setMaxPrice] = useState(2000);
  const [category, setCategory] = useState(qparams.get("category") || "all");

  const { addToCart } = useCart();
  const micRef = useRef(null);

  
  const { user } = useAuth();
  
  useEffect(() => {
    if (!results) {
      setFiltered(null);
      return;
    }
    let temp = [...results];
    if (category && category !== "all") {
      temp = temp.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }
    temp = temp.filter((p) => (p.price || 0) <= maxPrice);
    setFiltered(temp);
  }, [results, category, maxPrice]);

  useEffect(() => {
    const cat = qparams.get("category");
    const voice = qparams.get("voice");
    const q = qparams.get("q");

    if (cat) {
      setCategory(cat);
      setQuery(cat); 
      setTranscript(""); 
      setTimeout(() => doSearch(cat, { isCategory: true }), 200);
      return;
    }

    if (voice) {
      setQuery(voice);
      setTranscript(voice);
      setTimeout(() => doSearch(voice, { isCategory: false }), 250);
      return;
    }

    if (q) {
      setQuery(q);
      setTimeout(() => doSearch(q, { isCategory: false }), 150);
    }
   
  }, []); 


  async function doSearch(custom, opts = { isCategory: false }) {
    const finalQuery = (custom ?? query ?? "").trim();
    if (!finalQuery) return;
    setLoading(true);
    setFiltered(null);
    setResults(null);

    
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (!opts.isCategory) params.set("q", finalQuery);
    navigate({ pathname: "/search", search: params.toString() }, { replace: true });

    try {
      let data;
      if (opts.isCategory) {
        
        data = await Api.Products.getByCategory(finalQuery);
      } else {
        data = await Api.Products.search(finalQuery);
      }
      setResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Voice input: sets transcript + query + auto-search
  function voiceInput() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Speech();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.start();

   
    if (micRef.current) micRef.current.classList.add("animate-pulse");

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setQuery(text);
      setTimeout(() => doSearch(text, { isCategory: false }), 200);
    };

    rec.onerror = () => {
      if (micRef.current) micRef.current.classList.remove("animate-pulse");
    };

    rec.onend = () => {
      if (micRef.current) micRef.current.classList.remove("animate-pulse");
    };
  }

  
  async function handleAdd(p) {
  try {
    // Get userId from AuthContext
    const userId = user?._id || user?.id;

    if (!userId) {
      alert("Please login first.");
      return;
    }

    await addToCart({
      userId,
      productId: p.id || p._id,
      name: p.name,
      quantity: 1,
      price: p.price,
      unit: p.unit,
      category: p.category,
    });

    const el = document.getElementById(`prod-${p.id}`);
    if (el) {
      el.classList.add("ring-2", "ring-purple-400");
      setTimeout(() => el.classList.remove("ring-2", "ring-purple-400"), 600);
    }
  } catch (e) {
    console.error("Add to cart failed", e);
    alert("Failed to add to cart.");
  }
}


  return (
    <div className="pb-32">

      {/* search row */}
      <div className="flex gap-3 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
          placeholder="Search products (try 'biscuit' or say it)…"
          className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 transition"
        />

        {/* mic with ref */}
        <button
          ref={micRef}
          onClick={voiceInput}
          title="Voice search"
          className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg"
        >
          <Mic size={18} />
        </button>

        <button
          onClick={() => doSearch()}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-md active:scale-95"
        >
          Search
        </button>
      </div>

      {/* transcript / small helper row */}
      {transcript && (
        <div className="mt-3 flex items-center gap-3">
          <div className="text-xs text-gray-400">Voice:</div>
          <div className="text-sm px-3 py-1 rounded-full bg-gray-800 text-gray-100 shadow-sm">
            {transcript}
          </div>
          <button
            onClick={() => {
              setTranscript("");
              setQuery("");
              setResults(null);
              setFiltered(null);
              navigate("/search", { replace: true });
            }}
            className="ml-2 text-xs text-red-400"
          >
            Clear
          </button>
        </div>
      )}

      {/* filters */}
      {results && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // if user picks a category from select, run category endpoint
                if (e.target.value && e.target.value !== "all") {
                  setQuery(e.target.value);
                  doSearch(e.target.value, { isCategory: true });
                } else {
                  // fallback to showing full results (or clear)
                  setResults([]);
                }
              }}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="vegetables">Vegetables</option>
              <option value="snacks">Snacks</option>
              <option value="personal care">Personal Care</option>
              <option value="dairy">Dairy</option>
              <option value="bakery">Bakery</option>
            </select>

            <div className="flex-1" />

            <label className="text-xs text-gray-500 dark:text-gray-400">Max Price: ₹{maxPrice}</label>
          </div>

          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* loader */}
      {loading && (
        <div className="mt-6 text-center text-gray-500">Searching…</div>
      )}

      {/* results grid */}
      {filtered && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {filtered.length === 0 && (
            <div className="col-span-2 text-center text-gray-500">No products found.</div>
          )}

          {filtered.map((p) => (
            <div
              id={`prod-${p.id}`}
              key={p.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.brand || "Generic"} • {p.category}</div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-indigo-600 dark:text-indigo-300 font-semibold">₹{p.price ?? "-"}</div>

                <button
                  onClick={() => handleAdd(p)}
                  className="px-3 py-1 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-sm active:scale-95 shadow"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
