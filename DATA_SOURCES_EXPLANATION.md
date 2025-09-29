# 📊 مصادر البيانات في تقرير التقدم - Progress Report Data Sources

## 🔄 تدفق البيانات (Data Flow)

### 1. **المصادر الرئيسية للبيانات**

#### 🎯 **المصدر الأول: API الحقيقي (Real API)**
```
Backend Server → API Endpoints → Frontend Components
```

**نقاط API المستخدمة:**
- `GET /api/Nutrition/progress-report?period={week|month|quarter}`
- `GET /api/Nutrition/daily-needs?date={YYYY-MM-DD}`
- `GET /api/Nutrition/recommended-activities`
- `POST /api/Nutrition/progress-metrics`
- `PUT /api/Nutrition/activities/{id}/complete`

#### 🎭 **المصدر الثاني: البيانات التجريبية (Mock Data)**
```
Mock Data Function → Frontend Components (Fallback)
```

### 2. **مسار البيانات في التطبيق**

```
User Opens Progress Report
         ↓
ProgressReport Component
         ↓
fetchProgressData() Function
         ↓
progressApi.getProgressReport(period)
         ↓
┌─────────────────────────────────────┐
│  Try Real API First                 │
│  GET /Nutrition/progress-report     │
└─────────────────────────────────────┘
         ↓
    Success? ──No──→ Fallback to Mock Data
         ↓ Yes
    Set Progress Data
         ↓
    Render Components
```

## 📋 تفاصيل مصادر البيانات

### 1. **تقرير التقدم الرئيسي (Progress Report)**

#### **المصدر الحقيقي:**
```typescript
// في progressApi.ts
async getProgressReport(period: 'week' | 'month' | 'quarter' = 'week'): Promise<ProgressReport> {
  return this.makeRequest<ProgressReport>(`/Nutrition/progress-report?period=${period}`, {
    method: 'GET',
  });
}
```

**URL:** `https://weqaya-api-v1.runasp.net/api/Nutrition/progress-report?period=week`

#### **البيانات التجريبية:**
```typescript
// في progressApi.ts - getMockProgressReport()
{
  summary: {
    period: 'week',
    totalWeightChange: -1.2,
    averageCalories: 1850,
    averageSteps: 8500,
    averageSleep: 7.5,
    consistencyScore: 78,
    achievements: [...],
    improvements: [...],
    recommendations: [...]
  },
  dailyNeeds: {
    calories: { target: 2000, consumed: 1650, remaining: 350, percentage: 82 },
    protein: { target: 80, consumed: 65, remaining: 15, percentage: 81 },
    // ... باقي البيانات
  },
  recommendedActivities: [...],
  chartData: {
    weight: { labels: [...], datasets: [...] },
    calories: { labels: [...], datasets: [...] },
    // ... باقي الرسوم البيانية
  }
}
```

### 2. **الاحتياجات اليومية (Daily Needs)**

#### **المصدر الحقيقي:**
```typescript
async getDailyNeeds(date?: string): Promise<DailyNeeds> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  return this.makeRequest<DailyNeeds>(`/Nutrition/daily-needs?date=${targetDate}`, {
    method: 'GET',
  });
}
```

**URL:** `https://weqaya-api-v1.runasp.net/api/Nutrition/daily-needs?date=2024-01-15`

### 3. **الأنشطة المقترحة (Recommended Activities)**

#### **المصدر الحقيقي:**
```typescript
async getRecommendedActivities(): Promise<RecommendedActivity[]> {
  return this.makeRequest<RecommendedActivity[]>('/Nutrition/recommended-activities', {
    method: 'GET',
  });
}
```

**URL:** `https://weqaya-api-v1.runasp.net/api/Nutrition/recommended-activities`

## 🔧 كيفية عمل النظام

### 1. **في ProgressReport Component:**

```typescript
const fetchProgressData = async () => {
  try {
    // محاولة تحميل البيانات الحقيقية
    const data = await progressApi.getProgressReport(selectedPeriod);
    setProgressData(data);
  } catch (error) {
    // في حالة الفشل، استخدام البيانات التجريبية
    const mockData = await progressApi.getMockProgressReport();
    setProgressData(mockData);
  }
};
```

### 2. **في ProgressDashboard Component:**

```typescript
const fetchAllData = async () => {
  await Promise.all([
    fetchProgressReport(),      // تقرير التقدم
    fetchDailyNeeds(),          // الاحتياجات اليومية
    fetchRecommendedActivities() // الأنشطة المقترحة
  ]);
};
```

