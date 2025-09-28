import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, CheckCircle, AlertCircle, Info, Star, Heart, Zap } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  time: string;
  isRead: boolean;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'تهانينا! 🎉',
      message: 'لقد أكملت هدفك اليومي من السعرات الحرارية',
      type: 'achievement',
      time: 'منذ 5 دقائق',
      isRead: false
    },
    {
      id: '2',
      title: 'تذكير مهم',
      message: 'لا تنس شرب الماء - تحتاج إلى 2 كوب إضافي',
      type: 'warning',
      time: 'منذ 15 دقيقة',
      isRead: false
    },
    {
      id: '3',
      title: 'وجبة جديدة متاحة',
      message: 'تم إضافة سلطة الكينوا الصحية إلى قائمة اليوم',
      type: 'info',
      time: 'منذ ساعة',
      isRead: true
    },
    {
      id: '4',
      title: 'إنجاز جديد! ⭐',
      message: 'لقد حافظت على نظامك الغذائي لمدة 7 أيام متتالية',
      type: 'achievement',
      time: 'منذ يومين',
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'achievement':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'achievement':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 max-w-sm" onClick={(e) => e.stopPropagation()}>
        <Card className="glass-card border-2 border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">الإشعارات</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:bg-primary/10"
                  >
                    تعيين كمقروء
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border mb-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${getNotificationBgColor(notification.type)} ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                // TODO: Navigate to full notifications page
                console.log('View all notifications');
                onClose();
              }}
            >
              <Bell className="w-4 h-4 ml-2" />
              عرض جميع الإشعارات
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
