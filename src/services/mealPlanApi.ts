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
      console.log('Making request to:', url);
      console.log('Request config:', {
        method: config.method,
        headers: config.headers,
        body: config.body
      });
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url
        });
        
        // Provide more specific error messages
        let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        if (errorData && typeof errorData === 'object') {
          if ('message' in errorData && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          } else if ('errors' in errorData && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Meal Plan API request failed:', error);
      throw error;
    }
  }

  async createMealPlan(mealPlanData: CreateMealPlanRequest): Promise<MealPlanResponse> {
    console.log('Making request to create meal plan:', mealPlanData);
    return this.makeRequest<MealPlanResponse>('/Nutrition/meal-plana', {
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
