import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lightbulb, 
  Clock, 
  Star, 
  CheckCircle, 
  Circle,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { RecommendedActivity, getActivityTypeIcon, getPriorityColor } from '@/types/progress';
import { progressApi } from '@/services/progressApi';
import { useToast } from '@/hooks/use-toast';

interface RecommendedActivitiesProps {
  activities: RecommendedActivity[];
  onActivityComplete?: (activityId: number) => void;
}

export const RecommendedActivities: React.FC<RecommendedActivitiesProps> = ({ 
  activities, 
  onActivityComplete 
}) => {
  const [completedActivities, setCompletedActivities] = useState<number[]>(
    activities.filter(activity => activity.isCompleted).map(activity => activity.id)
  );
  const { toast } = useToast();

  const handleActivityToggle = async (activityId: number, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        // Call the API to mark activity as completed
        const response = await progressApi.markActivityCompleted(activityId);
        
        setCompletedActivities(prev => [...prev, activityId]);
        toast({
          title: "تم إكمال النشاط! 🎉",
          description: response.message || "ممتاز! استمر في التقدم نحو أهدافك الصحية",
        });
      } else {
        // For now, we'll just update local state
        // In a full implementation, you might want to add an "uncomplete" API endpoint
        setCompletedActivities(prev => prev.filter(id => id !== activityId));
        toast({
          title: "تم إلغاء إكمال النشاط",
          description: "لا بأس، يمكنك إكماله لاحقاً",
        });
      }
      
      if (onActivityComplete) {
        onActivityComplete(activityId);
      }
    } catch (error: any) {
      console.error('Error updating activity:', error);
      
      // Handle different types of errors
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

  const getDifficultyText = (difficulty: RecommendedActivity['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return 'غير محدد';
    }
  };

  const completedCount = completedActivities.length;
  const totalCount = activities.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            الأنشطة المقترحة
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              {completedCount}/{totalCount} مكتمل
            </Badge>
            <div className="text-sm text-gray-600">
              {completionPercentage}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">التقدم في الأنشطة</span>
            <span className="font-medium text-primary">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const isCompleted = completedActivities.includes(activity.id);
            
            return (
              <Card 
                key={activity.id} 
                className={`transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => 
                          handleActivityToggle(activity.id, checked as boolean)
                        }
                        className="w-5 h-5"
                      />
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{activity.icon}</span>
                          <div>
                            <h4 className={`font-semibold ${
                              isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}>
                              {activity.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(activity.priority)}
                        >
                          {activity.priority === 'high' ? 'عالي الأولوية' :
                           activity.priority === 'medium' ? 'متوسط الأولوية' : 'منخفض الأولوية'}
                        </Badge>
                        
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(activity.difficulty)}
                        >
                          {getDifficultyText(activity.difficulty)}
                        </Badge>
                        
                        {activity.duration && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                            <Clock className="w-3 h-3 ml-1" />
                            {activity.duration} دقيقة
                          </Badge>
                        )}
                      </div>
                      
                      {/* Benefits */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          الفوائد:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {activity.benefits.map((benefit, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Completion Summary */}
        {completedCount > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">إنجازات اليوم</h4>
            </div>
            <p className="text-sm text-gray-600">
              لقد أكملت {completedCount} من أصل {totalCount} نشاط مقترح. 
              {completionPercentage >= 80 ? ' ممتاز! أنت على الطريق الصحيح.' : 
               completionPercentage >= 50 ? ' جيد جداً! استمر في التقدم.' : 
               ' يمكنك فعل المزيد!'}
            </p>
          </div>
        )}
        
        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              لا توجد أنشطة مقترحة حالياً
            </h3>
            <p className="text-gray-500">
              سيتم إضافة أنشطة مقترحة بناءً على تقدمك وأهدافك الصحية
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
