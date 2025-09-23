// Meal Plan Types and Interfaces

export enum MealType {
  Breakfast = 1,
  Snack1 = 2,
  Lunch = 3,
  Snack2 = 4,
  Dinner = 5
}

export interface MealPlanFoodItem {
  id: number;
  name: string;
  description: string;
  category: number;
  quantity: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  notes: string;
}

export interface MealPlan {
  id: number;
  date: string;
  mealType: MealType;
  recommendations: string;
  healthNotes: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalFiber: number;
  foodItems: MealPlanFoodItem[];
  createdAt: string;
}

export interface CreateMealPlanRequest {
  date: string;
  mealType: MealType;
  foodItemId: number;
  quantity?: number;
}

export interface MealPlanResponse {
  id: number;
  date: string;
  mealType: MealType;
  recommendations: string;
  healthNotes: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalFiber: number;
  foodItems: MealPlanFoodItem[];
  createdAt: string;
}

// Helper functions for meal types
export const getMealTypeLabel = (mealType: MealType): string => {
  switch (mealType) {
    case MealType.Breakfast:
      return "الإفطار";
    case MealType.Snack1:
      return "وجبة خفيفة 1";
    case MealType.Lunch:
      return "الغداء";
    case MealType.Snack2:
      return "وجبة خفيفة 2";
    case MealType.Dinner:
      return "العشاء";
    default:
      return "غير محدد";
  }
};

export const getMealTypeDescription = (mealType: MealType): string => {
  switch (mealType) {
    case MealType.Breakfast:
      return "ابدأ يومك بوجبة إفطار صحية ومتوازنة";
    case MealType.Snack1:
      return "وجبة خفيفة صحية بين الإفطار والغداء";
    case MealType.Lunch:
      return "وجبة غداء متكاملة وغنية بالعناصر الغذائية";
    case MealType.Snack2:
      return "وجبة خفيفة بعد الظهر لزيادة الطاقة";
    case MealType.Dinner:
      return "وجبة عشاء خفيفة وصحية لإنهاء اليوم";
    default:
      return "وجبة صحية ومتوازنة";
  }
};

export const getMealTypeIcon = (mealType: MealType): string => {
  switch (mealType) {
    case MealType.Breakfast:
      return "🌅";
    case MealType.Snack1:
      return "🍎";
    case MealType.Lunch:
      return "🍽️";
    case MealType.Snack2:
      return "🥜";
    case MealType.Dinner:
      return "🌙";
    default:
      return "🍴";
  }
};
