"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Heart,
  Loader2,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for form data
interface OnboardingData {
  // Screen 1: Core basics
  dateOfBirth: string;
  sexAtBirth: "male" | "female" | "";
  anatomyPresent: string[];
  // Screen 2: Height & Weight (moved up early)
  heightFeet: number | null;
  heightInches: number | null;
  weightLbs: number | null;
  // Screen 3: Pregnancy (conditional)
  isPregnant: boolean | null;
  weeksPregnant: number | null;
  // Screen 4: Smoking
  smokingStatus: "never" | "former" | "current" | "";
  smokingYears: number | null;
  packsPerDay: number | null;
  quitYear: number | null;
  // Screen 5: Alcohol
  alcoholFrequency: string;
  drinksPerOccasion: number | null;
  // Screen 6: Sexual health
  sexuallyActive: boolean | null;
  partnersLast12Months: number | null;
  stiHistory: boolean | null;
  hivRisk: boolean | null;
  // Screen 7: Medical conditions
  conditions: string[];
  cancerTypes: string[];
  // Screen 8: Family history
  familyHistory: string[];
  // Screen 9: Preventive history
  lastBloodPressure: string;
  lastCholesterol: string;
  lastDiabetesTest: string;
  lastColonoscopy: string;
  lastCervicalScreening: string;
  lastMammogram: string;
  lastHivTest: string;
  lastDepressionScreening: string;
  // Screen 9.5: Location
  zipCode: string;
  insurancePlan: string;
  // Screen 10: Care logistics
  hasPCP: boolean | null;
  openToTelehealth: boolean | null;
  preferredAppointmentTimes: string[];
}

const initialData: OnboardingData = {
  dateOfBirth: "",
  sexAtBirth: "",
  anatomyPresent: [],
  isPregnant: null,
  weeksPregnant: null,
  smokingStatus: "",
  smokingYears: null,
  packsPerDay: null,
  quitYear: null,
  alcoholFrequency: "",
  drinksPerOccasion: null,
  sexuallyActive: null,
  partnersLast12Months: null,
  stiHistory: null,
  hivRisk: null,
  conditions: [],
  cancerTypes: [],
  familyHistory: [],
  heightFeet: null,
  heightInches: null,
  weightLbs: null,
  lastBloodPressure: "",
  lastCholesterol: "",
  lastDiabetesTest: "",
  lastColonoscopy: "",
  lastCervicalScreening: "",
  lastMammogram: "",
  lastHivTest: "",
  lastDepressionScreening: "",
  zipCode: "",
  insurancePlan: "",
  hasPCP: null,
  openToTelehealth: null,
  preferredAppointmentTimes: [],
};

// Calculate age from DOB
const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Total number of steps (excluding step 0 which is intro)
const TOTAL_STEPS = 12; // Steps 1-12
const TOTAL_STEPS_WITHOUT_PREGNANCY = 11; // Steps 1-12 minus step 2

// Progress percentages for each step
const STEP_PROGRESS: Record<number, number> = {
  0: 0,
  1: 10,
  2: 15,
  3: 25,
  4: 30,
  5: 40,
  6: 50,
  7: 60,
  8: 65,
  9: 80,
  10: 85,
  11: 90,
  12: 100,
};

