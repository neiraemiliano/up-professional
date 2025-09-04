import React, { createContext, useContext } from 'react';
import { useEnabledFeaturesMap } from '../hooks/api/featureFlags';

const FeatureFlagsContext = createContext({});

export const FeatureFlagsProvider = ({ children }) => {
  const { 
    data: featureFlags, 
    isLoading, 
    error 
  } = useEnabledFeaturesMap();

  console.log('FeatureFlagsProvider - featureFlags:', featureFlags);
  console.log('FeatureFlagsProvider - isLoading:', isLoading);

  // Feature flags helper
  const isFeatureEnabled = (flagId) => {
    console.log(`Checking feature ${flagId}:`, featureFlags?.[flagId]);
    if (isLoading || !featureFlags) return false;
    return Boolean(featureFlags[flagId]);
  };

  const value = {
    featureFlags: featureFlags || {},
    isFeatureEnabled,
    isLoading,
    error
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

export default FeatureFlagsContext;