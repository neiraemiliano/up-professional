import { useState } from "react";

const SearchSuggestions = ({ onSelect, category = "" }) => {
  const [suggestions] = useState([
    // Electricista
    { 
      category: "electricista", 
      suggestions: [
        { text: "Instalar aire acondicionado split", icon: "❄️", estimatedTime: "3-4 horas", avgPrice: "$15000" },
        { text: "Revisar tablero eléctrico", icon: "⚡", estimatedTime: "1-2 horas", avgPrice: "$8000" },
        { text: "Se cortó la luz en toda la casa", icon: "💡", estimatedTime: "2-3 horas", avgPrice: "$12000", urgent: true },
        { text: "Instalar tomas nuevas en cocina", icon: "🔌", estimatedTime: "2-3 horas", avgPrice: "$10000" }
      ]
    },
    
    // Plomero  
    { 
      category: "plomero", 
      suggestions: [
        { text: "Destapación urgente de inodoro", icon: "🚽", estimatedTime: "30 min", avgPrice: "$5000", urgent: true },
        { text: "Pérdida de agua en caños", icon: "💧", estimatedTime: "2-4 horas", avgPrice: "$18000", urgent: true },
        { text: "Instalar termotanque nuevo", icon: "🔥", estimatedTime: "3-5 horas", avgPrice: "$25000" },
        { text: "Cambiar canilla de cocina", icon: "🚿", estimatedTime: "1 hora", avgPrice: "$6000" }
      ]
    },
    
    // Pintor
    { 
      category: "pintor", 
      suggestions: [
        { text: "Pintar 2 habitaciones completas", icon: "🎨", estimatedTime: "2-3 días", avgPrice: "$45000" },
        { text: "Pintura exterior de la casa", icon: "🏠", estimatedTime: "3-5 días", avgPrice: "$80000" },
        { text: "Pintar living y comedor", icon: "🖌️", estimatedTime: "1-2 días", avgPrice: "$30000" },
        { text: "Arreglar pintura con humedad", icon: "🔧", estimatedTime: "1 día", avgPrice: "$20000" }
      ]
    },
    
    // Albañil
    { 
      category: "albanil", 
      suggestions: [
        { text: "Arreglar humedad en pared", icon: "🧱", estimatedTime: "2-3 días", avgPrice: "$35000" },
        { text: "Hacer contrapiso en balcón", icon: "🔨", estimatedTime: "3-4 días", avgPrice: "$50000" },
        { text: "Revoque interior de habitación", icon: "🏗️", estimatedTime: "2-3 días", avgPrice: "$40000" },
        { text: "Construir pared divisoria", icon: "🧱", estimatedTime: "4-5 días", avgPrice: "$70000" }
      ]
    },
    
    // Gasista
    { 
      category: "gasista", 
      suggestions: [
        { text: "Revisar calefón que no enciende", icon: "🔥", estimatedTime: "1-2 horas", avgPrice: "$8000", urgent: true },
        { text: "Instalar estufa a gas nueva", icon: "🌡️", estimatedTime: "2-3 horas", avgPrice: "$15000" },
        { text: "Revisión anual de gas", icon: "✅", estimatedTime: "1 hora", avgPrice: "$6000" },
        { text: "Conexión de cocina nueva", icon: "🍳", estimatedTime: "2-3 horas", avgPrice: "$18000" }
      ]
    }
  ]);

  const categoryData = suggestions.find(s => s.category === category.toLowerCase());
  
  if (!categoryData) return null;

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm font-medium text-gray-700">Trabajos comunes en {category}:</p>
      <div className="grid gap-2">
        {categoryData.suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{suggestion.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-violet-900">
                  {suggestion.text}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">⏱️ {suggestion.estimatedTime}</span>
                  <span className="text-xs font-medium text-green-600">{suggestion.avgPrice}</span>
                  {suggestion.urgent && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      🚨 Urgente
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-violet-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 italic">
        💡 Haz clic en cualquier opción para agregarla a tu búsqueda
      </p>
    </div>
  );
};

export default SearchSuggestions;