export default function PreventiveCareOnboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveProfile = useMutation(api.preventiveCare.saveProfile);
  const existingProfile = useQuery(
    api.preventiveCare.getProfile,
    session?.user?.id ? { userId: session.user.id } : "skip"
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/my-health");
    }
  }, [status, router]);

  // Redirect if already completed
  useEffect(() => {
    if (existingProfile) {
      router.push("/my-health");
    }
  }, [existingProfile, router]);

  // Check if pregnancy screen should be shown - infer from sex at birth
  // If female and hasn't had a hysterectomy, show pregnancy screen
  const showPregnancyScreen = 
    formData.sexAtBirth === "female" && 
    !formData.anatomyPresent.includes("hysterectomy");

  // Get actual step number accounting for conditional screens
  // Pregnancy is now at step 3 (after Height & Weight at step 2)
  const getActualStep = (visualStep: number): number => {
    if (visualStep <= 2) return visualStep;
    if (!showPregnancyScreen && visualStep >= 3) {
      return visualStep + 1;
    }
    return visualStep;
  };

  // Get visual step from actual step
  const getVisualStep = (actualStep: number): number => {
    if (actualStep <= 2) return actualStep;
    if (!showPregnancyScreen && actualStep >= 4) {
      return actualStep - 1;
    }
    return actualStep;
  };

  const handleNext = () => {
    let nextStep = currentStep + 1;
    
    // Skip pregnancy screen if not applicable (pregnancy is now at step 3)
    if (currentStep === 2 && !showPregnancyScreen) {
      nextStep = 4; // Skip to smoking screen
    }
    
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;
    
    // Skip pregnancy screen going back if not applicable (pregnancy is now at step 3)
    if (currentStep === 4 && !showPregnancyScreen) {
      prevStep = 2;
    }
    
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    
    setIsSubmitting(true);
    
    try {
      const totalHeightInches = 
        (formData.heightFeet || 0) * 12 + (formData.heightInches || 0);

      await saveProfile({
        userId: session.user.id,
        dateOfBirth: formData.dateOfBirth,
        sexAtBirth: formData.sexAtBirth as "male" | "female",
        anatomyPresent: formData.anatomyPresent,
        isPregnant: formData.isPregnant ?? undefined,
        weeksPregnant: formData.weeksPregnant ?? undefined,
        smokingStatus: formData.smokingStatus as "never" | "former" | "current",
        smokingYears: formData.smokingYears ?? undefined,
        packsPerDay: formData.packsPerDay ?? undefined,
        quitYear: formData.quitYear ?? undefined,
        alcoholFrequency: formData.alcoholFrequency,
        drinksPerOccasion: formData.drinksPerOccasion ?? undefined,
        sexuallyActive: formData.sexuallyActive ?? undefined,
        partnersLast12Months: formData.partnersLast12Months ?? undefined,
        stiHistory: formData.stiHistory ?? undefined,
        hivRisk: formData.hivRisk ?? undefined,
        conditions: formData.conditions,
        cancerTypes: formData.cancerTypes.length > 0 ? formData.cancerTypes : undefined,
        familyHistory: formData.familyHistory,
        heightInches: totalHeightInches,
        weightLbs: formData.weightLbs || 0,
        lastBloodPressure: formData.lastBloodPressure || undefined,
        lastCholesterol: formData.lastCholesterol || undefined,
        lastDiabetesTest: formData.lastDiabetesTest || undefined,
        lastColonoscopy: formData.lastColonoscopy || undefined,
        lastCervicalScreening: formData.lastCervicalScreening || undefined,
        lastMammogram: formData.lastMammogram || undefined,
        lastHivTest: formData.lastHivTest || undefined,
        lastDepressionScreening: formData.lastDepressionScreening || undefined,
        zipCode: formData.zipCode || undefined,
        insurancePlan: formData.insurancePlan || undefined,
        hasPCP: formData.hasPCP ?? undefined,
        openToTelehealth: formData.openToTelehealth ?? undefined,
        preferredAppointmentTimes: formData.preferredAppointmentTimes.length > 0 
          ? formData.preferredAppointmentTimes 
          : undefined,
      });

      // Move to confirmation screen
      setCurrentStep(12);
      
      // Redirect after delay
      setTimeout(() => {
        router.push("/my-health");
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateField(field, newArray as OnboardingData[typeof field]);
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  const progress = STEP_PROGRESS[currentStep] || 0;
  
  // Calculate step display number (step 0 is intro, so we show step 1 for currentStep 1, etc.)
  // Account for pregnancy screen being conditional
  const getTotalSteps = () => showPregnancyScreen ? TOTAL_STEPS : TOTAL_STEPS_WITHOUT_PREGNANCY;
  
  const getCurrentStepDisplay = () => {
    if (currentStep === 0) return 0; // Intro screen
    if (!showPregnancyScreen && currentStep >= 4) {
      // If pregnancy screen is skipped, adjust step number
      return currentStep - 1;
    }
    return currentStep;
  };

  const stepDisplay = getCurrentStepDisplay();
  const totalStepsDisplay = getTotalSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/my-health" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-600">HIPAA Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span className="font-medium">
              {stepDisplay === 0 ? "Getting started" : `Step ${stepDisplay} of ${totalStepsDisplay}`}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Screen 0: Framing */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Build Your Preventive Care Checklist
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                We'll ask a few questions to build your personalized preventive care checklist.
                This takes ~5 minutes. No medical advice — just what you're eligible for and due.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <div className="space-y-3">
                {[
                  "Personalized screening recommendations based on USPSTF guidelines",
                  "Clear status for each test: Due Now, Due Soon, or Up to Date",
                  "Easy scheduling with providers near you",
                  "No medical jargon — just what matters",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 mb-8 border border-sky-100">
              <p className="text-sm text-sky-800">
                <strong>Your privacy matters.</strong> All data is encrypted and HIPAA-compliant.
                We never sell your information.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-teal-700 transition-all shadow-lg"
            >
              Start
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Screen 1: Core Basics */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Core Basics</h2>
            <p className="text-gray-600 mb-6">Let's start with the essentials.</p>

            <div className="space-y-6">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  max={new Date().toISOString().split("T")[0]}
                />
                {formData.dateOfBirth && (
                  <p className="text-sm text-gray-500 mt-1">
                    Age: {calculateAge(formData.dateOfBirth)} years
                  </p>
                )}
              </div>

              {/* Sex at Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex Assigned at Birth
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "female", label: "Female" },
                    { value: "male", label: "Male" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("sexAtBirth", option.value as "male" | "female")}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                        formData.sexAtBirth === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reproductive Surgery History - Less personal question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you had any of these surgeries?
                </label>
                <p className="text-xs text-gray-500 mb-3">Select all that apply, or skip if none</p>
                <div className="space-y-2">
                  {formData.sexAtBirth === "female" ? (
                    <>
                      {[
                        { value: "hysterectomy", label: "Hysterectomy (uterus removed)" },
                        { value: "oophorectomy", label: "Oophorectomy (ovaries removed)" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleArrayItem("anatomyPresent", option.value)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                            formData.anatomyPresent.includes(option.value)
                              ? "border-sky-500 bg-sky-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                              formData.anatomyPresent.includes(option.value)
                                ? "border-sky-500 bg-sky-500"
                                : "border-gray-300"
                            )}
                          >
                            {formData.anatomyPresent.includes(option.value) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </>
                  ) : formData.sexAtBirth === "male" ? (
                    <>
                      {[
                        { value: "prostatectomy", label: "Prostatectomy (prostate removed)" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleArrayItem("anatomyPresent", option.value)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                            formData.anatomyPresent.includes(option.value)
                              ? "border-sky-500 bg-sky-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                              formData.anatomyPresent.includes(option.value)
                                ? "border-sky-500 bg-sky-500"
                                : "border-gray-300"
                            )}
                          >
                            {formData.anatomyPresent.includes(option.value) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 py-2">Please select your sex at birth first</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.dateOfBirth || !formData.sexAtBirth}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: Height & Weight (moved up for better flow) */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Height & Weight</h2>
            <p className="text-gray-600 mb-6">This helps determine obesity-related screening recommendations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={formData.heightFeet || ""}
                      onChange={(e) => updateField("heightFeet", parseInt(e.target.value) || null)}
                      placeholder="Feet"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">ft</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={formData.heightInches || ""}
                      onChange={(e) => updateField("heightInches", parseInt(e.target.value) || null)}
                      placeholder="Inches"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">in</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="50"
                  max="700"
                  value={formData.weightLbs || ""}
                  onChange={(e) => updateField("weightLbs", parseInt(e.target.value) || null)}
                  placeholder="e.g., 165"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              {formData.heightFeet && formData.weightLbs && (
                <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                  {(() => {
                    const totalInches = (formData.heightFeet || 0) * 12 + (formData.heightInches || 0);
                    const bmi = ((formData.weightLbs || 0) / (totalInches * totalInches)) * 703;
                    const bmiCategory = 
                      bmi < 18.5 ? "Underweight" :
                      bmi < 25 ? "Normal" :
                      bmi < 30 ? "Overweight" : "Obese";
                    return (
                      <p className="text-sm text-sky-800">
                        <strong>BMI:</strong> {bmi.toFixed(1)} ({bmiCategory})
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.heightFeet || !formData.weightLbs}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Pregnancy (Conditional) */}
        {currentStep === 3 && showPregnancyScreen && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pregnancy Status</h2>
            <p className="text-gray-600 mb-6">This helps us tailor recommendations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you currently pregnant?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateField("isPregnant", option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                        formData.isPregnant === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.isPregnant && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many weeks pregnant?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={formData.weeksPregnant || ""}
                    onChange={(e) => updateField("weeksPregnant", parseInt(e.target.value) || null)}
                    placeholder="e.g., 12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={formData.isPregnant === null}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 4: Smoking & Tobacco */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Smoking & Tobacco</h2>
            <p className="text-gray-600 mb-6">This affects many screening recommendations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Have you ever smoked cigarettes?
                </label>
                <div className="space-y-2">
                  {[
                    { value: "never", label: "Never smoked" },
                    { value: "former", label: "Former smoker" },
                    { value: "current", label: "Current smoker" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("smokingStatus", option.value as "never" | "former" | "current")}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 font-medium transition-all text-left",
                        formData.smokingStatus === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {(formData.smokingStatus === "former" || formData.smokingStatus === "current") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About how many years did you smoke?
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="80"
                      value={formData.smokingYears || ""}
                      onChange={(e) => updateField("smokingYears", parseInt(e.target.value) || null)}
                      placeholder="e.g., 10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About how many packs per day?
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      value={formData.packsPerDay || ""}
                      onChange={(e) => updateField("packsPerDay", parseFloat(e.target.value) || null)}
                      placeholder="e.g., 1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                  </div>

                  {formData.smokingStatus === "former" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What year did you quit?
                      </label>
                      <input
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={formData.quitYear || ""}
                        onChange={(e) => updateField("quitYear", parseInt(e.target.value) || null)}
                        placeholder={`e.g., ${new Date().getFullYear() - 2}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                      />
                    </div>
                  )}

                  {formData.smokingYears && formData.packsPerDay && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="text-sm text-amber-800">
                        <strong>Pack-years:</strong> {(formData.smokingYears * formData.packsPerDay).toFixed(1)}
                        <span className="text-xs ml-2">(years × packs/day)</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.smokingStatus}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 5: Alcohol Use */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Alcohol Use</h2>
            <p className="text-gray-600 mb-6">This helps determine counseling recommendations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How often do you drink alcohol?
                </label>
                <div className="space-y-2">
                  {[
                    { value: "never", label: "Never" },
                    { value: "monthly", label: "Monthly or less" },
                    { value: "weekly", label: "2-4 times per week" },
                    { value: "daily", label: "Daily or almost daily" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("alcoholFrequency", option.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 font-medium transition-all text-left",
                        formData.alcoholFrequency === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.alcoholFrequency && formData.alcoholFrequency !== "never" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    On days you drink, how many drinks do you typically have?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.drinksPerOccasion || ""}
                    onChange={(e) => updateField("drinksPerOccasion", parseInt(e.target.value) || null)}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    One drink = 12oz beer, 5oz wine, or 1.5oz spirits
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.alcoholFrequency}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 6: Sexual Activity & STI Risk */}
        {currentStep === 6 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sexual Health</h2>
            <p className="text-gray-600 mb-6">This helps determine HIV/STI screening recommendations.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you sexually active?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                    { value: null, label: "Prefer not to answer" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateField("sexuallyActive", option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm",
                        formData.sexuallyActive === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.sexuallyActive && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In the past 12 months, how many partners have you had?
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.partnersLast12Months ?? ""}
                      onChange={(e) => updateField("partnersLast12Months", parseInt(e.target.value) || null)}
                      placeholder="e.g., 1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Have you ever been diagnosed with an STI?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                        { value: null, label: "Prefer not to answer" },
                      ].map((option) => (
                        <button
                          key={String(option.value)}
                          type="button"
                          onClick={() => updateField("stiHistory", option.value)}
                          className={cn(
                            "px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm",
                            formData.stiHistory === option.value
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you believe you may be at increased risk for HIV?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                        { value: null, label: "Prefer not to answer" },
                      ].map((option) => (
                        <button
                          key={String(option.value)}
                          type="button"
                          onClick={() => updateField("hivRisk", option.value)}
                          className={cn(
                            "px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm",
                            formData.hivRisk === option.value
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 7: Medical Conditions */}
        {currentStep === 7 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Medical Conditions</h2>
            <p className="text-gray-600 mb-6">Have you ever been told you have any of the following?</p>

            <div className="space-y-2">
              {[
                { value: "diabetes", label: "Diabetes" },
                { value: "hypertension", label: "High blood pressure" },
                { value: "high_cholesterol", label: "High cholesterol" },
                { value: "heart_disease", label: "Heart disease or stroke" },
                { value: "hiv", label: "HIV" },
                { value: "cancer", label: "Any cancer" },
                { value: "chronic_kidney", label: "Chronic kidney disease" },
                { value: "immunocompromised", label: "Immunocompromised (chemo, transplant, long-term steroids)" },
              ].map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => toggleArrayItem("conditions", condition.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                    formData.conditions.includes(condition.value)
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      formData.conditions.includes(condition.value)
                        ? "border-sky-500 bg-sky-500"
                        : "border-gray-300"
                    )}
                  >
                    {formData.conditions.includes(condition.value) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700">{condition.label}</span>
                </button>
              ))}
            </div>

            {formData.conditions.includes("cancer") && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type(s) of cancer? (Optional)
                </label>
                <input
                  type="text"
                  value={formData.cancerTypes.join(", ")}
                  onChange={(e) => updateField("cancerTypes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g., breast, colon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 8: Family History */}
        {currentStep === 8 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Family History</h2>
            <p className="text-gray-600 mb-6">
              Has a parent, sibling, or child had any of the following?
            </p>

            <div className="space-y-2">
              {[
                { value: "colorectal_cancer", label: "Colorectal cancer" },
                { value: "breast_cancer", label: "Breast cancer" },
                { value: "prostate_cancer", label: "Prostate cancer" },
                { value: "ovarian_cancer", label: "Ovarian cancer" },
                { value: "early_heart_disease", label: "Heart attack or stroke at a young age (<55 men, <65 women)" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleArrayItem("familyHistory", item.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                    formData.familyHistory.includes(item.value)
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      formData.familyHistory.includes(item.value)
                        ? "border-sky-500 bg-sky-500"
                        : "border-gray-300"
                    )}
                  >
                    {formData.familyHistory.includes(item.value) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 9: Preventive History */}
        {currentStep === 9 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Preventive History</h2>
            <p className="text-gray-600 mb-6">
              Have you had any of these tests before? When was the most recent?
            </p>

            <div className="space-y-4">
              {[
                { field: "lastBloodPressure" as const, label: "Blood pressure check" },
                { field: "lastCholesterol" as const, label: "Cholesterol test" },
                { field: "lastDiabetesTest" as const, label: "Diabetes test" },
                { field: "lastColonoscopy" as const, label: "Colon cancer screening" },
                // Show cervical screening if female and hasn't had a hysterectomy (inferred cervix present)
                ...(formData.sexAtBirth === "female" && !formData.anatomyPresent.includes("hysterectomy") ? [
                  { field: "lastCervicalScreening" as const, label: "Cervical cancer screening (Pap)" },
                ] : []),
                ...(formData.sexAtBirth === "female" ? [
                  { field: "lastMammogram" as const, label: "Mammogram" },
                ] : []),
                { field: "lastHivTest" as const, label: "HIV test" },
                { field: "lastDepressionScreening" as const, label: "Depression screening" },
              ].map((test) => (
                <div key={test.field} className="bg-white rounded-xl border border-gray-200 p-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {test.label}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { value: "never", label: "Never" },
                      { value: "within_1_year", label: "< 1 year" },
                      { value: "1_3_years", label: "1-3 years" },
                      { value: "over_3_years", label: "> 3 years" },
                      { value: "not_sure", label: "Not sure" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField(test.field, option.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                          formData[test.field] === option.value
                            ? "border-sky-500 bg-sky-50 text-sky-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 10: Location & Coverage */}
        {currentStep === 10 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Location & Coverage</h2>
            <p className="text-gray-600 mb-6">This helps us find providers near you.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What ZIP code do you live in?
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={formData.zipCode}
                  onChange={(e) => updateField("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="e.g., 10001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Plan (Optional)
                </label>
                <input
                  type="text"
                  value={formData.insurancePlan}
                  onChange={(e) => updateField("insurancePlan", e.target.value)}
                  placeholder="e.g., Aetna PPO, Medicare"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information may already be linked from your initial 1A onboard.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 11: Care Logistics */}
        {currentStep === 11 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Care Logistics</h2>
            <p className="text-gray-600 mb-6">Help us make scheduling easier for you.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you currently have a primary care provider?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateField("hasPCP", option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                        formData.hasPCP === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you open to telehealth visits?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateField("openToTelehealth", option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                        formData.openToTelehealth === option.value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What days/times usually work best for appointments?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "weekday_morning", label: "Weekday mornings" },
                    { value: "weekday_afternoon", label: "Weekday afternoons" },
                    { value: "weekday_evening", label: "Weekday evenings" },
                    { value: "weekend", label: "Weekends" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleArrayItem("preferredAppointmentTimes", option.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left text-sm",
                        formData.preferredAppointmentTimes.includes(option.value)
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                          formData.preferredAppointmentTimes.includes(option.value)
                            ? "border-sky-500 bg-sky-500"
                            : "border-gray-300"
                        )}
                      >
                        {formData.preferredAppointmentTimes.includes(option.value) && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span className="text-gray-700">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl font-medium hover:from-sky-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Building your checklist...
                  </>
                ) : (
                  <>
                    Build My Checklist
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Screen 12: Confirmation & Processing */}
        {currentStep === 12 && (
          <div className="animate-fade-in text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your Checklist is Ready!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We've built your personalized preventive care checklist based on public medical guidelines and what you shared.
            </p>

            <div className="flex items-center justify-center gap-2 text-sky-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Redirecting to your health dashboard...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

