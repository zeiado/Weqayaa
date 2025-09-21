import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Dashboard } from "@/components/Dashboard";
import { Auth } from "@/components/Auth";
import { AIChat } from "@/components/AIChat";
import CafeteriaMenu from "@/components/CafeteriaMenu";

type AppState = "landing" | "auth" | "onboarding" | "dashboard" | "chat" | "cafeteria";

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
      />;
    case "chat":
      return <AIChat onBack={backToDashboard} />;
    case "cafeteria":
      return <CafeteriaMenu onBack={backToDashboard} />;
    default:
      return <HeroSection onStartOnboarding={startOnboarding} onLogin={showAuth} />;
  }
};

export default Index;