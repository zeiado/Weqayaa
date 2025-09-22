import React from "react";
import { WeqayaLogo } from "./WeqayaLogo";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-wellness border-t border-border mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <WeqayaLogo size="lg" />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              وقاية - تطبيق التغذية الذكية للطلاب الجامعيين. نساعدك في اتخاذ قرارات غذائية صحية ومتوازنة.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">صُنع بحب في مصر</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                  الرئيسية
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                  قائمة الكافتيريا
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                  المستشار الذكي
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                  ملفي الشخصي
                </Button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">المميزات</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                توصيات غذائية مخصصة
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-secondary" />
                مجتمع طلابي صحي
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-accent" />
                تتبع التقدم الصحي
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                info@weqaya.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +20 123 456 7890
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                القاهرة، مصر
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 وقاية. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
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
