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
  
  const colorClass = getColorClass(clampedScore);
  const message = getHealthScoreMessage(clampedScore);
  
  // Calculate fill from bottom to top
  // At 0%, the heart is empty (top: 100%)
  // At 100%, the heart is full (top: 0%)
  const fillFromTop = `${100 - clampedScore}%`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-12 h-12">
        {/* Background heart (outline only) */}
        <Heart
          className="absolute inset-0 w-12 h-12 text-gray-300 drop-shadow-lg"
          strokeWidth={2}
          fill="none"
        />
        
        {/* Container for filled portion with overflow hidden */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Filled heart that slides up from bottom */}
          <div 
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ 
              top: fillFromTop,
              height: '100%'
            }}
          >
            <Heart
              className={cn("w-12 h-12 drop-shadow-lg transition-colors duration-500", colorClass)}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={2}
            />
          </div>
        </div>
        
        {/* Score text overlay */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10">
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

