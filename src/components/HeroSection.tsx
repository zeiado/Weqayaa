import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeqayaLogo } from "./WeqayaLogo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Users, Utensils, Brain, Star } from "lucide-react";
import weqayaHero from "@/assets/weqaya-hero.jpg";

export const HeroSection = ({ 
  onStartRegistration, 
  onLogin 
}: { 
  onStartRegistration?: () => void;
  onLogin?: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-wellness relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-glow/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent-glow/10 rounded-full blur-3xl"></div>
      </div>

      <Header 
        onLogin={onLogin}
        showBackButton={false}
      />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Main Hero Content */}
        <div className="text-center mb-12 sm:mb-16">
          <WeqayaLogo size="lg" />
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-6 sm:mt-8 mb-4">
            حمايتك الغذائية الذكية
            <br />
            <span className="text-primary">في الجامعة</span>
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
            اكتشف الوجبات الصحية المناسبة لك من قائمة الكافتيريا واحصل على استشارات غذائية ذكية
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              className="bg-gradient-primary hover:shadow-lg transition-smooth text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl w-full sm:w-auto"
              onClick={onStartRegistration}
            >
              ابدأ رحلة الوقاية المجانية
            </Button>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl w-full sm:w-auto">
              شاهد كيف يعمل
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center mb-12 sm:mb-16 px-4">
          <div className="relative">
            <img 
              src={weqayaHero} 
              alt="وقاية - تطبيق التغذية الذكية" 
              className="rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full"
            />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
          <Card className="glass-card p-4 sm:p-6 text-center transition-smooth hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base">وجبات مخصصة</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">توصيات غذائية مبنية على قائمة الكافتيريا</p>
          </Card>

          <Card className="glass-card p-4 sm:p-6 text-center transition-smooth hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base">ذكاء اصطناعي</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">مستشار غذائي ذكي متاح 24/7</p>
          </Card>

          <Card className="glass-card p-4 sm:p-6 text-center transition-smooth hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base">مجتمع طلابي</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">انضم لآلاف الطلاب الأصحاء</p>
          </Card>

          <Card className="glass-card p-4 sm:p-6 text-center transition-smooth hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base">نتائج مضمونة</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">تحسن صحي ملحوظ خلال أسبوعين</p>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="flex justify-center items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-secondary fill-current" />
            ))}
            <span className="text-sm text-muted-foreground mr-2">4.9/5</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold text-primary">+15,000</span> طالب يثق بـوقاية
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};