import { Mic, MicOff, Volume2, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const VoiceInput = ({ onTranscript, className = "" }) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const [showPulse, setShowPulse] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  useEffect(() => {
    setShowPulse(isListening);
  }, [isListening]);

  if (!isSupported) {
    return null; // No mostrar el botón si no hay soporte
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ondas de sonido animadas de fondo */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Ondas que aparecen en hover o cuando está grabando */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
          (isHovered || isListening) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {/* Onda 1 */}
          <div className={`absolute inset-0 rounded-full border-2 border-violet-300/30 ${
            (isHovered || isListening) ? 'animate-ping' : ''
          }`} style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
          {/* Onda 2 */}
          <div className={`absolute inset-0 rounded-full border-2 border-blue-300/30 ${
            (isHovered || isListening) ? 'animate-ping' : ''
          }`} style={{ animationDelay: '0.7s', animationDuration: '2s' }}></div>
          {/* Onda 3 */}
          <div className={`absolute inset-0 rounded-full border-2 border-violet-400/20 ${
            (isHovered || isListening) ? 'animate-ping' : ''
          }`} style={{ animationDelay: '1.4s', animationDuration: '2s' }}></div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={!isSupported}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-300/50
          transform hover:scale-110 active:scale-95 z-10
          ${isListening 
            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:to-red-600 text-white shadow-lg shadow-red-500/30" 
            : "bg-gradient-to-br from-violet-500 via-violet-600 to-blue-600 hover:from-violet-400 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30"
          }
          ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}
          ${(isHovered || isListening) ? 'shadow-2xl' : 'shadow-lg'}
        `}
        title={isListening ? "Parar grabación" : "Hablar para describir tu problema"}
      >
        {/* Fondo con gradiente animado */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-300 ${
          isListening ? 'from-red-400 to-red-600 animate-pulse opacity-20' : 'from-violet-400 to-blue-500'
        } ${isHovered ? 'opacity-20' : ''}`}></div>

        {/* Icono principal */}
        <div className="relative z-10">
          {isListening ? (
            <div className="flex items-center justify-center">
              <MicOff className="w-6 h-6 drop-shadow-sm animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Mic className={`w-6 h-6 drop-shadow-sm transition-transform duration-300 ${
                isHovered ? 'scale-110' : ''
              }`} />
            </div>
          )}
        </div>
        
        {/* Ondas de pulso para estado de grabación */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" style={{ animationDuration: '1s' }}></div>
            <div className="absolute inset-0 rounded-full bg-red-300/20 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1s' }}></div>
          </>
        )}

        {/* Partículas de sonido flotantes */}
        {isListening && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-white rounded-full animate-bounce opacity-60`}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${25 + i * 10}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        )}
      </button>

      {/* Indicador de estado mejorado - ahora aparece arriba */}
      {isListening && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-3 shadow-xl border border-gray-700 animate-fadeIn z-50">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full animate-pulse"
                style={{
                  height: `${8 + Math.random() * 8}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
          <span className="font-medium">Escuchando...</span>
          <Radio className="w-4 h-4 animate-spin text-red-400" />
        </div>
      )}

      {/* Mensaje de error mejorado - ahora aparece arriba */}
      {error && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap max-w-64 text-center shadow-xl animate-shake z-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;