import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, Users, TrendingUp, ArrowLeft, Plus, BarChart3, Info, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface FoodItem {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  price: number;
  category: string;
  dietaryTags: string[];
  popularity: number;
  rating: number;
  reviews: number;
  available: boolean;
}

interface Location {
  id: number;
  location: string;
  description: string;
  averagePrice: number;
  itemCount: number;
  foodItems: FoodItem[];
}

const mockData: Location[] = [
  {
    id: 1,
    location: "الكافتيريا الرئيسية",
    description: "قائمة اليوم للأكل المصري الصحي",
    averagePrice: 45.99,
    itemCount: 29,
    foodItems: [
      {
        id: 1,
        nameAr: "كشري",
        nameEn: "Koshari",
        description: "الطبق المصري التقليدي بالأرز والعدس والمكرونة",
        calories: 360,
        protein: 17,
        carbs: 64,
        fat: 6.4,
        fiber: 13.6,
        price: 45.99,
        category: "أطباق رئيسية",
        dietaryTags: ["نباتي", "فيجان", "غني بالألياف"],
        popularity: 127,
        rating: 4.6,
        reviews: 89,
        available: true
      },
      {
        id: 2,
        nameAr: "ملوخية بالفراخ",
        nameEn: "Molokhia with Chicken",
        description: "ملوخية خضراء طازجة مع قطع الفراخ والأرز الأبيض",
        calories: 440,
        protein: 28,
        carbs: 35,
        fat: 18,
        fiber: 8.2,
        price: 52.99,
        category: "أطباق رئيسية",
        dietaryTags: ["عالي البروتين", "غني بالحديد"],
        popularity: 98,
        rating: 4.4,
        reviews: 67,
        available: true
      },
      {
        id: 3,
        nameAr: "سلطة يونانية",
        nameEn: "Greek Salad",
        description: "خضار طازجة مع الجبنة البيضاء وزيت الزيتون",
        calories: 180,
        protein: 8,
        carbs: 12,
        fat: 14,
        fiber: 6,
        price: 28.99,
        category: "سلطات",
        dietaryTags: ["نباتي", "قليل السعرات", "غني بالفيتامينات"],
        popularity: 76,
        rating: 4.2,
        reviews: 45,
        available: true
      }
    ]
  },
  {
    id: 2,
    location: "مطعم الطلاب",
    description: "قائمة مطعم الطلاب اليومية",
    averagePrice: 36.79,
    itemCount: 29,
    foodItems: [
      {
        id: 4,
        nameAr: "كشري",
        nameEn: "Koshari",
        description: "الطبق المصري التقليدي بالأرز والعدس والمكرونة",
        calories: 360,
        protein: 17,
        carbs: 64,
        fat: 6.4,
        fiber: 13.6,
        price: 36.79,
        category: "أطباق رئيسية",
        dietaryTags: ["نباتي", "فيجان", "غني بالألياف"],
        popularity: 89,
        rating: 4.3,
        reviews: 112,
        available: true
      }
    ]
  },
  {
    id: 3,
    location: "نادي الأساتذة",
    description: "قائمة النادي المميزة",
    averagePrice: 68.98,
    itemCount: 29,
    foodItems: [
      {
        id: 5,
        nameAr: "كشري",
        nameEn: "Koshari",
        description: "الطبق المصري التقليدي بالأرز والعدس والمكرونة - طبعة مميزة",
        calories: 360,
        protein: 17,
        carbs: 64,
        fat: 6.4,
        fiber: 13.6,
        price: 68.98,
        category: "أطباق رئيسية",
        dietaryTags: ["نباتي", "فيجان", "غني بالألياف", "طبعة مميزة"],
        popularity: 45,
        rating: 4.8,
        reviews: 23,
        available: true
      }
    ]
  }
];

const filterCategories = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'main', label: 'أطباق رئيسية', icon: null },
  { id: 'salads', label: 'سلطات', icon: null },
  { id: 'soups', label: 'شوربات', icon: null },
  { id: 'drinks', label: 'مشروبات', icon: null },
  { id: 'desserts', label: 'حلويات', icon: null }
];

const dietaryFilters = [
  { id: 'vegetarian', label: 'نباتي', color: 'bg-green-100 text-green-800' },
  { id: 'vegan', label: 'فيجان', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'high-protein', label: 'عالي البروتين', color: 'bg-blue-100 text-blue-800' },
  { id: 'low-fat', label: 'قليل الدهون', color: 'bg-orange-100 text-orange-800' },
  { id: 'gluten-free', label: 'خالي الجلوتين', color: 'bg-purple-100 text-purple-800' }
];

interface CafeteriaMenuProps {
  onBack: () => void;
}

