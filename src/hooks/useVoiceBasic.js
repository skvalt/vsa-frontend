import { useEffect, useRef, useState } from "react";

export default function useVoiceBasic() {
  const recRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition not supported.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const heard = e.results[0][0].transcript;
      setText(heard);
    };

    rec.onerror = (e) => {
      setError(e.error || "Mic error");
    };

    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  function start() {
    if (!recRef.current) return;
    setText("");
    setError(null);

    setListening(true);
    try {
      recRef.current.start();
    } catch {}
  }

  function stop() {
    try {
      recRef.current?.stop();
    } catch {}
    setListening(false);
  }

  return {
    listening,
    text,
    error,
    start,
    stop
  };
}
