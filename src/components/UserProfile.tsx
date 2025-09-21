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
  Ruler
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
    <div className="min-h-screen bg-gradient-wellness">
      <Header onBack={onBack} showBackButton={true} onOpenChat={onOpenChat} title="الملف الشخصي" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    نظرة عامة
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BMI Card */}
                <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
                  <div className="text-3xl font-bold">{bmi}</div>
                  <div className="text-sm opacity-90">مؤشر كتلة الجسم</div>
                  <Badge className={`mt-2 ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">الوزن</span>
                    </div>
                    <span className="font-semibold">{profile.weight} كجم</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">الطول</span>
                    </div>
                    <span className="font-semibold">{profile.height} سم</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">السعرات اليومية</span>
                    </div>
                    <span className="font-semibold">{profile.dailyCalorieRequirement}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  تفاصيل الملف الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-right block mb-2">العمر</Label>
                        <Input
                          id="age"
                          type="number"
                          value={editData.age || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight" className="text-right block mb-2">الوزن (كجم)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={editData.weight || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height" className="text-right block mb-2">الطول (سم)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          value={editData.height || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label className="text-right block mb-2">الهدف الصحي</Label>
                        <Select 
                          value={editData.healthGoal?.toString() || ''} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, healthGoal: parseInt(value) as HealthGoal }))}
                        >
                          <SelectTrigger className="text-right">
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

                    <div>
                      <Label className="text-right block mb-2">مستوى النشاط</Label>
                      <Select 
                        value={editData.activityLevel?.toString() || ''} 
                        onValueChange={(value) => setEditData(prev => ({ ...prev, activityLevel: parseInt(value) as ActivityLevel }))}
                      >
                        <SelectTrigger className="text-right">
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
                    <div>
                      <Label className="text-right block mb-3">الحالات الصحية</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(HealthConditionType)
                          .filter(([key, value]) => typeof value === 'number' && value !== 0)
                          .map(([key, value]) => (
                            <div key={value} className="flex items-center space-x-2">
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
                              <Label htmlFor={`edit-condition-${value}`} className="text-sm cursor-pointer">
                                {getHealthConditionLabel(value as HealthConditionType)}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-primary flex-1"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 ml-2" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Display Mode */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm text-muted-foreground">العمر</Label>
                        <p className="text-lg font-semibold">{profile.age} سنة</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الهدف الصحي</Label>
                        <p className="text-lg font-semibold">{getHealthGoalLabel(profile.healthGoal)}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">مستوى النشاط</Label>
                      <p className="text-lg font-semibold">{getActivityLevelLabel(profile.activityLevel)}</p>
                    </div>

                    {profile.healthConditions && profile.healthConditions.length > 0 && (
                      <div>
                        <Label className="text-sm text-muted-foreground mb-3 block">الحالات الصحية</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.healthConditions.map(condition => (
                            <Badge key={condition} variant="secondary">
                              {getHealthConditionLabel(condition as HealthConditionType)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>تاريخ الإنشاء</span>
                        <span>{new Date(profile.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                        <span>آخر تحديث</span>
                        <span>{new Date(profile.updatedAt).toLocaleDateString('ar-EG')}</span>
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