const CafeteriaMenu: React.FC<CafeteriaMenuProps> = ({ onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price_low');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showPriceComparison, setShowPriceComparison] = useState<FoodItem | null>(null);

  const currentLocation = mockData.find(loc => loc.id === selectedLocation);
  const filteredItems = currentLocation?.foodItems.filter(item => {
    const matchesSearch = item.nameAr.includes(searchQuery) || item.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'calories_low': return a.calories - b.calories;
      case 'protein_high': return b.protein - a.protein;
      case 'popular': return b.popularity - a.popularity;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const getPriceComparison = (itemName: string) => {
    const allItems = mockData.flatMap(loc => loc.foodItems.filter(item => item.nameAr === itemName));
    return allItems.sort((a, b) => a.price - b.price);
  };

  const NutritionPanel = ({ item }: { item: FoodItem }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">تفاصيل التغذية</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>📊 السعرات الحرارية</span>
            <span>{item.calories} / 2000 (18%)</span>
          </div>
          <Progress value={(item.calories / 2000) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>💪 البروتين</span>
            <span>{item.protein}g / 50g (34%)</span>
          </div>
          <Progress value={(item.protein / 50) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🍞 الكربوهيدرات</span>
            <span>{item.carbs}g / 250g (26%)</span>
          </div>
          <Progress value={(item.carbs / 250) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🔥 الدهون</span>
            <span>{item.fat}g / 70g (9%)</span>
          </div>
          <Progress value={(item.fat / 70) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🌾 الألياف</span>
            <span>{item.fiber}g / 25g (54%) ✅</span>
          </div>
          <Progress value={(item.fiber / 25) * 100} className="h-2" />
        </div>
      </div>
      
      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-sm text-green-800">✅ مناسب لأهدافك الصحية</p>
        <p className="text-sm text-green-800">📈 يساهم في زيادة الطاقة</p>
      </div>
    </div>
  );

  const PriceComparisonModal = ({ item }: { item: FoodItem }) => {
    const comparisons = getPriceComparison(item.nameAr);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">مقارنة أسعار {item.nameAr}</h3>
        
        <div className="space-y-3">
          {comparisons.map((compItem, index) => {
            const location = mockData.find(loc => loc.foodItems.some(f => f.id === compItem.id));
            const medals = ['🥇', '🥈', '🥉'];
            const badges = ['⭐ الأفضل قيمة', '📊 جودة عالية', '👑 الأغلى'];
            
            return (
              <div key={compItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{medals[index] || '📍'}</span>
                  <div>
                    <p className="font-medium">{location?.location}</p>
                    <p className="text-sm text-gray-600">{badges[index] || ''}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{compItem.price} جنيه</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {comparisons.length > 1 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 نصيحة وقاية: اختر {mockData.find(loc => loc.foodItems.some(f => f.id === comparisons[0].id))?.location} 
              لتوفير {(comparisons[comparisons.length - 1].price - comparisons[0].price).toFixed(2)} جنيه
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button className="flex-1">اختيار الأفضل قيمة</Button>
          <Button variant="outline" className="flex-1">إضافة للمفضلة</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-wellness py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary mb-2">قائمة الكافتيريا</h1>
            <p className="text-muted-foreground">Cafeteria Menu</p>
            <p className="text-sm text-muted-foreground mt-1">📅 19 سبتمبر، 2025</p>
          </div>
        </div>

        {/* Location Selector */}
        <div className="mb-6">
          <Tabs value={selectedLocation.toString()} onValueChange={(value) => setSelectedLocation(parseInt(value))}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {mockData.map((location) => (
                <TabsTrigger key={location.id} value={location.id.toString()} className="text-center">
                  <div>
                    <p className="font-medium text-sm">{location.location}</p>
                    <p className="text-xs text-muted-foreground">{location.averagePrice} جنيه متوسط</p>
                    <p className="text-xs text-muted-foreground">{location.itemCount} وجبة متاحة</p>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ابحث عن وجبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Filter Pills */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {filterCategories.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter.id)}
                  className="text-sm"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {dietaryFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "secondary"}
                  className={`cursor-pointer ${selectedFilters.includes(filter.id) ? '' : filter.color}`}
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ترتيب حسب:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-input rounded-md px-3 py-1 text-sm"
            >
              <option value="price_low">⚡ الأقل سعراً</option>
              <option value="price_high">💰 الأغلى سعراً</option>
              <option value="calories_low">🔥 الأقل سعرات</option>
              <option value="protein_high">💪 الأعلى بروتين</option>
              <option value="popular">⭐ الأكثر شعبية</option>
              <option value="rating">📈 الأكثر تقييماً</option>
            </select>
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow glass-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.nameAr}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {item.nameEn}
                    </CardDescription>
                    <p className="text-sm mt-2">{item.description}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">{item.price}</p>
                    <p className="text-xs text-muted-foreground">جنيه</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Nutritional Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span>📊</span>
                    <span>{item.calories} سعرة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💪</span>
                    <span>{item.protein}g بروتين</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🍞</span>
                    <span>{item.carbs}g كربوهيدرات</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🌾</span>
                    <span>{item.fiber}g ألياف</span>
                  </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.dietaryTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Popularity & Rating */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>اختاره {item.popularity} طالب اليوم</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating} ({item.reviews})</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>متاح في: {currentLocation?.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setShowPriceComparison(item)}>
                        <Scale className="h-3 w-3 ml-1" />
                        مقارنة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>مقارنة الأسعار</DialogTitle>
                      </DialogHeader>
                      <PriceComparisonModal item={item} />
                    </DialogContent>
                  </Dialog>

                  <Button size="sm">
                    <Plus className="h-3 w-3 ml-1" />
                    للخطة
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                        <Info className="h-3 w-3 ml-1" />
                        تفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>المعلومات الغذائية</DialogTitle>
                      </DialogHeader>
                      <NutritionPanel item={item} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد وجبات تطابق البحث</h3>
            <p className="text-muted-foreground mb-4">جرب إزالة بعض المرشحات أو البحث في موقع آخر</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setSelectedFilters([])}>
                مسح جميع المرشحات
              </Button>
              <Button onClick={() => setSearchQuery('')}>
                عرض الكل
              </Button>
            </div>
          </div>
        )}

        {/* AI Recommendation Banner */}
        {sortedItems.length > 0 && (
          <div className="mt-8 bg-gradient-primary p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-semibold">توصية وقاية الذكية</h3>
                <p className="text-sm opacity-90">بناءً على أهدافك، ننصحك بـ كشري + سلطة يونانية</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">قبول التوصية</Button>
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                  تخصيص أكثر
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeteriaMenu;