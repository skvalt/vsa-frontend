import React from "react";
import { useList } from "../contexts/ListContext";



export default function ResultPanel({
  recognized,
  result,
  isLoading,
  error,
  lastRaw,
  confirmAction
}) {
  const { addOrUpdateItem } = useList();

  if (!result && !recognized && !lastRaw) {
    return null;
  }

  return (
    <section className="mt-6">
      {/* Recognized Speech */}
      <div className="rounded-lg border p-3 bg-white">
        <div className="text-xs text-gray-500">Recognized Speech</div>
        <div className="text-sm text-gray-900 mt-1 min-h-[20px]">
          {recognized || lastRaw || (
            <span className="text-gray-400">Say something…</span>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-3 p-3 rounded-lg border border-dashed flex items-center gap-3 bg-gray-50">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm text-gray-600">Processing…</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* NLP Result */}
      {result && !isLoading && !error && (
        <div className="mt-3 p-4 rounded-lg bg-gray-50 border">
          {/* Intent */}
          <div>
            <div className="text-xs text-gray-500">Intent</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm font-medium text-gray-900">
                {result.intent}
              </div>
              <div className="text-xs text-gray-500">
                score: {Math.round((result.intentScore || 0) * 100) / 100}
              </div>
            </div>
          </div>

          {/* Matches list */}
          <div className="mt-3">
            <div className="text-xs text-gray-500">Matches</div>

            {result.matches?.length > 0 ? (
              <div className="mt-2 space-y-2">
                {result.matches.map((m, idx) => (
                  <div key={m.id ?? m.name ?? idx} className="bg-white p-3 rounded-md border flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold truncate">{m.name}</div>
                      <div className="text-xs text-gray-500">
                        {m.brand || "Generic"} • {m.category || "Unknown"}
                      </div>
                      <div className="text-sm text-indigo-600 mt-1">₹{m.price ?? "—"}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          
                          confirmAction(result, m);
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md"
                      >
                        Add
                      </button>

                      <button
                        onClick={() => {
                          
                          addOrUpdateItem({ name: m.name, quantity: 1, price: m.price, category: m.category });
                        }}
                        className="text-xs text-gray-500 underline"
                      >
                        Quick add (local)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">No product matched.</div>
            )}
          </div>

          {/* Confirm whole parsed object */}
          {result.matches?.length > 0 && (
            <button
              onClick={() => confirmAction(result)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg active:scale-95"
            >
              Add top match(s)
            </button>
          )}

          {/* Applied Action Feedback */}
          {result.applied && (
            <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-100 text-sm text-green-700">
              Action applied.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
