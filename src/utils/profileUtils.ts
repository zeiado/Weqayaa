import { UserProfile } from "@/types/nutrition";

/**
 * Check if a user profile is complete and valid
 */
export const isProfileComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  
  // Check if all required fields are present and valid
  return (
    profile.age > 0 &&
    profile.height > 0 &&
    profile.weight > 0 &&
    profile.activityLevel !== undefined &&
    profile.healthGoal !== undefined &&
    profile.dailyCalorieRequirement > 0
  );
};

/**
 * Get profile completion percentage
 */
export const getProfileCompletionPercentage = (profile: UserProfile | null): number => {
  if (!profile) return 0;
  
  const requiredFields = [
    'age',
    'height', 
    'weight',
    'activityLevel',
    'healthGoal',
    'dailyCalorieRequirement'
  ];
  
  const completedFields = requiredFields.filter(field => {
    const value = profile[field as keyof UserProfile];
    return value !== undefined && value !== null && value !== 0;
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

/**
 * Get missing profile fields
 */
export const getMissingProfileFields = (profile: UserProfile | null): string[] => {
  if (!profile) return ['age', 'height', 'weight', 'activityLevel', 'healthGoal'];
  
  const missing: string[] = [];
  
  if (!profile.age || profile.age <= 0) missing.push('age');
  if (!profile.height || profile.height <= 0) missing.push('height');
  if (!profile.weight || profile.weight <= 0) missing.push('weight');
  if (profile.activityLevel === undefined) missing.push('activityLevel');
  if (profile.healthGoal === undefined) missing.push('healthGoal');
  
  return missing;
};

/**
 * Check if a feature requires profile completion
 */
export const requiresProfileCompletion = (feature: string): boolean => {
  const profileRequiredFeatures = [
    'chat',
    'progress',
    'mealplan',
    'recommendations',
    'nutrition-tracking'
  ];
  
  return profileRequiredFeatures.includes(feature);
};
