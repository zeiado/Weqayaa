import React from "react";
import { WeqayaLogo } from "./WeqayaLogo";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Mail, Phone, MapPin, Code, MessageCircle, Linkedin } from "lucide-react";
import { authApi } from "@/services/authApi";
import britishImg from "@/assets/British-Council-Egypt-Egypt-46149-1568211691-og.jpg";
import educalityImg from "@/assets/Educality.jpg";
import gizImg from "@/assets/GIZ-logo.jpg";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

interface FooterProps {
  onNavigate?: (section: string) => void;
  onRegister?: () => void;
}

export const Footer = ({ onNavigate, onRegister }: FooterProps) => {
  const isAuthenticated = authApi.isTokenValid();

  const handleQuickLinkClick = (section: string) => {
    if (!isAuthenticated && onRegister) {
      onRegister();
    } else if (onNavigate) {
      onNavigate(section);
    }
  };
  return (
    <footer className="bg-gradient-wellness border-t border-border mt-16 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Sponsors Row */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">شركاؤنا الرعاة</h3>
            <p className="text-sm text-muted-foreground">نشكر شركاءنا على دعمهم لرحلة الصحة الغذائية</p>
          </div>
          <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
              <div className="group h-16 sm:h-20 md:h-24 flex items-center justify-center p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src={britishImg} 
                  alt="British Council" 
                  className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
              <div className="group h-16 sm:h-20 md:h-24 flex items-center justify-center p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src={educalityImg} 
                  alt="Educality" 
                  className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
              <div className="group h-16 sm:h-20 md:h-24 flex items-center justify-center p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src={gizImg} 
                  alt="GIZ" 
                  className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-1 text-center sm:text-right">
            <WeqayaLogo size="lg" />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
              وقاية - تطبيق التغذية الذكية للطلاب الجامعيين. نساعدك في اتخاذ قرارات غذائية صحية ومتوازنة.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">صُنع بحب في مصر</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-right">
            <h3 className="font-semibold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary text-sm"
                  onClick={() => handleQuickLinkClick('dashboard')}
                >
                  الرئيسية
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary text-sm"
                  onClick={() => handleQuickLinkClick('chat')}
                >
                  المستشار الذكي
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary text-sm"
                  onClick={() => handleQuickLinkClick('profile')}
                >
                  ملفي الشخصي
                </Button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="text-center sm:text-right">
            <h3 className="font-semibold text-foreground mb-4">المميزات</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                توصيات غذائية مخصصة
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-secondary" />
                مجتمع طلابي صحي
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-accent" />
                تتبع التقدم الصحي
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-right">
            <h3 className="font-semibold text-foreground mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                weqayaa@gmail.com
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +20 10 03173576
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                القاهرة، مصر
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="sm:col-span-2 md:col-span-1 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg border-2 border-red-300 dark:border-red-700">
            <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center sm:justify-start gap-2">
              <Code className="w-4 h-4" />
              المطورون
            </h3>
            <div className="space-y-4">
              {/* Ziad Gamal */}
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-medium text-foreground text-sm mb-2">زياد جمال</h4>
                <div className="space-y-2">
                  <div 
                    onClick={() => window.open('https://wa.me/201278747645', '_blank')}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded-md transition-all duration-200 cursor-pointer group"
                    title="Send WhatsApp message to Ziad"
                  >
                    <WhatsAppIcon className="w-3 h-3 group-hover:text-green-600 transition-colors" />
                    WhatsApp: 01278747645
                  </div>
                  <div 
                    onClick={() => window.open('https://www.linkedin.com/in/ziad-gamal-506b99222', '_blank')}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-all duration-200 cursor-pointer group"
                    title="View Ziad's LinkedIn profile"
                  >
                    <Linkedin className="w-3 h-3 group-hover:text-blue-600 transition-colors" />
                    LinkedIn Profile
                  </div>
                </div>
              </div>

              {/* Youssef Samir */}
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="font-medium text-foreground text-sm mb-2">يوسف سمير</h4>
                <div className="space-y-2">
                  <div 
                    onClick={() => window.open('https://wa.me/201202203469', '_blank')}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded-md transition-all duration-200 cursor-pointer group"
                    title="Send WhatsApp message to Youssef"
                  >
                    <WhatsAppIcon className="w-3 h-3 group-hover:text-green-600 transition-colors" />
                    WhatsApp: 01202203469
                  </div>
                  <div 
                    onClick={() => window.open('https://www.linkedin.com/in/youssef-samir-7b688230b/', '_blank')}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-all duration-200 cursor-pointer group"
                    title="View Youssef's LinkedIn profile"
                  >
                    <Linkedin className="w-3 h-3 group-hover:text-blue-600 transition-colors" />
                    LinkedIn Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © 2025 وقاية. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary">
              الشروط والأحكام
            </Button>
            <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary">
              سياسة الخصوصية
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
