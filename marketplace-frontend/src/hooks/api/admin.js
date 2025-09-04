import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminAPI from "../../api/admin";

// Dashboard overview
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminAPI.fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

// Métricas específicas
export const useUserMetrics = (period = '30d', options = {}) => {
  return useQuery({
    queryKey: ['admin', 'metrics', 'users', period],
    queryFn: () => adminAPI.fetchUserMetrics(period),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useProfessionalMetrics = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'metrics', 'professionals'],
    queryFn: adminAPI.fetchProfessionalMetrics,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useBookingMetrics = (period = '30d', options = {}) => {
  return useQuery({
    queryKey: ['admin', 'metrics', 'bookings', period],
    queryFn: () => adminAPI.fetchBookingMetrics(period),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useFinancialMetrics = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'metrics', 'financial'],
    queryFn: adminAPI.fetchFinancialMetrics,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useContactMetrics = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'metrics', 'contacts'],
    queryFn: adminAPI.fetchContactMetrics,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// Actividad reciente
export const useRecentActivity = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'activity', 'recent'],
    queryFn: adminAPI.fetchRecentActivity,
    staleTime: 2 * 60 * 1000, // 2 minutes for recent activity
    ...options
  });
};

// Configuración del sistema
export const useSystemConfig = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'system', 'config'],
    queryFn: adminAPI.fetchSystemConfig,
    staleTime: 30 * 60 * 1000, // 30 minutes for config
    ...options
  });
};

// Exportar datos
export const useExportData = () => {
  return useMutation({
    mutationFn: ({ type, format }) => adminAPI.exportData(type, format),
  });
};

// Gestión de usuarios existentes
export const useAllUsers = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminAPI.fetchAllUsers,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }) => adminAPI.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
    }
  });
};