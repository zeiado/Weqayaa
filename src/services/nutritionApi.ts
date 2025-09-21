// Nutrition Profile API Service
import { CreateProfileRequest, UserProfile } from "@/types/nutrition";

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class NutritionApiService {
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
      console.error('Nutrition API request failed:', error);
      throw error;
    }
  }

  async createProfile(profileData: CreateProfileRequest): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/Nutrition/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/Nutrition/profile', {
      method: 'GET',
    });
  }

  async updateProfile(profileData: Partial<CreateProfileRequest>): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/Nutrition/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async deleteProfile(): Promise<void> {
    return this.makeRequest<void>('/Nutrition/profile', {
      method: 'DELETE',
    });
  }
}

export const nutritionApi = new NutritionApiService();
