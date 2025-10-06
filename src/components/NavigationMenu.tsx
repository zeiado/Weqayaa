import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  MessageCircle, 
  User, 
  Utensils, 
  Calendar, 
  TrendingUp,
  Menu,
  ChevronDown
} from "lucide-react";
import { authApi } from "@/services/authApi";

interface NavigationMenuProps {
  onNavigate: (section: string) => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

export const NavigationMenu = ({ onNavigate, onLogin, onRegister }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = authApi.isTokenValid();

  const navigationItems = [
    {
      id: "dashboard",
      label: "الرئيسية",
      icon: Home,
      description: "لوحة التحكم الرئيسية"
    },
    {
      id: "chat",
      label: "المستشار الذكي",
      icon: MessageCircle,
      description: "استشارات غذائية ذكية"
    },
    {
      id: "cafeteria",
      label: "قائمة الكافتيريا",
      icon: Utensils,
      description: "وجبات صحية متاحة"
    },
    {
      id: "mealplan",
      label: "خطة الوجبات",
      icon: Calendar,
      description: "خطط غذائية مخصصة"
    },
    {
      id: "progress",
      label: "تقرير التقدم",
      icon: TrendingUp,
      description: "متابعة تقدمك الصحي"
    },
    {
      id: "profile",
      label: "الملف الشخصي",
      icon: User,
      description: "إدارة بياناتك الشخصية"
    }
  ];

  const handleNavigation = (section: string) => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to sign up
      if (onRegister) {
        onRegister();
      }
      return;
    }
    
    onNavigate(section);
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onLogin}
          className="text-primary border-primary/30 hover:bg-primary/10 text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">تسجيل الدخول</span>
          <span className="sm:hidden">دخول</span>
        </Button>
        <Button 
          size="sm"
          onClick={onRegister}
          className="bg-gradient-primary hover:shadow-lg text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">إنشاء حساب</span>
          <span className="sm:hidden">حساب</span>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 text-foreground hover:bg-primary/10 border-primary/30"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline">القائمة</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 sm:w-72 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-border shadow-xl"
      >
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.id}>
              <DropdownMenuItem
                onClick={() => handleNavigation(item.id)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </DropdownMenuItem>
              {index < navigationItems.length - 1 && (
                <DropdownMenuSeparator className="my-1" />
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
