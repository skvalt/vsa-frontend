

export function safeJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

//Format currency like ₹120 
export function formatCurrency(n) {
  if (isNaN(n)) return "₹-";
  return `₹${n}`;
}

// Capitalize a string 
export function cap(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Fire a global toast 
export function toast(msg) {
  window.dispatchEvent(new CustomEvent("toast", { detail: msg }));
}
