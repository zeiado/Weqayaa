import React from "react";

export const WeqayaLogo = ({
  size = "xl",
  animated = true,
  glow = true,
  showText = true,
  textContent = "WEQAYA",
  showTagline = true
}: {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animated?: boolean;
  glow?: boolean;
  showText?: boolean;
  textContent?: string;
  showTagline?: boolean;
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
    "2xl": "w-48 h-48"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-4xl"
  };

  const taglineSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl"
  };

  const isLargeSize = ["lg", "xl", "2xl"].includes(size);

  return (
    <div className={`flex items-center gap-4 ${isLargeSize ? "flex-col text-center" : "flex-row"}`}>
      <div className={`relative group ${animated ? "transition-all duration-300 hover:scale-110" : ""}`}>
        {/* Glow effect background */}
        {glow && (
          <div className={`
            absolute inset-0 ${sizeClasses[size]}
            bg-gradient-to-r from-teal-400 to-teal-500
            rounded-3xl blur-xl opacity-50
            ${animated ? "animate-pulse" : ""}
            group-hover:opacity-75 transition-opacity
          `} />
        )}

        {/* Main logo container */}
        <div className={`
          relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl
          border-2 border-white/30 overflow-hidden
          ${sizeClasses[size]}
          ${animated ? "hover:shadow-[0_20px_50px_rgba(20,_184,_166,_0.7)]" : ""}
          transition-all duration-300
          flex items-center justify-center
        `}>
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/10 pointer-events-none" />
          
          {/* CSS Heart Logo */}
          <div className={`
            relative
            ${animated ? "group-hover:scale-105 transition-transform duration-300" : ""}
          `}>
            <svg 
              viewBox="0 0 200 120" 
              className="w-3/4 h-3/4"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Define gradient */}
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              
              {/* First heart (left/back) */}
              <path
                d="M60 25 
                   C60 15, 45 10, 35 25
                   C25 10, 10 15, 10 25
                   C10 40, 35 65, 35 65
                   C35 65, 60 40, 60 25 Z"
                fill="url(#heartGradient)"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: "0s", animationDuration: "2s" }}
              />
              
              {/* Second heart (right/front) */}
              <path
                d="M130 25
                   C130 15, 115 10, 105 25  
                   C95 10, 80 15, 80 25
                   C80 40, 105 65, 105 65
                   C105 65, 130 40, 130 25 Z"
                fill="url(#heartGradient)"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: "0.5s", animationDuration: "2s" }}
              />
              
              {/* Interlocking connector */}
              <path
                d="M65 35 
                   C75 25, 85 25, 95 35
                   C85 45, 75 45, 65 35 Z"
                fill="url(#heartGradient)"
                className={animated ? "animate-pulse" : ""}
                style={{ animationDelay: "1s", animationDuration: "2s" }}
              />
            </svg>
          </div>

          {/* Shine effect */}
          {animated && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          )}
        </div>

        {/* Decorative elements */}
        {isLargeSize && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-500 rounded-full animate-ping" style={{ animationDelay: "300ms" }} />
          </>
        )}
      </div>

      {/* Text label */}
      {showText && (
        <div className={`${animated ? "group-hover:scale-105 transition-transform" : ""} flex flex-col items-center gap-1`}>
          <h1 className={`
            font-bold tracking-[0.3em]
            ${textSizes[size]}
            ${animated ? "animate-gradient" : ""}
          `}
          style={{ 
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 25%, #fdba74 50%, #fed7aa 75%, #ffedd5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {textContent}
          </h1>
          
          {showTagline && (
            <p className={`
              font-medium tracking-[0.2em] text-teal-600
              ${taglineSizes[size]}
              ${animated ? "opacity-80 hover:opacity-100 transition-opacity" : ""}
            `}>
              A HEALTHY MEAL IS A GOOD DEAL
            </p>
          )}
        </div>
      )}
    </div>
  );
};