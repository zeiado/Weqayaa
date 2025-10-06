import { useState, useEffect, useCallback } from "react";
import { nutritionApi } from "@/services/nutritionApi";
import { UserProfile } from "@/types/nutrition";

interface ProfileCompletionStatus {
  hasProfile: boolean;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: number | null;
}

export const useProfileCompletion = () => {
  const [status, setStatus] = useState<ProfileCompletionStatus>({
    hasProfile: false,
    profile: null,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const checkProfile = useCallback(async (force = false) => {
    // Don't check again if we checked recently (within 5 minutes) unless forced
    const now = Date.now();
    if (!force && status.lastChecked && (now - status.lastChecked) < 5 * 60 * 1000) {
      return status;
    }

    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const profile = await nutritionApi.getProfile();
      
      setStatus({
        hasProfile: true,
        profile,
        isLoading: false,
        error: null,
        lastChecked: now
      });
      
      return {
        hasProfile: true,
        profile,
        isLoading: false,
        error: null,
        lastChecked: now
      };
    } catch (error: any) {
      console.error('Profile check error:', error);
      
      const newStatus = {
        hasProfile: false,
        profile: null,
        isLoading: false,
        error: 'ملف غير مكتمل', // Hide technical error details
        lastChecked: now
      };
      
      setStatus(newStatus);
      return newStatus;
    }
  }, [status.lastChecked]);

  const refreshProfile = useCallback(() => {
    return checkProfile(true);
  }, [checkProfile]);

  const clearProfile = useCallback(() => {
    setStatus({
      hasProfile: false,
      profile: null,
      isLoading: false,
      error: null,
      lastChecked: null
    });
  }, []);

  // Check profile on mount
  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  return {
    ...status,
    checkProfile,
    refreshProfile,
    clearProfile,
    isProfileComplete: status.hasProfile && status.profile !== null,
    needsProfileCompletion: !status.isLoading && !status.hasProfile
  };
};
