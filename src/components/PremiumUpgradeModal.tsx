import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Crown, Check, Star, Zap, Heart, Shield, Sparkles, ArrowRight, Gift } from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'استشارات غير محدودة',
      description: 'احصل على استشارات غذائية فورية 24/7'
    },
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: 'خطط غذائية مخصصة',
      description: 'خطط مصممة خصيصاً لأهدافك الصحية'
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: 'تحليلات متقدمة',
      description: 'تقارير مفصلة عن تقدمك الصحي'
    },
    {
      icon: <Star className="w-5 h-5 text-purple-500" />,
      title: 'دعم أولوية',
      description: 'دعم فني سريع ومتخصص'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-green-500" />,
      title: 'ميزات حصرية',
      description: 'وصول مبكر للميزات الجديدة'
    },
    {
      icon: <Gift className="w-5 h-5 text-orange-500" />,
      title: 'خصومات حصرية',
      description: 'خصومات على المنتجات الصحية'
    }
  ];

  const plans = {
    monthly: {
      price: 50,
      originalPrice: 100,
      period: 'شهرياً',
      savings: '50%'
    },
    yearly: {
      price: 500,
      originalPrice: 1200,
      period: 'سنوياً',
      savings: '58%'
    }
  };

  const handleUpgrade = () => {
    // TODO: Implement actual payment processing
    console.log(`Upgrading to ${selectedPlan} plan`);
    alert(`سيتم توجيهك لصفحة الدفع للخطة ${selectedPlan === 'monthly' ? 'الشهرية' : 'السنوية'}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <Card className="glass-card border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-sm">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    ترقية إلى وقاية المتقدم
                  </h2>
                  <p className="text-muted-foreground">احصل على تجربة صحية متكاملة</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 text-center">مميزات العضوية المتقدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Plans */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-center">اختر خطتك</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlan === 'monthly'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="text-center">
                    <h4 className="font-bold text-lg">شهري</h4>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-primary">{plans.monthly.price}</span>
                      <span className="text-muted-foreground"> جنيه</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm line-through text-muted-foreground">
                        {plans.monthly.originalPrice} جنيه
                      </span>
                      <Badge className="bg-green-500 text-white text-xs">
                        خصم {plans.monthly.savings}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 relative ${
                    selectedPlan === 'yearly'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlan('yearly')}
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                      الأكثر توفيراً
                    </Badge>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg">سنوي</h4>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-primary">{plans.yearly.price}</span>
                      <span className="text-muted-foreground"> جنيه</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm line-through text-muted-foreground">
                        {plans.yearly.originalPrice} جنيه
                      </span>
                      <Badge className="bg-green-500 text-white text-xs">
                        خصم {plans.yearly.savings}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Button */}
            <div className="text-center">
              <Button
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Crown className="w-5 h-5 ml-2" />
                ترقية الآن
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                يمكنك إلغاء الاشتراك في أي وقت • ضمان استرداد الأموال لمدة 30 يوم
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
