// Nutrition Profile Types and Enums

export enum ActivityLevel {
  Sedentary = 1,        // Little to no exercise
  LightlyActive = 2,    // Light exercise 1-3 days/week
  ModeratelyActive = 3, // Moderate exercise 3-5 days/week
  VeryActive = 4,       // Heavy exercise 6-7 days/week
  ExtraActive = 5       // Very heavy exercise, physical job
}

export enum HealthGoal {
  LoseWeight = 1,
  GainMuscle = 2,
  MaintainWeight = 3
}

export enum HealthConditionType {
  None = 0,
  Diabetes = 1,
  Hypertension = 2,
  Anemia = 3,
  Obesity = 4,
  HeartDisease = 5,
  HighCholesterol = 6,
  CeliacDisease = 7,
  LactoseIntolerance = 8
}

export interface HealthCondition {
  id: number;
  userProfileId: number;
  conditionType: HealthConditionType;
  notes?: string;
  diagnosedAt: string;
  isActive: boolean;
}

export interface CreateProfileRequest {
  activityLevel: ActivityLevel;
  age: number;
  healthGoal: HealthGoal;
  height: number; // in cm
  weight: number; // in kg
  healthConditions: number[]; // Array of HealthConditionType values
}

export interface UserProfile {
  id: number;
  age: number;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;
  healthConditions: number[];
  bmi: number;
  dailyCalorieRequirement: number;
  createdAt: string;
  updatedAt: string;
}

// Helper functions for enum labels
export const getActivityLevelLabel = (level: ActivityLevel): string => {
  switch (level) {
    case ActivityLevel.Sedentary:
      return "قليل النشاط";
    case ActivityLevel.LightlyActive:
      return "نشاط خفيف";
    case ActivityLevel.ModeratelyActive:
      return "نشاط متوسط";
    case ActivityLevel.VeryActive:
      return "نشاط عالي";
    case ActivityLevel.ExtraActive:
      return "نشاط مكثف";
    default:
      return "غير محدد";
  }
};

export const getHealthGoalLabel = (goal: HealthGoal): string => {
  switch (goal) {
    case HealthGoal.LoseWeight:
      return "فقدان الوزن";
    case HealthGoal.GainMuscle:
      return "بناء العضلات";
    case HealthGoal.MaintainWeight:
      return "المحافظة على الوزن";
    default:
      return "غير محدد";
  }
};

export const getHealthConditionLabel = (condition: HealthConditionType): string => {
  switch (condition) {
    case HealthConditionType.None:
      return "لا توجد";
    case HealthConditionType.Diabetes:
      return "السكري";
    case HealthConditionType.Hypertension:
      return "ارتفاع ضغط الدم";
    case HealthConditionType.Anemia:
      return "فقر الدم";
    case HealthConditionType.Obesity:
      return "السمنة";
    case HealthConditionType.HeartDisease:
      return "أمراض القلب";
    case HealthConditionType.HighCholesterol:
      return "ارتفاع الكوليسترول";
    case HealthConditionType.CeliacDisease:
      return "مرض الاضطرابات الهضمية";
    case HealthConditionType.LactoseIntolerance:
      return "عدم تحمل اللاكتوز";
    default:
      return "غير محدد";
  }
};
