"use client";

import { Heart } from "lucide-react";
import { cn, getHealthScoreColor, getHealthScoreMessage } from "@/lib/utils";

interface HeartScoreProps {
  score: number;
  className?: string;
  showMessage?: boolean;
  isAnimating?: boolean;
}

export const HeartScore = ({ score, className, showMessage = false, isAnimating = false }: HeartScoreProps) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const isFullScore = clampedScore >= 100;
  
  // Always use 1A brand colors - green to blue gradient
  const getColorClass = (score: number) => {
    // Use 1A teal for all scores - brand consistency
    return "text-[#00BFA6]";
  };

  const getGradientClass = (score: number) => {
    // Always use 1A brand gradient (green to blue) for all scores
    return "heart-gradient-1a";
  };
  
  const colorClass = getColorClass(clampedScore);
  const gradientClass = getGradientClass(clampedScore);
  const message = getHealthScoreMessage(clampedScore);
  
  // Calculate fill percentage (inverted for clip-path from bottom)
  const fillPercentage = clampedScore;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative w-12 h-12",
        isFullScore && "heart-glow-100",
        isAnimating && "animate-heart-pulse"
      )}>
        {/* Background heart with subtle shadow */}
        <div className="absolute inset-0 w-12 h-12 rounded-full blur-sm opacity-20 bg-gray-400" />
        
        {/* Outer ring/border - always use 1A brand colors */}
        <div className={cn(
          "absolute inset-0 w-12 h-12 rounded-full",
          "bg-gradient-to-br from-[#00BFA6]/30 to-[#00A6CE]/30"
        )}
             style={{
               WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
               maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
               WebkitMaskRepeat: 'no-repeat',
               maskRepeat: 'no-repeat',
               WebkitMaskSize: 'contain',
               maskSize: 'contain',
               WebkitMaskPosition: 'center',
               maskPosition: 'center'
             }}
        />
        
        {/* Filled heart with gradient and clip-path for bottom-to-top fill */}
        <div 
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={{ 
            clipPath: `inset(${100 - fillPercentage}% 0 0 0)`
          }}
        >
          <div 
            className={cn("w-12 h-12 transition-all duration-500", gradientClass)} 
            style={{ 
              WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\' stroke=\'currentColor\' stroke-width=\'1.5\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
              maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\' stroke=\'currentColor\' stroke-width=\'1.5\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              // Always use 1A brand glow - brighter at 100%
              filter: isFullScore 
                ? 'drop-shadow(0 0 8px rgba(0, 191, 166, 0.6)) drop-shadow(0 0 16px rgba(0, 166, 206, 0.4))' 
                : 'drop-shadow(0 0 4px rgba(0, 191, 166, 0.3)) drop-shadow(0 0 8px rgba(0, 166, 206, 0.2))'
            }}
          />
        </div>
        
        {/* Heart icon without score number */}
      </div>
      {showMessage && (
        <span className={cn("text-sm font-medium", colorClass)}>
          {isFullScore ? "Perfect! 🎉" : message}
        </span>
      )}
    </div>
  );
};

