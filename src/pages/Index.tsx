import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Dashboard } from "@/components/Dashboard";
import { Auth } from "@/components/Auth";
import { AIChat } from "@/components/AIChat";
import { UserProfile } from "@/components/UserProfile";
import CafeteriaMenu from "@/components/CafeteriaMenu";
import { DailyMealPlan } from "@/components/DailyMealPlan";
import { ProgressReport } from "@/components/ProgressReport";
import { authApi } from "@/services/authApi";

type AppState = "landing" | "auth" | "onboarding" | "dashboard" | "chat" | "cafeteria" | "profile" | "mealplan" | "progress";
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

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMealPlanMode, setIsMealPlanMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  const handleLogout = () => {
    setCurrentState("landing");
  };

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
      return <CafeteriaMenu onBack={backToDashboard} isMealPlanMode={isMealPlanMode} selectedDate={selectedDate} />;
    case "profile":
      return <UserProfile onBack={backToDashboard} onOpenChat={showChat} />;
    case "mealplan":
      return <DailyMealPlan onBack={backToDashboard} onOpenCafeteria={showCafeteriaForMealPlan} onDateChange={setSelectedDate} />;
    case "progress":
      return <ProgressReport onBack={backToDashboard} />;
    default:
      return <HeroSection onStartRegistration={startRegistration} onLogin={showAuth} />;
  }
};

export default Index;