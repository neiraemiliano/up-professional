// src/hooks/aiSearch.js
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../api/client";

// Hook for AI-powered search
export const useAISearch = (query, enabled = false) => {
  return useQuery({
    queryKey: ["aiSearch", query],
    queryFn: () => aiSearchProfessionals(query),
    enabled: Boolean(query && enabled),
  });
};

// Hook for getting AI suggestions
export const useAISuggestions = () => {
  return useQuery({
    queryKey: ["aiSuggestions"],
    queryFn: getAISuggestions,
  });
};

// AI Search function
const aiSearchProfessionals = async (queryData) => {
  const { query: searchQuery, location, urgency, category } = queryData;
  
  // Process natural language query to extract parameters
  const processedParams = processNaturalLanguageQuery(searchQuery);
  
  // Build search parameters
  const searchParams = new URLSearchParams({
    q: searchQuery || '',
    categoryId: processedParams.categoryId || '',
    locationId: location || '',
    supportsUrgent: urgency === 'urgent' ? 'true' : 'false',
    order: urgency === 'urgent' ? 'rating_desc' : 'rating_desc',
    page: 1,
    limit: 12
  });

  const response = await api.get(`/professionals/search?${searchParams}`);
  
  // Generate AI response based on results
  const aiResponse = generateAIResponse(searchQuery, response.data, processedParams);
  
  return {
    professionals: response.data.data || [],
    aiMessage: aiResponse.message,
    suggestions: aiResponse.suggestions,
    metadata: {
      totalResults: response.data.pagination?.total || 0,
      searchQuery: searchQuery,
      processedCategory: processedParams.category
    }
  };
};

// Process natural language to extract search parameters
const processNaturalLanguageQuery = (query) => {
  if (!query) return {};
  
  const lowerQuery = query.toLowerCase();
  
  // Service type mapping
  const serviceTypes = {
    'plomero': { categoryId: 1, category: 'Plomería' },
    'plomeria': { categoryId: 1, category: 'Plomería' },
    'cañeria': { categoryId: 1, category: 'Plomería' },
    'agua': { categoryId: 1, category: 'Plomería' },
    'fuga': { categoryId: 1, category: 'Plomería' },
    'electricista': { categoryId: 2, category: 'Electricidad' },
    'electricidad': { categoryId: 2, category: 'Electricidad' },
    'luz': { categoryId: 2, category: 'Electricidad' },
    'luces': { categoryId: 2, category: 'Electricidad' },
    'instalacion': { categoryId: 2, category: 'Electricidad' },
    'pintor': { categoryId: 3, category: 'Pintura' },
    'pintura': { categoryId: 3, category: 'Pintura' },
    'carpintero': { categoryId: 4, category: 'Carpintería' },
    'carpinteria': { categoryId: 4, category: 'Carpintería' },
    'madera': { categoryId: 4, category: 'Carpintería' },
    'jardinero': { categoryId: 5, category: 'Jardinería' },
    'jardin': { categoryId: 5, category: 'Jardinería' },
    'plantas': { categoryId: 5, category: 'Jardinería' },
    'limpieza': { categoryId: 6, category: 'Limpieza' },
    'limpiar': { categoryId: 6, category: 'Limpieza' },
  };
  
  // Find matching service type
  let result = {};
  for (const [keyword, data] of Object.entries(serviceTypes)) {
    if (lowerQuery.includes(keyword)) {
      result = { ...data };
      break;
    }
  }
  
  // Detect urgency
  const urgencyKeywords = ['urgente', 'ya', 'ahora', 'inmediato', 'rapido', 'emergencia'];
  result.isUrgent = urgencyKeywords.some(keyword => lowerQuery.includes(keyword));
  
  return result;
};

// Generate contextual AI responses
const generateAIResponse = (query, results, processedParams) => {
  const professionals = results.data || [];
  const total = results.pagination?.total || professionals.length;
  
  let message = '';
  let suggestions = [];
  
  if (professionals.length === 0) {
    message = `🤔 No encontré profesionales que coincidan exactamente con "${query}". Te sugiero intentar con términos más generales o revisar la ubicación.`;
    suggestions = [
      '¿Podrías especificar tu ubicación?',
      'Mostrar todas las categorías disponibles',
      '¿Qué tipo de trabajo específico necesitas?'
    ];
  } else if (processedParams.category) {
    const category = processedParams.category;
    const urgentText = processedParams.isUrgent ? ' con disponibilidad inmediata' : '';
    
    message = `🔧 ¡Perfecto! He encontrado ${total} profesional${total > 1 ? 'es' : ''} de ${category}${urgentText} que pueden ayudarte. Todos están verificados y tienen excelentes reseñas de clientes anteriores.`;
    
    suggestions = [
      `Mostrar solo ${category.toLowerCase()} cerca de mí`,
      '¿Cuál es tu presupuesto aproximado?',
      'Ver solo profesionales con mejor calificación',
      'Filtrar por disponibilidad inmediata'
    ];
  } else {
    message = `🔍 Encontré ${total} profesional${total > 1 ? 'es' : ''} que podrían ayudarte con "${query}". He seleccionado los mejor calificados y más relevantes para tu búsqueda.`;
    
    suggestions = [
      'Especificar el tipo de servicio exacto',
      '¿Es un trabajo urgente?',
      'Mostrar profesionales cerca de mi ubicación',
      'Ver reseñas más recientes'
    ];
  }
  
  return { message, suggestions };
};

// Get AI suggestions for initial screen
const getAISuggestions = async () => {
  // This could be enhanced to use real AI or fetch from backend
  return [
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
};

export { aiSearchProfessionals, getAISuggestions };