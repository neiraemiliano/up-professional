import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Verificar soporte del navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "es-AR"; // Español argentino

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
        
        // Timeout de 10 segundos
        timeoutRef.current = setTimeout(() => {
          stopListening();
          setError("Tiempo agotado. Intenta de nuevo.");
        }, 10000);
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        
        if (currentTranscript) {
          setTranscript(currentTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        
        let errorMessage = "Error al escuchar";
        switch (event.error) {
          case "no-speech":
            errorMessage = "No se detectó voz. Habla más fuerte.";
            break;
          case "network":
            errorMessage = "Error de conexión. Verifica tu internet.";
            break;
          case "not-allowed":
            errorMessage = "Permiso denegado. Habilita el micrófono.";
            break;
          case "service-not-allowed":
            errorMessage = "Servicio no disponible.";
            break;
        }
        
        setError(errorMessage);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setError("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setError("");
  };

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};

export default useSpeechRecognition;