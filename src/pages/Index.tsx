import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Dashboard } from "@/components/Dashboard";

type AppState = "landing" | "onboarding" | "dashboard";

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

  switch (currentState) {
    case "onboarding":
      return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    case "dashboard":
      return <Dashboard userName={userData?.name} />;
    default:
      return <HeroSection onStartOnboarding={startOnboarding} />;
  }
};

export default Index;