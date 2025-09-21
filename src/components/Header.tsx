import React from "react";
import { Button } from "@/components/ui/button";
import { WeqayaLogo } from "./WeqayaLogo";
import { Bell, MessageCircle, User, Settings, LogOut } from "lucide-react";
import { authApi } from "@/services/authApi";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
  onOpenChat?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onLogin?: () => void;
}

export const Header = ({ 
  onBack, 
  showBackButton = false, 
  title,
  onOpenChat,
  onOpenProfile,
  onLogout,
  onLogin
}: HeaderProps) => {
  const handleLogout = () => {
    authApi.removeToken();
    localStorage.removeItem('userData');
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                العودة
              </Button>
            )}
            <WeqayaLogo size="sm" />
            {title && (
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {onLogin ? (
              <Button 
                variant="outline" 
                className="text-primary border-primary/30 hover:bg-primary/10"
                onClick={onLogin}
              >
                تسجيل الدخول
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
                </Button>
                
                {onOpenChat && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onOpenChat}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                )}
                
                {onOpenProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onOpenProfile}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
