"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Logo } from "@/components/Logo";
import { 
  Shield, 
  Heart, 
  Stethoscope, 
  Video,
  CheckCircle,
  Activity,
  Users,
  BarChart3,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Patient benefits
const PATIENT_BENEFITS = [
  { icon: <Heart className="w-5 h-5" />, text: "Track your health journey" },
  { icon: <Video className="w-5 h-5" />, text: "Watch personalized care videos" },
  { icon: <Activity className="w-5 h-5" />, text: "Stay connected with your doctors" },
];

// Doctor benefits
const DOCTOR_BENEFITS = [
  { icon: <Sparkles className="w-5 h-5" />, text: "Create AI-powered video content" },
  { icon: <Users className="w-5 h-5" />, text: "Engage patients between visits" },
  { icon: <BarChart3 className="w-5 h-5" />, text: "Track engagement analytics" },
];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const callbackUrlParam = searchParams.get("callbackUrl");
  
  // Determine initial state based on URL params
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | null>(() => {
    if (roleParam === "doctor" || callbackUrlParam === "/doctor") return "doctor";
    if (roleParam === "patient") return "patient";
    return null;
  });

  // Update role when URL params change
  useEffect(() => {
    if (roleParam === "doctor" || callbackUrlParam === "/doctor") {
      setSelectedRole("doctor");
    } else if (roleParam === "patient") {
      setSelectedRole("patient");
    }
  }, [roleParam, callbackUrlParam]);

  const callbackUrl = selectedRole === "doctor" ? "/doctor" : "/my-health";
  const isDoctorLogin = selectedRole === "doctor";

  // If a role is selected, show the onboarding form
  if (selectedRole) {
    return (
      <div className={`min-h-screen flex flex-col ${
        isDoctorLogin 
          ? "bg-[#0a0a0f]" 
          : "bg-gradient-to-br from-[#00BFA6] to-[#3ac1e1]"
      }`}>
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => setSelectedRole(null)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDoctorLogin 
                ? "text-white/60 hover:text-white" 
                : "text-white/80 hover:text-white"
            }`}
            aria-label="Go back to role selection"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <OnboardingForm callbackUrl={callbackUrl} isDoctorLogin={isDoctorLogin} />
            
            <div className={`mt-6 flex items-center justify-center gap-2 text-sm ${
              isDoctorLogin ? "text-white/50" : "text-white/70"
            }`}>
              <Shield className="w-4 h-4" />
              <span>HIPAA-compliant & encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split screen role selection
  return (
    <div className="auth-split">
      {/* Logo - centered at top on mobile, absolute on desktop */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-6 md:pt-8">
        <Link href="/">
          <Logo variant="full" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Patient Panel - Left */}
      <div 
        className="auth-panel relative flex flex-col items-center justify-center p-8 pt-24 md:pt-8 bg-gradient-to-br from-[#00BFA6] to-[#3ac1e1] cursor-pointer group"
        onClick={() => setSelectedRole("patient")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setSelectedRole("patient")}
        aria-label="Continue as a patient"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)`
          }} />
        </div>

        <div className="relative z-10 max-w-sm text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-10 h-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Track Your Health Journey
          </h2>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {PATIENT_BENEFITS.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 text-white/90"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <span className="text-left">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-4 px-6 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Continue as Patient
          </button>
        </div>

        {/* Mobile indicator */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
          Tap to continue
        </div>
      </div>

      {/* Doctor Panel - Right */}
      <div 
        className="auth-panel relative flex flex-col items-center justify-center p-8 pt-24 md:pt-8 bg-[#0a0a0f] cursor-pointer group"
        onClick={() => setSelectedRole("doctor")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setSelectedRole("doctor")}
        aria-label="Continue as a healthcare provider"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 geo-pattern opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00BFA6]/5" />

        <div className="relative z-10 max-w-sm text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-border-2 bg-[#0a0a0f] mb-6 group-hover:scale-110 group-hover:glow-brand transition-all duration-300">
            <Stethoscope className="w-10 h-10 text-[#3ac1e1]" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elevate Your Practice
          </h2>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {DOCTOR_BENEFITS.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 text-white/70"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#3ac1e1]">
                  {benefit.icon}
                </div>
                <span className="text-left">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-4 px-6 font-bold text-lg rounded-2xl gradient-border-2 text-white hover:bg-white/5 hover:scale-105 transition-all duration-300"
          >
            Continue as Provider
          </button>
        </div>

        {/* Mobile indicator */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-sm">
          Tap to continue
        </div>
      </div>

      {/* Center divider line - desktop only */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent z-10" />

      {/* Trust badge - bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-white/70 text-sm font-medium">HIPAA Compliant</span>
      </div>
    </div>
  );
}
