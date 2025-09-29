# 👤 بيانات المستخدم المتاحة لتغذية Progress APIs

## 📊 نظرة عامة

نعم، هناك بيانات مستخدم متاحة بالفعل في الواجهة الأمامية يمكن استخدامها لتغذية Progress APIs. إليك تفصيل شامل:

## 🔐 بيانات المصادقة المتاحة

### **1. بيانات تسجيل الدخول (Auth Data)**
```typescript
// مخزنة في localStorage تحت 'userData'
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string
}

// مخزنة في localStorage تحت 'authToken'
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**الاستخدام:**
- جميع طلبات API تستخدم `authToken` تلقائياً
- معرف المستخدم (`userId`) متاح لتتبع البيانات

## 🏥 بيانات الملف الشخصي الغذائي

### **2. بيانات Onboarding (عند التسجيل)**
```typescript
interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  university: string;
  goal: string;
  activityLevel: string;
  budget: string;
  // بيانات التغذية
  height: string;
  weight: string;
  healthConditions: number[];
}
```

### **3. بيانات الملف الشخصي الغذائي (Nutrition Profile)**
```typescript
interface UserProfile {
  id: number;
  age: number;
  weight: number;           // الوزن الحالي
  height: number;           // الطول
  activityLevel: ActivityLevel;  // مستوى النشاط
  healthGoal: HealthGoal;   // الهدف الصحي
  healthConditions: number[]; // الحالات الصحية
  bmi: number;              // مؤشر كتلة الجسم
  dailyCalorieRequirement: number; // الاحتياج اليومي من السعرات
  createdAt: string;
  updatedAt: string;
}
```

**الاستخدام في Progress APIs:**
- `weight` - لتتبع تغيير الوزن
- `height` - لحساب BMI
- `dailyCalorieRequirement` - للأهداف اليومية
- `activityLevel` - لحساب السعرات المحروقة
- `healthGoal` - لتخصيص التوصيات

## 📈 بيانات التقدم المتاحة

### **4. بيانات المقاييس اليومية (Progress Metrics)**
```typescript
interface ProgressMetrics {
  date: string;
  weight?: number;          // الوزن اليومي
  bodyFat?: number;         // نسبة الدهون
  muscleMass?: number;      // كتلة العضلات
  waterIntake?: number;     // استهلاك الماء
  steps?: number;           // عدد الخطوات
  caloriesBurned?: number;  // السعرات المحروقة
  sleepHours?: number;      // ساعات النوم
  mood?: number;            // المزاج (1-10)
}
```

### **5. بيانات الوجبات (Meal Plan Data)**
```typescript
// من mealPlanApi
interface MealPlanResponse {
  id: number;
  date: string;
  mealType: string;
  menuFoodItem: {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  quantity: number;
}
```

## 🎯 كيفية استخدام البيانات لتغذية Progress APIs

### **1. تحديث مقاييس التقدم (updateProgressMetrics)**

```typescript
// مثال: استخدام بيانات من الملف الشخصي + بيانات يومية
const updateDailyMetrics = async () => {
  const userProfile = await nutritionApi.getProfile();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  const metrics: ProgressMetrics = {
    date: new Date().toISOString().split('T')[0],
    weight: userProfile.weight, // من الملف الشخصي
    // يمكن إضافة بيانات أخرى من المستخدم
    steps: 8500, // من تطبيق اللياقة البدنية
    sleepHours: 7.5, // من ساعة ذكية
    mood: 8, // من استطلاع المستخدم
    waterIntake: 2000, // من تتبع المستخدم
    caloriesBurned: calculateCaloriesBurned(userProfile.activityLevel)
  };
  
  await progressApi.updateProgressMetrics(metrics);
};
```

### **2. حساب الأهداف اليومية (Daily Needs)**

```typescript
// استخدام بيانات الملف الشخصي لحساب الأهداف
const calculateDailyNeeds = (userProfile: UserProfile) => {
  return {
    calories: {
      target: userProfile.dailyCalorieRequirement,
      consumed: 0, // سيتم تحديثه من بيانات الوجبات
      remaining: userProfile.dailyCalorieRequirement,
      percentage: 0
    },
    protein: {
      target: calculateProteinTarget(userProfile.weight, userProfile.healthGoal),
      consumed: 0,
      remaining: calculateProteinTarget(userProfile.weight, userProfile.healthGoal),
      percentage: 0
    },
    water: {
      target: calculateWaterTarget(userProfile.weight),
      consumed: 0,
      remaining: calculateWaterTarget(userProfile.weight),
      percentage: 0
    },
    steps: {
      target: calculateStepsTarget(userProfile.activityLevel),
      consumed: 0,
      remaining: calculateStepsTarget(userProfile.activityLevel),
      percentage: 0
    },
    sleep: {
      target: 8, // هدف عام
      consumed: 0,
      remaining: 8,
      percentage: 0
    }
  };
};
```

### **3. تخصيص الأنشطة المقترحة**

```typescript
// استخدام بيانات المستخدم لتخصيص الأنشطة
const getPersonalizedActivities = (userProfile: UserProfile) => {
  const activities = [];
  
  // بناءً على الهدف الصحي
  if (userProfile.healthGoal === HealthGoal.LoseWeight) {
    activities.push({
      title: 'تمارين حرق الدهون',
      type: 'exercise',
      priority: 'high'
    });
  }
  
  // بناءً على مستوى النشاط
  if (userProfile.activityLevel === ActivityLevel.Sedentary) {
    activities.push({
      title: 'المشي اليومي',
      type: 'exercise',
      priority: 'high'
    });
  }
  
  // بناءً على الحالات الصحية
  if (userProfile.healthConditions.includes(HealthConditionType.Diabetes)) {
    activities.push({
      title: 'مراقبة السكر',
      type: 'wellness',
      priority: 'high'
    });
  }
  
  return activities;
};
```

## 🔄 دمج البيانات من مصادر متعددة

### **1. دمج بيانات الوجبات مع التقدم**

```typescript
const integrateMealDataWithProgress = async () => {
  // جلب بيانات الوجبات اليومية
  const today = new Date().toISOString().split('T')[0];
  const mealPlans = await mealPlanApi.getMealPlans(today, today);
  
  // حساب السعرات والبروتين المستهلك
  const consumedCalories = mealPlans.reduce((total, meal) => {
    return total + (meal.menuFoodItem.calories * meal.quantity);
  }, 0);
  
  const consumedProtein = mealPlans.reduce((total, meal) => {
    return total + (meal.menuFoodItem.protein * meal.quantity);
  }, 0);
  
  // تحديث بيانات التقدم
  const userProfile = await nutritionApi.getProfile();
  const dailyNeeds = calculateDailyNeeds(userProfile);
  
  dailyNeeds.calories.consumed = consumedCalories;
  dailyNeeds.calories.remaining = dailyNeeds.calories.target - consumedCalories;
  dailyNeeds.calories.percentage = (consumedCalories / dailyNeeds.calories.target) * 100;
  
  dailyNeeds.protein.consumed = consumedProtein;
  dailyNeeds.protein.remaining = dailyNeeds.protein.target - consumedProtein;
  dailyNeeds.protein.percentage = (consumedProtein / dailyNeeds.protein.target) * 100;
  
  return dailyNeeds;
};
```

### **2. تتبع التقدم بناءً على البيانات التاريخية**

```typescript
const trackProgressOverTime = async () => {
  const userProfile = await nutritionApi.getProfile();
  const currentWeight = userProfile.weight;
  
  // جلب بيانات التقدم السابقة
  const progressReport = await progressApi.getProgressReport('month');
  
  // حساب تغيير الوزن
  const weightChange = currentWeight - progressReport.summary.startWeight;
  
  // تحديث تقرير التقدم
  const updatedReport = {
    ...progressReport,
    summary: {
      ...progressReport.summary,
      totalWeightChange: weightChange,
      currentWeight: currentWeight
    }
  };
  
  return updatedReport;
};
```

## 🛠️ وظائف مساعدة لحساب البيانات

```typescript
// حساب هدف البروتين
const calculateProteinTarget = (weight: number, healthGoal: HealthGoal): number => {
  const baseProtein = weight * 1.6; // 1.6g per kg
  switch (healthGoal) {
    case HealthGoal.GainMuscle:
      return baseProtein * 1.2;
    case HealthGoal.LoseWeight:
      return baseProtein * 1.1;
    default:
      return baseProtein;
  }
};

// حساب هدف الماء
const calculateWaterTarget = (weight: number): number => {
  return weight * 35; // 35ml per kg
};

// حساب هدف الخطوات
const calculateStepsTarget = (activityLevel: ActivityLevel): number => {
  switch (activityLevel) {
    case ActivityLevel.Sedentary:
      return 5000;
    case ActivityLevel.LightlyActive:
      return 7500;
    case ActivityLevel.ModeratelyActive:
      return 10000;
    case ActivityLevel.VeryActive:
      return 12500;
    case ActivityLevel.ExtraActive:
      return 15000;
    default:
      return 10000;
  }
};

// حساب السعرات المحروقة
const calculateCaloriesBurned = (activityLevel: ActivityLevel): number => {
  const baseCalories = 200; // سعرات أساسية
  switch (activityLevel) {
    case ActivityLevel.Sedentary:
      return baseCalories;
    case ActivityLevel.LightlyActive:
      return baseCalories * 1.5;
    case ActivityLevel.ModeratelyActive:
      return baseCalories * 2;
    case ActivityLevel.VeryActive:
      return baseCalories * 2.5;
    case ActivityLevel.ExtraActive:
      return baseCalories * 3;
    default:
      return baseCalories;
  }
};
```

## 📱 مثال عملي: تحديث البيانات اليومية

```typescript
const updateDailyProgress = async () => {
  try {
    // 1. جلب بيانات المستخدم
    const userProfile = await nutritionApi.getProfile();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // 2. جلب بيانات الوجبات اليومية
    const today = new Date().toISOString().split('T')[0];
    const mealPlans = await mealPlanApi.getMealPlans(today, today);
    
    // 3. حساب البيانات المستهلكة
    const consumedCalories = mealPlans.reduce((total, meal) => {
      return total + (meal.menuFoodItem.calories * meal.quantity);
    }, 0);
    
    // 4. تحديث مقاييس التقدم
    const metrics: ProgressMetrics = {
      date: today,
      weight: userProfile.weight,
      steps: 8500, // من تطبيق اللياقة البدنية
      sleepHours: 7.5, // من ساعة ذكية
      mood: 8, // من استطلاع المستخدم
      waterIntake: 2000, // من تتبع المستخدم
      caloriesBurned: calculateCaloriesBurned(userProfile.activityLevel)
    };
    
    await progressApi.updateProgressMetrics(metrics);
    
    // 5. تحديث الأهداف اليومية
    const dailyNeeds = calculateDailyNeeds(userProfile);
    dailyNeeds.calories.consumed = consumedCalories;
    dailyNeeds.calories.remaining = dailyNeeds.calories.target - consumedCalories;
    dailyNeeds.calories.percentage = (consumedCalories / dailyNeeds.calories.target) * 100;
    
    return dailyNeeds;
    
  } catch (error) {
    console.error('Error updating daily progress:', error);
    throw error;
  }
};
```

## 🎯 الخلاصة

**البيانات المتاحة لتغذية Progress APIs:**

1. **✅ بيانات المصادقة** - userId, token
2. **✅ بيانات الملف الشخصي** - weight, height, age, activityLevel, healthGoal
3. **✅ بيانات الوجبات** - calories, protein, carbs من meal plans
4. **✅ بيانات التقدم** - metrics, daily needs, activities
5. **✅ بيانات Onboarding** - goals, conditions, preferences

**يمكن استخدام هذه البيانات لتغذية جميع Progress APIs وتخصيص التجربة للمستخدم!** 🚀
