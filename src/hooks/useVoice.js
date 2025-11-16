import { useEffect, useRef, useState } from "react";
import Api from "../api/Api";
import { useList } from "../contexts/ListContext";

export default function useVoice() {
  const { applyBackendAction } = useList();

  const recognitionRef = useRef(null);
  const hasStartedRef = useRef(false);

  const [listening, setListening] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const [recognized, setRecognized] = useState("");
  const [lastRaw, setLastRaw] = useState(null);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isIOS) {
    return {
      listening: false,
      overlayOpen: false,
      isLoading: false,
      recognized: "",
      result: null,
      error: "Voice recognition not supported on iOS Safari.",
      startListening: () => {},
      stopListening: () => {},
      confirmAction: () => {},
    };
  }

  // SpeechRecognizer

  useEffect(() => {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      setError("Speech recognition not supported.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";

    // Single-shot speech
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      console.log("🎤 Recognition started");
      hasStartedRef.current = true;
    };

    rec.onresult = async (event) => {
      const text =
        event.results[event.results.length - 1][0].transcript;

      console.log("🎤 Heard:", text);

      setRecognized(text);
      setLastRaw(text);

      await processSpeech(text);
    };

    rec.onspeechend = () => {
      console.log("🔇 User stopped speaking");
      stopListening();
    };

    rec.onerror = (e) => {
      console.log("❌ Speech error:", e.error);

      if (e.error === "not-allowed") {
        setError("Microphone permission denied.");
        stopListening();
        return;
      }

      setError("Speech error: " + e.error);
      stopListening();
    };

    rec.onend = () => {
      console.log("⛔ Recognition ended");
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.stop(); } catch (_) {}
    };
  }, [listening]);

 
  // PROCESS SPEECH

  async function processSpeech(text) {
    setIsLoading(true);
    setError(null);

    try {
      const translated = await Api.Translate.toEnglish(text);
      const english = translated.text;

      console.log("🌐 Translated:", english);

      const parsed = await Api.Voice.parse(english);
      console.log("🧠 Parsed:", parsed);

      if (parsed && Array.isArray(parsed.matches)) {
        parsed.matches = parsed.matches.map((m) => {
         
          const id = m.id ?? m.productId ?? m.productId;
          return {
            id,
            name: m.name || m.product || "",
            brand: m.brand || m.manufacturer || m.brand,
            category: m.category || m.cat,
            price: m.price ?? m.pricePerUnit ?? null,
            score: m.score ?? m.similarity ?? 0
          };
        });
      }

      setResult(parsed);
    } catch (err) {
      console.error("Parse Error:", err);
      setError(err.message || "Failed to process speech.");
    }

    setIsLoading(false);
  }

  // CONFIRM ACTION
  async function confirmAction(payload = null, chosenMatch = null) {
    setIsLoading(true);
    setError(null);

    try {
      const body = payload || result;
      if (!body) throw new Error("Nothing to apply");

      // Build a clean payload that matches backend expectations
      const cleanPayload = {
        intent: body.intent,
        entities: body.entities ?? {},
        matches: []
      };

      // If user chose a specific match, send only that
      if (chosenMatch) {
        cleanPayload.matches = [
          {
            id: chosenMatch.id,
            name: chosenMatch.name,
            brand: chosenMatch.brand,
            category: chosenMatch.category,
            price: chosenMatch.price,
            score: chosenMatch.score ?? 1.0
          }
        ];
      } else if (Array.isArray(body.matches)) {
        cleanPayload.matches = body.matches.map((m) => ({
          id: m.id,
          name: m.name,
          brand: m.brand,
          category: m.category,
          price: m.price,
          score: m.score ?? 0
        }));
      }

      const res = await Api.Voice.apply(cleanPayload);
      console.log("🔁 Apply Response:", res);


      if (Array.isArray(res)) {
        res.forEach((it) => applyBackendAction(it));
      } else if (res && res.removed) {
        // backend: { removed: item }
        applyBackendAction(res.removed);
      } else if (res && res.cleared !== undefined) {
        applyBackendAction({ type: "clear" });
      } else if (res && res.undone) {
 
        if (res.undone instanceof Object && res.undone.name) {
          applyBackendAction({ action: "remove", name: res.undone.name });
        }
      } else {

        applyBackendAction(res);
      }

      setResult((prev) => (prev ? { ...prev, applied: res } : { applied: res }));


      setTimeout(() => setResult(null), 800);

    } catch (err) {
      console.error("Apply Error:", err);
      setError("Action failed: " + (err.message || err));
    }

    setIsLoading(false);
  }

  // START / STOP

  function startListening() {
    if (!recognitionRef.current) return;

    console.log("▶️ startListening()");

    hasStartedRef.current = false;
    setListening(true);
    setOverlayOpen(true);

    setRecognized("");
    setResult(null);
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("start() error ignored:", e);
    }
  }

  function stopListening() {
    if (!recognitionRef.current) return;

    console.log("⏹ stopListening()");

    setListening(false);
    setOverlayOpen(false);

    try {
      recognitionRef.current.stop();
    } catch (_) {}
  }

  return {
    listening,
    recognized,
    result,
    isLoading,
    error,
    lastRaw,
    overlayOpen,

    startListening,
    stopListening,
    confirmAction,
  };
}
