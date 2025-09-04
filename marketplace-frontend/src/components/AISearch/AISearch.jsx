import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Loader2,
  Brain,
  MessageCircle,
  Lightbulb,
  Users,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import ProfessionalCard from '../../pages/SearchProfessional/components/ProfessionalCard';
import Button from '../template/ui/button/Button';
import { useAISearch, useAISuggestions } from '../../hooks/api/aiSearch';

const AISearch = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, searching, results
  const [currentQuery, setCurrentQuery] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Backend hooks
  const { data: aiSuggestions } = useAISuggestions();
  const { 
    data: aiSearchData, 
    isLoading: isProcessing, 
    error: searchError 
  } = useAISearch(currentQuery, Boolean(currentQuery));

  // Sugerencias inteligentes iniciales
  const initialSuggestions = [
    {
      type: 'service',
      text: '¿Necesitas un plomero para arreglar una fuga de agua?',
      icon: '🔧',
      category: 'Plomería',
      urgency: 'urgent'
    },
    {
      type: 'service', 
      text: 'Busco un electricista para instalar luces LED',
      icon: '💡',
      category: 'Electricidad',
      urgency: 'normal'
    },
    {
      type: 'service',
      text: 'Quiero contratar un pintor para renovar mi casa',
      icon: '🎨',
      category: 'Pintura',
      urgency: 'flexible'
    },
    {
      type: 'location',
      text: 'Profesionales cerca de mi ubicación',
      icon: '📍',
      category: 'General',
      urgency: 'normal'
    }
  ];

  useEffect(() => {
    // Welcome message with suggestions from backend
    const suggestions = aiSuggestions || initialSuggestions;
    setConversation([{
      type: 'ai',
      message: '¡Hola! 👋 Soy tu asistente de búsqueda inteligente. Puedo ayudarte a encontrar el profesional perfecto para tu proyecto. ¿Qué necesitas?',
      timestamp: new Date(),
      suggestions: suggestions.slice(0, 3)
    }]);
  }, [aiSuggestions]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Handle AI search results from backend
  useEffect(() => {
    if (aiSearchData && currentQuery) {
      const aiMessage = {
        type: 'ai',
        message: aiSearchData.aiMessage,
        timestamp: new Date(),
        searchResults: aiSearchData.professionals || [],
        suggestions: aiSearchData.suggestions || [],
        metadata: aiSearchData.metadata
      };

      setConversation(prev => [...prev, aiMessage]);
      
      if (aiSearchData.professionals && aiSearchData.professionals.length > 0) {
        setSearchResults(aiSearchData.professionals);
        setCurrentStep('results');
      }
      
      // Clear current query to prevent re-triggering
      setCurrentQuery(null);
    }
  }, [aiSearchData, currentQuery]);

  // Handle search errors
  useEffect(() => {
    if (searchError && currentQuery) {
      const errorMessage = {
        type: 'ai',
        message: 'Lo siento, hubo un problema al procesar tu búsqueda. ¿Podrías intentar de nuevo con otros términos?',
        timestamp: new Date(),
        error: true
      };
      setConversation(prev => [...prev, errorMessage]);
      setCurrentQuery(null);
    }
  }, [searchError, currentQuery]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    const userMessage = {
      type: 'user',
      message: searchQuery.trim(),
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setCurrentStep('searching');

    // Trigger backend search
    setCurrentQuery({
      query: searchQuery.trim(),
      location: '', // Could be enhanced with geolocation
      urgency: searchQuery.toLowerCase().includes('urgente') ? 'urgent' : 'normal',
    });

    setQuery('');
  };


  const handleSuggestionClick = (suggestion) => {
    if (typeof suggestion === 'string') {
      setQuery(suggestion);
      handleSearch(suggestion);
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Búsqueda con IA</h1>
              <p className="text-gray-600 text-sm">Encuentra profesionales usando inteligencia artificial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Asistente IA</h3>
                    <p className="text-sm opacity-90">Búsqueda inteligente en tiempo real</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4" />
                          <span className="text-xs font-medium text-gray-600">IA Asistente</span>
                        </div>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      
                      {msg.suggestions && (
                        <div className="mt-3 space-y-1">
                          {msg.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              {typeof suggestion === 'string' ? suggestion : suggestion.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-sm text-gray-600">Procesando con IA...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Describe lo que necesitas... ej: 'Necesito un plomero urgente para una fuga'"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      disabled={isProcessing}
                    />
                    <button
                      type="button"
                      onClick={startVoiceSearch}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        isListening 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
                      }`}
                      disabled={isProcessing}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    disabled={!query.trim() || isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Características IA
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Lenguaje Natural</h4>
                    <p className="text-sm text-gray-600">Habla como lo harías normalmente</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">IA Avanzada</h4>
                    <p className="text-sm text-gray-600">Comprende contexto y necesidades</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Resultados Instantáneos</h4>
                    <p className="text-sm text-gray-600">Respuestas en tiempo real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            {currentStep === 'welcome' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Prueba estas búsquedas
                </h3>
                
                <div className="space-y-2">
                  {(aiSuggestions || initialSuggestions).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
                            {suggestion.text}
                          </p>
                          <p className="text-xs text-gray-500">
                            {suggestion.category}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Count */}
            {searchResults.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {searchResults.length} profesionales encontrados
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Seleccionados por IA según tus necesidades
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Profesionales Recomendados</h2>
                <p className="text-gray-600">Seleccionados especialmente para ti por nuestra IA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((professional) => (
                <ProfessionalCard 
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearch;