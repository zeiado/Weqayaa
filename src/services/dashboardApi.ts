// Dashboard API Service
import { DashboardSummaryResponse, RecommendedMeal, UserStatisticsResponse, StatisticsPeriod } from "@/types/dashboard";

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class DashboardApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

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
        throw new Error((errorData as any).message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Dashboard API request failed:', error);
      throw error;
    }
  }

  async getDashboardSummary(date?: string): Promise<DashboardSummaryResponse> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.makeRequest<DashboardSummaryResponse>(`/Nutrition/dashboard/summary?date=${targetDate}`, { method: 'GET' });
  }

  async getRecommendedMeals(date?: string): Promise<RecommendedMeal[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.makeRequest<RecommendedMeal[]>(`/Nutrition/dashboard/recommended-meals?date=${targetDate}`, { method: 'GET' });
  }

  async getUserStatistics(period: StatisticsPeriod = 'week'): Promise<UserStatisticsResponse> {
    return this.makeRequest<UserStatisticsResponse>(`/Nutrition/dashboard/user-statistics?period=${period}`, { method: 'GET' });
  }
}

export const dashboardApi = new DashboardApiService();


