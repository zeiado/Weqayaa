import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, ArrowLeft, Loader2, Target, Zap, Activity, Droplets, Leaf, Utensils, Clock, Sparkles } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FoodItemsTable } from './FoodItemsTable';
import { mealPlanApi } from '@/services/mealPlanApi';
import { 
  MealPlan, 
  MealType, 
  getMealTypeLabel, 
  getMealTypeDescription, 
  getMealTypeIcon
} from '@/types/mealPlan';
import { useToast } from '@/hooks/use-toast';

interface DailyMealPlanProps {
  onBack: () => void;
  onOpenCafeteria?: () => void;
  onDateChange?: (date: string) => void;
}

export const DailyMealPlan: React.FC<DailyMealPlanProps> = ({ onBack, onOpenCafeteria, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  // Fetch meal plans
  useEffect(() => {
    fetchMealPlans();
  }, [selectedDate]);

  const fetchMealPlans = async () => {
    try {
      setIsLoading(true);
      const fromDate = new Date(selectedDate).toISOString();
      const toDate = new Date(selectedDate).toISOString();
      const data = await mealPlanApi.getMealPlans(fromDate, toDate);
      setMealPlans(data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast({
        title: "خطأ في تحميل خطة الوجبات",
        description: "حدث خطأ أثناء تحميل خطة الوجبات اليومية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMealPlanForType = (mealType: MealType): MealPlan | undefined => {
    return mealPlans.find(plan => plan.mealType === mealType);
  };

  const getTotalNutrition = () => {
    return mealPlans.reduce((total, plan) => ({
      calories: total.calories + plan.totalCalories,
      protein: total.protein + plan.totalProtein,
      carbohydrates: total.carbohydrates + plan.totalCarbohydrates,
      fat: total.fat + plan.totalFat,
      fiber: total.fiber + plan.totalFiber,
    }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 });
  };

  const totalNutrition = getTotalNutrition();

  const MealCard: React.FC<{ mealType: MealType }> = ({ mealType }) => {
    const mealPlan = getMealPlanForType(mealType);
    const hasMealPlan = !!mealPlan;

    return (
      <Card className={`glass-card ${hasMealPlan ? 'border-primary' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">{getMealTypeIcon(mealType)}</span>
            <div>
              <div className="text-lg font-bold">{getMealTypeLabel(mealType)}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {getMealTypeDescription(mealType)}
              </div>
            </div>
            {hasMealPlan && (
              <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasMealPlan ? (
            <div className="space-y-4">
              {/* Recommendations */}
              {mealPlan.recommendations && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">{mealPlan.recommendations}</p>
                </div>
              )}

              {/* Nutrition Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <Zap className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="text-sm font-bold text-orange-600">{mealPlan.totalCalories.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">سعرة</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm font-bold text-blue-600">{mealPlan.totalProtein.toFixed(1)}g</div>
                  <div className="text-xs text-muted-foreground">بروتين</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <Target className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-bold text-green-600">{mealPlan.totalCarbohydrates.toFixed(1)}g</div>
                  <div className="text-xs text-muted-foreground">كربوهيدرات</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <Droplets className="w-4 h-4 mx-auto mb-1 text-red-600" />
                  <div className="text-sm font-bold text-red-600">{mealPlan.totalFat.toFixed(1)}g</div>
                  <div className="text-xs text-muted-foreground">دهون</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <Leaf className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <div className="text-sm font-bold text-purple-600">{mealPlan.totalFiber.toFixed(1)}g</div>
                  <div className="text-xs text-muted-foreground">ألياف</div>
                </div>
              </div>

              {/* Food Items Table */}
              <FoodItemsTable foodItems={mealPlan.foodItems} />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-muted-foreground mb-4">لم يتم إضافة أطعمة لهذه الوجبة بعد</p>
              <p className="text-sm text-muted-foreground">استخدم زر "إنشاء خطة الوجبات" لإضافة الأطعمة</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.Breakfast);

  const generateMealPlan = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً لإنشاء خطة وجبة');
      }
      const dateIso = new Date(selectedDate).toISOString();
      const res = await mealPlanApi.createMealPlan({
        date: dateIso,
        mealType: selectedMealType,
        menueId: 0,
        quantity: 0,
      });
      toast({
        title: 'تم إنشاء خطة الوجبة',
        description: `${getMealTypeLabel(selectedMealType)} ليوم ${selectedDate}`,
      });
      await fetchMealPlans();
    } catch (error) {
      toast({
        title: 'خطأ في إنشاء الخطة',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="خطة الوجبات اليومية"
      />
      
      <div className="container mx-auto px-6 py-8">
        {/* Date Picker */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <Label htmlFor="date-picker" className="text-sm font-medium">اختر التاريخ:</Label>
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Daily Nutrition Summary */}
        {mealPlans.length > 0 && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                ملخص التغذية اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-gradient-primary text-white rounded-lg">
                  <div className="text-2xl font-bold">{totalNutrition.calories.toFixed(0)}</div>
                  <div className="text-sm opacity-90">سعرة حرارية</div>
                </div>
                <div className="text-center p-3 bg-gradient-secondary text-white rounded-lg">
                  <div className="text-2xl font-bold">{totalNutrition.protein.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">بروتين</div>
                </div>
                <div className="text-center p-3 bg-gradient-primary text-white rounded-lg">
                  <div className="text-2xl font-bold">{totalNutrition.carbohydrates.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">كربوهيدرات</div>
                </div>
                <div className="text-center p-3 bg-gradient-secondary text-white rounded-lg">
                  <div className="text-2xl font-bold">{totalNutrition.fat.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">دهون</div>
                </div>
                <div className="text-center p-3 bg-gradient-primary text-white rounded-lg">
                  <div className="text-2xl font-bold">{totalNutrition.fiber.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">ألياف</div>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>السعرات الحرارية</span>
                    <span>{totalNutrition.calories.toFixed(0)} / 2000 ({(totalNutrition.calories / 2000 * 100).toFixed(0)}%)</span>
                  </div>
                  <Progress value={(totalNutrition.calories / 2000) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>البروتين</span>
                    <span>{totalNutrition.protein.toFixed(1)}g / 80g ({(totalNutrition.protein / 80 * 100).toFixed(0)}%)</span>
                  </div>
                  <Progress value={(totalNutrition.protein / 80) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate or Build Meal Plan */}
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Generate via backend */}
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  توليد تلقائي لخطة الوجبة
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <Label className="text-sm">نوع الوجبة:</Label>
                  </div>
                  <select
                    className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(parseInt(e.target.value) as MealType)}
                  >
                    {Object.values(MealType).filter((v) => typeof v === 'number').map((mt) => (
                      <option key={mt as number} value={mt as number}>
                        {getMealTypeLabel(mt as MealType)}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={generateMealPlan} disabled={isGenerating} className="bg-gradient-primary">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      بدء التوليد
                    </>
                  )}
                </Button>
              </div>

              {/* Build manually via cafeteria */}
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-primary" />
                  إنشاء خطة الوجبات يدوياً
                </h3>
                <p className="text-sm text-muted-foreground mb-3">اختر من قائمة الكافتيريا وأضف الأطعمة المفضلة</p>
                <Button 
                  onClick={onOpenCafeteria}
                  variant="outline"
                >
                  فتح قائمة الكافتيريا
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل خطة الوجبات...</span>
          </div>
        )}

        {/* Meal Cards */}
        {!isLoading && (
          <div className="space-y-6">
            <MealCard mealType={MealType.Breakfast} />
            <MealCard mealType={MealType.Snack1} />
            <MealCard mealType={MealType.Lunch} />
            <MealCard mealType={MealType.Snack2} />
            <MealCard mealType={MealType.Dinner} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && mealPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد خطط وجبات لهذا التاريخ</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإنشاء خطة وجبة جديدة لليوم</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};
