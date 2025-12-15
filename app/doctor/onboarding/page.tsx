"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building2,
  Stethoscope,
  Mail,
  Phone,
  Upload,
  Video,
  UserCircle,
  Wand2,
  ExternalLink,
  Film,
  Send,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Steps for the onboarding flow
const STEPS = [
  {
    id: 1,
    title: "Practice Setup",
    description: "Set up your medical practice details",
    icon: Building2,
  },
  {
    id: 2,
    title: "Train AI Avatar",
    description: "Create your AI likeness with HeyGen",
    icon: UserCircle,
  },
  {
    id: 3,
    title: "Create First Video",
    description: "Personalize your first chapter",
    icon: Film,
  },
  {
    id: 4,
    title: "Invite Patients",
    description: "Share content with your patients",
    icon: Users,
  },
];

// Template chapters for step 3
const TEMPLATE_CHAPTERS = [
  {
    id: "1",
    title: "Welcome to Your Care",
    description: "Introduction video for new patients",
    duration: "2:30",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Understanding Your Diagnosis",
    description: "General overview of heart health",
    duration: "3:45",
    thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Medication Guide",
    description: "How to take your prescribed medications",
    duration: "4:00",
    thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&q=80",
  },
];

export default function DoctorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Form state for step 1
  const [practiceInfo, setPracticeInfo] = useState({
    clinicName: "",
    specialty: "Cardiology",
    email: "",
    phone: "",
    address: "",
  });
  
  // State for step 2
  const [avatarStatus, setAvatarStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  
  // State for step 3
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // State for step 4
  const [patientEmails, setPatientEmails] = useState("");

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current/next step
    if (completedSteps.includes(stepId) || stepId === currentStep || stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  const isStepAccessible = (stepId: number) => {
    return completedSteps.includes(stepId) || stepId === currentStep || stepId <= Math.max(...completedSteps, 0) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-sky-500 to-violet-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Onboarding</h1>
                <p className="text-sm text-gray-500">Get started with 1Another</p>
              </div>
            </div>
            <Link
              href="/doctor"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Skip for now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = isStepAccessible(step.id);
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className={cn(
                      "flex flex-col items-center gap-2 group transition-all",
                      isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-sky-600 text-white ring-4 ring-sky-200"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isCurrent ? "text-sky-600" : "text-gray-700"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 rounded-full",
                        completedSteps.includes(step.id)
                          ? "bg-emerald-500"
                          : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          {/* Step 1: Practice Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Set Up Your Practice
                </h2>
                <p className="text-gray-600">
                  Tell us about your medical practice so we can personalize your experience.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic / Practice Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={practiceInfo.clinicName}
                      onChange={(e) =>
                        setPracticeInfo({ ...practiceInfo, clinicName: e.target.value })
                      }
                      placeholder="e.g., Heart Health Clinic"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={practiceInfo.specialty}
                      onChange={(e) =>
                        setPracticeInfo({ ...practiceInfo, specialty: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Primary Care">Primary Care</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={practiceInfo.email}
                        onChange={(e) =>
                          setPracticeInfo({ ...practiceInfo, email: e.target.value })
                        }
                        placeholder="doctor@clinic.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={practiceInfo.phone}
                        onChange={(e) =>
                          setPracticeInfo({ ...practiceInfo, phone: e.target.value })
                        }
                        placeholder="(555) 555-5555"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Logo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Train AI Avatar */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Train Your AI Avatar
                </h2>
                <p className="text-gray-600">
                  Create a realistic AI avatar that looks and sounds like you using HeyGen.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white flex-shrink-0">
                    <UserCircle className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How HeyGen Works
                    </h3>
                    <ol className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          1
                        </span>
                        <span>Record a 2-3 minute video of yourself speaking naturally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          2
                        </span>
                        <span>Upload to HeyGen to train your AI avatar (takes ~24 hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          3
                        </span>
                        <span>Once trained, your avatar can speak any text in your voice and likeness</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recording Tips:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Good lighting (face the window or use ring light)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Quiet environment with minimal background noise
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Look directly at the camera
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Speak naturally and vary your expressions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Wear professional attire (lab coat recommended)
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.heygen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg"
                >
                  <Wand2 className="w-5 h-5" />
                  Go to HeyGen
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setAvatarStatus("completed")}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all",
                    avatarStatus === "completed"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {avatarStatus === "completed" ? (
                    <>
                      <Check className="w-5 h-5" />
                      Avatar Training Complete
                    </>
                  ) : (
                    "I've Completed Training"
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Don't have time now? You can skip this step and complete it later from your dashboard.
              </p>
            </div>
          )}

          {/* Step 3: Create First Video */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your First Video
                </h2>
                <p className="text-gray-600">
                  Select a template chapter to personalize with your AI avatar.
                </p>
              </div>

              <div className="space-y-4">
                {TEMPLATE_CHAPTERS.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedTemplate(chapter.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      selectedTemplate === chapter.id
                        ? "border-sky-500 bg-sky-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={chapter.thumbnail}
                        alt={chapter.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                        {chapter.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                      <p className="text-sm text-gray-500">{chapter.description}</p>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        selectedTemplate === chapter.id
                          ? "border-sky-500 bg-sky-500"
                          : "border-gray-300"
                      )}
                    >
                      {selectedTemplate === chapter.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="bg-violet-50 rounded-xl p-6 border border-violet-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Film className="w-6 h-6 text-violet-600" />
                    <h4 className="font-semibold text-gray-900">Preview & Customize</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your AI avatar will be applied to this template. You can customize the script
                    and add personal touches.
                  </p>
                  <Link
                    href="/doctor/create-chapters"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Customize Video
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Invite Patients */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Invite Your Patients
                </h2>
                <p className="text-gray-600">
                  Share your personalized health content with your patients.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Email Addresses
                  </label>
                  <textarea
                    value={patientEmails}
                    onChange={(e) => setPatientEmails(e.target.value)}
                    placeholder="Enter email addresses, one per line"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Patients will receive a magic link to access their personalized content
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Other ways to invite:</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Bulk Import CSV</p>
                        <p className="text-sm text-gray-500">Upload a list of patients</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Send SMS Invites</p>
                        <p className="text-sm text-gray-500">Text magic links to patients</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900">You're all set!</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Once you send invites, your patients will receive personalized health content
                  from you. You can track their engagement from your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === STEPS.length ? (
              <Link
                href="/doctor"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-violet-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-violet-700 transition-all shadow-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

