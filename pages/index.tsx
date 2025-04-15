import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ClaraApp() {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "es-ES";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = async (event) => {
          const spokenText = event.results[0][0].transcript;
          setTranscript(spokenText);
          setListening(false);

          const gptResponse = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: spokenText }),
          }).then(res => res.json());

          setResponse(gptResponse.text);

          const audio = new Audio("/api/speak?text=" + encodeURIComponent(gptResponse.text));
          audio.play();
        };

        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleTalk = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
      setTranscript("");
      setResponse("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <Button onClick={handleTalk} disabled={listening} className="text-xl px-6 py-3">
        {listening ? "Escuchando..." : "Hablar con Clara"}
      </Button>
      <Textarea value={transcript} readOnly placeholder="Lo que has dicho" />
      <Textarea value={response} readOnly placeholder="Respuesta de Clara" />
    </div>
  );
}