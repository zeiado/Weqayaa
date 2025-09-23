import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeqayaLogo } from "./WeqayaLogo";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "./AIChat";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { 
  Bell, 
  MessageCircle, 
  Utensils, 
  TrendingUp, 
  Calendar,
  Crown,
  Plus,
  Activity,
  Zap,
  Clock,
  ArrowLeft,
  User
} from "lucide-react";

export const Dashboard = ({ 
  userName, 
  onBack,
  onOpenChat,
  onOpenCafeteria,
  onOpenProfile,
  onOpenMealPlan,
  onOpenProgressReport
}: { 
  userName?: string;
  onBack: () => void;
  onOpenChat: () => void;
  onOpenCafeteria: () => void;
  onOpenProfile?: () => void;
  onOpenMealPlan?: () => void;
  onOpenProgressReport?: () => void;
}) => {
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        setUserData(parsed);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const displayName = userData ? `${userData.firstName} ${userData.lastName}` : userName || "أحمد";
  const todaysMeals = [
    {
      name: "فول مدمس بالطحينة",
      calories: 320,
      protein: 12,
      price: 15,
      rating: 4.5,
      available: true
    },
    {
      name: "سلطة خضراء مع جبن قريش",
      calories: 180,
      protein: 8,
      price: 25,
      rating: 4.8,
      available: true
    },
    {
      name: "فراخ مشوية مع أرز",
      calories: 450,
      protein: 35,
      price: 40,
      rating: 4.3,
      available: false
    }
  ];

  const nutritionGoals = {
    calories: { current: 1200, target: 2000 },
    protein: { current: 45, target: 80 },
    water: { current: 6, target: 8 }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title={`أهلاً ${displayName}`}
        onOpenChat={onOpenChat}
        onOpenProfile={onOpenProfile}
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="glass-card p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-primary">{nutritionGoals.calories.current}</div>
            <div className="text-xs text-muted-foreground">سعرات اليوم</div>
            <Progress 
              value={(nutritionGoals.calories.current / nutritionGoals.calories.target) * 100} 
              className="mt-2 h-1" 
            />
          </Card>
          <Card className="glass-card p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-secondary">{nutritionGoals.protein.current}g</div>
            <div className="text-xs text-muted-foreground">بروتين</div>
            <Progress 
              value={(nutritionGoals.protein.current / nutritionGoals.protein.target) * 100} 
              className="mt-2 h-1" 
            />
          </Card>
          <Card className="glass-card p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-accent">{nutritionGoals.water.current}</div>
            <div className="text-xs text-muted-foreground">أكواب مياه</div>
            <Progress 
              value={(nutritionGoals.water.current / nutritionGoals.water.target) * 100} 
              className="mt-2 h-1" 
            />
          </Card>
        </div>

        {/* AI Chat Quick Access */}
        <Card className="glass-card p-4 sm:p-6 bg-gradient-primary text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-base sm:text-lg">مستشار وقاية الذكي</h3>
              <p className="text-sm text-white/80">اسأل أي سؤال عن التغذية الصحية</p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
              onClick={onOpenChat}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              ابدأ المحادثة
            </Button>
          </div>
        </Card>

        {/* Today's Recommended Meals */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">وجبات اليوم المقترحة</h2>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 ml-2" />
              عرض الأسبوع
            </Button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {todaysMeals.map((meal, index) => (
              <Card key={index} className={`glass-card p-3 sm:p-4 ${!meal.available ? 'opacity-60' : ''}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{meal.name}</h3>
                      {!meal.available && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          <Clock className="w-3 h-3 ml-1" />
                          غير متاح
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                        {meal.calories} سعرة
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                        {meal.protein}g بروتين
                      </span>
                      <span>{meal.price} جنيه</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-semibold text-secondary">⭐ {meal.rating}</div>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!meal.available}
                      className="bg-gradient-primary shrink-0"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        <Card className="glass-card p-4 sm:p-6 bg-gradient-secondary text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-semibold text-sm sm:text-base">ترقية لحساب وقاية المتقدم</h3>
              </div>
              <p className="text-xs sm:text-sm text-white/80 mb-3">
                استشارات غير محدودة + خطط غذائية مخصصة + تحليلات متقدمة
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span>50 جنيه/شهر</span>
                <span className="line-through text-white/60">100 جنيه/شهر</span>
                <Badge className="bg-white/20 text-white text-xs">خصم 50%</Badge>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90 w-full sm:w-auto">
              ترقية الآن
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {onOpenProgressReport && (
            <Button 
              variant="outline" 
              className="p-4 sm:p-6 h-auto flex-col gap-2" 
              onClick={onOpenProgressReport}
            >
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-xs sm:text-sm">تقرير التقدم</span>
            </Button>
          )}
          <Button variant="outline" className="p-4 sm:p-6 h-auto flex-col gap-2" onClick={onOpenCafeteria}>
            <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            <span className="text-xs sm:text-sm">قائمة الكافتيريا</span>
          </Button>
          {onOpenMealPlan && (
            <Button variant="outline" className="p-4 sm:p-6 h-auto flex-col gap-2" onClick={onOpenMealPlan}>
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <span className="text-xs sm:text-sm">خطة الوجبات</span>
            </Button>
          )}
          {onOpenProfile && (
            <Button variant="outline" className="p-4 sm:p-6 h-auto flex-col gap-2" onClick={onOpenProfile}>
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <span className="text-xs sm:text-sm">الملف الشخصي</span>
            </Button>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};