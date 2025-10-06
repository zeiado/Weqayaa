import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  Droplets, 
  Footprints, 
  Moon, 
  Scale, 
  Zap,
  Save,
  Calendar
} from 'lucide-react';
import { progressApi } from '@/services/progressApi';
import { ProgressMetrics } from '@/types/progress';
import { useToast } from '@/hooks/use-toast';

interface ProgressMetricsFormProps {
  onMetricsUpdated?: () => void;
  initialDate?: string;
}

export const ProgressMetricsForm: React.FC<ProgressMetricsFormProps> = ({ 
  onMetricsUpdated,
  initialDate 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    date: initialDate || new Date().toISOString().split('T')[0],
    weight: undefined,
    bodyFat: undefined,
    muscleMass: undefined,
    waterIntake: undefined,
    steps: undefined,
    caloriesBurned: undefined,
    sleepHours: undefined,
    mood: undefined,
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProgressMetrics, value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    setMetrics(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
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
      
      if (onMetricsUpdated) {
        onMetricsUpdated();
      }
    } catch (error: any) {
      console.error('Error updating progress metrics:', error);
      
      // Handle different types of errors
      let errorTitle = "خطأ في حفظ البيانات";
      let errorDescription = "حدث خطأ أثناء حفظ مقاييس التقدم. يرجى المحاولة مرة أخرى.";
      
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
      setIsLoading(false);
    }
  };

  const metricsFields = [
    {
      key: 'weight' as keyof ProgressMetrics,
      label: 'الوزن',
      icon: Scale,
      unit: 'كجم',
      placeholder: '70.5',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'bodyFat' as keyof ProgressMetrics,
      label: 'نسبة الدهون',
      icon: Activity,
      unit: '%',
      placeholder: '15.2',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      key: 'muscleMass' as keyof ProgressMetrics,
      label: 'كتلة العضلات',
      icon: Activity,
      unit: 'كجم',
      placeholder: '25.8',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'waterIntake' as keyof ProgressMetrics,
      label: 'استهلاك الماء',
      icon: Droplets,
      unit: 'مل',
      placeholder: '2000',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      key: 'steps' as keyof ProgressMetrics,
      label: 'عدد الخطوات',
      icon: Footprints,
      unit: 'خطوة',
      placeholder: '8500',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      key: 'caloriesBurned' as keyof ProgressMetrics,
      label: 'السعرات المحروقة',
      icon: Zap,
      unit: 'سعرة',
      placeholder: '450',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      key: 'sleepHours' as keyof ProgressMetrics,
      label: 'ساعات النوم',
      icon: Moon,
      unit: 'ساعة',
      placeholder: '7.5',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      key: 'mood' as keyof ProgressMetrics,
      label: 'المزاج',
      icon: Activity,
      unit: '/10',
      placeholder: '8',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      max: 10,
      min: 1
    }
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          مقاييس التقدم اليومية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              التاريخ
            </Label>
            <Input
              id="date"
              type="date"
              value={metrics.date}
              onChange={(e) => setMetrics(prev => ({ ...prev, date: e.target.value }))}
              className="w-full"
              required
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metricsFields.map((field) => {
              const IconComponent = field.icon;
              const value = metrics[field.key]?.toString() || '';
              
              return (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${field.color}`} />
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.key}
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.key === 'mood' ? '1' : '0.1'}
                      className={`w-full ${field.bgColor} ${field.borderColor} border-2`}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      {field.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-primary min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ البيانات
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">نصائح لتسجيل البيانات:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• قم بقياس الوزن في نفس الوقت كل يوم للحصول على نتائج دقيقة</li>
            <li>• سجل عدد الخطوات من تطبيق الهاتف أو ساعة اللياقة البدنية</li>
            <li>• راقب ساعات النوم لتحسين جودة الراحة</li>
            <li>• قيم مزاجك من 1 إلى 10 (1 = سيء جداً، 10 = ممتاز)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
