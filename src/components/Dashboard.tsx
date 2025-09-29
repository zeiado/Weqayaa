import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeqayaLogo } from "./WeqayaLogo";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "./AIChat";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PremiumUpgradeModal } from "./PremiumUpgradeModal";
import { AIAssistancePopup } from "./AIAssistancePopup";
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
  User,
  Heart,
  Droplets,
  Target,
  Award,
  Sparkles,
  Star,
  ArrowRight,
  Flame,
  Apple,
  Coffee,
  Moon,
  Sun
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);

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

    // Show AI assistance popup after a delay (only if not shown before)
    const hasSeenAIPopup = localStorage.getItem('hasSeenAIPopup');
    if (!hasSeenAIPopup) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
      }, 2000); // Show after 2 seconds
      return () => clearTimeout(timer);
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
        title={`أهلاً ${displayName}`}
        onOpenChat={onOpenChat}
        onOpenProfile={onOpenProfile}
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 relative z-10">
        {/* Welcome Section with Time-based Greeting */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {new Date().getHours() < 12 ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : new Date().getHours() < 18 ? (
              <Sun className="w-5 h-5 text-orange-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {new Date().getHours() < 12 ? "صباح الخير" : new Date().getHours() < 18 ? "مساء الخير" : "مساء الخير"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {displayName} 🌟
          </h1>
          <p className="text-muted-foreground mt-2">استمر في رحلتك نحو الصحة المثالية</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300 border-primary/20 hover:border-primary/40 bg-background/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{nutritionGoals.calories.current}</div>
              <div className="text-sm text-foreground/80 mb-3">سعرات اليوم</div>
              <Progress 
                value={(nutritionGoals.calories.current / nutritionGoals.calories.target) * 100} 
                className="h-2 bg-primary/20" 
              />
              <div className="text-xs text-foreground/70 mt-2">
                {nutritionGoals.calories.target - nutritionGoals.calories.current} سعرة متبقية
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300 border-secondary/20 hover:border-secondary/40 bg-background/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-secondary mb-1">{nutritionGoals.protein.current}g</div>
              <div className="text-sm text-foreground/80 mb-3">بروتين</div>
              <Progress 
                value={(nutritionGoals.protein.current / nutritionGoals.protein.target) * 100} 
                className="h-2 bg-secondary/20" 
              />
              <div className="text-xs text-foreground/70 mt-2">
                {nutritionGoals.protein.target - nutritionGoals.protein.current}g متبقي
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300 border-accent/20 hover:border-accent/40 bg-background/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{nutritionGoals.water.current}</div>
              <div className="text-sm text-foreground/80 mb-3">أكواب مياه</div>
              <Progress 
                value={(nutritionGoals.water.current / nutritionGoals.water.target) * 100} 
                className="h-2 bg-accent/20" 
              />
              <div className="text-xs text-foreground/70 mt-2">
                {nutritionGoals.water.target - nutritionGoals.water.current} كوب متبقي
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced AI Chat Section */}
        <Card className="glass-card p-6 sm:p-8 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl">مستشار وقاية الذكي</h3>
                    <p className="text-white/80 text-sm">مدعوم بالذكاء الاصطناعي المتقدم</p>
                  </div>
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">
                  احصل على استشارات غذائية فورية ومخصصة. اسأل عن أي شيء متعلق بالتغذية الصحية واللياقة البدنية
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white text-xs">متاح 24/7</Badge>
                  <Badge className="bg-white/20 text-white text-xs">إجابات فورية</Badge>
                  <Badge className="bg-white/20 text-white text-xs">مخصص لك</Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={onOpenChat}
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  ابدأ المحادثة
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto px-6 py-3 text-sm font-medium transition-all duration-300"
                  onClick={() => setShowAIPopup(true)}
                >
                  <Sparkles className="w-4 h-4 ml-2" />
                  تعرف على المزيد
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Today's Recommended Meals */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                وجبات اليوم المقترحة
              </h2>
              <p className="text-muted-foreground text-sm mt-1">اختر من أفضل الوجبات الصحية المتاحة</p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10">
              <Calendar className="w-4 h-4 ml-2" />
              عرض الأسبوع
            </Button>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            {todaysMeals.map((meal, index) => (
              <Card key={index} className={`glass-card p-4 sm:p-6 group hover:scale-[1.02] transition-all duration-300 bg-background/80 ${!meal.available ? 'opacity-60' : 'hover:shadow-lg'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          {meal.name.includes('فول') ? <Apple className="w-5 h-5 text-white" /> : 
                           meal.name.includes('سلطة') ? <Heart className="w-5 h-5 text-white" /> :
                           <Coffee className="w-5 h-5 text-white" />}
                        </div>
                        <h3 className="font-bold text-foreground text-base sm:text-lg">{meal.name}</h3>
                      </div>
                      {!meal.available && (
                        <Badge variant="secondary" className="text-xs shrink-0 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <Clock className="w-3 h-3 ml-1" />
                          غير متاح
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>{meal.calories} سعرة</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Activity className="w-4 h-4 text-secondary" />
                        <span>{meal.protein}g بروتين</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80 col-span-2 sm:col-span-1">
                        <span className="font-semibold text-foreground">{meal.price} جنيه</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-foreground">{meal.rating}</span>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!meal.available}
                      className="bg-gradient-primary hover:shadow-lg transition-all duration-300 px-6"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Premium Upgrade Banner */}
        <Card className="glass-card p-6 sm:p-8 bg-gradient-to-br from-secondary via-secondary/90 to-accent text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl">ترقية لحساب وقاية المتقدم</h3>
                    <p className="text-white/80 text-sm">احصل على المزيد من المميزات</p>
                  </div>
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">
                  استشارات غير محدودة + خطط غذائية مخصصة + تحليلات متقدمة + دعم أولوية
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">50 جنيه/شهر</span>
                    <span className="line-through text-white/60 text-sm">100 جنيه/شهر</span>
                  </div>
                  <Badge className="bg-white/20 text-white text-sm px-3 py-1">خصم 50%</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white text-xs">استشارات غير محدودة</Badge>
                  <Badge className="bg-white/20 text-white text-xs">خطط مخصصة</Badge>
                  <Badge className="bg-white/20 text-white text-xs">تحليلات متقدمة</Badge>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-secondary hover:bg-white/90 w-full sm:w-auto px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowPremiumModal(true)}
              >
                <Crown className="w-5 h-5 ml-2" />
                ترقية الآن
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Quick Actions */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            الإجراءات السريعة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {onOpenProgressReport && (
              <Button 
                variant="outline" 
                className="p-6 sm:p-8 h-auto flex-col gap-4 group hover:scale-105 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 dark:border-primary/40 dark:hover:border-primary/70 dark:hover:from-primary/15 dark:hover:to-primary/10 shadow-lg hover:shadow-xl hover:shadow-primary/20" 
                onClick={onOpenProgressReport}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-primary/30">
                  <TrendingUp className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">تقرير التقدم</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              className="p-6 sm:p-8 h-auto flex-col gap-4 group hover:scale-105 transition-all duration-300 border-2 border-secondary/30 hover:border-secondary/60 hover:bg-gradient-to-br hover:from-secondary/10 hover:to-secondary/5 dark:border-secondary/40 dark:hover:border-secondary/70 dark:hover:from-secondary/15 dark:hover:to-secondary/10 shadow-lg hover:shadow-xl hover:shadow-secondary/20" 
              onClick={onOpenCafeteria}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-secondary/30">
                <Utensils className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">قائمة الكافتيريا</span>
            </Button>
            {onOpenMealPlan && (
              <Button 
                variant="outline" 
                className="p-6 sm:p-8 h-auto flex-col gap-4 group hover:scale-105 transition-all duration-300 border-2 border-accent/30 hover:border-accent/60 hover:bg-gradient-to-br hover:from-accent/10 hover:to-accent/5 dark:border-accent/40 dark:hover:border-accent/70 dark:hover:from-accent/15 dark:hover:to-accent/10 shadow-lg hover:shadow-xl hover:shadow-accent/20" 
                onClick={onOpenMealPlan}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-accent/30">
                  <Calendar className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-300">خطة الوجبات</span>
              </Button>
            )}
            {onOpenProfile && (
              <Button 
                variant="outline" 
                className="p-6 sm:p-8 h-auto flex-col gap-4 group hover:scale-105 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 dark:border-primary/40 dark:hover:border-primary/70 dark:hover:from-primary/15 dark:hover:to-primary/10 shadow-lg hover:shadow-xl hover:shadow-primary/20" 
                onClick={onOpenProfile}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-primary/30">
                  <User className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">الملف الشخصي</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />

      {/* AI Assistance Popup */}
      <AIAssistancePopup 
        isOpen={showAIPopup} 
        onClose={() => {
          setShowAIPopup(false);
          localStorage.setItem('hasSeenAIPopup', 'true');
        }}
        onOpenChat={onOpenChat}
      />
    </div>
  );
};