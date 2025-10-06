// Progress Report API Service
import { ProgressReport, ProgressMetrics, DailyNeeds, RecommendedActivity, MealPlanItemUpdateResponse } from "@/types/progress";

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class ProgressApiService {
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
      console.log('Making progress API request to:', url);
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
        
        console.error('Progress API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url
        });
        
        let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        if (errorData && typeof errorData === 'object') {
          if ('message' in errorData && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          } else if ('errors' in errorData && typeof errorData.errors === 'object') {
            // Handle validation errors from API
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            errorMessage = validationErrors || errorMessage;
          } else if ('errors' in errorData && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Progress API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Progress API request failed:', error);
      throw error;
    }
  }

  async getProgressReport(period: 'week' | 'month' | 'quarter' = 'week'): Promise<ProgressReport> {
    console.log('Fetching progress report for period:', period);
    return this.makeRequest<ProgressReport>(`/Nutrition/progress-report?period=${period}`, {
      method: 'GET',
    });
  }

  async getDailyNeeds(date?: string): Promise<DailyNeeds> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    console.log('Fetching daily needs for date:', targetDate);
    return this.makeRequest<DailyNeeds>(`/Nutrition/daily-needs?date=${targetDate}`, {
      method: 'GET',
    });
  }

  async getRecommendedActivities(): Promise<RecommendedActivity[]> {
    console.log('Fetching recommended activities');
    return this.makeRequest<RecommendedActivity[]>('/Nutrition/recommended-activities', {
      method: 'GET',
    });
  }

  async updateProgressMetrics(metrics: ProgressMetrics): Promise<{ message: string }> {
    console.log('Updating progress metrics:', metrics);
    return this.makeRequest<{ message: string }>('/Nutrition/progress-metrics', {
      method: 'POST',
      body: JSON.stringify(metrics),
    });
  }

  async markActivityCompleted(activityId: number): Promise<{ message: string }> {
    console.log('Marking activity as completed:', activityId);
    return this.makeRequest<{ message: string }>(`/Nutrition/activities/${activityId}/complete`, {
      method: 'PUT',
    });
  }

  async updateMealPlanItem(
    mealPlanId: number, 
    mealPlanFoodItemId: number, 
    newMenuFoodItemId: number
  ): Promise<MealPlanItemUpdateResponse> {
    console.log('Updating meal plan item:', { mealPlanId, mealPlanFoodItemId, newMenuFoodItemId });
    return this.makeRequest<MealPlanItemUpdateResponse>(
      `/Nutrition/meal-plan/${mealPlanId}/items/${mealPlanFoodItemId}?newMenuFoodItemId=${newMenuFoodItemId}`, 
      {
        method: 'PUT',
      }
    );
  }

  // Mock data for development/testing with real profile integration
  async getMockProgressReport(): Promise<ProgressReport> {
    // This is mock data for development - replace with actual API call
    return new Promise(async (resolve) => {
      try {
        // Try to get real profile data
        const { nutritionApi } = await import('./nutritionApi');
        const userProfile = await nutritionApi.getProfile();
        
        // Calculate weight change based on profile data
        const currentWeight = userProfile.weight;
        const targetWeight = currentWeight - 5; // Example: assume 5kg weight loss goal
        const totalWeightChange = currentWeight - targetWeight;
        
        setTimeout(() => {
          resolve({
            summary: {
              period: 'week',
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date().toISOString(),
              totalWeightChange: totalWeightChange,
              averageCalories: userProfile.dailyCalorieRequirement,
              averageSteps: 8500,
              averageSleep: 7.5,
              consistencyScore: 78,
              achievements: [
                'أكملت 5 أيام من التمارين',
                'وصلت لهدف السعرات الحرارية 4 مرات',
                'شربت 2 لتر ماء يومياً'
              ],
              improvements: [
                'زيادة عدد الخطوات اليومية',
                'تحسين جودة النوم',
                'تناول المزيد من البروتين'
              ],
              recommendations: [
                'جرب تمارين القوة 3 مرات أسبوعياً',
                'أضف المزيد من الخضروات لوجباتك',
                'مارس التأمل لمدة 10 دقائق يومياً'
              ]
            },
          dailyNeeds: {
            calories: { 
              target: userProfile.dailyCalorieRequirement, 
              consumed: Math.round(userProfile.dailyCalorieRequirement * 0.8), 
              remaining: Math.round(userProfile.dailyCalorieRequirement * 0.2), 
              percentage: 80 
            },
            protein: { 
              target: Math.round(userProfile.dailyCalorieRequirement * 0.04), // 4% of calories as protein
              consumed: Math.round(userProfile.dailyCalorieRequirement * 0.03), 
              remaining: Math.round(userProfile.dailyCalorieRequirement * 0.01), 
              percentage: 75 
            },
            water: { target: 2000, consumed: 1500, remaining: 500, percentage: 75 },
            steps: { target: 10000, consumed: 8500, remaining: 1500, percentage: 85 },
            sleep: { target: 8, consumed: 7.5, remaining: 0.5, percentage: 94 }
          },
          recommendedActivities: [
            {
              id: 1,
              title: 'تمارين المشي السريع',
              description: 'امشِ بسرعة لمدة 30 دقيقة لتحسين صحة القلب',
              type: 'exercise',
              priority: 'high',
              duration: 30,
              difficulty: 'beginner',
              icon: '🚶',
              benefits: ['تحسين صحة القلب', 'حرق السعرات', 'تقوية العضلات'],
              isCompleted: false
            },
            {
              id: 2,
              title: 'تناول وجبة خفيفة صحية',
              description: 'تناول تفاحة مع ملعقة من زبدة الفول السوداني',
              type: 'nutrition',
              priority: 'medium',
              difficulty: 'beginner',
              icon: '🍎',
              benefits: ['توفير الطاقة', 'تحسين التركيز', 'تغذية صحية'],
              isCompleted: false
            },
            {
              id: 3,
              title: 'جلسة تأمل',
              description: 'مارس التأمل لمدة 10 دقائق لتحسين الصحة النفسية',
              type: 'wellness',
              priority: 'medium',
              duration: 10,
              difficulty: 'beginner',
              icon: '🧘',
              benefits: ['تقليل التوتر', 'تحسين النوم', 'زيادة التركيز'],
              isCompleted: true
            }
          ],
          chartData: {
            weight: {
              labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
              datasets: [{
                label: 'الوزن (كجم)',
                data: [
                  userProfile.weight + 0.2,
                  userProfile.weight + 0.1,
                  userProfile.weight,
                  userProfile.weight - 0.1,
                  userProfile.weight - 0.2,
                  userProfile.weight - 0.3,
                  userProfile.weight - 0.4
                ],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
              }]
            },
            calories: {
              labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
              datasets: [{
                label: 'السعرات الحرارية',
                data: [
                  Math.round(userProfile.dailyCalorieRequirement * 0.9),
                  Math.round(userProfile.dailyCalorieRequirement * 0.95),
                  Math.round(userProfile.dailyCalorieRequirement * 0.85),
                  Math.round(userProfile.dailyCalorieRequirement * 1.05),
                  Math.round(userProfile.dailyCalorieRequirement * 0.9),
                  Math.round(userProfile.dailyCalorieRequirement * 1.0),
                  Math.round(userProfile.dailyCalorieRequirement * 0.85)
                ],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4
              }]
            },
            steps: {
              labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
              datasets: [{
                label: 'عدد الخطوات',
                data: [8500, 9200, 7800, 10500, 8800, 12000, 7500],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
              }]
            },
            sleep: {
              labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
              datasets: [{
                label: 'ساعات النوم',
                data: [7.5, 8.0, 7.0, 8.5, 7.2, 9.0, 7.8],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4
              }]
            }
          },
          lastUpdated: new Date().toISOString()
        });
      }, 1000);
      } catch (error) {
        console.error('Error fetching profile data for progress report:', error);
        // Fallback to original mock data if profile fetch fails
        setTimeout(() => {
          resolve({
            summary: {
              period: 'week',
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date().toISOString(),
              totalWeightChange: -1.2,
              averageCalories: 1850,
              averageSteps: 8500,
              averageSleep: 7.5,
              consistencyScore: 78,
              achievements: [
                'أكملت 5 أيام من التمارين',
                'وصلت لهدف السعرات الحرارية 4 مرات',
                'شربت 2 لتر ماء يومياً'
              ],
              improvements: [
                'زيادة عدد الخطوات اليومية',
                'تحسين جودة النوم',
                'تناول المزيد من البروتين'
              ],
              recommendations: [
                'جرب تمارين القوة 3 مرات أسبوعياً',
                'أضف المزيد من الخضروات لوجباتك',
                'مارس التأمل لمدة 10 دقائق يومياً'
              ]
            },
            dailyNeeds: {
              calories: { target: 2000, consumed: 1650, remaining: 350, percentage: 82 },
              protein: { target: 80, consumed: 65, remaining: 15, percentage: 81 },
              water: { target: 2000, consumed: 1500, remaining: 500, percentage: 75 },
              steps: { target: 10000, consumed: 8500, remaining: 1500, percentage: 85 },
              sleep: { target: 8, consumed: 7.5, remaining: 0.5, percentage: 94 }
            },
            recommendedActivities: [
              {
                id: 1,
                title: 'تمارين المشي السريع',
                description: 'امشِ بسرعة لمدة 30 دقيقة لتحسين صحة القلب',
                type: 'exercise',
                priority: 'high',
                duration: 30,
                difficulty: 'beginner',
                icon: '🚶',
                benefits: ['تحسين صحة القلب', 'حرق السعرات', 'تقوية العضلات'],
                isCompleted: false
              },
              {
                id: 2,
                title: 'تناول وجبة خفيفة صحية',
                description: 'تناول تفاحة مع ملعقة من زبدة الفول السوداني',
                type: 'nutrition',
                priority: 'medium',
                difficulty: 'beginner',
                icon: '🍎',
                benefits: ['توفير الطاقة', 'تحسين التركيز', 'تغذية صحية'],
                isCompleted: false
              },
              {
                id: 3,
                title: 'جلسة تأمل',
                description: 'مارس التأمل لمدة 10 دقائق لتحسين الصحة النفسية',
                type: 'wellness',
                priority: 'medium',
                duration: 10,
                difficulty: 'beginner',
                icon: '🧘',
                benefits: ['تقليل التوتر', 'تحسين النوم', 'زيادة التركيز'],
                isCompleted: true
              }
            ],
            chartData: {
              weight: {
                labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
                datasets: [{
                  label: 'الوزن (كجم)',
                  data: [75.2, 75.0, 74.8, 74.6, 74.4, 74.2, 74.0],
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                }]
              },
              calories: {
                labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
                datasets: [{
                  label: 'السعرات الحرارية',
                  data: [1800, 1950, 1700, 2100, 1850, 2000, 1750],
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  tension: 0.4
                }]
              },
              steps: {
                labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
                datasets: [{
                  label: 'عدد الخطوات',
                  data: [8500, 9200, 7800, 10500, 8800, 12000, 7500],
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4
                }]
              },
              sleep: {
                labels: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
                datasets: [{
                  label: 'ساعات النوم',
                  data: [7.5, 8.0, 7.0, 8.5, 7.2, 9.0, 7.8],
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  tension: 0.4
                }]
              }
            },
            lastUpdated: new Date().toISOString()
          });
        }, 1000);
      }
    });
  }
}

export const progressApi = new ProgressApiService();
