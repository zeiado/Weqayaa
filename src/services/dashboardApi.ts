// Dashboard API Service
import { DashboardSummaryResponse, RecommendedMeal, UserStatisticsResponse, StatisticsPeriod, QuickActivity } from "@/types/dashboard";

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

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
        const message = (errorData as any)?.message || `HTTP error! status: ${response.status}`;
        console.error('Dashboard API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new HttpError(message, response.status);
      }
      return await response.json();
    } catch (error) {
      console.error('Dashboard API request failed:', {
        url,
        error,
        config: {
          method: config.method,
          headers: config.headers
        }
      });
      throw error;
    }
  }

  async getDashboardSummary(date?: string): Promise<DashboardSummaryResponse> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    try {
      console.log('🔄 Attempting to fetch dashboard summary from API...');
      const result = await this.makeRequest<DashboardSummaryResponse>(`/Nutrition/dashboard/summary?date=${targetDate}`, { method: 'GET' });
      console.log('✅ Dashboard summary fetched successfully:', result);
      return result;
    } catch (error) {
      console.warn('⚠️ Dashboard API unavailable, using fallback data:', error);
      const fallbackData = this.getFallbackDashboardSummary();
      console.log('📊 Using fallback data:', fallbackData);
      return fallbackData;
    }
  }

  private getFallbackDashboardSummary(): DashboardSummaryResponse {
    return {
      date: new Date().toISOString().split('T')[0],
      progress: {
        caloriesConsumed: 0,
        caloriesTarget: 2000,
        proteinConsumed: 0,
        proteinTarget: 150,
        waterConsumed: 0,
        waterTarget: 2000,
        stepsToday: 0,
        stepsTarget: 10000,
        sleepHours: 0,
        sleepTarget: 8,
        caloriesPercentage: 0,
        proteinPercentage: 0,
        waterPercentage: 0,
        stepsPercentage: 0,
        sleepPercentage: 0
      },
      recommendedMeals: this.getFallbackRecommendedMeals(),
      quickActivities: this.getFallbackQuickActivities()
    };
  }

  async getRecommendedMeals(date?: string): Promise<RecommendedMeal[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    try {
      return await this.makeRequest<RecommendedMeal[]>(`/Nutrition/dashboard/recommended-meals?date=${targetDate}`, { method: 'GET' });
    } catch (error) {
      console.warn('Recommended meals API unavailable, using fallback data:', error);
      return this.getFallbackRecommendedMeals();
    }
  }

  private getFallbackRecommendedMeals(): RecommendedMeal[] {
    return [
      {
        id: 1,
        name: 'سلطة الخضار الطازجة',
        description: 'مزيج من الخضار الطازجة مع زيت الزيتون',
        calories: 150,
        protein: 8,
        carbohydrates: 12,
        fat: 8,
        price: 15,
        rating: 4.5,
        available: true,
        category: 'Salad',
        imageUrl: '/placeholder.svg',
        recommendationReason: 'غنية بالفيتامينات والألياف',
        healthBenefits: ['مصدر جيد للفيتامينات', 'قليلة السعرات الحرارية', 'مفيدة للهضم']
      },
      {
        id: 2,
        name: 'شوربة العدس',
        description: 'شوربة العدس المغذية واللذيذة',
        calories: 200,
        protein: 12,
        carbohydrates: 25,
        fat: 5,
        price: 20,
        rating: 4.2,
        available: true,
        category: 'MainCourse',
        imageUrl: '/placeholder.svg',
        recommendationReason: 'مصدر ممتاز للبروتين النباتي',
        healthBenefits: ['غنية بالبروتين', 'مفيدة للقلب', 'مصدر جيد للحديد']
      }
    ];
  }

  private getFallbackQuickActivities(): QuickActivity[] {
    return [
      {
        id: 1,
        title: 'شرب كوب من الماء',
        description: 'اشرب كوب من الماء للحفاظ على الترطيب',
        type: 'wellness',
        duration: 1,
        icon: '💧',
        isCompleted: false
      },
      {
        id: 2,
        title: 'تمارين الإطالة',
        description: 'قم بتمارين الإطالة لمدة 5 دقائق',
        type: 'exercise',
        duration: 5,
        icon: '🤸',
        isCompleted: false
      },
      {
        id: 3,
        title: 'تناول وجبة خفيفة صحية',
        description: 'تناول وجبة خفيفة غنية بالبروتين',
        type: 'nutrition',
        duration: 10,
        icon: '🥗',
        isCompleted: false
      }
    ];
  }

  async getUserStatistics(period: StatisticsPeriod = 'week'): Promise<UserStatisticsResponse> {
    try {
      return await this.makeRequest<UserStatisticsResponse>(`/Nutrition/dashboard/user-statistics?period=${period}`, { method: 'GET' });
    } catch (error) {
      console.warn('User statistics API unavailable, using fallback data:', error);
      return this.getFallbackUserStatistics(period);
    }
  }

  private getFallbackUserStatistics(period: StatisticsPeriod): UserStatisticsResponse {
    return {
      period,
      streakDays: 0,
      totalMealsLogged: 0,
      averageCaloriesPerDay: 0,
      averageProteinPerDay: 0,
      goalAchievementRate: 0,
      achievements: [],
      weeklyProgress: {
        weightChange: 0,
        calorieConsistency: 0,
        proteinConsistency: 0
      }
    };
  }
}

export const dashboardApi = new DashboardApiService();


