import React, { useEffect, useState } from "react";



export default function Toast() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    function handler(e) {
      setMsg(e.detail);
      setTimeout(() => setMsg(""), 3000);
    }

    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full shadow-md text-sm animate-fade-in">
        {msg}
      </div>
    </div>
  );
}
