import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WeqayaLogo } from "./WeqayaLogo";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { NavigationMenu } from "./NavigationMenu";
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
  onRegister?: () => void;
  onNavigate?: (section: string) => void;
}

export const Header = ({ 
  onBack, 
  showBackButton = false, 
  title,
  onOpenChat,
  onOpenProfile,
  onLogout,
  onLogin,
  onRegister,
  onNavigate
}: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {showBackButton && onBack && (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground shrink-0"
                size="sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">العودة</span>
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <WeqayaLogo size="sm" />
            </div>
            {title && (
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate hidden sm:block">{title}</h1>
            )}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <ThemeToggle />
            {onLogin ? (
              <NavigationMenu 
                onNavigate={onNavigate || (() => {})}
                onLogin={onLogin}
                onRegister={onRegister}
              />
            ) : (
              <>
                {/* Mobile: Show only essential buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
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
                </div>

                {/* Mobile: Show only chat and profile buttons */}
                <div className="flex sm:hidden items-center gap-1">
                  {onOpenChat && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onOpenChat}
                      className="w-8 h-8"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {onOpenProfile && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onOpenProfile}
                      className="w-8 h-8"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 w-8 h-8"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile title row */}
        {title && (
          <div className="sm:hidden mt-2">
            <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
          </div>
        )}
      </div>
      
      {/* Notifications Dropdown */}
      <NotificationsDropdown 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
};
