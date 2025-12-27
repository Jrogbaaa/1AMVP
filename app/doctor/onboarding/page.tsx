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
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Camera,
  MessageSquare,
  BookOpen,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoRecorder } from "@/components/VideoRecorder";

// Health system groups
const HEALTH_SYSTEM_GROUPS = [
  { id: "kaiser", name: "Kaiser Permanente", logo: "/images/kaiser-logo.png" },
  { id: "united", name: "United Healthcare", logo: "/images/united-healthcare-logo.svg" },
  { id: "bcbs", name: "Blue Cross Blue Shield", logo: null },
  { id: "aetna", name: "Aetna", logo: null },
  { id: "cigna", name: "Cigna", logo: null },
  { id: "humana", name: "Humana", logo: null },
  { id: "independent", name: "Independent Practice", logo: null },
  { id: "other", name: "Other", logo: null },
];

// Steps for the onboarding flow - updated with new steps
const STEPS = [
  {
    id: 1,
    title: "Practice Setup",
    description: "Set up your details",
    icon: Building2,
  },
  {
    id: 2,
    title: "Train AI Avatar",
    description: "Create your AI likeness",
    icon: UserCircle,
  },
  {
    id: 3,
    title: "Message Templates",
    description: "Set up quick messages",
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "Browse Videos",
    description: "Add to your library",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Invite Patients",
    description: "Share with patients",
    icon: Users,
  },
];

// 1A Video library for browsing step
const VIDEO_LIBRARY = [
  {
    id: "1a-1",
    title: "Heart Health Basics",
    description: "Essential information about cardiovascular health",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
    duration: "4:32",
    category: "Foundation",
  },
  {
    id: "1a-2",
    title: "Managing Stress for Heart Health",
    description: "Evidence-based techniques for stress management",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    duration: "5:30",
    category: "Lifestyle",
  },
  {
    id: "1a-3",
    title: "Understanding Blood Pressure",
    description: "What your numbers mean and how to improve them",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
    duration: "5:20",
    category: "Education",
  },
  {
    id: "1a-4",
    title: "Medication Guide",
    description: "How to take your heart medications properly",
    thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
    duration: "4:15",
    category: "Treatment",
  },
  {
    id: "1a-5",
    title: "Exercise After a Heart Event",
    description: "Safe ways to return to physical activity",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
    duration: "6:45",
    category: "Recovery",
  },
  {
    id: "1a-6",
    title: "Sodium and Your Heart",
    description: "How sodium affects your cardiovascular system",
    thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
    duration: "4:50",
    category: "Nutrition",
  },
];

