import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Zap, 
  Activity, 
  Footprints, 
  Moon, 
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { DailyNeeds, getProgressColor, getProgressBarColor } from '@/types/progress';

interface DailyNeedsTrackerProps {
  dailyNeeds: DailyNeeds;
}

export const DailyNeedsTracker: React.FC<DailyNeedsTrackerProps> = ({ dailyNeeds }) => {
  // Add defensive programming to handle undefined data
  if (!dailyNeeds) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            الاحتياجات اليومية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل بيانات الاحتياجات اليومية...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  const needsData = [
    {
      key: 'calories',
      label: 'السعرات الحرارية',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      unit: 'سعرة',
      data: dailyNeeds.calories
    },
    {
      key: 'protein',
      label: 'البروتين',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      unit: 'جرام',
      data: dailyNeeds.protein
    },
    {
      key: 'water',
      label: 'الماء',
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      unit: 'مل',
      data: dailyNeeds.water
    },
    {
      key: 'steps',
      label: 'الخطوات',
      icon: Footprints,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      unit: 'خطوة',
      data: dailyNeeds.steps
    },
    {
      key: 'sleep',
      label: 'النوم',
      icon: Moon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      unit: 'ساعة',
      data: dailyNeeds.sleep
    }
  ];

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (percentage >= 80) {
      return <Target className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) {
      return 'مكتمل';
    } else if (percentage >= 80) {
      return 'جيد جداً';
    } else if (percentage >= 60) {
      return 'جيد';
    } else {
      return 'يحتاج تحسين';
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (percentage >= 80) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (percentage >= 60) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          الاحتياجات اليومية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {needsData.map((need) => {
            const IconComponent = need.icon;
            const { consumed = 0, target = 0, remaining = 0, percentage = 0 } = need.data || {};
            
            return (
              <Card 
                key={need.key} 
                className={`${need.bgColor} ${need.borderColor} border-2 transition-all duration-300 hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 ${need.color}`} />
                      <span className="font-medium text-gray-800">{need.label}</span>
                    </div>
                    {getStatusIcon(percentage)}
                  </div>
                  
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">التقدم</span>
                        <span className={`font-medium ${getProgressColor(percentage)}`}>
                          {percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Numbers */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">المستهلك</span>
                        <span className="font-semibold text-gray-800">
                          {consumed.toLocaleString()} {need.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">الهدف</span>
                        <span className="font-semibold text-gray-800">
                          {target.toLocaleString()} {need.unit}
                        </span>
                      </div>
                      {remaining > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">المتبقي</span>
                          <span className="font-semibold text-gray-600">
                            {remaining.toLocaleString()} {need.unit}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(percentage)} border`}
                      >
                        {getStatusText(percentage)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Overall Progress Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">التقدم الإجمالي اليوم</h4>
            <span className="text-2xl font-bold text-primary">
              {Math.round(
                needsData.reduce((sum, need) => sum + (need.data?.percentage || 0), 0) / needsData.length
              )}%
            </span>
          </div>
          <Progress 
            value={Math.round(
              needsData.reduce((sum, need) => sum + (need.data?.percentage || 0), 0) / needsData.length
            )} 
            className="h-3"
          />
          <p className="text-sm text-gray-600 mt-2 text-center">
            متوسط تقدمك في جميع الأهداف اليومية
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
