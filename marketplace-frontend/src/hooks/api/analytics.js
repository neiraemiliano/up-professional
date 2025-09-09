import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/client";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Analytics API calls
const analyticsApi = {
  // Admin protected endpoints (require authentication)
  getDashboardAnalytics: (params) => 
    api.get("/analytics/dashboard", { params }).then(res => res.data),
  getRealtimeAnalytics: () => 
    api.get("/analytics/dashboard/realtime").then(res => res.data),
  getUserAnalytics: (params) => 
    api.get("/analytics/users", { params }).then(res => res.data),
  getProfessionalAnalytics: (params) => 
    api.get("/analytics/professionals", { params }).then(res => res.data),
  getSearchAnalytics: (params) => 
    api.get("/analytics/search", { params }).then(res => res.data),
  getBookingAnalytics: (params) => 
    api.get("/analytics/bookings", { params }).then(res => res.data),
  getRevenueAnalytics: (params) => 
    api.get("/analytics/revenue", { params }).then(res => res.data),
  getEvents: (params) => 
    api.get("/analytics/events", { params }).then(res => res.data),
  exportAnalytics: (type, params) => 
    api.get(`/analytics/export/${type}`, { params }).then(res => res.data),
  
  // Public endpoint (no authentication required)
  trackEvent: (eventData) => 
    axios.post(`${API_BASE}/analytics/events`, eventData)
};

// Dashboard Analytics
export const useDashboardAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "dashboard", period],
    queryFn: () => analyticsApi.getDashboardAnalytics({ period }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

// Real-time Analytics
export const useRealtimeAnalytics = (options = {}) => {
  return useQuery({
    queryKey: ["analytics", "realtime"],
    queryFn: () => analyticsApi.getRealtimeAnalytics(),
    refetchInterval: false, // Disable auto refresh to fix loop
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// User Analytics
export const useUserAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "users", period],
    queryFn: () => analyticsApi.getUserAnalytics({ period }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
};

// Professional Analytics
export const useProfessionalAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "professionals", period],
    queryFn: () => analyticsApi.getProfessionalAnalytics({ period }),
    staleTime: 10 * 60 * 1000,
    ...options
  });
};

// Search Analytics
export const useSearchAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "search", period],
    queryFn: () => analyticsApi.getSearchAnalytics({ period }),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options
  });
};

// Booking Analytics
export const useBookingAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "bookings", period],
    queryFn: () => analyticsApi.getBookingAnalytics({ period }),
    staleTime: 10 * 60 * 1000,
    ...options
  });
};

// Revenue Analytics
export const useRevenueAnalytics = (period = "30d", options = {}) => {
  return useQuery({
    queryKey: ["analytics", "revenue", period],
    queryFn: () => analyticsApi.getRevenueAnalytics({ period }),
    staleTime: 10 * 60 * 1000,
    ...options
  });
};

// Events Query
export const useAnalyticsEvents = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["analytics", "events", filters],
    queryFn: () => analyticsApi.getEvents(filters),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// Track Event Mutation
export const useTrackEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData) => analyticsApi.trackEvent(eventData),
    onSuccess: () => {
      // Invalidate real-time analytics on new events
      queryClient.invalidateQueries({ queryKey: ["analytics", "realtime"] });
    },
    onError: (error) => {
      console.error("Error tracking event:", error);
    }
  });
};

// Export Analytics Mutation
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: ({ type, params }) => analyticsApi.exportAnalytics(type, params),
    onError: (error) => {
      console.error("Error exporting analytics:", error);
    }
  });
};

// Combined Analytics Hook for Dashboard Overview
export const useAnalyticsOverview = (period = "30d") => {
  const dashboard = useDashboardAnalytics(period);
  const realtime = useRealtimeAnalytics();
  const users = useUserAnalytics(period);
  const search = useSearchAnalytics(period);
  const bookings = useBookingAnalytics(period);
  const revenue = useRevenueAnalytics(period);

  return {
    dashboard,
    realtime,
    users,
    search,
    bookings,
    revenue,
    isLoading: dashboard.isLoading || realtime.isLoading,
    isError: dashboard.isError || realtime.isError,
    refetchAll: () => {
      dashboard.refetch();
      realtime.refetch();
      users.refetch();
      search.refetch();
      bookings.refetch();
      revenue.refetch();
    }
  };
};

// Frontend Analytics Tracking Helper
export const useAnalyticsTracker = () => {
  const trackEvent = useTrackEvent();

  const track = (eventType, data = {}) => {
    const eventData = {
      eventType,
      category: data.category || 'user',
      action: data.action || 'view',
      label: data.label,
      value: data.value,
      userId: data.userId,
      professionalId: data.professionalId,
      bookingId: data.bookingId,
      sessionId: data.sessionId || sessionStorage.getItem('sessionId'),
      metadata: data.metadata || {}
    };

    trackEvent.mutate(eventData);
  };

  // Convenience methods
  const trackPageView = (pagePath, metadata = {}) => {
    track('page_view', {
      category: 'navigation',
      action: 'view',
      label: pagePath,
      metadata: { ...metadata, pagePath }
    });
  };

  const trackSearch = (searchTerm, resultCount = 0, metadata = {}) => {
    track('search', {
      category: 'search',
      action: 'search',
      label: searchTerm,
      value: resultCount,
      metadata: { ...metadata, searchTerm, resultCount }
    });
  };

  const trackProfessionalContact = (professionalId, contactMethod, metadata = {}) => {
    track('professional_contact', {
      category: 'professional',
      action: 'contact',
      label: contactMethod,
      professionalId,
      metadata: { ...metadata, contactMethod }
    });
  };

  const trackBookingCreation = (bookingId, bookingValue, metadata = {}) => {
    track('booking_created', {
      category: 'booking',
      action: 'create',
      value: bookingValue,
      bookingId,
      metadata
    });
  };

  return {
    track,
    trackPageView,
    trackSearch,
    trackProfessionalContact,
    trackBookingCreation,
    isLoading: trackEvent.isPending
  };
};