import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Activity, Clock, Star, Apple, Heart, Coffee } from "lucide-react";
import { RecommendedMeal } from "@/types/dashboard";

interface RecommendedMealsProps {
  meals: RecommendedMeal[];
}

export const RecommendedMeals: React.FC<RecommendedMealsProps> = ({ meals }) => {
  const iconFor = (name: string) => {
    if (name.includes('فول')) return <Apple className="w-5 h-5 text-white" />;
    if (name.includes('سلطة')) return <Heart className="w-5 h-5 text-white" />;
    return <Coffee className="w-5 h-5 text-white" />;
  };

  return (
    <div className="grid gap-4 sm:gap-6">
      {meals.map((meal) => (
        <Card key={meal.id} className={`glass-card p-4 sm:p-6 group hover:scale-[1.02] transition-all duration-300 bg-background/80 ${!meal.available ? 'opacity-60' : 'hover:shadow-lg'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    {iconFor(meal.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base sm:text-lg line-clamp-1">{meal.name}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">{meal.recommendationReason || meal.description}</p>
                  </div>
                </div>
                {!meal.available && (
                  <Badge variant="secondary" className="text-xs shrink-0 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <Clock className="w-3 h-3 ml-1" />
                    غير متاح
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>{meal.calories} سعرة</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Activity className="w-4 h-4 text-secondary" />
                  <span>{meal.protein}g بروتين</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80 col-span-2 sm:col-span-1">
                  <span className="font-semibold text-foreground">{meal.price} جنيه</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-foreground">{meal.rating}</span>
              </div>
              <Button size="sm" disabled={!meal.available} className="bg-gradient-primary hover:shadow-lg transition-all duration-300 px-6">
                إضافة
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};


