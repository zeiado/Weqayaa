import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Lightbulb,
  Heart,
  Brain,
  Zap
} from 'lucide-react';
import { ProgressSummary } from '@/types/progress';

interface ProgressInsightsProps {
  summary: ProgressSummary;
}

export const ProgressInsights: React.FC<ProgressInsightsProps> = ({ summary }) => {
  // Add defensive programming to handle undefined data
  if (!summary) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            رؤى صحية ذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل الرؤى الصحية...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-green-600" />;
      case 'improvement': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-50 border-green-200';
      case 'improvement': return 'bg-blue-50 border-blue-200';
      case 'recommendation': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getConsistencyLevel = (score: number = 0) => {
    if (score >= 90) return { level: 'ممتاز', color: 'text-green-600 bg-green-50 border-green-200' };
    if (score >= 80) return { level: 'جيد جداً', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 70) return { level: 'جيد', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    if (score >= 60) return { level: 'مقبول', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { level: 'يحتاج تحسين', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const consistency = getConsistencyLevel(summary?.consistencyScore || 0);

  return (
    <div className="space-y-6">
      {/* Consistency Score */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            نقاط الاتساق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {summary?.consistencyScore || 0}%
            </div>
            <Badge 
              variant="outline" 
              className={`${consistency.color} border text-lg px-4 py-2`}
            >
              {consistency.level}
            </Badge>
            <p className="text-sm text-gray-600">
              هذا الرقم يعكس مدى التزامك بأهدافك الصحية اليومية
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            رؤى صحية ذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Weight Change Insight */}
            <div className={`p-4 rounded-lg border ${getInsightColor((summary?.totalWeightChange || 0) < 0 ? 'achievement' : 'improvement')}`}>
              <div className="flex items-center gap-2 mb-2">
                {getInsightIcon((summary?.totalWeightChange || 0) < 0 ? 'achievement' : 'improvement')}
                <span className="font-medium">تطور الوزن</span>
              </div>
              <p className="text-sm text-gray-700">
                {(summary?.totalWeightChange || 0) < 0 
                  ? `ممتاز! لقد فقدت ${Math.abs(summary?.totalWeightChange || 0).toFixed(1)} كجم هذا الأسبوع. استمر في هذا المسار الصحي.`
                  : (summary?.totalWeightChange || 0) > 0
                  ? `لاحظنا زيادة في الوزن بمقدار ${(summary?.totalWeightChange || 0).toFixed(1)} كجم. ننصح بمراجعة النظام الغذائي وممارسة المزيد من التمارين.`
                  : 'وزنك مستقر هذا الأسبوع. هذا جيد، لكن يمكنك العمل على تحسينات أخرى.'
                }
              </p>
            </div>

            {/* Activity Insight */}
            <div className={`p-4 rounded-lg border ${getInsightColor((summary?.averageSteps || 0) >= 8000 ? 'achievement' : 'improvement')}`}>
              <div className="flex items-center gap-2 mb-2">
                {getInsightIcon((summary?.averageSteps || 0) >= 8000 ? 'achievement' : 'improvement')}
                <span className="font-medium">النشاط البدني</span>
              </div>
              <p className="text-sm text-gray-700">
                {(summary?.averageSteps || 0) >= 10000 
                  ? `رائع! متوسط خطواتك ${(summary?.averageSteps || 0).toLocaleString()} خطوة يومياً. هذا مستوى ممتاز من النشاط.`
                  : (summary?.averageSteps || 0) >= 8000
                  ? `جيد جداً! متوسط خطواتك ${(summary?.averageSteps || 0).toLocaleString()} خطوة يومياً. يمكنك الوصول لـ 10,000 خطوة.`
                  : `متوسط خطواتك ${(summary?.averageSteps || 0).toLocaleString()} خطوة يومياً. ننصح بزيادة النشاط البدني للوصول لـ 8,000 خطوة على الأقل.`
                }
              </p>
            </div>

            {/* Sleep Insight */}
            <div className={`p-4 rounded-lg border ${getInsightColor((summary?.averageSleep || 0) >= 7 ? 'achievement' : 'improvement')}`}>
              <div className="flex items-center gap-2 mb-2">
                {getInsightIcon((summary?.averageSleep || 0) >= 7 ? 'achievement' : 'improvement')}
                <span className="font-medium">جودة النوم</span>
              </div>
              <p className="text-sm text-gray-700">
                {(summary?.averageSleep || 0) >= 8 
                  ? `ممتاز! متوسط نومك ${(summary?.averageSleep || 0).toFixed(1)} ساعة يومياً. هذا مثالي لصحتك.`
                  : (summary?.averageSleep || 0) >= 7
                  ? `جيد! متوسط نومك ${(summary?.averageSleep || 0).toFixed(1)} ساعة يومياً. يمكنك تحسينه لـ 8 ساعات.`
                  : `متوسط نومك ${(summary?.averageSleep || 0).toFixed(1)} ساعة يومياً. النوم الكافي مهم جداً لصحتك. ننصح بتحسين عادات النوم.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="glass-card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
          <blockquote className="text-lg font-medium text-gray-800 mb-2">
            "الصحة ليست مجرد غياب المرض، بل هي حالة من الرفاهية الجسدية والعقلية والاجتماعية الكاملة"
          </blockquote>
          <cite className="text-sm text-gray-600">- منظمة الصحة العالمية</cite>
        </CardContent>
      </Card>
    </div>
  );
};