// Default message template suggestions
const SUGGESTED_TEMPLATES = [
  { title: "Post-Visit Follow-Up", content: "Thank you for your visit today. I wanted to follow up and remind you to..." },
  { title: "Medication Reminder", content: "This is a friendly reminder to take your medications as prescribed..." },
  { title: "Wellness Check", content: "I hope you're doing well! I wanted to check in and see how you're feeling..." },
  { title: "Test Results Ready", content: "Your recent test results are in. Please log in to view them or schedule a call..." },
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
    healthSystemGroup: "",
  });
  
  // State for step 2
  const [avatarStatus, setAvatarStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");
  
  // State for step 3 - Message Templates
  const [messageTemplates, setMessageTemplates] = useState<{ id: string; title: string; content: string }[]>([]);
  const [newTemplateTitle, setNewTemplateTitle] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  
  // State for step 4 - Video Library
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  
  // State for step 5
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
    if (completedSteps.includes(stepId) || stepId === currentStep || stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  const isStepAccessible = (stepId: number) => {
    return completedSteps.includes(stepId) || stepId === currentStep || stepId <= Math.max(...completedSteps, 0) + 1;
  };

  // Add message template
  const handleAddTemplate = () => {
    if (newTemplateTitle.trim() && newTemplateContent.trim()) {
      setMessageTemplates([
        ...messageTemplates,
        {
          id: `template-${Date.now()}`,
          title: newTemplateTitle,
          content: newTemplateContent,
        },
      ]);
      setNewTemplateTitle("");
      setNewTemplateContent("");
    }
  };

  // Add suggested template
  const handleAddSuggestedTemplate = (template: typeof SUGGESTED_TEMPLATES[0]) => {
    setMessageTemplates([
      ...messageTemplates,
      {
        id: `template-${Date.now()}`,
        title: template.title,
        content: template.content,
      },
    ]);
  };

  // Remove template
  const handleRemoveTemplate = (id: string) => {
    setMessageTemplates(messageTemplates.filter(t => t.id !== id));
  };

  // Toggle video selection
  const handleToggleVideo = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
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
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-max">
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
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-sky-600 text-white ring-4 ring-sky-200"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-medium",
                          isCurrent ? "text-sky-600" : "text-gray-700"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 rounded-full min-w-[20px]",
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
                {/* Health System Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which group are you associated with?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HEALTH_SYSTEM_GROUPS.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setPracticeInfo({ ...practiceInfo, healthSystemGroup: group.id })}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-center",
                          practiceInfo.healthSystemGroup === group.id
                            ? "border-sky-500 bg-sky-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {group.logo ? (
                          <div className="h-8 flex items-center justify-center mb-2">
                            <Image
                              src={group.logo}
                              alt={group.name}
                              width={80}
                              height={32}
                              className="max-h-8 w-auto object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-8 flex items-center justify-center mb-2">
                            <Building2 className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-700">{group.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

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
                  Create Your AI Avatar
                </h2>
                <p className="text-gray-600">
                  Record a short video and we'll create a realistic AI avatar that looks and sounds like you.
                </p>
              </div>

              {avatarStatus === "not_started" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setAvatarStatus("in_progress")}
                    className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-700">
                          Record Here
                        </h3>
                        <p className="text-sm text-gray-600">
                          Use your webcam to record directly in this app.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-pink-600 font-medium">
                      <span>Start Recording</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <a
                    href="https://app.heygen.com/avatars/create-instant-avatar?listAccessType=any"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50/50 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-violet-100 rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Wand2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-violet-700">
                          Use HeyGen Studio
                        </h3>
                        <p className="text-sm text-gray-600">
                          Access advanced tools on HeyGen for professional avatars.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-violet-600 font-medium">
                      <span>Open HeyGen</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </div>
              )}

              {avatarStatus === "in_progress" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setAvatarStatus("not_started")}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to options
                  </button>
                  <VideoRecorder
                    maxDuration={180}
                    onAvatarCreated={(avatarId) => {
                      console.log("Avatar created:", avatarId);
                      setAvatarStatus("completed");
                    }}
                  />
                </div>
              )}

              {avatarStatus === "completed" && (
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-800 text-lg">Avatar Created Successfully!</h3>
                      <p className="text-sm text-emerald-700">
                        Your AI avatar is ready. You can now create personalized videos.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAvatarStatus("not_started")}
                    className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Create a different avatar
                  </button>
                </div>
              )}

              {avatarStatus === "not_started" && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Recording Tips:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Good lighting on your face
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Quiet environment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Look directly at the camera
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      Professional attire
                    </li>
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-500 text-center">
                Don't have time now? You can skip this step and complete it later.
              </p>
            </div>
          )}

          {/* Step 3: Message Templates */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Set Up Message Templates
                </h2>
                <p className="text-gray-600">
                  Are there any consistent messages you like to send to patients? Create templates to quickly send them later.
                </p>
              </div>

              {/* Suggested Templates */}
              {messageTemplates.length === 0 && (
                <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Start - Add Suggested Templates</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {SUGGESTED_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddSuggestedTemplate(template)}
                        className="p-3 bg-white rounded-lg border border-sky-200 hover:border-sky-400 transition-all text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Plus className="w-4 h-4 text-sky-600" />
                          <span className="font-medium text-gray-900 text-sm">{template.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Templates */}
              {messageTemplates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Your Templates ({messageTemplates.length})</h4>
                  {messageTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3"
                    >
                      <MessageSquare className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900">{template.title}</h5>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveTemplate(template.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Template */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Add Custom Template</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      placeholder="e.g., Post-Visit Follow-Up"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message Content
                    </label>
                    <textarea
                      value={newTemplateContent}
                      onChange={(e) => setNewTemplateContent(e.target.value)}
                      placeholder="Type your message template here..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={handleAddTemplate}
                    disabled={!newTemplateTitle.trim() || !newTemplateContent.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Template
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                You can add more templates later from Settings.
              </p>
            </div>
          )}

          {/* Step 4: Browse Videos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Browse 1A Video Library
                </h2>
                <p className="text-gray-600">
                  Add relevant videos to your collection. You can clone them with your AI avatar later.
                </p>
              </div>

              <div className="flex items-center justify-between bg-sky-50 rounded-xl p-4 border border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Film className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedVideos.size} videos selected</p>
                    <p className="text-sm text-gray-600">These will be added to your library</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VIDEO_LIBRARY.map((video) => {
                  const isSelected = selectedVideos.has(video.id);
                  return (
                    <button
                      key={video.id}
                      onClick={() => handleToggleVideo(video.id)}
                      className={cn(
                        "rounded-xl overflow-hidden border-2 transition-all text-left",
                        isSelected
                          ? "border-sky-500 ring-2 ring-sky-200"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="relative aspect-video bg-gray-200">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 text-gray-700 text-xs rounded-full font-medium">
                          {video.category}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{video.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{video.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 text-center">
                You can browse and add more videos from your dashboard anytime.
              </p>
            </div>
          )}

          {/* Step 5: Invite Patients */}
          {currentStep === 5 && (
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
