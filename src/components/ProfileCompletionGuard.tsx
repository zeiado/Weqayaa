import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Target, 
  Heart, 
  School, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { nutritionApi } from "@/services/nutritionApi";
import { UserProfile } from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
  onCompleteProfile?: () => void;
  onSkip?: () => void;
}

interface ProfileStatus {
  hasProfile: boolean;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const ProfileCompletionGuard = ({ 
  children, 
  onCompleteProfile, 
  onSkip 
}: ProfileCompletionGuardProps) => {
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    hasProfile: false,
    profile: null,
    isLoading: true,
    error: null
  });
  const [showModal, setShowModal] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      setProfileStatus(prev => ({ ...prev, isLoading: true, error: null }));
      setIsProfileIncomplete(false);

      const profile = await nutritionApi.getProfile();

      setProfileStatus({
        hasProfile: true,
        profile,
        isLoading: false,
        error: null
      });

      // Ensure modal is hidden when profile is returned successfully
      setShowModal(false);
      setIsProfileIncomplete(false);
    } catch (error: any) {
      console.error('Profile check error:', error);

      // Normalize response details
      const status = error?.response?.status ?? error?.status ?? null;
      const code = error?.response?.data?.code ?? error?.code ?? null;
      const message = String(error?.response?.data?.message ?? error?.message ?? '').toLowerCase();

      // Only treat these cases as "profile incomplete"
      const detectedIncomplete =
        status === 404 ||
        code === 'PROFILE_INCOMPLETE' ||
        /profile.*incomplete|not found|ملف غير مكتمل/.test(message);

      setProfileStatus({
        hasProfile: false,
        profile: null,
        isLoading: false,
        error: detectedIncomplete ? 'ملف غير مكتمل' : (message || 'حدث خطأ أثناء التحقق')
      });

      setIsProfileIncomplete(detectedIncomplete);

      if (detectedIncomplete) {
        // show modal only for profile-incomplete case
        setShowModal(true);
      } else {
        // keep modal closed for other errors; optionally inform user
        setShowModal(false);
        toast?.({
          title: 'حدث خطأ',
          description: 'تعذر التحقق من ملفك الشخصي. حاول مرة أخرى لاحقًا.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCompleteProfile = () => {
    if (onCompleteProfile) onCompleteProfile();
    setShowModal(false);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    setShowModal(false);
  };

  const handleRetry = () => {
    checkProfileStatus();
  };

  // Show simple loader while checking profile
  if (profileStatus.isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>جاري التحقق من الملف...</span>
      </div>
    );
  }

  // If profile exists, render children
  if (profileStatus.hasProfile && profileStatus.profile) {
    return <>{children}</>;
  }

  // No profile: render children + modal (modal will only open when isProfileIncomplete === true)
  return (
    <>
      {children}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center glow-primary">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              أكمل ملفك الشخصي
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              نحتاج إلى بعض المعلومات الإضافية لتقديم أفضل تجربة غذائية مخصصة لك
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <AlertCircle className="w-3 h-3 ml-1" />
                  ملف غير مكتمل
                </Badge>
              </div>
              <Progress value={30} className="h-2 bg-primary/20" />
              <p className="text-sm text-muted-foreground mt-2">30% مكتمل</p>
            </div>

            {/* Required Information */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                المعلومات المطلوبة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">القياسات الصحية</p>
                    <p className="text-xs text-muted-foreground">الطول والوزن</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">الأهداف الصحية</p>
                    <p className="text-xs text-muted-foreground">فقدان/زيادة/المحافظة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">مستوى النشاط</p>
                    <p className="text-xs text-muted-foreground">من قليل إلى مكثف</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <School className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">الحالة الصحية</p>
                    <p className="text-xs text-muted-foreground">أي حالات صحية</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                المميزات بعد الإكمال
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-foreground">توصيات غذائية مخصصة</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-foreground">خطط وجبات شخصية</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-foreground">تتبع التقدم الصحي</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-foreground">استشارات ذكية متقدمة</span>
                </div>
              </div>
            </Card>

            {/* Error Message */}
            {profileStatus.error && (
              <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">خطأ في تحميل الملف الشخصي</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {profileStatus.error}
                </p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleCompleteProfile}
                className="flex-1 bg-gradient-primary hover:shadow-lg transition-all duration-300"
                disabled={isCreatingProfile}
              >
                {isCreatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 ml-2" />
                    أكمل ملفي الشخصي
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="sm:w-auto border-primary/30 text-primary hover:bg-primary/10"
                disabled={isCreatingProfile}
              >
                إعادة المحاولة
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="sm:w-auto text-muted-foreground hover:text-foreground"
                disabled={isCreatingProfile}
              >
                تخطي الآن
              </Button>
            </div>

            {/* Skip Warning */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                يمكنك تخطي هذا الآن، لكن بعض المميزات قد لا تعمل بشكل كامل
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
