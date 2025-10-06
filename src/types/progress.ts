// Progress Report Types and Interfaces

export interface ProgressMetrics {
  date: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
  weight?: number; // Weight in kg
  bodyFat?: number; // Body fat percentage
  muscleMass?: number; // Muscle mass in kg
  waterIntake?: number; // Water intake in ml
  steps?: number; // Number of steps taken
  caloriesBurned?: number; // Calories burned
  sleepHours?: number; // Hours of sleep
  mood?: number; // Mood rating (1-10 scale)
}

export interface DailyNeeds {
  calories: {
    target: number;
    consumed: number;
    remaining: number;
    percentage: number;
  };
  protein: {
    target: number;
    consumed: number;
    remaining: number;
    percentage: number;
  };
  water: {
    target: number; // in ml
    consumed: number;
    remaining: number;
    percentage: number;
  };
  steps: {
    target: number;
    consumed: number; // Changed from 'achieved' to 'consumed' to match API spec
    remaining: number;
    percentage: number;
  };
  sleep: {
    target: number; // in hours
    consumed: number; // Changed from 'achieved' to 'consumed' to match API spec
    remaining: number;
    percentage: number;
  };
}

export interface RecommendedActivity {
  id: number;
  title: string;
  description: string;
  type: 'exercise' | 'nutrition' | 'lifestyle' | 'wellness';
  priority: 'high' | 'medium' | 'low';
  duration?: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  benefits: string[];
  isCompleted: boolean;
}

export interface ProgressSummary {
  period: 'week' | 'month' | 'quarter';
  startDate: string;
  endDate: string;
  totalWeightChange: number;
  averageCalories: number;
  averageSteps: number;
  averageSleep: number;
  consistencyScore: number; // 0-100
  achievements: string[];
  improvements: string[];
  recommendations: string[];
}

export interface ProgressChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface ProgressReport {
  summary: ProgressSummary;
  dailyNeeds: DailyNeeds;
  recommendedActivities: RecommendedActivity[];
  chartData: {
    weight: ProgressChartData;
    calories: ProgressChartData;
    steps: ProgressChartData;
    sleep: ProgressChartData;
  };
  lastUpdated: string;
}

export interface MealPlanItemUpdateResponse {
  success: boolean;
  message: string;
  updatedItem?: {
    id: number;
    name: string;
    quantity: number;
    calories: number;
  };
}

// API Response Types
export interface ProgressMetricsResponse {
  message: string;
}

export interface ActivityCompletionResponse {
  message: string;
}

export interface ApiErrorResponse {
  type?: string;
  title?: string;
  status: number;
  errors?: Record<string, string[]>;
  message?: string;
}

// Helper functions for progress calculations
export const calculateProgressPercentage = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getProgressBarColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getActivityTypeIcon = (type: RecommendedActivity['type']): string => {
  switch (type) {
    case 'exercise': return '💪';
    case 'nutrition': return '🥗';
    case 'lifestyle': return '🌱';
    case 'wellness': return '🧘';
    default: return '📋';
  }
};

export const getPriorityColor = (priority: RecommendedActivity['priority']): string => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
