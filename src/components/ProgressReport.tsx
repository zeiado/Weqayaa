import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  Award,
  BarChart3,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProgressChart, ProgressSummaryChart } from './ProgressChart';
import { DailyNeedsTracker } from './DailyNeedsTracker';
import { RecommendedActivities } from './RecommendedActivities';
import { ProgressInsights } from './ProgressInsights';
import { progressApi } from '@/services/progressApi';
import { ProgressReport, ProgressSummary } from '@/types/progress';
import { useToast } from '@/hooks/use-toast';

interface ProgressReportProps {
  onBack: () => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({ onBack }) => {
  const [progressData, setProgressData] = useState<ProgressReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgressData();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      // For now, using mock data. Replace with actual API call when backend is ready
      const data = await progressApi.getMockProgressReport();
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast({
        title: "خطأ في تحميل تقرير التقدم",
        description: "حدث خطأ أثناء تحميل بيانات التقدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProgressData();
    setIsRefreshing(false);
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث تقرير التقدم بنجاح",
    });
  };

  const handleActivityComplete = async (activityId: number) => {
    try {
      // In a real implementation, this would call the API
      // await progressApi.markActivityCompleted(activityId);
      console.log('Activity completed:', activityId);
    } catch (error) {
      console.error('Error marking activity as completed:', error);
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'الأسبوع';
      case 'month': return 'الشهر';
      case 'quarter': return 'الربع';
      default: return 'الفترة';
    }
  };

  const getWeightChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-green-600" />;
    } else {
      return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getWeightChangeText = (change: number) => {
    if (change > 0) {
      return `زيادة ${Math.abs(change).toFixed(1)} كجم`;
    } else if (change < 0) {
      return `نقص ${Math.abs(change).toFixed(1)} كجم`;
    } else {
      return 'بدون تغيير';
    }
  };

  const getWeightChangeColor = (change: number) => {
    if (change > 0) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (change < 0) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <Header 
          onBack={onBack}
          showBackButton={true}
          title="تقرير التقدم"
        />
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                جاري تحميل تقرير التقدم...
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                نعمل على تحضير بياناتك الصحية
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <Header 
          onBack={onBack}
          showBackButton={true}
          title="تقرير التقدم"
        />
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="text-center py-12 sm:py-20">
            <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              لا توجد بيانات متاحة
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              لم يتم العثور على بيانات التقدم. يرجى المحاولة مرة أخرى.
            </p>
            <Button onClick={handleRefresh} className="bg-gradient-primary">
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { summary, dailyNeeds, recommendedActivities, chartData } = progressData;

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="تقرير التقدم"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">الفترة:</span>
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-24 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">الأسبوع</SelectItem>
                  <SelectItem value="month">الشهر</SelectItem>
                  <SelectItem value="quarter">الربع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">تصدير</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">مشاركة</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">تغيير الوزن</p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1">
                    {getWeightChangeIcon(summary.totalWeightChange)}
                    <span className={`text-sm sm:text-lg font-bold ${getWeightChangeColor(summary.totalWeightChange).split(' ')[0]}`}>
                      {getWeightChangeText(summary.totalWeightChange)}
                    </span>
                  </div>
                </div>
                <div className="text-lg sm:text-2xl">⚖️</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">متوسط السعرات</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {summary.averageCalories.toLocaleString()}
                  </p>
                </div>
                <div className="text-lg sm:text-2xl">🔥</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">متوسط الخطوات</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {summary.averageSteps.toLocaleString()}
                  </p>
                </div>
                <div className="text-lg sm:text-2xl">👟</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">نقاط الاتساق</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">
                    {summary.consistencyScore}%
                  </p>
                </div>
                <div className="text-lg sm:text-2xl">🎯</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Needs Tracker */}
        <div className="mb-6 sm:mb-8">
          <DailyNeedsTracker dailyNeeds={progressData.dailyNeeds} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <ProgressChart 
            data={chartData.weight} 
            title="تطور الوزن" 
            unit=" كجم"
            color="#3b82f6"
          />
          <ProgressChart 
            data={chartData.calories} 
            title="السعرات الحرارية اليومية" 
            unit=" سعرة"
            color="#f59e0b"
          />
          <ProgressChart 
            data={chartData.steps} 
            title="عدد الخطوات اليومية" 
            unit=" خطوة"
            color="#10b981"
          />
          <ProgressChart 
            data={chartData.sleep} 
            title="ساعات النوم" 
            unit=" ساعة"
            color="#8b5cf6"
          />
        </div>

        {/* Progress Insights */}
        <div className="mb-6 sm:mb-8">
          <ProgressInsights summary={summary} />
        </div>

        {/* Achievements and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                الإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                مجالات التحسين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Activities */}
        <div className="mb-6 sm:mb-8">
          <RecommendedActivities 
            activities={recommendedActivities}
            onActivityComplete={handleActivityComplete}
          />
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          آخر تحديث: {new Date(progressData.lastUpdated).toLocaleDateString('ar-SA')}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
