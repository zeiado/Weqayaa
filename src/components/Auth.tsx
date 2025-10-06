import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeqayaLogo } from "./WeqayaLogo";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { authApi, LoginRequest, RegisterRequest } from "@/services/authApi";
import { useToast } from "@/hooks/use-toast";

interface AuthProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister?: () => void;
  initialMode?: "login" | "register";
}

export const Auth = ({ onBack, onLogin, onRegister, initialMode = "login" }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password
        };

        const response = await authApi.login(loginData);
        
        if (response.isSuccess) {
          // Store token and user data
          authApi.setToken(response.token);
          localStorage.setItem('userData', JSON.stringify({
            userId: response.userId,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName
          }));

          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً ${response.firstName}!`,
          });

          onLogin();
        } else {
          throw new Error(response.errors?.join(', ') || 'فشل في تسجيل الدخول');
        }
      } else {
        // Handle Register
        if (formData.password !== formData.confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة');
        }

        const registerData: RegisterRequest = {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName
        };

        const response = await authApi.register(registerData);
        
        if (response.isSuccess) {
          // Store token and user data
          authApi.setToken(response.token);
          localStorage.setItem('userData', JSON.stringify({
            userId: response.userId,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName
          }));

          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: `مرحباً ${response.firstName}! تم إنشاء حسابك بنجاح.`,
          });

          // For new registrations, go to onboarding
          if (onRegister) {
            onRegister();
          } else {
            onLogin();
          }
        } else {
          throw new Error(response.errors?.join(', ') || 'فشل في إنشاء الحساب');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "خطأ في المصادقة",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      {/* Header with back button */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Button>
            <WeqayaLogo size="sm" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <WeqayaLogo size="lg" />
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
            {isLogin ? "مرحباً بعودتك" : "انضم لوقاية"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? "سجل دخولك للمتابعة إلى رحلتك الصحية" 
              : "ابدأ رحلة الحماية الغذائية اليوم"
            }
          </p>
        </div>

        {/* Auth Form */}
        <Card className="glass-card p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* First Name Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <Label htmlFor="firstName" className="text-right block mb-2">الاسم الأول</Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="أدخل اسمك الأول"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="text-right pr-10"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Last Name Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <Label htmlFor="lastName" className="text-right block mb-2">الاسم الأخير</Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="أدخل اسمك الأخير"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="text-right pr-10"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-right block mb-2">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-right pr-10"
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-right block mb-2">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="text-right pr-10 pl-10"
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-right block mb-2">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="text-right pr-10 pl-10"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-left">
                <Button variant="link" className="text-primary p-0 text-sm">
                  نسيت كلمة المرور؟
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary text-base sm:text-lg py-4 sm:py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  {isLogin ? "جاري تسجيل الدخول..." : "جاري إنشاء الحساب..."}
                </>
              ) : (
                isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"
              )}
            </Button>

            {/* Toggle Auth Mode */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
                <Button 
                  variant="link" 
                  className="text-primary p-0 mr-1"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "إنشاء حساب جديد" : "تسجيل الدخول"}
                </Button>
              </p>
            </div>
          </form>
        </Card>

        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">أو</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 space-y-3">
            <Button variant="outline" className="w-full text-sm sm:text-base">
              <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 bg-red-500 rounded"></div>
              {isLogin ? "الدخول" : "التسجيل"} بحساب Google
            </Button>
            <Button variant="outline" className="w-full text-sm sm:text-base">
              <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 bg-blue-600 rounded"></div>
              {isLogin ? "الدخول" : "التسجيل"} بحساب Facebook
            </Button>
          </div>
        </div>

        {/* Terms and Privacy */}
        {!isLogin && (
          <div className="mt-4 sm:mt-6 text-center text-xs text-muted-foreground">
            بإنشاء حساب، أنت توافق على{" "}
            <Button variant="link" className="text-primary p-0 text-xs">
              الشروط والأحكام
            </Button>{" "}
            و{" "}
            <Button variant="link" className="text-primary p-0 text-xs">
              سياسة الخصوصية
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};