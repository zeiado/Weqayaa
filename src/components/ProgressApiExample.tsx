import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Activity, 
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';
import { progressApi } from '@/services/progressApi';
import { ProgressMetrics, RecommendedActivity } from '@/types/progress';
import { useToast } from '@/hooks/use-toast';

/**
 * Example component demonstrating the Progress Metrics and Activities APIs
 * This component shows how to:
 * 1. Update progress metrics with partial data
 * 2. Mark activities as completed
 * 3. Handle API errors properly
 * 4. Display success/error messages
 */
export const ProgressApiExample: React.FC = () => {
  const [activities, setActivities] = useState<RecommendedActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isUpdatingMetrics, setIsUpdatingMetrics] = useState(false);
  const [isCompletingActivity, setIsCompletingActivity] = useState<number | null>(null);
  const { toast } = useToast();

  // Sample metrics form data
  const [metrics, setMetrics] = useState<Partial<ProgressMetrics>>({
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    steps: undefined,
    sleepHours: undefined,
    mood: undefined
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const activitiesData = await progressApi.getRecommendedActivities();
      setActivities(activitiesData);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "خطأ في تحميل الأنشطة",
        description: "حدث خطأ أثناء تحميل الأنشطة المقترحة",
        variant: "destructive",
      });
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleMetricsUpdate = async () => {
    try {
      setIsUpdatingMetrics(true);
      
      // Filter out undefined values and convert date to ISO format
      const filteredMetrics = Object.fromEntries(
        Object.entries(metrics).filter(([key, value]) => value !== undefined && value !== null && value !== '')
      );
      
      // Ensure date is in ISO format
      if (filteredMetrics.date) {
        const date = new Date(filteredMetrics.date);
        filteredMetrics.date = date.toISOString();
      }
      
      const response = await progressApi.updateProgressMetrics(filteredMetrics as ProgressMetrics);
      
      toast({
        title: "تم حفظ البيانات! ✅",
        description: response.message || "تم حفظ مقاييس التقدم بنجاح",
      });
      
      // Reset form
      setMetrics({
        date: new Date().toISOString().split('T')[0],
        weight: undefined,
        steps: undefined,
        sleepHours: undefined,
        mood: undefined
      });
      
    } catch (error: any) {
      console.error('Error updating progress metrics:', error);
      
      let errorTitle = "خطأ في حفظ البيانات";
      let errorDescription = "حدث خطأ أثناء حفظ مقاييس التقدم";
      
      if (error.message) {
        if (error.message.includes('400')) {
          errorTitle = "خطأ في البيانات المدخلة";
          errorDescription = "يرجى التحقق من صحة البيانات المدخلة";
        } else if (error.message.includes('404')) {
          errorTitle = "الملف الشخصي غير موجود";
          errorDescription = "يرجى إنشاء ملف شخصي أولاً";
        } else if (error.message.includes('500')) {
          errorTitle = "خطأ في الخادم";
          errorDescription = "حدث خطأ في الخادم. يرجى المحاولة لاحقاً";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingMetrics(false);
    }
  };

  const handleActivityComplete = async (activityId: number) => {
    try {
      setIsCompletingActivity(activityId);
      
      const response = await progressApi.markActivityCompleted(activityId);
      
      // Update local state
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isCompleted: true }
          : activity
      ));
      
      toast({
        title: "تم إكمال النشاط! 🎉",
        description: response.message || "ممتاز! استمر في التقدم نحو أهدافك الصحية",
      });
      
    } catch (error: any) {
      console.error('Error completing activity:', error);
      
      let errorTitle = "خطأ في تحديث النشاط";
      let errorDescription = "حدث خطأ أثناء تحديث النشاط";
      
      if (error.message) {
        if (error.message.includes('404')) {
          errorTitle = "النشاط غير موجود";
          errorDescription = "النشاط المحدد غير موجود أو لا ينتمي إليك";
        } else if (error.message.includes('500')) {
          errorTitle = "خطأ في الخادم";
          errorDescription = "حدث خطأ في الخادم. يرجى المحاولة لاحقاً";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsCompletingActivity(null);
    }
  };

  const getPriorityColor = (priority: RecommendedActivity['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: RecommendedActivity['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Metrics Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            مثال على تحديث مقاييس التقدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={metrics.date}
                onChange={(e) => setMetrics(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={metrics.weight || ''}
                onChange={(e) => setMetrics(prev => ({ 
                  ...prev, 
                  weight: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="steps">عدد الخطوات</Label>
              <Input
                id="steps"
                type="number"
                placeholder="8500"
                value={metrics.steps || ''}
                onChange={(e) => setMetrics(prev => ({ 
                  ...prev, 
                  steps: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sleep">ساعات النوم</Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                placeholder="7.5"
                value={metrics.sleepHours || ''}
                onChange={(e) => setMetrics(prev => ({ 
                  ...prev, 
                  sleepHours: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mood">المزاج (1-10)</Label>
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                placeholder="8"
                value={metrics.mood || ''}
                onChange={(e) => setMetrics(prev => ({ 
                  ...prev, 
                  mood: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={handleMetricsUpdate}
              disabled={isUpdatingMetrics}
              className="bg-gradient-primary"
            >
              {isUpdatingMetrics ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ المقاييس'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            الأنشطة المقترحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="mr-2">جاري تحميل الأنشطة...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activity.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{activity.icon}</span>
                        <h3 className="font-semibold text-lg">{activity.title}</h3>
                        <Badge className={getPriorityColor(activity.priority)}>
                          {activity.priority === 'high' ? 'عالي' : 
                           activity.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                        <Badge className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty === 'beginner' ? 'مبتدئ' :
                           activity.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                      
                      {activity.duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <Clock className="w-4 h-4" />
                          {activity.duration} دقيقة
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {activity.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {activity.isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">مكتمل</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleActivityComplete(activity.id)}
                          disabled={isCompletingActivity === activity.id}
                          className="bg-gradient-primary"
                        >
                          {isCompletingActivity === activity.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Circle className="w-4 h-4 ml-1" />
                              إكمال
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Usage Examples */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            أمثلة على استخدام API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. تحديث مقاييس التقدم (جزئي):</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// تحديث الوزن والخطوات فقط
const metrics = {
  date: "2024-01-15T00:00:00Z",
  weight: 75.5,
  steps: 8500
};

const response = await progressApi.updateProgressMetrics(metrics);
console.log(response.message); // "Metrics updated"`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. إكمال نشاط:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// إكمال نشاط معين
const response = await progressApi.markActivityCompleted(activityId);
console.log(response.message); // "Activity completed"`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. معالجة الأخطاء:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`try {
  await progressApi.updateProgressMetrics(metrics);
} catch (error) {
  if (error.message.includes('400')) {
    // خطأ في البيانات المدخلة
  } else if (error.message.includes('404')) {
    // الملف الشخصي غير موجود
  } else if (error.message.includes('500')) {
    // خطأ في الخادم
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
