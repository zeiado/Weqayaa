import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MealPlanFoodItem } from '@/types/mealPlan';

interface FoodItemsTableProps {
  foodItems: MealPlanFoodItem[];
  title?: string;
}

export const FoodItemsTable: React.FC<FoodItemsTableProps> = ({ foodItems, title = "تفاصيل الأطعمة" }) => {
  if (!foodItems || foodItems.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">لا توجد أطعمة مضافة لهذه الوجبة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-center">السعرات</TableHead>
                <TableHead className="text-center">البروتين</TableHead>
                <TableHead className="text-center">الكربوهيدرات</TableHead>
                <TableHead className="text-center">الدهون</TableHead>
                <TableHead className="text-center">الألياف</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{item.quantity}g</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-orange-600">{item.calories.toFixed(1)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-blue-600">{item.protein.toFixed(1)}g</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600">{item.carbohydrates.toFixed(1)}g</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-red-600">{item.fat.toFixed(1)}g</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-purple-600">{item.fiber.toFixed(1)}g</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.notes && (
                      <Badge variant="outline" className="text-xs">
                        {item.notes}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
