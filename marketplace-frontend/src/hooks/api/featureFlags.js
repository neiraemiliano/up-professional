// src/hooks/api/featureFlags.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import featureFlagsAPI from "../../api/featureFlags";

// Query keys
const QUERY_KEYS = {
  FEATURE_FLAGS: ['featureFlags'],
  FEATURE_FLAGS_GROUPED: ['featureFlags', 'grouped'],
  ENABLED_FLAGS: ['featureFlags', 'enabled'],
  ENABLED_MAP: ['featureFlags', 'enabledMap'],
  FEATURE_FLAG: (id) => ['featureFlags', id],
};

// Get all feature flags (admin only)
export const useFeatureFlags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FEATURE_FLAGS,
    queryFn: featureFlagsAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get feature flags grouped by category (admin only)
export const useFeatureFlagsGrouped = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FEATURE_FLAGS_GROUPED,
    queryFn: featureFlagsAPI.getGrouped,
  });
};

// Get enabled feature flags (public)
export const useEnabledFeatureFlags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ENABLED_FLAGS,
    queryFn: featureFlagsAPI.getEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get enabled features map (public)
export const useEnabledFeaturesMap = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ENABLED_MAP,
    queryFn: featureFlagsAPI.getEnabledMap,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single feature flag (admin only)
export const useFeatureFlag = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.FEATURE_FLAG(id),
    queryFn: () => featureFlagsAPI.getById(id),
    enabled: Boolean(id),
  });
};

// Check if feature is enabled (public)
export const useIsFeatureEnabled = (flagId) => {
  return useQuery({
    queryKey: ['featureEnabled', flagId],
    queryFn: () => featureFlagsAPI.checkEnabled(flagId).then(res => res.isEnabled),
    enabled: Boolean(flagId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Toggle feature flag mutation (admin only)
export const useToggleFeatureFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => featureFlagsAPI.toggle(id),
    onSuccess: () => {
      // Invalidate and refetch all feature flag queries
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
      queryClient.invalidateQueries({ queryKey: ['featureEnabled'] });
    },
  });
};

// Update feature flag mutation (admin only)
export const useUpdateFeatureFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => featureFlagsAPI.update(id, data),
    onSuccess: (data, variables) => {
      // Update specific feature flag in cache
      queryClient.setQueryData(QUERY_KEYS.FEATURE_FLAG(variables.id), data);
      // Invalidate other queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEATURE_FLAGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEATURE_FLAGS_GROUPED });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENABLED_FLAGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENABLED_MAP });
    },
  });
};

// Create feature flag mutation (admin only)
export const useCreateFeatureFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => featureFlagsAPI.create(data),
    onSuccess: () => {
      // Invalidate all feature flag queries to refetch
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });
};

// Delete feature flag mutation (admin only)
export const useDeleteFeatureFlag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => featureFlagsAPI.delete(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.FEATURE_FLAG(id) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEATURE_FLAGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEATURE_FLAGS_GROUPED });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENABLED_FLAGS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENABLED_MAP });
    },
  });
};

// Custom hook to easily check if features are enabled in components
export const useFeatureState = () => {
  const { data: featuresMap = {}, isLoading } = useEnabledFeaturesMap();
  
  const isEnabled = (flagId) => {
    if (isLoading) return false;
    return Boolean(featuresMap[flagId]);
  };

  return {
    isEnabled,
    features: featuresMap,
    isLoading
  };
};