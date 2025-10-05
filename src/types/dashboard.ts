// Dashboard Types and Interfaces

export interface DashboardProgress {
  caloriesConsumed: number;
  caloriesTarget: number;
  proteinConsumed: number;
  proteinTarget: number;
  waterConsumed: number;
  waterTarget: number; // in ml
  stepsToday: number;
  stepsTarget: number;
  sleepHours: number;
  sleepTarget: number; // in hours
  caloriesPercentage: number;
  proteinPercentage: number;
  waterPercentage: number;
  stepsPercentage: number;
  sleepPercentage: number;
}

export type MealCategory =
  | 'MainCourse'
  | 'Salad'
  | 'Snack'
  | 'Breakfast'
  | 'Dessert'
  | 'Drink';

export interface RecommendedMeal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  price: number;
  rating: number;
  available: boolean;
  category: MealCategory | string;
  imageUrl: string;
  recommendationReason: string;
  healthBenefits: string[];
}

export type ActivityType = 'exercise' | 'nutrition' | 'wellness' | 'lifestyle';

export interface QuickActivity {
  id: number;
  title: string;
  description: string;
  type: ActivityType;
  duration?: number; // minutes
  icon?: string; // emoji or icon code
  isCompleted: boolean;
}

export interface DashboardSummaryResponse {
  date: string; // ISO
  progress: DashboardProgress;
  recommendedMeals: RecommendedMeal[];
  quickActivities: QuickActivity[];
}

export type StatisticsPeriod = 'week' | 'month' | 'quarter';

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  earnedAt: string; // ISO
  icon?: string;
}

export interface UserStatisticsResponse {
  period: StatisticsPeriod;
  streakDays: number;
  totalMealsLogged: number;
  averageCaloriesPerDay: number;
  averageProteinPerDay: number;
  goalAchievementRate: number; // percentage
  achievements: UserAchievement[];
  weeklyProgress: {
    weightChange: number;
    calorieConsistency: number;
    proteinConsistency: number;
  };
}


