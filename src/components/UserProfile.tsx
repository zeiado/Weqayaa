import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { 
  User, 
  Target, 
  Activity, 
  Heart, 
  Edit3, 
  Save, 
  X, 
  Loader2,
  TrendingUp,
  Scale,
  Ruler,
  Award,
  Star,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Droplets,
  Flame,
  ArrowRight,
  CheckCircle,
  Crown,
  Shield,
  Trophy
} from "lucide-react";
import { nutritionApi } from "@/services/nutritionApi";
import { 
  UserProfile as UserProfileType, 
  ActivityLevel, 
  HealthGoal, 
  HealthConditionType,
  getActivityLevelLabel, 
  getHealthGoalLabel, 
  getHealthConditionLabel 
} from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  onBack: () => void;
  onOpenChat?: () => void;
}

export const UserProfile = ({ onBack, onOpenChat }: UserProfileProps) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfileType>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await nutritionApi.getProfile();
      setProfile(profileData);
      setEditData(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "خطأ في تحميل الملف الشخصي",
        description: "حدث خطأ أثناء تحميل بياناتك الشخصية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await nutritionApi.updateProfile(editData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "نقص الوزن", color: "bg-blue-100 text-blue-800" };
    if (bmi < 25) return { label: "وزن طبيعي", color: "bg-green-100 text-green-800" };
    if (bmi < 30) return { label: "زيادة وزن", color: "bg-yellow-100 text-yellow-800" };
    return { label: "سمنة", color: "bg-red-100 text-red-800" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <Header onBack={onBack} showBackButton={true} onOpenChat={onOpenChat} title="الملف الشخصي" />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <Header onBack={onBack} showBackButton={true} onOpenChat={onOpenChat} title="الملف الشخصي" />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">لا يوجد ملف شخصي</h2>
            <p className="text-muted-foreground mb-6">يبدو أنك لم تقم بإنشاء ملفك الشخصي بعد</p>
            <Button onClick={onBack} className="bg-gradient-primary">
              العودة للرئيسية
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bmi = parseFloat(calculateBMI(profile.weight, profile.height));
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="min-h-screen bg-gradient-wellness relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-glow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent-glow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Header onBack={onBack} showBackButton={true} onOpenChat={onOpenChat} title="الملف الشخصي" />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            الملف الشخصي
          </h1>
          <p className="text-muted-foreground">إدارة معلوماتك الصحية والأهداف</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* BMI Card */}
            <Card className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 bg-background/80 backdrop-blur-sm">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{bmi}</div>
                <div className="text-sm text-foreground/80 mb-3">مؤشر كتلة الجسم</div>
                <Badge className={`${bmiCategory.color} text-sm px-3 py-1`}>
                  {bmiCategory.label}
                </Badge>
              </div>
            </Card>

            {/* Health Stats */}
            <Card className="glass-card p-6 bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                  <Activity className="w-5 h-5 text-primary" />
                  الإحصائيات الصحية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">الوزن</span>
                  </div>
                  <span className="font-bold text-primary">{profile.weight} كجم</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary/10 dark:bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium text-foreground">الطول</span>
                  </div>
                  <span className="font-bold text-secondary">{profile.height} سم</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent/10 dark:bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">السعرات اليومية</span>
                  </div>
                  <span className="font-bold text-accent">{profile.dailyCalorieRequirement}</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card p-6 bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <div>
                    <div className="text-sm font-medium text-foreground">عضو جديد</div>
                    <div className="text-xs text-foreground/70">انضممت إلى وقاية</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm font-medium text-foreground">ملف مكتمل</div>
                    <div className="text-xs text-foreground/70">أكملت بياناتك الشخصية</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-foreground">مستوى الصحة</div>
                    <div className="text-xs text-foreground/70">حالة صحية جيدة</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Profile Details */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6 bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    تفاصيل الملف الشخصي
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Edit3 className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <User className="w-5 h-5 text-primary" />
                        المعلومات الأساسية
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="age" className="text-right block mb-3 font-medium">العمر</Label>
                          <Input
                            id="age"
                            type="number"
                            value={editData.age || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                            className="text-right border-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight" className="text-right block mb-3 font-medium">الوزن (كجم)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={editData.weight || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                            className="text-right border-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="height" className="text-right block mb-3 font-medium">الطول (سم)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          value={editData.height || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                          className="text-right border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-right block mb-3 font-medium">الهدف الصحي</Label>
                        <Select 
                          value={editData.healthGoal?.toString() || ''} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, healthGoal: parseInt(value) as HealthGoal }))}
                        >
                          <SelectTrigger className="text-right border-primary/20 focus:border-primary">
                            <SelectValue placeholder="اختر هدفك" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={HealthGoal.LoseWeight.toString()}>
                              {getHealthGoalLabel(HealthGoal.LoseWeight)}
                            </SelectItem>
                            <SelectItem value={HealthGoal.GainMuscle.toString()}>
                              {getHealthGoalLabel(HealthGoal.GainMuscle)}
                            </SelectItem>
                            <SelectItem value={HealthGoal.MaintainWeight.toString()}>
                              {getHealthGoalLabel(HealthGoal.MaintainWeight)}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-secondary/10 dark:bg-secondary/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Activity className="w-5 h-5 text-secondary" />
                        مستوى النشاط
                      </h3>
                      <Select 
                        value={editData.activityLevel?.toString() || ''} 
                        onValueChange={(value) => setEditData(prev => ({ ...prev, activityLevel: parseInt(value) as ActivityLevel }))}
                      >
                        <SelectTrigger className="text-right border-secondary/20 focus:border-secondary">
                          <SelectValue placeholder="اختر مستوى نشاطك" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ActivityLevel).filter(val => typeof val === 'number').map(level => (
                            <SelectItem key={level} value={level.toString()}>
                              {getActivityLevelLabel(level as ActivityLevel)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Health Conditions */}
                    <div className="bg-accent/10 dark:bg-accent/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Heart className="w-5 h-5 text-accent" />
                        الحالات الصحية
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(HealthConditionType)
                          .filter(([key, value]) => typeof value === 'number' && value !== 0)
                          .map(([key, value]) => (
                            <div key={value} className="flex items-center space-x-3 p-3 bg-background/50 dark:bg-background/80 rounded-lg border border-accent/20">
                              <Checkbox
                                id={`edit-condition-${value}`}
                                checked={editData.healthConditions?.includes(value) || false}
                                onCheckedChange={(checked) => {
                                  const currentConditions = editData.healthConditions || [];
                                  if (checked) {
                                    setEditData(prev => ({ 
                                      ...prev, 
                                      healthConditions: [...currentConditions, value] 
                                    }));
                                  } else {
                                    setEditData(prev => ({ 
                                      ...prev, 
                                      healthConditions: currentConditions.filter(c => c !== value) 
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={`edit-condition-${value}`} className="text-sm cursor-pointer font-medium text-foreground">
                                {getHealthConditionLabel(value as HealthConditionType)}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-primary flex-1 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 ml-2" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1 py-3 text-base font-semibold border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <X className="w-5 h-5 ml-2" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Enhanced Display Mode */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
                        <Label className="text-sm text-foreground/70 mb-2 block">العمر</Label>
                        <p className="text-xl font-bold text-primary">{profile.age} سنة</p>
                      </div>
                      <div className="bg-secondary/10 dark:bg-secondary/20 rounded-lg p-4">
                        <Label className="text-sm text-foreground/70 mb-2 block">الهدف الصحي</Label>
                        <p className="text-xl font-bold text-secondary">{getHealthGoalLabel(profile.healthGoal)}</p>
                      </div>
                    </div>

                    <div className="bg-accent/10 dark:bg-accent/20 rounded-lg p-4">
                      <Label className="text-sm text-foreground/70 mb-2 block">مستوى النشاط</Label>
                      <p className="text-xl font-bold text-accent">{getActivityLevelLabel(profile.activityLevel)}</p>
                    </div>

                    {profile.healthConditions && profile.healthConditions.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                        <Label className="text-sm text-foreground/70 mb-4 block font-medium">الحالات الصحية</Label>
                        <div className="flex flex-wrap gap-3">
                          {profile.healthConditions.map(condition => (
                            <Badge key={condition} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-sm px-3 py-1">
                              <Heart className="w-3 h-3 ml-1" />
                              {getHealthConditionLabel(condition as HealthConditionType)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        معلومات الحساب
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background/50 dark:bg-background/80 rounded-lg">
                          <span className="text-sm text-foreground/70">تاريخ الإنشاء</span>
                          <span className="font-semibold text-foreground">{new Date(profile.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background/50 dark:bg-background/80 rounded-lg">
                          <span className="text-sm text-foreground/70">آخر تحديث</span>
                          <span className="font-semibold text-foreground">{new Date(profile.updatedAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
