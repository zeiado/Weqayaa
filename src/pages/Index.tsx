import { useState, useEffect, Suspense, lazy } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Auth } from "@/components/Auth";
import { authApi } from "@/services/authApi";

// Lazy load heavy components
const Dashboard = lazy(() => import("@/components/Dashboard").then(module => ({ default: module.Dashboard })));
const AIChat = lazy(() => import("@/components/AIChat").then(module => ({ default: module.AIChat })));
const UserProfile = lazy(() => import("@/components/UserProfile").then(module => ({ default: module.UserProfile })));
const CafeteriaMenu = lazy(() => import("@/components/CafeteriaMenu"));
const DailyMealPlan = lazy(() => import("@/components/DailyMealPlan").then(module => ({ default: module.DailyMealPlan })));
const ProgressReport = lazy(() => import("@/components/ProgressReport").then(module => ({ default: module.ProgressReport })));
const PaymentCheckout = lazy(() => import("@/components/PaymentCheckout"));
const PaymentSuccess = lazy(() => import("@/components/PaymentSuccess"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-wellness flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

type AppState = "landing" | "auth" | "onboarding" | "dashboard" | "chat" | "cafeteria" | "profile" | "mealplan" | "progress" | "checkout" | "payment-success";
type AuthMode = "login" | "register";

interface UserData {
  name: string;
  age: string;
  gender: string;
  university: string;
  goal: string;
  activityLevel: string;
  budget: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  location: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMealPlanMode, setIsMealPlanMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (authApi.isTokenValid()) {
      setCurrentState("dashboard");
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState("dashboard");
  };

  const startRegistration = () => {
    setAuthMode("register");
    setCurrentState("auth");
  };

  const showAuth = () => {
    setAuthMode("login");
    setCurrentState("auth");
  };

  const handleLogin = () => {
    setCurrentState("dashboard");
  };

  const handleRegister = () => {
    setCurrentState("onboarding");
  };

  const backToLanding = () => {
    setCurrentState("landing");
  };

  const showChat = () => {
    setCurrentState("chat");
  };

  const showCafeteria = () => {
    setIsMealPlanMode(false);
    setCurrentState("cafeteria");
  };

  const showCafeteriaForMealPlan = () => {
    setIsMealPlanMode(true);
    setCurrentState("cafeteria");
  };

  const backToDashboard = () => {
    setCurrentState("dashboard");
  };

  const showProfile = () => {
    setCurrentState("profile");
  };

  const showMealPlan = () => {
    setCurrentState("mealplan");
  };

  const showProgressReport = () => {
    setCurrentState("progress");
  };

  const showCheckout = (items: CartItem[]) => {
    setCartItems(items);
    setCurrentState("checkout");
  };

  const showPaymentSuccess = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.14;
    setOrderDetails({
      orderId: `ORD-${Date.now()}`,
      total: total + tax,
      items: cartItems,
      estimatedTime: "15-30 دقيقة",
      location: "مبنى الطلاب - الدور الأرضي"
    });
    setCurrentState("payment-success");
  };

  const showNewOrder = () => {
    setCartItems([]);
    setOrderDetails(null);
    setCurrentState("cafeteria");
  };

  const handleLogout = () => {
    setCurrentState("landing");
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case "auth":
        return <Auth 
          onBack={backToLanding} 
          onLogin={handleLogin} 
          onRegister={handleRegister}
          initialMode={authMode}
        />;
      case "onboarding":
        return <OnboardingFlow onComplete={handleOnboardingComplete} onBack={backToLanding} />;
      case "dashboard":
        return <Dashboard 
          userName={userData?.name} 
          onBack={backToLanding} 
          onOpenChat={showChat}
          onOpenCafeteria={showCafeteria}
          onOpenProfile={showProfile}
          onOpenMealPlan={showMealPlan}
          onOpenProgressReport={showProgressReport}
        />;
      case "chat":
        return <AIChat onBack={backToDashboard} />;
      case "cafeteria":
        return <CafeteriaMenu onBack={backToDashboard} isMealPlanMode={isMealPlanMode} selectedDate={selectedDate} onOpenMealPlan={showMealPlan} onOpenCheckout={showCheckout} />;
      case "profile":
        return <UserProfile onBack={backToDashboard} onOpenChat={showChat} />;
      case "mealplan":
        return <DailyMealPlan onBack={backToDashboard} onOpenCafeteria={showCafeteriaForMealPlan} onDateChange={setSelectedDate} onOpenCheckout={showCheckout} />;
      case "progress":
        return <ProgressReport onBack={backToDashboard} />;
      case "checkout":
        return <PaymentCheckout onBack={backToDashboard} onPaymentSuccess={showPaymentSuccess} cartItems={cartItems} />;
      case "payment-success":
        return <PaymentSuccess onBack={backToDashboard} onNewOrder={showNewOrder} orderDetails={orderDetails} />;
      default:
        return <HeroSection onStartRegistration={startRegistration} onLogin={showAuth} />;
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {renderCurrentState()}
    </Suspense>
  );
};

export default Index;