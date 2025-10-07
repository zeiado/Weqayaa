import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Target, 
  Heart, 
  School, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { nutritionApi } from "@/services/nutritionApi";
import { UserProfile } from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
  onCompleteProfile?: () => void;
  onSkip?: () => void;
}

interface ProfileStatus {
  hasProfile: boolean;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const ProfileCompletionGuard = ({ 
  children, 
  onCompleteProfile, 
  onSkip 
}: ProfileCompletionGuardProps) => {
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    hasProfile: false,
    profile: null,
    isLoading: true,
    error: null
  });
  const [showModal, setShowModal] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkProfileStatus();
  }, []);

  // helper to decide if profile is complete
  const isProfileComplete = (profile: any) => {
    if (!profile) return false;
    // honor explicit flag if backend provides it
    if (typeof profile.isComplete === 'boolean') return profile.isComplete;
    // otherwise require a minimal set of fields — adjust to your schema
    const required = ['firstName', 'lastName', 'dob', 'height', 'weight'];
    return required.every((k) => {
      const v = profile[k];
      return v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '') && !(typeof v === 'number' && isNaN(v));
    });
  };

  const checkProfileStatus = async () => {
    try {
      setProfileStatus(prev => ({ ...prev, isLoading: true, error: null }));
      setIsProfileIncomplete(false);

      const profile = await nutritionApi.getProfile();

      // If API returned a profile but it's missing required fields, treat as incomplete
      const complete = isProfileComplete(profile);

      if (complete) {
        setProfileStatus({
          hasProfile: true,
          profile,
          isLoading: false,
          error: null
        });
        setShowModal(false);
        setIsProfileIncomplete(false);
      } else {
        // profile exists but incomplete (or API returned null)
        setProfileStatus({
          hasProfile: false,
          profile,
          isLoading: false,
          error: 'ملف غير مكتمل'
        });
        setIsProfileIncomplete(true);
        setShowModal(true);
      }
    } catch (error: any) {
      console.error('Profile check error:', error);

      // Normalize response details
      const status = error?.response?.status ?? error?.status ?? null;
      const code = error?.response?.data?.code ?? error?.code ?? null;
      const message = String(error?.response?.data?.message ?? error?.message ?? '').toLowerCase();

      const detectedIncomplete =
        status === 404 ||
        code === 'PROFILE_INCOMPLETE' ||
        /profile.*incomplete|not found|ملف غير مكتمل/.test(message);

      setProfileStatus({
        hasProfile: false,
        profile: null,
        isLoading: false,
        error: detectedIncomplete ? 'ملف غير مكتمل' : (message || 'حدث خطأ أثناء التحقق')
      });

      setIsProfileIncomplete(detectedIncomplete);

      if (detectedIncomplete) {
        setShowModal(true);
      } else {
        setShowModal(false);
        toast?.({
          title: 'حدث خطأ',
          description: 'تعذر التحقق من ملفك الشخصي. حاول مرة أخرى لاحقًا.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCompleteProfile = () => {
    if (onCompleteProfile) onCompleteProfile();
    setShowModal(false);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    setShowModal(false);
  };

  const handleRetry = () => {
    checkProfileStatus();
  };

  // Show simple loader while checking profile
  if (profileStatus.isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>جاري التحقق من الملف...</span>
      </div>
    );
  }

  // If profile exists, render children
  if (profileStatus.hasProfile && profileStatus.profile) {
    return <>{children}</>;
  }

  // No profile: render children + modal (modal will only open when isProfileIncomplete === true)
  return (
    <>
      {children}
      <ProfileCompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCompleteProfile={handleCompleteProfile}
        onSkip={handleSkip}
        isLoading={isCreatingProfile}
        error={profileStatus.error}
        isProfileIncomplete={isProfileIncomplete}
        showSkipOption={true}
      />
    </>
  );
};
