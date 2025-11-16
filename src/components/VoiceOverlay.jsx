import React from "react";

export default function VoiceOverlay({ open, listening, recognized, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl max-w-sm w-full text-white shadow-2xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Listening…</h2>
          <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100">Close</button>
        </div>

        <div className="flex justify-center my-5">
          <div className="w-28 h-28 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-300/20 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>

        <p className="text-center text-sm opacity-90 mb-3">
          {listening ? "Speak your command…" : "Not listening"}
        </p>

        <div className="border border-white/20 rounded-lg p-3 min-h-[48px] text-sm">
          {recognized || <span className="opacity-50">No speech yet…</span>}
        </div>
      </div>
    </div>
  );
}
