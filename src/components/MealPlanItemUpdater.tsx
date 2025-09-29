import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Utensils, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { progressApi } from '@/services/progressApi';
import { useToast } from '@/hooks/use-toast';

interface MenuFoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

interface MealPlanItem {
  id: number;
  name: string;
  quantity: number;
  calories: number;
  mealType: string;
  date: string;
}

interface MealPlanItemUpdaterProps {
  mealPlanId: number;
  currentItem: MealPlanItem;
  availableMenuItems: MenuFoodItem[];
  onItemUpdated?: () => void;
}

export const MealPlanItemUpdater: React.FC<MealPlanItemUpdaterProps> = ({
  mealPlanId,
  currentItem,
  availableMenuItems,
  onItemUpdated
}) => {
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateItem = async () => {
    if (!selectedMenuItemId) {
      toast({
        title: "يرجى اختيار عنصر جديد",
        description: "يجب اختيار عنصر من القائمة قبل التحديث",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await progressApi.updateMealPlanItem(
        mealPlanId,
        currentItem.id,
        parseInt(selectedMenuItemId)
      );

      toast({
        title: "تم تحديث العنصر! ✅",
        description: response.message || "تم استبدال العنصر بنجاح",
      });

      setIsOpen(false);
      setSelectedMenuItemId('');
      
      if (onItemUpdated) {
        onItemUpdated();
      }
    } catch (error) {
      console.error('Error updating meal plan item:', error);
      toast({
        title: "خطأ في تحديث العنصر",
        description: "حدث خطأ أثناء تحديث عنصر الوجبة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMenuItem = availableMenuItems.find(item => item.id === parseInt(selectedMenuItemId));

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-green-100 text-green-800 border-green-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealTypeText = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'فطور';
      case 'lunch': return 'غداء';
      case 'dinner': return 'عشاء';
      case 'snack': return 'وجبة خفيفة';
      default: return mealType;
    }
  };

  if (!isOpen) {
    return (
      <Card className="glass-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsOpen(true)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{currentItem.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getMealTypeColor(currentItem.mealType)}>
                    {getMealTypeText(currentItem.mealType)}
                  </Badge>
                  <span className="text-sm text-gray-600">{currentItem.calories} سعرة</span>
                </div>
              </div>
            </div>
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          تحديث عنصر الوجبة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Item */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">العنصر الحالي</h4>
              <p className="text-sm text-gray-600">{currentItem.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{currentItem.calories} سعرة</p>
              <Badge variant="outline" className={getMealTypeColor(currentItem.mealType)}>
                {getMealTypeText(currentItem.mealType)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-primary" />
        </div>

        {/* New Item Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">اختر عنصر جديد</label>
          <Select value={selectedMenuItemId} onValueChange={setSelectedMenuItemId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر عنصر من القائمة" />
            </SelectTrigger>
            <SelectContent>
              {availableMenuItems.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{item.calories} سعرة</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Item Preview */}
        {selectedMenuItem && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">العنصر الجديد</h4>
                <p className="text-sm text-green-700">{selectedMenuItem.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-800">{selectedMenuItem.calories} سعرة</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    بروتين: {selectedMenuItem.protein}g
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    كربوهيدرات: {selectedMenuItem.carbs}g
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleUpdateItem}
            disabled={isLoading || !selectedMenuItemId}
            className="flex-1 bg-gradient-primary"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري التحديث...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 ml-2" />
                تحديث العنصر
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setSelectedMenuItemId('');
            }}
            disabled={isLoading}
          >
            إلغاء
          </Button>
        </div>

        {/* Help Text */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">ملاحظة:</p>
              <p>سيتم استبدال العنصر الحالي بالعنصر الجديد مع الحفاظ على نفس الكمية والتاريخ.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
