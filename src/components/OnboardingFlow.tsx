import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, User, Target, School, Loader2, Heart } from "lucide-react";
import { nutritionApi } from "@/services/nutritionApi";
import { ActivityLevel, HealthGoal, HealthConditionType, getActivityLevelLabel, getHealthGoalLabel, getHealthConditionLabel } from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  university: string;
  goal: string;
  activityLevel: string;
  budget: string;
  // New nutrition profile fields
  height: string;
  weight: string;
  healthConditions: number[];
}

export const OnboardingFlow = ({ 
  onComplete, 
  onBack 
}: { 
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    gender: "",
    university: "",
    goal: "",
    activityLevel: "",
    budget: "",
    height: "",
    weight: "",
    healthConditions: []
  });
  const { toast } = useToast();

  const steps = [
    { icon: User, title: "معلوماتك الشخصية", subtitle: "أخبرنا عن نفسك" },
    { icon: Target, title: "أهدافك الصحية", subtitle: "ما الذي تريد تحقيقه؟" },
    { icon: Heart, title: "القياسات والحالة الصحية", subtitle: "أخبرنا عن قياساتك وحالتك الصحية" },
    { icon: School, title: "جامعتك وميزانيتك", subtitle: "حدد جامعتك وميزانيتك" }
  ];

  const universities = [
    "جامعة القاهرة",
    "الجامعة الأمريكية بالقاهرة", 
    "جامعة عين شمس",
    "جامعة الإسكندرية",
    "جامعة المنصورة",
    "جامعة أسيوط",
    "جامعة طنطا",
    "جامعة الزقازيق"
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - create nutrition profile and complete onboarding
      setIsLoading(true);
      
      try {
        // Create nutrition profile
        const profileData = {
          activityLevel: parseInt(data.activityLevel) as ActivityLevel,
          age: parseInt(data.age),
          healthGoal: parseInt(data.goal) as HealthGoal,
          height: parseFloat(data.height),
          weight: parseFloat(data.weight),
          healthConditions: data.healthConditions
        };

        await nutritionApi.createProfile(profileData);
        
        toast({
          title: "تم إنشاء ملفك الشخصي بنجاح",
          description: "تم حفظ معلوماتك الصحية والبدء في رحلتك مع وقاية",
        });

        onComplete(data);
      } catch (error) {
        console.error('Error creating nutrition profile:', error);
        toast({
          title: "خطأ في إنشاء الملف الشخصي",
          description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-wellness py-8">
      <div className="container mx-auto px-6 max-w-md">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center glow-primary">
              {currentStep === 0 && <User className="w-8 h-8 text-white" />}
              {currentStep === 1 && <Target className="w-8 h-8 text-white" />}
              {currentStep === 2 && <Heart className="w-8 h-8 text-white" />}
              {currentStep === 3 && <School className="w-8 h-8 text-white" />}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep].subtitle}
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {currentStep + 1} من {steps.length}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="glass-card p-6 mb-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-right block mb-2">الاسم الأول</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسمك"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-right block mb-2">العمر</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="أدخل عمرك"
                  value={data.age}
                  onChange={(e) => updateData("age", e.target.value)}
                  className="text-right"
                />
              </div>
              <div>
                <Label className="text-right block mb-3">الجنس</Label>
                <RadioGroup
                  value={data.gender}
                  onValueChange={(value) => updateData("gender", value)}
                  className="flex gap-4 justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="male">ذكر</Label>
                    <RadioGroupItem value="male" id="male" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="female">أنثى</Label>
                    <RadioGroupItem value="female" id="female" />
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-right block mb-3">هدفك الصحي</Label>
                <RadioGroup
                  value={data.goal}
                  onValueChange={(value) => updateData("goal", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="lose-weight" className="cursor-pointer">فقدان الوزن</Label>
                    <RadioGroupItem value={HealthGoal.LoseWeight.toString()} id="lose-weight" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="gain-muscle" className="cursor-pointer">بناء العضلات</Label>
                    <RadioGroupItem value={HealthGoal.GainMuscle.toString()} id="gain-muscle" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="maintain-weight" className="cursor-pointer">المحافظة على الوزن</Label>
                    <RadioGroupItem value={HealthGoal.MaintainWeight.toString()} id="maintain-weight" />
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-right block mb-3">مستوى النشاط</Label>
                <RadioGroup
                  value={data.activityLevel}
                  onValueChange={(value) => updateData("activityLevel", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="sedentary" className="cursor-pointer">قليل النشاط</Label>
                    <RadioGroupItem value={ActivityLevel.Sedentary.toString()} id="sedentary" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="lightly-active" className="cursor-pointer">نشاط خفيف</Label>
                    <RadioGroupItem value={ActivityLevel.LightlyActive.toString()} id="lightly-active" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="moderately-active" className="cursor-pointer">نشاط متوسط</Label>
                    <RadioGroupItem value={ActivityLevel.ModeratelyActive.toString()} id="moderately-active" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="very-active" className="cursor-pointer">نشاط عالي</Label>
                    <RadioGroupItem value={ActivityLevel.VeryActive.toString()} id="very-active" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="extra-active" className="cursor-pointer">نشاط مكثف</Label>
                    <RadioGroupItem value={ActivityLevel.ExtraActive.toString()} id="extra-active" />
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height" className="text-right block mb-2">الطول (سم)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={data.height}
                    onChange={(e) => updateData("height", e.target.value)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-right block mb-2">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={data.weight}
                    onChange={(e) => updateData("weight", e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <Label className="text-right block mb-3">الحالات الصحية (اختياري)</Label>
                <div className="space-y-2">
                  {Object.entries(HealthConditionType)
                    .filter(([key, value]) => typeof value === 'number' && value !== 0)
                    .map(([key, value]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${value}`}
                          checked={data.healthConditions.includes(value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData("healthConditions", [...data.healthConditions, value]);
                            } else {
                              updateData("healthConditions", data.healthConditions.filter(c => c !== value));
                            }
                          }}
                        />
                        <Label htmlFor={`condition-${value}`} className="text-sm cursor-pointer">
                          {getHealthConditionLabel(value as HealthConditionType)}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-right block mb-2">الجامعة</Label>
                <Select value={data.university} onValueChange={(value) => updateData("university", value)}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر جامعتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-right block mb-3">الميزانية اليومية للطعام</Label>
                <RadioGroup
                  value={data.budget}
                  onValueChange={(value) => updateData("budget", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="budget-low" className="cursor-pointer">20-40 جنيه</Label>
                    <RadioGroupItem value="20-40" id="budget-low" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="budget-mid" className="cursor-pointer">40-70 جنيه</Label>
                    <RadioGroupItem value="40-70" id="budget-mid" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-input hover:bg-muted/50">
                    <Label htmlFor="budget-high" className="cursor-pointer">70+ جنيه</Label>
                    <RadioGroupItem value="70+" id="budget-high" />
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? "العودة للرئيسية" : "السابق"}
          </Button>
          
          <Button
            onClick={nextStep}
            className="bg-gradient-primary flex items-center gap-2"
            disabled={
              isLoading ||
              (currentStep === 0 && (!data.name || !data.age || !data.gender)) ||
              (currentStep === 1 && (!data.goal || !data.activityLevel)) ||
              (currentStep === 2 && (!data.height || !data.weight)) ||
              (currentStep === 3 && (!data.university || !data.budget))
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? "إنهاء التسجيل" : "التالي"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};