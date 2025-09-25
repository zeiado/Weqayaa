// Meal Plan API Service
import { CreateMealPlanRequest, UpdateMealPlanRequest, MealPlanResponse } from "@/types/mealPlan";

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
    // Backend expects: { date, mealType, menueId, quantity }
    const payload = {
      date: mealPlanData.date,
      mealType: mealPlanData.mealType,
      menueId: mealPlanData.menueId,
      quantity: mealPlanData.quantity,
    };
    console.log('Making request to create meal plan:', payload);
    return this.makeRequest<MealPlanResponse>('/Nutrition/meal-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMealPlans(fromDate: string, toDate: string): Promise<MealPlanResponse[]> {
    // Use plural route for GET to avoid 405
    return this.makeRequest<MealPlanResponse[]>(`/Nutrition/meal-plans?fromDate=${fromDate}&toDate=${toDate}`, {
      method: 'GET',
    });
  }

  async updateMealPlan(mealPlanId: number, mealPlanData: UpdateMealPlanRequest): Promise<MealPlanResponse> {
    console.log('Making request to update meal plan:', { mealPlanId, mealPlanData });
    return this.makeRequest<MealPlanResponse>(`/Nutrition/meal-plan/${mealPlanId}`, {
      method: 'PUT',
      body: JSON.stringify(mealPlanData),
    });
  }

  async deleteMealPlan(mealPlanId: number): Promise<void> {
    console.log('Making request to delete meal plan:', mealPlanId);
    return this.makeRequest<void>(`/Nutrition/meal-plan/${mealPlanId}`, {
      method: 'DELETE',
    });
  }

  async addItem(mealPlanId: number, menuFoodItemId: number): Promise<MealPlanResponse> {
    // Backend expects menueFoodItemId as a query parameter (not in body)
    const params = new URLSearchParams({ menuFoodItemId: String(menuFoodItemId) });
    const endpoint = `/Nutrition/meal-plan/${mealPlanId}/items?${params.toString()}`;
    console.log('Adding item to meal plan via query:', { mealPlanId, menuFoodItemId: menuFoodItemId });
    return this.makeRequest<MealPlanResponse>(endpoint, {
      method: 'POST',
    });
  }

  // Note: Food item validation is now handled by the backend
  // The validateFoodItem method has been removed as it was causing issues
  // The backend meal plan API will validate food items during creation
}

export const mealPlanApi = new MealPlanApiService();
