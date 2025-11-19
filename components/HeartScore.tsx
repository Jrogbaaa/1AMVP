"use client";

import { Heart } from "lucide-react";
import { cn, getHealthScoreColor, getHealthScoreMessage } from "@/lib/utils";

interface HeartScoreProps {
  score: number;
  className?: string;
  showMessage?: boolean;
}

export const HeartScore = ({ score, className, showMessage = false }: HeartScoreProps) => {
  const color = getHealthScoreColor(score);
  const message = getHealthScoreMessage(score);
  
  // Calculate fill percentage (bottom to top)
  const fillPercentage = Math.min(Math.max(score, 0), 100);
  const fillHeight = `${100 - fillPercentage}%`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-12 h-12">
        {/* Background heart (empty/outline) */}
        <Heart
          className="absolute inset-0 w-12 h-12 text-gray-300 drop-shadow-lg"
          strokeWidth={2}
          fill="white"
        />
        
        {/* Filled heart with mask for partial fill */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{ top: fillHeight }}
          >
            <Heart
              className={cn("w-12 h-12 drop-shadow-lg", color)}
              fill="currentColor"
              strokeWidth={2}
            />
          </div>
        </div>
        
        {/* Score text overlay */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 drop-shadow-sm">
          {score}%
        </span>
      </div>
      {showMessage && (
        <span className={cn("text-sm font-medium", color)}>
          {message}
        </span>
      )}
    </div>
  );
};

