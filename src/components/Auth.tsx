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
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const isStrongPassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return hasUppercase && hasNumber && hasSpecial;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "البريد الإلكتروني مطلوب";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "يرجى إدخال بريد إلكتروني صحيح";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "كلمة المرور مطلوبة";
    }
    if (password.length < 8) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!isStrongPassword(password)) {
      return "كلمة المرور يجب أن تحتوي على حرف كبير ورقم ورمز خاص";
    }
    return null;
  };

  const validateName = (name: string, fieldName: string): string | null => {
    if (!name.trim()) {
      return `${fieldName} مطلوب`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} يجب أن يكون حرفين على الأقل`;
    }
    if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name.trim())) {
      return `${fieldName} يجب أن يحتوي على أحرف فقط`;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    // Validate names for registration
    if (!isLogin) {
      const firstNameError = validateName(formData.firstName, "الاسم الأول");
      if (firstNameError) errors.firstName = firstNameError;
      
      const lastNameError = validateName(formData.lastName, "الاسم الأخير");
      if (lastNameError) errors.lastName = lastNameError;
      
      // Validate confirm password
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "كلمات المرور غير متطابقة";
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getUserFriendlyError = (error: string): string => {
    // Map common API errors to user-friendly messages
    const errorMappings: {[key: string]: string} = {
      'User already exists': 'هذا البريد الإلكتروني مسجل بالفعل',
      'Invalid email': 'البريد الإلكتروني غير صحيح',
      'Invalid credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      'Email already exists': 'هذا البريد الإلكتروني مسجل بالفعل',
      'Password too weak': 'كلمة المرور ضعيفة جداً',
      'User not found': 'المستخدم غير موجود',
      'Account locked': 'الحساب مقفل، يرجى المحاولة لاحقاً',
      'Network error': 'خطأ في الاتصال، تحقق من الإنترنت',
      'Server error': 'خطأ في الخادم، يرجى المحاولة لاحقاً'
    };
    
    // Check for partial matches
    for (const [key, value] of Object.entries(errorMappings)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Default user-friendly message
    return "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    setPasswordError(null);
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "يرجى تصحيح الأخطاء",
        description: "تحقق من البيانات المدخلة وحاول مرة أخرى",
        variant: "destructive",
      });
      return;
    }
    
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
          const errorMessage = response.errors?.join(', ') || 'فشل في تسجيل الدخول';
          throw new Error(errorMessage);
        }
      } else {
        // Handle Register
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
          const errorMessage = response.errors?.join(', ') || 'فشل في إنشاء الحساب';
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      const userFriendlyMessage = getUserFriendlyError(errorMessage);
      
      toast({
        title: isLogin ? "فشل في تسجيل الدخول" : "فشل في إنشاء الحساب",
        description: userFriendlyMessage,
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }));
                      // Clear error when user starts typing
                      if (fieldErrors.firstName) {
                        setFieldErrors(prev => ({ ...prev, firstName: '' }));
                      }
                    }}
                    className={`text-right pr-10 ${fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                    required={!isLogin}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors.firstName}</p>
                )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }));
                      // Clear error when user starts typing
                      if (fieldErrors.lastName) {
                        setFieldErrors(prev => ({ ...prev, lastName: '' }));
                      }
                    }}
                    className={`text-right pr-10 ${fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                    required={!isLogin}
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors.lastName}</p>
                )}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    // Clear error when user starts typing
                    if (fieldErrors.email) {
                      setFieldErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  className={`text-right pr-10 ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors.email}</p>
              )}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    // Clear error when user starts typing
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  className={`text-right pr-10 pl-10 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
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
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors.password}</p>
              )}
              {!isLogin && (
                <div className="mt-2 text-xs text-muted-foreground text-right">
                  يجب أن تحتوي كلمة المرور على: حرف كبير واحد على الأقل، رقم واحد على الأقل، ورمز خاص واحد على الأقل.
                </div>
              )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      // Clear error when user starts typing
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    className={`text-right pr-10 pl-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
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
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 text-right">{fieldErrors.confirmPassword}</p>
                )}
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