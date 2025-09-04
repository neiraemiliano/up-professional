// src/hooks/professionals.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profAPI from "../../api/professionals";
import { createResourceHooks } from "./baseResourceHooks";

// Hooks básicos del CRUD original
export const {
  useList: useProfessionals,
  useItem: useProfessional,
  useCreate: useCreateProfessional,
  useUpdate: useUpdateProfessional,
  useDelete: useDeleteProfessional,
} = createResourceHooks("professionals", {
  fetchAll: profAPI.fetchProfessionals,
  fetchOne: profAPI.fetchProfessional,
  create: profAPI.createProfessional,
  update: profAPI.updateProfessional,
  remove: profAPI.deleteProfessional,
});

// Hook para búsqueda avanzada con paginación
export const useSearchProfessionals = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['professionals', 'search', filters],
    queryFn: () => profAPI.searchProfessionals(filters),
    ...options
  });
};

// Hook para perfil completo de profesional
export const useProfessionalProfile = (id, options = {}) => {
  return useQuery({
    queryKey: ['professionals', 'profile', id],
    queryFn: () => profAPI.fetchProfessionalProfile(id),
    enabled: Boolean(id),
    ...options
  });
};

// Hook para generar URL de WhatsApp
export const useGenerateWhatsAppURL = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => profAPI.generateWhatsAppURL(id, data),
    onSuccess: () => {
      // Opcional: invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    }
  });
};

// Hook para verificar disponibilidad de WhatsApp
export const useWhatsAppAvailability = (id, options = {}) => {
  return useQuery({
    queryKey: ['professionals', 'whatsapp', id],
    queryFn: () => profAPI.checkWhatsAppAvailability(id),
    enabled: Boolean(id),
    ...options
  });
};

// Intelligent Search Hooks
export const useIntelligentSearch = (params, options = {}) => {
  return useQuery({
    queryKey: ['intelligent-search', params],
    queryFn: () => profAPI.intelligentSearch(params),
    enabled: Boolean(params.q && params.q.trim()),
    ...options
  });
};

export const useSmartSuggestions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['intelligent-search', 'suggestions', params],
    queryFn: () => profAPI.getSmartSuggestions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const useQueryAnalysis = (query, options = {}) => {
  return useQuery({
    queryKey: ['intelligent-search', 'analyze', query],
    queryFn: () => profAPI.analyzeQuery({ q: query }),
    enabled: Boolean(query && query.trim().length > 2),
    staleTime: 30 * 1000, // 30 seconds
    ...options
  });
};

export const useSubmitSearchFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => profAPI.submitSearchFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intelligent-search'] });
    }
  });
};
