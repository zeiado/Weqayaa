import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Activity, 
  Target, 
  Calendar,
  RefreshCw,
  TrendingUp,
  Clock,
  Bug
} from 'lucide-react';
import { ProgressReport } from './ProgressReport';
import { DailyNeedsTracker } from './DailyNeedsTracker';
import { RecommendedActivities } from './RecommendedActivities';
import { ProgressMetricsForm } from './ProgressMetricsForm';
import { MealPlanItemUpdater } from './MealPlanItemUpdater';
import { ProgressDebugger } from './ProgressDebugger';
import { SimpleProgressTest } from './SimpleProgressTest';
import { progressApi } from '@/services/progressApi';
import { ProgressReport as ProgressReportType, DailyNeeds, RecommendedActivity } from '@/types/progress';
import { useToast } from '@/hooks/use-toast';

interface ProgressDashboardProps {
  onBack: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<ProgressReportType | null>(null);
  const [dailyNeeds, setDailyNeeds] = useState<DailyNeeds | null>(null);
  const [recommendedActivities, setRecommendedActivities] = useState<RecommendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchProgressReport(),
        fetchDailyNeeds(),
        fetchRecommendedActivities()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات لوحة التحكم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressReport = async () => {
    try {
      const data = await progressApi.getProgressReport('week');
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress report:', error);
      // Fallback to mock data
      try {
        const mockData = await progressApi.getMockProgressReport();
        setProgressData(mockData);
        console.log('Using mock data for progress report');
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
      }
    }
  };

  const fetchDailyNeeds = async () => {
    try {
      const data = await progressApi.getDailyNeeds();
      setDailyNeeds(data);
    } catch (error) {
      console.error('Error fetching daily needs:', error);
      // Fallback to mock data from progress report
      try {
        const mockData = await progressApi.getMockProgressReport();
        setDailyNeeds(mockData.dailyNeeds);
        console.log('Using mock data for daily needs');
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
      }
    }
  };

  const fetchRecommendedActivities = async () => {
    try {
      const data = await progressApi.getRecommendedActivities();
      setRecommendedActivities(data);
    } catch (error) {
      console.error('Error fetching recommended activities:', error);
      // Fallback to mock data from progress report
      try {
        const mockData = await progressApi.getMockProgressReport();
        setRecommendedActivities(mockData.recommendedActivities);
        console.log('Using mock data for recommended activities');
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع البيانات بنجاح",
    });
  };

  const handleActivityComplete = async (activityId: number) => {
    try {
      await progressApi.markActivityCompleted(activityId);
      // Refresh activities to show updated completion status
      await fetchRecommendedActivities();
      toast({
        title: "تم إكمال النشاط! 🎉",
        description: "تم حفظ تقدمك بنجاح",
      });
    } catch (error) {
      console.error('Error marking activity as completed:', error);
      toast({
        title: "خطأ في حفظ النشاط",
        description: "حدث خطأ أثناء حفظ إكمال النشاط",
        variant: "destructive",
      });
    }
  };

  const handleMetricsUpdated = async () => {
    // Refresh all data when metrics are updated
    await fetchAllData();
  };

  const handleMealPlanItemUpdated = async () => {
    // Refresh daily needs when meal plan is updated
    await fetchDailyNeeds();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                جاري تحميل لوحة التحكم...
              </h3>
              <p className="text-gray-500">
                نعمل على تحضير جميع بياناتك الصحية
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              لوحة تحكم التقدم
            </h1>
            <p className="text-gray-600">
              تتبع تقدمك الصحي وإنجازاتك اليومية
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <Button variant="outline" onClick={onBack}>
              العودة
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {progressData && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">نقاط الاتساق</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {progressData.summary.consistencyScore}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">متوسط السعرات</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {progressData.summary.averageCalories}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">متوسط الخطوات</p>
                    <p className="text-2xl font-bold text-green-600">
                      {progressData.summary.averageSteps.toLocaleString()}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">متوسط النوم</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {progressData.summary.averageSleep}س
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">الاحتياجات اليومية</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">الأنشطة</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل البيانات</span>
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="hidden sm:inline">التشخيص</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {progressData && (
              <ProgressReport onBack={onBack} />
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            {dailyNeeds && (
              <DailyNeedsTracker dailyNeeds={dailyNeeds} />
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {recommendedActivities.length > 0 && (
              <RecommendedActivities 
                activities={recommendedActivities}
                onActivityComplete={handleActivityComplete}
              />
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <ProgressMetricsForm onMetricsUpdated={handleMetricsUpdated} />
          </TabsContent>

          <TabsContent value="debug" className="space-y-6">
            <SimpleProgressTest />
            <ProgressDebugger />
          </TabsContent>
        </Tabs>

        {/* API Usage Examples */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>أمثلة على استخدام API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">1. الحصول على تقرير التقدم:</h4>
                <code className="text-xs bg-white p-2 rounded border block">
                  const report = await progressApi.getProgressReport('week');
                </code>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">2. تحديث مقاييس التقدم:</h4>
                <code className="text-xs bg-white p-2 rounded border block">
                  await progressApi.updateProgressMetrics({'{'}
                    date: '2024-01-15', weight: 70.5, steps: 8500
                  {'}'});
                </code>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">3. إكمال نشاط:</h4>
                <code className="text-xs bg-white p-2 rounded border block">
                  await progressApi.markActivityCompleted(activityId);
                </code>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">4. تحديث عنصر في خطة الوجبات:</h4>
                <code className="text-xs bg-white p-2 rounded border block">
                  await progressApi.updateMealPlanItem(mealPlanId, itemId, newMenuItemId);
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
