import React from "react";
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
  Loader2,
  Sparkles,
  X
} from "lucide-react";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  error?: string | null;
  showSkipOption?: boolean;
  // new prop: explicit signal from caller that profile is incomplete (optional)
  isProfileIncomplete?: boolean;
}

export const ProfileCompletionModal = ({
  isOpen,
  onClose,
  onCompleteProfile,
  onSkip,
  isLoading = false,
  error = null,
  showSkipOption = true,
  isProfileIncomplete
}: ProfileCompletionModalProps) => {
  // determine if the error indicates an incomplete profile.
  // caller can pass isProfileIncomplete to be explicit; otherwise infer from error text.
  const inferredIncomplete = isProfileIncomplete ?? /profile.*incomplete|not found|ملف غير مكتمل/i.test(error ?? '');

  // If there's an error but it's NOT the "profile incomplete" case, show a simple error modal
  if (error && !inferredIncomplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center glow-primary">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">حدث خطأ</DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              حدث خطأ أثناء التحقق من ملفك الشخصي. حاول مرة أخرى لاحقًا.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">{error}</p>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>إغلاق</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Default: render the profile-completion UI when inferredIncomplete === true (or no error)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

          {/* Error Message - Only show user-friendly messages */}
          {error && (
            <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">{error}</p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onCompleteProfile}
              className="flex-1 bg-gradient-primary hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              أكمل الآن
            </Button>
            
            {showSkipOption && onSkip && (
              <Button variant="ghost" onClick={onSkip} disabled={isLoading}>
                تخطى
              </Button>
            )}
          </div>

          {/* Skip Warning */}
          {showSkipOption && (
            <div className="text-center">
              <p className="text-muted-foreground text-sm">يمكنك إكمال الملف لاحقًا من صفحة الإعدادات.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
