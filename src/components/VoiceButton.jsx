import React from "react";

export default function VoiceButton({ listening, onStart, onStop }) {
  return (
    <button
      onClick={listening ? onStop : onStart}
      className={`fixed bottom-7 right-5 z-50 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95
        ${
          listening
            ? "w-20 h-20 bg-gradient-to-br from-red-600 to-pink-500 animate-pulse ring-4 ring-red-300/40"
            : "w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 hover:scale-105"
        }
      `}
    >
      {listening ? (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M12 1v11m0 0a3 3 0 003-3V6a3 3 0 10-6 0v3a3 3 0 003 3zm-6 5v2a6 6 0 0012 0v-2"
          />
        </svg>
      )}
    </button>
  );
}

