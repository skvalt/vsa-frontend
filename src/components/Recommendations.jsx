import { useEffect, useState } from "react";
import Api from "../api/Api";
import { useAuth } from "../hooks/useAuth";
import { useList } from "../contexts/ListContext";

export default function Recommendations() {
  const { user } = useAuth();
  const { addOrUpdateItem } = useList();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const userId = user?.id || user?._id || null;
        const data = await Api.Suggestions.getSuggestions(userId);

        if (!Array.isArray(data)) {
          setItems([]);
        } else {
          setItems(data);
        }
      } catch (e) {
        setErr("Unable to load suggestions.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="mt-4 mb-2 px-4 py-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 w-28 bg-gray-300 rounded mb-3"></div>
        <div className="flex gap-2">
          <div className="h-20 w-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 w-20 bg-gray-200 rounded-xl"></div>
          <div className="h-20 w-20 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="mt-4 mx-4 p-3 bg-red-50 text-red-700 border border-red-200 text-sm rounded-lg">
        {err}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null; 
  }

  return (
    <div className="mt-4 px-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Recommended for you
      </h2>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {items.map((p) => (
          <div
            key={p.id}
            className="min-w-[120px] bg-white rounded-xl shadow-sm p-3 border border-gray-100 active:scale-95 transition cursor-pointer"
            onClick={() =>
              addOrUpdateItem({
                name: p.name,
                quantity: 1,
                price: p.price,
                category: p.category,
              })
            }
          >
            <div className="font-medium text-sm text-gray-800 truncate">
              {p.name}
            </div>

            {p.brand && (
              <div className="text-xs text-gray-500 truncate">{p.brand}</div>
            )}

            {p.price != null && (
              <div className="mt-1 text-[13px] font-medium text-indigo-600">
                ₹{p.price}
              </div>
            )}

            <div className="mt-2 text-[11px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full w-fit">
              {p.category || "General"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
