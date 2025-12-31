"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/types";
import Image from "next/image";
import { ScheduleAppointment } from "./ScheduleAppointment";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface ChatOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  patientName: string;
  userId: string;
}

const ONBOARDING_QUESTIONS = [
  {
    step: 1,
    question: "Have you taken your medicine today?",
    field: "medicine_taken",
  },
  {
    step: 2,
    question: "Are you feeling better after the new medicine?",
    field: "feeling_better",
  },
];

export const ChatOnboarding = ({
  isOpen,
  onClose,
  doctor,
  patientName,
  userId,
}: ChatOnboardingProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleScheduleClick = () => {
    setIsScheduleOpen(true);
  };

  const handleScheduleClose = () => {
    setIsScheduleOpen(false);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize chat with welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `${patientName}, thanks for coming in today. Here's your next step. I'll guide you through everything.`,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);

      // Ask first question after a delay
      setTimeout(() => {
        const firstQuestion: ChatMessage = {
          id: "q1",
          role: "assistant",
          content: ONBOARDING_QUESTIONS[0].question,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, firstQuestion]);
      }, 1000);
    }
  }, [isOpen, messages.length, patientName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Process response
    setTimeout(() => {
      const nextStep = currentStep + 1;

      if (nextStep < ONBOARDING_QUESTIONS.length) {
        // Ask next question
        const nextQuestion: ChatMessage = {
          id: `q${nextStep + 1}`,
          role: "assistant",
          content: ONBOARDING_QUESTIONS[nextStep].question,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, nextQuestion]);
        setCurrentStep(nextStep);
      } else {
        // Onboarding complete
        const completeMessage: ChatMessage = {
          id: "complete",
          role: "assistant",
          content: "Thank you! I'll make sure Dr. " + doctor.name + " has all this information. Feel free to continue watching your personalized content.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, completeMessage]);
        setIsCompleted(true);

        // Close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md h-[80vh] bg-white rounded-t-3xl shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {doctor.avatarUrl ? (
                  <Image
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Dr. {doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {/* Schedule Follow-Up Button */}
          <div className="px-4 pb-3">
            <button 
              onClick={handleScheduleClick}
              className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Schedule Follow-Up
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!isCompleted && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Schedule Appointment Modal */}
    <ScheduleAppointment
      isOpen={isScheduleOpen}
      onClose={handleScheduleClose}
      doctor={doctor}
      userId={userId}
    />
    </>
  );
};

