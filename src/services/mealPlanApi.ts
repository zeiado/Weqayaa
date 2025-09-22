// Meal Plan API Service
import { CreateMealPlanRequest, MealPlanResponse } from "@/types/mealPlan";

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class MealPlanApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Meal Plan API request failed:', error);
      throw error;
    }
  }

  async createMealPlan(mealPlanData: CreateMealPlanRequest): Promise<MealPlanResponse> {
    return this.makeRequest<MealPlanResponse>('/Nutrition/meal-plan', {
      method: 'POST',
      body: JSON.stringify(mealPlanData),
    });
  }

  async getMealPlans(fromDate: string, toDate: string): Promise<MealPlanResponse[]> {
    return this.makeRequest<MealPlanResponse[]>(`/Nutrition/meal-plans?fromDate=${fromDate}&toDate=${toDate}`, {
      method: 'GET',
    });
  }
}

export const mealPlanApi = new MealPlanApiService();
