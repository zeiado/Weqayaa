import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  Zap, 
  Brain, 
  Star,
  Clock,
  Shield,
  Heart
} from "lucide-react";

interface AIAssistancePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export const AIAssistancePopup = ({ isOpen, onClose, onOpenChat }: AIAssistancePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleOpenChat = () => {
    onOpenChat();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <Card className={`relative w-full max-w-md mx-auto glass-card border-2 border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-500 transform ${
        isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 z-10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Header with Animated Background */}
        <div className="relative p-6 pb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-t-lg opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center">
            {/* Animated Icon */}
            <div className="relative mx-auto mb-4 w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              مستشار وقاية الذكي
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              احصل على استشارات غذائية فورية ومخصصة من الذكاء الاصطناعي المتقدم
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">إجابات فورية</p>
                <p className="text-xs text-muted-foreground">24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5 dark:bg-secondary/10 border border-secondary/20">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">مخصص لك</p>
                <p className="text-xs text-muted-foreground">شخصي</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/20">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">موثوق</p>
                <p className="text-xs text-muted-foreground">آمن</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">متقدم</p>
                <p className="text-xs text-muted-foreground">ذكي</p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3 text-center">اسأل عن أي شيء:</p>
            <div className="space-y-2">
              {[
                "ما أفضل وجبة للإفطار؟",
                "كيف أزيد من وزني بطريقة صحية؟",
                "احسب احتياجي من السعرات الحرارية"
              ].map((question, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 dark:bg-muted/30">
                  <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground flex-1">{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleOpenChat}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              ابدأ المحادثة الآن
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              ربما لاحقاً
            </Button>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">متاح الآن - ابدأ فوراً!</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
