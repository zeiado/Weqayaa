// Menu Types and Interfaces

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: number;
  servingSize: number;
  price: number;
  unit: string;
  isAvailable: boolean;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLowSodium: boolean;
  isLowSugar: boolean;
  isHighProtein: boolean;
  isHighFiber: boolean;
}

export interface MenuLocation {
  id: number;
  date: string;
  location: string;
  description: string;
  foodItems: MenuItem[];
}

export interface MenuResponse {
  id: number;
  date: string;
  location: string;
  description: string;
  foodItems: MenuItem[];
}

// Helper functions for dietary tags
export const getDietaryTags = (item: MenuItem): string[] => {
  const tags: string[] = [];
  
  if (item.isVegetarian) tags.push("نباتي");
  if (item.isVegan) tags.push("فيجان");
  if (item.isGlutenFree) tags.push("خالي الجلوتين");
  if (item.isLowSodium) tags.push("قليل الصوديوم");
  if (item.isLowSugar) tags.push("قليل السكر");
  if (item.isHighProtein) tags.push("عالي البروتين");
  if (item.isHighFiber) tags.push("غني بالألياف");
  
  return tags;
};

// Category mapping
export const getCategoryLabel = (category: number): string => {
  const categories: { [key: number]: string } = {
    1: "أطباق رئيسية",
    2: "سلطات",
    3: "شوربات",
    4: "مشروبات",
    5: "حلويات",
    6: "وجبات خفيفة"
  };
  
  return categories[category] || "غير محدد";
};
