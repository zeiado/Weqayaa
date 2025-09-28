import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, ArrowLeft, Loader2, Target, Zap, Activity, Droplets, Leaf, Utensils, Clock, Sparkles, Star, Heart, Coffee, Apple, Sun, Moon, ArrowRight, CheckCircle, Award, Flame } from 'lucide-react';
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
      <Card className={`glass-card group hover:scale-[1.02] transition-all duration-300 bg-background/80 ${hasMealPlan ? 'border-primary/40 shadow-lg' : 'border-border/50'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-xl">{getMealTypeIcon(mealType)}</span>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{getMealTypeLabel(mealType)}</div>
                <div className="text-sm text-foreground/70 font-normal">
                  {getMealTypeDescription(mealType)}
                </div>
              </div>
            </div>
            {hasMealPlan && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                <CheckCircle className="w-3 h-3 ml-1" />
                مكتمل
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasMealPlan ? (
            <div className="space-y-6">
              {/* Enhanced Recommendations */}
              {mealPlan.recommendations && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{mealPlan.recommendations}</p>
                  </div>
                </div>
              )}

              {/* Enhanced Nutrition Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Zap className="w-5 h-5 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{mealPlan.totalCalories.toFixed(0)}</div>
                  <div className="text-xs text-foreground/70">سعرة</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Activity className="w-5 h-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{mealPlan.totalProtein.toFixed(1)}g</div>
                  <div className="text-xs text-foreground/70">بروتين</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Target className="w-5 h-5 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{mealPlan.totalCarbohydrates.toFixed(1)}g</div>
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">كربوهيدرات</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <Droplets className="w-5 h-5 mx-auto mb-2 text-red-600 dark:text-red-400" />
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{mealPlan.totalFat.toFixed(1)}g</div>
                  <div className="text-xs text-foreground/70">دهون</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Leaf className="w-5 h-5 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{mealPlan.totalFiber.toFixed(1)}g</div>
                  <div className="text-xs text-foreground/70">ألياف</div>
                </div>
              </div>

              {/* Food Items Table */}
              <FoodItemsTable foodItems={mealPlan.foodItems} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لم يتم إضافة أطعمة لهذه الوجبة بعد</h3>
              <p className="text-foreground/70 mb-4">ابدأ بإنشاء خطة وجبة جديدة</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-primary/20 text-primary text-xs">توليد تلقائي</Badge>
                <Badge className="bg-secondary/20 text-secondary text-xs">اختيار يدوي</Badge>
              </div>
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
    <div className="min-h-screen bg-gradient-wellness relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-glow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent-glow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Header 
        onBack={onBack}
        showBackButton={true}
        title="خطة الوجبات اليومية"
      />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            خطة الوجبات اليومية
          </h1>
          <p className="text-foreground/80">خطط وجباتك الصحية واتبع نظامك الغذائي المثالي</p>
        </div>
        {/* Enhanced Date Picker */}
        <Card className="glass-card p-6 mb-8 bg-background/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label htmlFor="date-picker" className="text-base font-semibold text-foreground">اختر التاريخ</Label>
                <p className="text-sm text-foreground/70">حدد اليوم الذي تريد التخطيط له</p>
              </div>
            </div>
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="max-w-xs border-primary/20 focus:border-primary"
            />
          </div>
        </Card>

        {/* Enhanced Daily Nutrition Summary */}
        {mealPlans.length > 0 && (
          <Card className="glass-card mb-8 bg-background/80">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                ملخص التغذية اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-primary text-white rounded-lg group hover:scale-105 transition-all duration-300">
                  <Flame className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalNutrition.calories.toFixed(0)}</div>
                  <div className="text-sm opacity-90">سعرة حرارية</div>
                </div>
                <div className="text-center p-4 bg-gradient-secondary text-white rounded-lg group hover:scale-105 transition-all duration-300">
                  <Activity className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalNutrition.protein.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">بروتين</div>
                </div>
                <div className="text-center p-4 bg-gradient-accent text-white rounded-lg group hover:scale-105 transition-all duration-300">
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalNutrition.carbohydrates.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">كربوهيدرات</div>
                </div>
                <div className="text-center p-4 bg-gradient-primary text-white rounded-lg group hover:scale-105 transition-all duration-300">
                  <Droplets className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalNutrition.fat.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">دهون</div>
                </div>
                <div className="text-center p-4 bg-gradient-secondary text-white rounded-lg group hover:scale-105 transition-all duration-300">
                  <Leaf className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalNutrition.fiber.toFixed(1)}g</div>
                  <div className="text-sm opacity-90">ألياف</div>
                </div>
              </div>
              
              {/* Enhanced Progress Bars */}
              <div className="space-y-4">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">السعرات الحرارية</span>
                    <span className="text-foreground/80">{totalNutrition.calories.toFixed(0)} / 2000 ({(totalNutrition.calories / 2000 * 100).toFixed(0)}%)</span>
                  </div>
                  <Progress value={(totalNutrition.calories / 2000) * 100} className="h-3 bg-primary/20" />
                </div>
                <div className="bg-secondary/10 dark:bg-secondary/20 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">البروتين</span>
                    <span className="text-foreground/80">{totalNutrition.protein.toFixed(1)}g / 80g ({(totalNutrition.protein / 80 * 100).toFixed(0)}%)</span>
                  </div>
                  <Progress value={(totalNutrition.protein / 80) * 100} className="h-3 bg-secondary/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Generate or Build Meal Plan */}
        <Card className="glass-card mb-8 bg-background/80">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-foreground">
              <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              إنشاء خطة الوجبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Generate via backend */}
              <div className="p-6 rounded-lg border border-primary/20 bg-primary/5 dark:bg-primary/10">
                <h3 className="font-bold mb-4 flex items-center gap-3 text-lg text-foreground">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  توليد تلقائي لخطة الوجبة
                </h3>
                <p className="text-sm text-foreground/80 mb-4">دع الذكاء الاصطناعي يخطط وجبتك بناءً على احتياجاتك الصحية</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium text-foreground">نوع الوجبة:</Label>
                  </div>
                  <select
                    className="bg-background border border-primary/20 focus:border-primary rounded-md px-3 py-2 text-sm text-foreground"
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
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={generateMealPlan} 
                    disabled={isGenerating} 
                    className="bg-gradient-primary hover:shadow-lg transition-all duration-300 flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 ml-2" />
                        بدء التوليد
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={onOpenCafeteria}
                    variant="outline"
                    className="border-secondary/30 text-secondary hover:bg-secondary/10 flex-1"
                  >
                    <Utensils className="w-4 h-4 ml-2" />
                    فتح قائمة الكافتيريا
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>

              {/* Build manually via cafeteria */}
              <div className="p-6 rounded-lg border border-secondary/20 bg-secondary/5 dark:bg-secondary/10">
                <h3 className="font-bold mb-4 flex items-center gap-3 text-lg text-foreground">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-white" />
                  </div>
                  إنشاء خطة الوجبات يدوياً
                </h3>
                <p className="text-sm text-foreground/80 mb-4">اختر من قائمة الكافتيريا وأضف الأطعمة المفضلة</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-secondary/20 text-secondary text-xs">اختيار شخصي</Badge>
                  <Badge className="bg-secondary/20 text-secondary text-xs">تحكم كامل</Badge>
                  <Badge className="bg-secondary/20 text-secondary text-xs">أطعمة مفضلة</Badge>
                </div>
                <Button 
                  onClick={onOpenCafeteria}
                  variant="outline"
                  className="border-secondary/30 text-secondary hover:bg-secondary/10 w-full"
                >
                  <Utensils className="w-4 h-4 ml-2" />
                  فتح قائمة الكافتيريا
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Loading State */}
        {isLoading && (
          <Card className="glass-card p-12 text-center bg-background/80 ">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">جاري تحميل خطة الوجبات</h3>
                <p className="text-foreground/70">يرجى الانتظار بينما نقوم بتحميل وجباتك اليومية...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Meal Cards */}
        {!isLoading && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                وجبات اليوم
              </h2>
              <div className="space-y-6">
                <MealCard mealType={MealType.Breakfast} />
                <MealCard mealType={MealType.Snack1} />
                <MealCard mealType={MealType.Lunch} />
                <MealCard mealType={MealType.Snack2} />
                <MealCard mealType={MealType.Dinner} />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {!isLoading && mealPlans.length === 0 && (
          <Card className="glass-card p-12 text-center bg-background/80 ">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                <Utensils className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">لا توجد خطط وجبات لهذا التاريخ</h3>
                <p className="text-foreground/70 mb-6">ابدأ بإنشاء خطة وجبة جديدة لليوم</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge className="bg-primary/20 text-primary text-sm px-3 py-1">توليد تلقائي</Badge>
                  <Badge className="bg-secondary/20 text-secondary text-sm px-3 py-1">اختيار يدوي</Badge>
                  <Badge className="bg-accent/20 text-accent text-sm px-3 py-1">خطط مخصصة</Badge>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};
