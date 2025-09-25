import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Users, TrendingUp, ArrowLeft, Plus, BarChart3, Info, Scale, Calendar, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Header } from './Header';
import { Footer } from './Footer';
import { menuApi } from '@/services/menuApi';
import { mealPlanApi } from '@/services/mealPlanApi';
import { MenuResponse, MenuItem, getDietaryTags, getCategoryLabel } from '@/types/menu';
import { MealType, getMealTypeLabel, getMealTypeIcon, CreateMealPlanRequest } from '@/types/mealPlan';
import { useToast } from '@/hooks/use-toast';

// Using MenuItem and MenuResponse from types/menu.ts

// Mock data removed - now using real API data

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
  isMealPlanMode?: boolean;
  selectedDate?: string;
  onMealPlanUpdated?: () => void;
}

const CafeteriaMenu: React.FC<CafeteriaMenuProps> = ({ onBack, isMealPlanMode = false, selectedDate: propSelectedDate, onMealPlanUpdated }) => {
  const [menus, setMenus] = useState<MenuResponse[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState('price_low');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showPriceComparison, setShowPriceComparison] = useState<MenuItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(propSelectedDate || new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToMealPlan, setIsAddingToMealPlan] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.Breakfast);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const { toast } = useToast();

  const currentLocation = menus.find(loc => loc.id === selectedLocation);
  const filteredItems = currentLocation?.foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'calories_low': return a.calories - b.calories;
      case 'protein_high': return b.protein - a.protein;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Fetch menus data
  useEffect(() => {
    fetchMenus();
  }, [selectedDate, categoryFilter]);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const data = await menuApi.getMenus(selectedDate, {
        category: categoryFilter,
        available: 1,
        page: 1,
        pageSize: 10,
      });
      setMenus(data);
      
      // Set first location as selected if available
      if (data.length > 0 && !menus.find(loc => loc.id === selectedLocation)) {
        setSelectedLocation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: "خطأ في تحميل القائمة",
        description: "حدث خطأ أثناء تحميل قائمة الطعام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filterId: string) => {
    // Only one category filter at a time for server-side filtering
    if (filterId === 'all') {
      setSelectedFilters(['all']);
      setCategoryFilter(undefined);
      return;
    }
    const map: Record<string, number> = {
      main: 1,
      salads: 2,
      soups: 3,
      drinks: 4,
      desserts: 5,
    };
    setSelectedFilters([filterId]);
    setCategoryFilter(map[filterId]);
  };

  const getPriceComparison = (itemName: string) => {
    const allItems = menus.flatMap(loc => loc.foodItems.filter(item => item.name === itemName));
    return allItems.sort((a, b) => a.price - b.price);
  };

  const getOrCreateMealPlanId = async (): Promise<number> => {
    const dateIso = new Date(selectedDate).toISOString();
    // Try get existing plan for this date and meal type
    const plans = await mealPlanApi.getMealPlans(dateIso, dateIso);
    const existing = plans.find(p => p.mealType === selectedMealType);
    if (existing) return existing.id;

    // Create empty plan for this meal type
    const created = await mealPlanApi.createMealPlan({
      date: dateIso,
      mealType: selectedMealType,
      menueId: 0,
      quantity: 0,
    });
    return created.id;
  };

  const addToMealPlan = async (item: MenuItem) => {
    try {
      setIsAddingToMealPlan(true);
      
      // Check authentication
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً لإضافة الطعام لخطة الوجبات');
      }
      
      // Validate token format (basic check)
      if (token.length < 10) {
        throw new Error('رمز المصادقة غير صالح');
      }
      
      // Validate required data
      if (!item.id) {
        throw new Error('Food item ID is missing');
      }
      
      // Additional validation for food item ID
      if (typeof item.id !== 'number' || item.id <= 0) {
        throw new Error(`Invalid food item ID: ${item.id}. Expected a positive number.`);
      }
      
      // Note: Food item validation is now handled by the backend
      // The backend will validate if the food item exists and is available
      
      if (!selectedDate) {
        throw new Error('Selected date is missing');
      }
      
      // Validate date format
      const dateObj = new Date(selectedDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error('تاريخ غير صالح');
      }
      
      // Validate quantity (now required)
      if (!selectedQuantity || selectedQuantity < 1 || selectedQuantity > 10) {
        throw new Error('الكمية مطلوبة ويجب أن تكون بين 1 و 10');
      }

      // Ensure there's a meal plan for this date and meal type
      const mealPlanId = await getOrCreateMealPlanId();

      // Fetch the authoritative menu details to retrieve the correct menueFoodItemId
      if (!currentLocation) {
        throw new Error('تعذر تحديد قائمة اليوم الحالية');
      }
      const menuDetails = await menuApi.getMenuItem(currentLocation.id);
      const detailedItem = menuDetails.foodItems.find(fi => fi.name === item.name) 
        || menuDetails.foodItems.find(fi => fi.description === item.description);
      if (!detailedItem) {
        throw new Error('تعذر العثور على العنصر المطلوب في تفاصيل القائمة');
      }

      // Add specific menu item to the meal plan using menueFoodItemId from details
      const updatedPlan = await mealPlanApi.addItem(mealPlanId, detailedItem.id);
      console.log('Meal plan item added successfully:', updatedPlan);
      
      toast({
        title: "تم إضافة الطعام لخطة الوجبات",
        description: `تمت إضافة ${item.name} إلى ${getMealTypeLabel(selectedMealType)} بتاريخ ${selectedDate}`,
      });
      
      // Notify parent component to refresh meal plan
      if (onMealPlanUpdated) onMealPlanUpdated();
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      
      // Get more specific error message
      let errorMessage = "حدث خطأ أثناء إضافة الطعام لخطة الوجبات";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // If it's a food item not found error, provide more helpful message
        if (error.message.includes('not found') || error.message.includes('غير موجود')) {
          errorMessage = `العنصر "${item.name}" غير متوفر حالياً. يرجى تحديث القائمة والمحاولة مرة أخرى.`;
        } else if (error.message.toLowerCase().includes('not available')) {
          errorMessage = `"${item.name}" غير متاح حالياً. قم بتحديث التاريخ أو الفلترة (المتاح فقط) ثم حاول مرة أخرى.`;
        }
      }
      
      toast({
        title: "خطأ في إضافة الطعام",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingToMealPlan(false);
    }
  };

  const NutritionPanel = ({ item }: { item: MenuItem }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">تفاصيل التغذية</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>📊 السعرات الحرارية</span>
            <span>{item.calories} / 2000 ({Math.round((item.calories / 2000) * 100)}%)</span>
          </div>
          <Progress value={(item.calories / 2000) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>💪 البروتين</span>
            <span>{item.protein}g / 50g ({Math.round((item.protein / 50) * 100)}%)</span>
          </div>
          <Progress value={(item.protein / 50) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🍞 الكربوهيدرات</span>
            <span>{item.carbohydrates}g / 250g ({Math.round((item.carbohydrates / 250) * 100)}%)</span>
          </div>
          <Progress value={(item.carbohydrates / 250) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🔥 الدهون</span>
            <span>{item.fat}g / 70g ({Math.round((item.fat / 70) * 100)}%)</span>
          </div>
          <Progress value={(item.fat / 70) * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>🌾 الألياف</span>
            <span>{item.fiber}g / 25g ({Math.round((item.fiber / 25) * 100)}%) {item.isHighFiber ? '✅' : ''}</span>
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

  const PriceComparisonModal = ({ item }: { item: MenuItem }) => {
    const comparisons = getPriceComparison(item.name);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">مقارنة أسعار {item.name}</h3>
        
        <div className="space-y-3">
          {comparisons.map((compItem, index) => {
            const location = menus.find(loc => loc.foodItems.some(f => f.id === compItem.id));
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
              💡 نصيحة وقاية: اختر {menus.find(loc => loc.foodItems.some(f => f.id === comparisons[0].id))?.location} 
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
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title={isMealPlanMode ? "اختيار الطعام لخطة الوجبات" : "قائمة الكافتيريا"}
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Date Picker */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <label htmlFor="date-picker" className="text-sm font-medium">اختر التاريخ:</label>
            </div>
            <Input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:max-w-xs"
            />
          </div>
        </div>

        {/* Meal Type Selector for Meal Plan Mode */}
        {isMealPlanMode && (
          <Card className="glass-card mb-4 sm:mb-6">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <label className="text-sm font-medium">اختر نوع الوجبة:</label>
                </div>
                <Select value={selectedMealType.toString()} onValueChange={(value) => setSelectedMealType(parseInt(value) as MealType)}>
                  <SelectTrigger className="w-full sm:max-w-xs">
                    <SelectValue placeholder="اختر نوع الوجبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MealType).filter(val => typeof val === 'number').map(mealType => (
                      <SelectItem key={mealType} value={mealType.toString()}>
                        {getMealTypeIcon(mealType as MealType)} {getMealTypeLabel(mealType as MealType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-medium">الكمية:</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">حصة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="mr-2 text-muted-foreground">جاري تحميل القائمة...</span>
          </div>
        )}

        {/* Location Selector */}
        {!isLoading && menus.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Tabs value={selectedLocation.toString()} onValueChange={(value) => setSelectedLocation(parseInt(value))}>
              <TabsList className={`grid w-full ${menus.length === 1 ? 'grid-cols-1' : menus.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'} mb-4`}>
                {menus.map((location) => (
                  <TabsTrigger key={location.id} value={location.id.toString()} className="text-center p-2 sm:p-3">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{location.location}</p>
                      <p className="text-xs text-muted-foreground">{location.foodItems.length} وجبة متاحة</p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
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
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {filterCategories.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter.id)}
                  className="text-xs sm:text-sm"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2">
              {dietaryFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={selectedFilters.includes(filter.id) ? "default" : "secondary"}
                  className={`cursor-pointer text-xs ${selectedFilters.includes(filter.id) ? '' : filter.color}`}
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-sm text-muted-foreground">ترتيب حسب:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-input rounded-md px-3 py-1 text-sm w-full sm:w-auto"
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
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow glass-card">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{item.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        {getCategoryLabel(item.category)}
                      </CardDescription>
                      <p className="text-xs sm:text-sm mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-lg sm:text-2xl font-bold text-primary">{item.price}</p>
                      <p className="text-xs text-muted-foreground">جنيه</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  {/* Nutritional Info */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
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
                      <span>{item.carbohydrates}g كربوهيدرات</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🌾</span>
                      <span>{item.fiber}g ألياف</span>
                    </div>
                  </div>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1">
                    {getDietaryTags(item).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-1 text-sm">
                    <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={item.isAvailable ? 'text-green-600' : 'text-red-600'}>
                      {item.isAvailable ? 'متاح' : 'غير متاح'}
                    </span>
                  </div>

                  {/* Serving Size */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>🍽️</span>
                    <span>حجم الحصة: {item.servingSize}g</span>
                  </div>

                  {/* Action Buttons */}
                  <div className={`grid gap-2 ${isMealPlanMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {!isMealPlanMode && (
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
                    )}

                    {isMealPlanMode ? (
                      <Button 
                        size="sm" 
                        disabled={!item.isAvailable || isAddingToMealPlan}
                        onClick={() => addToMealPlan(item)}
                        className="bg-gradient-primary"
                      >
                        {isAddingToMealPlan ? (
                          <>
                            <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                            جاري الإضافة...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 ml-1" />
                            إضافة للوجبة
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        disabled={!item.isAvailable || isAddingToMealPlan}
                        onClick={() => addToMealPlan(item)}
                        className="bg-gradient-primary"
                      >
                        {isAddingToMealPlan ? (
                          <>
                            <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                            جاري الإضافة...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 ml-1" />
                            اضافه للخطه
                          </>
                        )}
                      </Button>
                    )}

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
        )}

        {/* Empty State */}
        {!isLoading && sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">لا توجد وجبات متاحة</h3>
            <p className="text-muted-foreground mb-4">
              {menus.length === 0 
                ? `لا توجد قوائم طعام متاحة للتاريخ ${selectedDate}`
                : "جرب إزالة بعض المرشحات أو البحث في موقع آخر"
              }
            </p>
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
        {!isLoading && sortedItems.length > 0 && (
          <div className="mt-8 bg-gradient-primary p-4 rounded-lg text-white">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-semibold">توصية وقاية الذكية</h3>
                <p className="text-sm opacity-90">بناءً على أهدافك، ننصحك بوجبة متوازنة من القائمة المتاحة</p>
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
      
      <Footer />
    </div>
  );
};

export default CafeteriaMenu;