## 📊 أنواع البيانات المختلفة

### 1. **بيانات الملخص (Summary Data)**
- **المصدر:** API endpoint `/Nutrition/progress-report`
- **المحتوى:** 
  - تغيير الوزن
  - متوسط السعرات الحرارية
  - متوسط الخطوات
  - متوسط ساعات النوم
  - نقاط الاتساق
  - الإنجازات والتحسينات

### 2. **بيانات الرسوم البيانية (Chart Data)**
- **المصدر:** نفس API endpoint
- **المحتوى:**
  - بيانات الوزن اليومية
  - بيانات السعرات الحرارية
  - بيانات الخطوات
  - بيانات النوم

### 3. **الاحتياجات اليومية (Daily Needs)**
- **المصدر:** API endpoint `/Nutrition/daily-needs`
- **المحتوى:**
  - السعرات الحرارية (الهدف والمستهلك)
  - البروتين
  - الماء
  - الخطوات
  - النوم

### 4. **الأنشطة المقترحة (Recommended Activities)**
- **المصدر:** API endpoint `/Nutrition/recommended-activities`
- **المحتوى:**
  - قائمة الأنشطة المقترحة
  - الأولوية والصعوبة
  - الفوائد والوصف

## 🔄 آلية Fallback

### **عند فشل API الحقيقي:**

1. **التقاط الخطأ:**
```typescript
catch (error) {
  console.error('Error fetching progress data:', error);
  setError(error.message);
}
```

2. **التحويل للبيانات التجريبية:**
```typescript
try {
  const mockData = await progressApi.getMockProgressReport();
  setProgressData(mockData);
  toast({
    title: "تم تحميل البيانات التجريبية",
    description: "يتم عرض بيانات تجريبية. تأكد من إنشاء ملفك الشخصي أولاً.",
  });
} catch (mockError) {
  // معالجة خطأ البيانات التجريبية
}
```

## 🎯 متى يتم استخدام كل مصدر؟

### **API الحقيقي يُستخدم عندما:**
- ✅ المستخدم مسجل الدخول
- ✅ الخادم الخلفي متصل
- ✅ المستخدم لديه ملف شخصي
- ✅ البيانات متاحة في قاعدة البيانات

### **البيانات التجريبية تُستخدم عندما:**
- ❌ API الحقيقي غير متاح
- ❌ المستخدم غير مسجل الدخول
- ❌ خطأ في الخادم الخلفي
- ❌ لا توجد بيانات للمستخدم
- 🧪 للاختبار والتطوير

## 🔍 كيفية التحقق من مصدر البيانات

### 1. **استخدام أداة التشخيص:**
```typescript
// في SimpleProgressTest
const realData = await progressApi.getProgressReport('week');
// إذا نجح: البيانات من API الحقيقي
// إذا فشل: سيتم استخدام البيانات التجريبية
```

### 2. **فحص وحدة التحكم:**
```javascript
// في وحدة التحكم
console.log('Progress data source:', progressData);
// إذا كان من API: ستجد بيانات حقيقية
// إذا كان من Mock: ستجد البيانات التجريبية
```

### 3. **رسائل المستخدم:**
- **من API الحقيقي:** لا توجد رسالة خاصة
- **من البيانات التجريبية:** "تم تحميل البيانات التجريبية"

## 📱 في الواجهة

### **المكونات التي تعرض البيانات:**
1. **ProgressChart** - الرسوم البيانية
2. **DailyNeedsTracker** - تتبع الاحتياجات اليومية
3. **RecommendedActivities** - الأنشطة المقترحة
4. **ProgressInsights** - رؤى التقدم
5. **Summary Cards** - بطاقات الملخص

### **تحديث البيانات:**
- **تلقائي:** عند تغيير الفترة (أسبوع/شهر/ربع)
- **يدوي:** عند الضغط على زر "تحديث"
- **عند إكمال نشاط:** تحديث فوري للأنشطة

## 🎉 الخلاصة

**البيانات في تقرير التقدم تأتي من:**

1. **🎯 API الحقيقي** (الأولوية الأولى)
   - `https://weqaya-api-v1.runasp.net/api/Nutrition/progress-report`
   - بيانات حقيقية من قاعدة البيانات

2. **🎭 البيانات التجريبية** (البديل الآمن)
   - Mock data في `progressApi.getMockProgressReport()`
   - بيانات ثابتة للاختبار والتطوير

**النظام يضمن عدم ظهور صفحة بيضاء أبداً!** 🚀
