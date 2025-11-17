import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { Mic } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ProductMiniCard from "../components/common/ProductMiniCard.jsx";

export default function ProductSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const qparams = new URLSearchParams(location.search);

  const { user } = useAuth();
  const userId = user?._id || user?.id;

  // CORE STATES
  const [query, setQuery] = useState(qparams.get("q") || "");
  const [transcript, setTranscript] = useState(qparams.get("voice") || "");
  const [results, setResults] = useState(null);   // RAW backend results
  const [displayList, setDisplayList] = useState(null); // Filtered + Sorted Final Output
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(qparams.get("category") || "all");
  const [sortBy, setSortBy] = useState("relevance");

  const micRef = useRef(null);

  // ==== ORIGINAL LOGIC RESTORED ====
  useEffect(() => {
    const cat = qparams.get("category");
    const voice = qparams.get("voice");
    const q = qparams.get("q");

    if (cat) {
      setCategory(cat);
      setQuery(cat);
      setTimeout(() => doSearch(cat, { isCategory: true }), 180);
      return;
    }

    if (voice) {
      setTranscript(voice);
      setQuery(voice);
      setTimeout(() => doSearch(voice, { isCategory: false }), 180);
      return;
    }

    if (q) {
      setQuery(q);
      setTimeout(() => doSearch(q, { isCategory: false }), 150);
      return;
    }

    // DEFAULT: show ALL products
    loadAllProducts();
  }, []);

  // LOAD ALL PRODUCTS FOR DEFAULT VIEW
  async function loadAllProducts() {
    setLoading(true);
    try {
      const all = await Api.Products.getAll();
      setResults(all || []);
      setDisplayList(all || []);
    } catch (err) {
      console.error("LoadAll error:", err);
      setResults([]);
    }
    setLoading(false);
  }

  // FILTER + SORT (PURE CLIENT SIDE)
  useEffect(() => {
    if (!results) return;

    let temp = [...results];

    if (category !== "all") {
      temp = temp.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      temp = temp.filter((p) =>
        `${p.name} ${p.brand || ""} ${p.category || ""}`.toLowerCase().includes(q)
      );
    }

    // SORTING
    if (sortBy === "price_asc") temp.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") temp.sort((a, b) => b.price - a.price);
    if (sortBy === "discount")
      temp.sort(
        (a, b) =>
          ((b.salePercent || 0) - (a.salePercent || 0))
      );

    setDisplayList(temp);
  }, [results, category, sortBy, query]);

  // FULL SEARCH FUNCTION
  async function doSearch(customText, options = { isCategory: false }) {
    const finalQuery = (customText ?? query ?? "").trim();
    setLoading(true);
    setDisplayList(null);
    setResults(null);

    try {
      let data;
      if (options.isCategory) {
        data = await Api.Products.getByCategory(finalQuery);
      } else {
        data = await Api.Products.search(finalQuery);
      }

      setResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }

    setLoading(false);

    // Update URL
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (!options.isCategory && finalQuery) params.set("q", finalQuery);
    navigate({ pathname: "/search", search: params.toString() }, { replace: true });
  }

  // VOICE INPUT
  function voiceInput() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser does not support voice.");
      return;
    }

    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Speech();
    rec.lang = "en-IN";

    micRef.current?.classList.add("animate-pulse");
    rec.start();

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setQuery(text);
      doSearch(text);
    };

    rec.onend = () => micRef.current?.classList.remove("animate-pulse");
  }

  const CATEGORIES = ["all", "Vegetables", "Dairy", "Bakery", "Snacks", "Personal Care"];

  return (
    <div className="pb-32 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* SEARCH ROW */}
      <div className="flex gap-3 items-center mt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="Search products..."
          className="flex-1 p-3 bg-gray-900/40 text-gray-100 rounded-2xl border border-white/10 focus:ring-2 focus:ring-blue-500"
        />

        <button
          ref={micRef}
          onClick={voiceInput}
          className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
        >
          <Mic size={18} />
        </button>

        <button
          onClick={() => doSearch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl"
        >
          Search
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="mt-4 p-4 bg-gray-900/30 rounded-2xl flex flex-wrap gap-4 items-center">

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Category</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              doSearch(e.target.value, { isCategory: e.target.value !== "all" });
            }}
            className="p-2 bg-gray-900/50 rounded-xl text-gray-100 border border-white/10"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Sort</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 bg-gray-900/50 rounded-xl text-gray-100 border border-white/10"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Low to High</option>
            <option value="price_desc">High to Low</option>
            <option value="discount">Discounted</option>
          </select>
        </div>

        <div className="flex-1 text-right text-xs text-gray-400">
          Showing {displayList ? displayList.length : 0} results
        </div>
      </div>

      {/* RESULTS */}
      <div className="mt-6">
        {loading ? (
          <div className="text-gray-400 text-center py-10">Searching…</div>
        ) : !displayList ? (
          <div className="text-gray-400 text-center py-10">No results.</div>
        ) : displayList.length === 0 ? (
          <div className="text-gray-400 text-center py-10">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayList.map((p) => (
              <ProductMiniCard
                key={p.id || p._id}
                product={{ ...p, userId }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
