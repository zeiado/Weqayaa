import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Dashboard } from "@/components/Dashboard";
import { Auth } from "@/components/Auth";
import { AIChat } from "@/components/AIChat";
import { UserProfile } from "@/components/UserProfile";
import CafeteriaMenu from "@/components/CafeteriaMenu";
import { authApi } from "@/services/authApi";

type AppState = "landing" | "auth" | "onboarding" | "dashboard" | "chat" | "cafeteria" | "profile";

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
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const startOnboarding = () => {
    setCurrentState("onboarding");
  };

  const showAuth = () => {
    setCurrentState("auth");
  };

  const handleLogin = () => {
    setCurrentState("dashboard");
  };

  const backToLanding = () => {
    setCurrentState("landing");
  };

  const showChat = () => {
    setCurrentState("chat");
  };

  const showCafeteria = () => {
    setCurrentState("cafeteria");
  };

  const backToDashboard = () => {
    setCurrentState("dashboard");
  };

  const showProfile = () => {
    setCurrentState("profile");
  };

  const handleLogout = () => {
    setCurrentState("landing");
  };

  switch (currentState) {
    case "auth":
      return <Auth onBack={backToLanding} onLogin={handleLogin} />;
    case "onboarding":
      return <OnboardingFlow onComplete={handleOnboardingComplete} onBack={backToLanding} />;
    case "dashboard":
      return <Dashboard 
        userName={userData?.name} 
        onBack={backToLanding} 
        onOpenChat={showChat}
        onOpenCafeteria={showCafeteria}
        onOpenProfile={showProfile}
      />;
    case "chat":
      return <AIChat onBack={backToDashboard} />;
    case "cafeteria":
      return <CafeteriaMenu onBack={backToDashboard} />;
    case "profile":
      return <UserProfile onBack={backToDashboard} onOpenChat={showChat} />;
    default:
      return <HeroSection onStartOnboarding={startOnboarding} onLogin={showAuth} />;
  }
};

export default Index;