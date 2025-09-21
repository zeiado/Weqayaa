import { Heart, Shield } from "lucide-react";

export const WeqayaLogo = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  const isLarge = size === "lg";
  
  return (
    <div className={`flex items-center gap-3 ${isLarge ? "flex-col text-center" : "flex-row"}`}>
      <div className={`relative ${isLarge ? "mb-2" : ""}`}>
        <div className={`
          relative bg-gradient-primary rounded-2xl p-3 glow-primary
          ${isLarge ? "w-16 h-16" : "w-10 h-10"}
        `}>
          <Shield className={`text-white ${isLarge ? "w-10 h-10" : "w-6 h-6"}`} />
          <Heart className={`absolute top-1 right-1 text-white/80 ${isLarge ? "w-4 h-4" : "w-3 h-3"}`} />
        </div>
      </div>
      
      <div className={isLarge ? "text-center" : ""}>
        <h1 className={`font-bold text-primary ${isLarge ? "text-4xl mb-2" : "text-xl"}`}>
          وقاية
        </h1>
        {isLarge && (
          <p className="text-muted-foreground text-sm">
            وقايتك من سوء التغذية تبدأ هنا
          </p>
        )}
      </div>
    </div>
  );
};