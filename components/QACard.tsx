"use client";

import { useState } from "react";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";

interface QAOption {
  id: string;
  label: string;
  emoji: string;
}

interface QAQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QAOption[];
}

// Different Q&A questions that can be shown
export const QA_QUESTIONS: QAQuestion[] = [
  {
    id: "feeling-today",
    question: "Hey Dave, how are you feeling today?",
    subtitle: "Your doctor wants to check in with you",
    options: [
      { id: "great", label: "Great", emoji: "😊" },
      { id: "good", label: "Good", emoji: "🙂" },
      { id: "okay", label: "Okay", emoji: "😐" },
      { id: "not-great", label: "Not Great", emoji: "😔" },
    ],
  },
  {
    id: "medications",
    question: "Hey Dave, how are your new medications working?",
    subtitle: "Help your doctor understand your progress",
    options: [
      { id: "working-well", label: "Working Well", emoji: "✅" },
      { id: "some-effects", label: "Some Side Effects", emoji: "⚠️" },
      { id: "not-sure", label: "Not Sure Yet", emoji: "🤔" },
      { id: "need-discuss", label: "Need to Discuss", emoji: "💬" },
    ],
  },
  {
    id: "sleep-quality",
    question: "Hey Dave, how has your sleep been lately?",
    subtitle: "Sleep affects your heart health",
    options: [
      { id: "excellent", label: "Excellent", emoji: "😴" },
      { id: "pretty-good", label: "Pretty Good", emoji: "🌙" },
      { id: "could-be-better", label: "Could Be Better", emoji: "😪" },
      { id: "struggling", label: "Struggling", emoji: "😫" },
    ],
  },
  {
    id: "exercise",
    question: "Hey Dave, have you been staying active?",
    subtitle: "Exercise is key to heart health",
    options: [
      { id: "very-active", label: "Very Active", emoji: "🏃" },
      { id: "somewhat", label: "Somewhat", emoji: "🚶" },
      { id: "not-much", label: "Not Much", emoji: "🛋️" },
      { id: "need-help", label: "Need Guidance", emoji: "🙋" },
    ],
  },
  {
    id: "stress-level",
    question: "Hey Dave, how's your stress level?",
    subtitle: "Managing stress helps your heart",
    options: [
      { id: "low", label: "Low", emoji: "😌" },
      { id: "moderate", label: "Moderate", emoji: "😅" },
      { id: "high", label: "High", emoji: "😰" },
      { id: "overwhelming", label: "Overwhelming", emoji: "🆘" },
    ],
  },
];

interface QACardProps {
  question: QAQuestion;
  onAnswer?: (questionId: string, answerId: string) => void;
  isActive?: boolean;
}

export const QACard = ({ question, onAnswer, isActive = false }: QACardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    
    setSelectedOption(optionId);
    setIsSubmitted(true);
    onAnswer?.(question.id, optionId);
    
    // Reset after a delay for demo purposes
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedOption(null);
    }, 3000);
  };

  return (
    <div className="video-card overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00BFA6] via-[#00A6CE] to-[#7C3AED] animate-gradient-shift">
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-pulse-slow" />
        </div>
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* 1A Logo Watermark */}
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <Image
          src="/images/1a-icon.png?v=2"
          alt="1Another"
          width={44}
          height={44}
          className="drop-shadow-lg"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-12">
        {/* Icon */}
        <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-full">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>

        {/* Question */}
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2 drop-shadow-lg">
          {question.question}
        </h2>
        
        {question.subtitle && (
          <p className="text-white/80 text-sm md:text-base text-center mb-8 drop-shadow-md">
            {question.subtitle}
          </p>
        )}

        {/* Options */}
        <div className="w-full max-w-sm space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isSubmitted && !isSelected}
                className={`
                  w-full flex items-center justify-between px-5 py-4 rounded-2xl
                  transition-all duration-300 transform
                  ${isSelected 
                    ? 'bg-white text-gray-900 scale-105 shadow-xl' 
                    : isSubmitted 
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-102 active:scale-98'
                  }
                `}
                aria-label={`Select ${option.label}`}
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-semibold">{option.label}</span>
                </div>
                
                {isSelected && (
                  <div className="flex items-center gap-2 text-[#00BFA6]">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Sent!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Thank you message */}
        {isSubmitted && (
          <div className="mt-6 flex items-center gap-2 text-white animate-fade-in">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Thanks! Your response has been sent to your doctor.</span>
          </div>
        )}

        {/* Footer hint */}
        {!isSubmitted && (
          <p className="mt-8 text-white/60 text-xs text-center">
            Tap an option to send your response
          </p>
        )}
      </div>
    </div>
  );
};
