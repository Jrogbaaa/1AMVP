"use client";

import { Heart } from "lucide-react";
import { cn, getHealthScoreColor, getHealthScoreMessage } from "@/lib/utils";

interface HeartScoreProps {
  score: number;
  className?: string;
  showMessage?: boolean;
}

export const HeartScore = ({ score, className, showMessage = false }: HeartScoreProps) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.min(Math.max(score, 0), 100);
  
  // Determine color based on score thresholds
  const getColorClass = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getGradientClass = (score: number) => {
    if (score >= 70) return "bg-gradient-to-br from-emerald-400 to-green-600";
    if (score >= 40) return "bg-gradient-to-br from-amber-400 to-orange-500";
    return "bg-gradient-to-br from-rose-400 to-red-600";
  };
  
  const colorClass = getColorClass(clampedScore);
  const gradientClass = getGradientClass(clampedScore);
  const message = getHealthScoreMessage(clampedScore);
  
  // Calculate fill percentage (inverted for clip-path from bottom)
  const fillPercentage = clampedScore;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-12 h-12">
        {/* Background heart with subtle shadow */}
        <div className="absolute inset-0 w-12 h-12 rounded-full blur-sm opacity-20 bg-gray-400" />
        
        {/* Outer ring/border */}
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-gray-200/50" 
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
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))'
            }}
          />
        </div>
        
        {/* Score text overlay with better contrast */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10">
          {clampedScore}%
        </span>
      </div>
      {showMessage && (
        <span className={cn("text-sm font-medium", colorClass)}>
          {message}
        </span>
      )}
    </div>
  );
};

