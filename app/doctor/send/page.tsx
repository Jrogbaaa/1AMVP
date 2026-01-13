"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Check,
  X,
  Play,
  Users,
  Clock,
  Send,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Mail,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  Heart,
  Pill,
  Apple,
  Activity,
  Calendar,
  Sparkles,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  chapterId: string;
  chapterTitle: string;
}

interface Chapter {
  id: string;
  title: string;
  videos: VideoItem[];
}

// Check-in questions (reused from messages page)
interface CheckInQuestion {
  id: string;
  category: "wellness" | "medication" | "diet" | "activity" | "follow-up";
  question: string;
  icon: React.ReactNode;
  options: { id: string; label: string; emoji: string }[];
}

const CHECK_IN_QUESTIONS: CheckInQuestion[] = [
  {
    id: "feeling-today",
    category: "wellness",
    question: "How are you feeling today?",
    icon: <Heart className="w-5 h-5" />,
    options: [
      { id: "great", label: "Great", emoji: "😊" },
      { id: "good", label: "Good", emoji: "🙂" },
      { id: "okay", label: "Okay", emoji: "😐" },
      { id: "not-great", label: "Not Great", emoji: "😔" },
    ],
  },
  {
    id: "took-meds",
    category: "medication",
    question: "Did you take your medications today?",
    icon: <Pill className="w-5 h-5" />,
    options: [
      { id: "yes-all", label: "Yes, all of them", emoji: "✅" },
      { id: "yes-some", label: "Yes, some of them", emoji: "🔶" },
      { id: "no-forgot", label: "No, I forgot", emoji: "😅" },
      { id: "no-side-effects", label: "No, side effects", emoji: "⚠️" },
    ],
  },
  {
    id: "meds-working",
    category: "medication",
    question: "How are your medications working?",
    icon: <Pill className="w-5 h-5" />,
    options: [
      { id: "working-well", label: "Working well", emoji: "👍" },
      { id: "some-improvement", label: "Some improvement", emoji: "📈" },
      { id: "no-change", label: "No change yet", emoji: "🤔" },
      { id: "side-effects", label: "Having side effects", emoji: "💬" },
    ],
  },
  {
    id: "diet-changes",
    category: "diet",
    question: "Have you made changes to your diet?",
    icon: <Apple className="w-5 h-5" />,
    options: [
      { id: "yes-following", label: "Yes, following plan", emoji: "🥗" },
      { id: "partially", label: "Partially", emoji: "🍽️" },
      { id: "struggling", label: "Struggling to change", emoji: "😅" },
      { id: "need-guidance", label: "Need more guidance", emoji: "📚" },
    ],
  },
  {
    id: "activity-level",
    category: "activity",
    question: "How active have you been this week?",
    icon: <Activity className="w-5 h-5" />,
    options: [
      { id: "very-active", label: "Very active", emoji: "🏃" },
      { id: "moderately", label: "Moderately active", emoji: "🚶" },
      { id: "light", label: "Light activity", emoji: "🧘" },
      { id: "sedentary", label: "Not much movement", emoji: "🛋️" },
    ],
  },
  {
    id: "symptoms",
    category: "wellness",
    question: "Any new symptoms to report?",
    icon: <Heart className="w-5 h-5" />,
    options: [
      { id: "no-symptoms", label: "No new symptoms", emoji: "✨" },
      { id: "mild", label: "Mild symptoms", emoji: "🤏" },
      { id: "moderate", label: "Moderate symptoms", emoji: "⚠️" },
      { id: "severe", label: "Severe symptoms", emoji: "🚨" },
    ],
  },
  {
    id: "schedule-followup",
    category: "follow-up",
    question: "Ready to schedule your follow-up?",
    icon: <Calendar className="w-5 h-5" />,
    options: [
      { id: "yes-schedule", label: "Yes, schedule now", emoji: "📅" },
      { id: "need-time", label: "Need to check calendar", emoji: "🗓️" },
      { id: "later", label: "Remind me later", emoji: "⏰" },
      { id: "questions", label: "Have questions first", emoji: "❓" },
    ],
  },
];

// Reminder templates
interface ReminderTemplate {
  id: string;
  title: string;
  description: string;
  timing: string;
}

const REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: "medication",
    title: "Take Medications",
    description: "Daily reminder to take prescribed medications",
    timing: "Daily at 9:00 AM",
  },
  {
    id: "blood-pressure",
    title: "Check Blood Pressure",
    description: "Reminder to check and log blood pressure readings",
    timing: "Daily at 8:00 AM",
  },
  {
    id: "appointment",
    title: "Upcoming Appointment",
    description: "Reminder about scheduled follow-up appointment",
    timing: "1 day before",
  },
  {
    id: "exercise",
    title: "Physical Activity",
    description: "Reminder to complete daily exercise routine",
    timing: "Daily at 6:00 PM",
  },
  {
    id: "hydration",
    title: "Stay Hydrated",
    description: "Reminder to drink water throughout the day",
    timing: "Every 2 hours",
  },
  {
    id: "lab-work",
    title: "Lab Work Due",
    description: "Reminder for upcoming lab tests",
    timing: "3 days before",
  },
];

const getCategoryColor = (category: CheckInQuestion["category"]) => {
  switch (category) {
    case "wellness":
      return "bg-rose-100 text-rose-600";
    case "medication":
      return "bg-blue-100 text-blue-600";
    case "diet":
      return "bg-green-100 text-green-600";
    case "activity":
      return "bg-orange-100 text-orange-600";
    case "follow-up":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Dave Thompson",
    email: "dave.t@email.com",
    avatarUrl: "/images/patients/dave-thompson.jpg",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "7",
    name: "Robert Martinez",
    email: "r.martinez@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "j.taylor@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  },
];

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "1",
    title: "Heart Health Basics",
    videos: [
      { id: "v1-1", title: "Understanding Your Heart", duration: "4:32", thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=113&fit=crop", chapterId: "1", chapterTitle: "Heart Health Basics" },
      { id: "v1-2", title: "Heart Rate & Rhythm", duration: "3:45", thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=113&fit=crop", chapterId: "1", chapterTitle: "Heart Health Basics" },
      { id: "v1-3", title: "Signs of a Healthy Heart", duration: "5:10", thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=113&fit=crop", chapterId: "1", chapterTitle: "Heart Health Basics" },
    ],
  },
  {
    id: "2",
    title: "Blood Pressure Management",
    videos: [
      { id: "v2-1", title: "Reading Blood Pressure Numbers", duration: "3:20", thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=113&fit=crop", chapterId: "2", chapterTitle: "Blood Pressure Management" },
      { id: "v2-2", title: "Home Monitoring Tips", duration: "4:15", thumbnailUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=113&fit=crop", chapterId: "2", chapterTitle: "Blood Pressure Management" },
    ],
  },
  {
    id: "3",
    title: "Diet & Nutrition",
    videos: [
      { id: "v3-1", title: "Heart-Healthy Foods", duration: "5:45", thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=113&fit=crop", chapterId: "3", chapterTitle: "Diet & Nutrition" },
      { id: "v3-2", title: "Foods to Limit or Avoid", duration: "4:30", thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=113&fit=crop", chapterId: "3", chapterTitle: "Diet & Nutrition" },
      { id: "v3-3", title: "Meal Planning Tips", duration: "6:00", thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=113&fit=crop", chapterId: "3", chapterTitle: "Diet & Nutrition" },
    ],
  },
  {
    id: "4",
    title: "Exercise & Physical Activity",
    videos: [
      { id: "v4-1", title: "Starting a Safe Exercise Routine", duration: "5:15", thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=113&fit=crop", chapterId: "4", chapterTitle: "Exercise & Physical Activity" },
      { id: "v4-2", title: "Low-Impact Cardio Exercises", duration: "7:20", thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=113&fit=crop", chapterId: "4", chapterTitle: "Exercise & Physical Activity" },
    ],
  },
  {
    id: "5",
    title: "Medication Management",
    videos: [
      { id: "v5-1", title: "Understanding Your Medications", duration: "6:30", thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=113&fit=crop", chapterId: "5", chapterTitle: "Medication Management" },
      { id: "v5-2", title: "Managing Side Effects", duration: "4:45", thumbnailUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=113&fit=crop", chapterId: "5", chapterTitle: "Medication Management" },
      { id: "v5-3", title: "Medication Reminders & Tips", duration: "3:15", thumbnailUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=113&fit=crop", chapterId: "5", chapterTitle: "Medication Management" },
    ],
  },
];

const SendContentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedPatientId = searchParams.get("patient");
  const preselectedChapterId = searchParams.get("chapter");
  const preselectedVideoId = searchParams.get("video");

  // When coming from patient profile, skip patient selection
  const isFromPatientProfile = !!preselectedPatientId;
  const hasPreselectedVideo = !!preselectedVideoId || !!preselectedChapterId;
  
  // New 4-step flow: 1 = Patients, 2 = Videos, 3 = Check-in/Message, 4 = Review & Send
  // For patient profile flow: step 1 = Videos, step 2 = Check-in/Message, step 3 = Review & Send (skip patient selection)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(
    preselectedPatientId ? new Set([preselectedPatientId]) : new Set()
  );
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(() => {
    if (preselectedVideoId) {
      return new Set([preselectedVideoId]);
    }
    if (preselectedChapterId) {
      const chapter = MOCK_CHAPTERS.find((c) => c.id === preselectedChapterId);
      return new Set(chapter?.videos.map((v) => v.id) || []);
    }
    return new Set();
  });
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    // Auto-expand chapters containing preselected videos
    if (preselectedVideoId) {
      const chapter = MOCK_CHAPTERS.find((c) => c.videos.some(v => v.id === preselectedVideoId));
      return new Set(chapter ? [chapter.id] : ["1"]);
    }
    if (preselectedChapterId) {
      return new Set([preselectedChapterId]);
    }
    return new Set(["1"]);
  });
  const [patientSearch, setPatientSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [selectedCheckIns, setSelectedCheckIns] = useState<Set<string>>(new Set());
  const [selectedReminders, setSelectedReminders] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredChapters = MOCK_CHAPTERS.filter(
    (c) =>
      c.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
      c.videos.some((v) => v.title.toLowerCase().includes(contentSearch.toLowerCase()))
  );

  const handleTogglePatient = (patientId: string) => {
    setSelectedPatients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(patientId)) {
        newSet.delete(patientId);
      } else {
        newSet.add(patientId);
      }
      return newSet;
    });
  };

  const handleSelectAllPatients = () => {
    if (selectedPatients.size === filteredPatients.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(filteredPatients.map((p) => p.id)));
    }
  };

  const handleToggleVideo = (videoId: string) => {
    setSelectedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleToggleChapterExpand = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handleSelectEntireChapter = (chapter: Chapter) => {
    const allSelected = chapter.videos.every((v) => selectedVideos.has(v.id));
    setSelectedVideos((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        chapter.videos.forEach((v) => newSet.delete(v.id));
      } else {
        chapter.videos.forEach((v) => newSet.add(v.id));
      }
      return newSet;
    });
  };

  const handleToggleCheckIn = (questionId: string) => {
    setSelectedCheckIns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleToggleReminder = (reminderId: string) => {
    setSelectedReminders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reminderId)) {
        newSet.delete(reminderId);
      } else {
        newSet.add(reminderId);
      }
      return newSet;
    });
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    setSendSuccess(true);
  };

  const selectedPatientsList = MOCK_PATIENTS.filter((p) => selectedPatients.has(p.id));
  const selectedVideosList = MOCK_CHAPTERS.flatMap((c) =>
    c.videos.filter((v) => selectedVideos.has(v.id))
  );
  const selectedCheckInsList = CHECK_IN_QUESTIONS.filter((q) => selectedCheckIns.has(q.id));
  const selectedRemindersList = REMINDER_TEMPLATES.filter((r) => selectedReminders.has(r.id));

  // Calculate actual step number accounting for patient profile flow
  const getDisplayStep = () => {
    if (isFromPatientProfile) {
      // Map internal steps to display: 1->1, 2->2, 3->3, 4->3
      if (step === 1) return 1; // Videos
      if (step === 2) return 2; // Check-in/Message
      return 3; // Review & Send
    }
    return step;
  };

  // Get the actual step for display purposes
  const getTotalSteps = () => isFromPatientProfile ? 3 : 4;
  
  // Navigate between steps based on flow type
  const handleNextStep = () => {
    if (isFromPatientProfile) {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(4);
    } else {
      if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    if (isFromPatientProfile) {
      if (step === 2) setStep(1);
      else if (step === 4) setStep(2);
    } else {
      if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  if (sendSuccess) {
    const hasVideos = selectedVideosList.length > 0;
    const hasCheckIns = selectedCheckInsList.length > 0;
    const hasReminders = selectedRemindersList.length > 0;
    const hasMessage = personalMessage.trim().length > 0;
    
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Content Sent Successfully!
        </h1>
        <p className="text-gray-500 mb-8">
          {hasVideos && `${selectedVideosList.length} video${selectedVideosList.length !== 1 ? "s" : ""}`}
          {hasVideos && (hasCheckIns || hasReminders || hasMessage) && ", "}
          {hasCheckIns && `${selectedCheckInsList.length} check-in${selectedCheckInsList.length !== 1 ? "s" : ""}`}
          {hasCheckIns && (hasReminders || hasMessage) && ", "}
          {hasReminders && `${selectedRemindersList.length} reminder${selectedRemindersList.length !== 1 ? "s" : ""}`}
          {hasReminders && hasMessage && ", "}
          {hasMessage && "a message"}
          {` sent to ${selectedPatientsList.length} patient${selectedPatientsList.length !== 1 ? "s" : ""}. They will receive a notification shortly.`}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/doctor/patients"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            View Patients
          </Link>
          <button
            onClick={() => {
              setSendSuccess(false);
              setStep(1);
              setSelectedPatients(new Set());
              setSelectedVideos(new Set());
              setSelectedCheckIns(new Set());
              setSelectedReminders(new Set());
              setPersonalMessage("");
            }}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all"
          >
            Send More
          </button>
        </div>
      </div>
    );
  }

  // Render step labels based on flow type
  const getStepLabels = () => {
    if (isFromPatientProfile) {
      return ["Add Video", "Add Check-in/Message", "Send"];
    }
    return ["Pick Patient", "Add Video", "Add Check-in/Message", "Send"];
  };

  const stepLabels = getStepLabels();
  const totalSteps = getTotalSteps();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/doctor"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Send to Patients</h1>
        <p className="text-gray-500 mt-1">
          Select patients to send personalized messages, check-ins, and health content
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          let isCurrentStep = false;
          let isCompleted = false;
          
          if (isFromPatientProfile) {
            // Map display step to internal step
            const internalStep = step === 4 ? 3 : step;
            isCurrentStep = stepNum === internalStep;
            isCompleted = stepNum < internalStep;
          } else {
            isCurrentStep = stepNum === step;
            isCompleted = stepNum < step;
          }
          
          return (
            <div
              key={stepNum}
              className="flex items-center gap-3 flex-1"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                  isCurrentStep
                    ? "bg-sky-600 text-white"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "font-medium text-sm hidden sm:block",
                  isCurrentStep ? "text-gray-900" : "text-gray-400"
                )}
              >
                {label}
              </span>
              {stepNum < totalSteps && (
                <div className="flex-1 h-0.5 bg-gray-200 hidden sm:block">
                  <div
                    className={cn(
                      "h-full bg-emerald-500 transition-all",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Patients - Only shown when NOT from patient profile */}
      {step === 1 && !isFromPatientProfile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pick Patient</h2>
              <button
                onClick={handleSelectAllPatients}
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                {selectedPatients.size === filteredPatients.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleTogglePatient(patient.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left",
                  selectedPatients.has(patient.id) && "bg-sky-50"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                    selectedPatients.has(patient.id)
                      ? "bg-sky-600 border-sky-600"
                      : "border-gray-300"
                  )}
                >
                  {selectedPatients.has(patient.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={patient.avatarUrl}
                    alt={patient.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={selectedPatients.size === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Videos (or Step 1 when from patient profile) */}
      {((step === 2 && !isFromPatientProfile) || (step === 1 && isFromPatientProfile)) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Video</h2>
              <p className="text-sm text-gray-500">
                {selectedVideos.size} video{selectedVideos.size !== 1 ? "s" : ""} selected
              </p>
            </div>
            {hasPreselectedVideo && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-sm text-emerald-700">
                  <CheckCircle className="w-4 h-4 inline-block mr-1" />
                  Video preselected from your library. You can add more videos below.
                </p>
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chapters or videos..."
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {filteredChapters.map((chapter) => {
              const isExpanded = expandedChapters.has(chapter.id);
              const selectedCount = chapter.videos.filter((v) => selectedVideos.has(v.id)).length;
              const allSelected = selectedCount === chapter.videos.length;

              return (
                <div key={chapter.id} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => handleToggleChapterExpand(chapter.id)}
                      className="p-1 mr-2"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSelectEntireChapter(chapter)}
                      className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors mr-3",
                        allSelected
                          ? "bg-sky-600 border-sky-600"
                          : selectedCount > 0
                          ? "bg-sky-100 border-sky-400"
                          : "border-gray-300"
                      )}
                    >
                      {allSelected ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : selectedCount > 0 ? (
                        <div className="w-2 h-2 bg-sky-600 rounded-sm" />
                      ) : null}
                    </button>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{chapter.title}</p>
                      <p className="text-sm text-gray-500">
                        {chapter.videos.length} videos • {selectedCount} selected
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pl-12 pr-4 pb-4 space-y-2">
                      {chapter.videos.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => handleToggleVideo(video.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                            selectedVideos.has(video.id)
                              ? "bg-sky-50 border border-sky-200"
                              : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0",
                              selectedVideos.has(video.id)
                                ? "bg-sky-600 border-sky-600"
                                : "border-gray-300"
                            )}
                          >
                            {selectedVideos.has(video.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-200">
                            <Image
                              src={video.thumbnailUrl}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-4 h-4 text-white" fill="white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">
                              {video.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{video.duration}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => isFromPatientProfile ? router.back() : setStep(1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              {isFromPatientProfile ? "Cancel" : "Back"}
            </button>
            <div className="flex items-center gap-3">
              {selectedVideos.size === 0 && (
                <button
                  onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Skip Videos
                </button>
              )}
              <button
                onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                disabled={selectedVideos.size === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Add Check-in or Message (or Step 2 when from patient profile) */}
      {((step === 3 && !isFromPatientProfile) || (step === 2 && isFromPatientProfile)) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add Check-in or Message</h2>
            <p className="text-sm text-gray-500">Send check-in questions and/or a personal message to your patients</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Check-in Questions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-gray-900">Check-in Questions</h3>
                <span className="text-sm text-gray-500">
                  ({selectedCheckIns.size} selected)
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {CHECK_IN_QUESTIONS.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleToggleCheckIn(question.id)}
                    className={cn(
                      "p-4 rounded-xl transition-colors text-left flex items-start gap-3",
                      selectedCheckIns.has(question.id)
                        ? "bg-sky-50 border-2 border-sky-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5",
                        selectedCheckIns.has(question.id)
                          ? "bg-sky-600 border-sky-600"
                          : "border-gray-300"
                      )}
                    >
                      {selectedCheckIns.has(question.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn("p-1.5 rounded-lg", getCategoryColor(question.category))}>
                          {question.icon}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{question.category}</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{question.question}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Reminders</h3>
                <span className="text-sm text-gray-500">
                  ({selectedReminders.size} selected)
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                {REMINDER_TEMPLATES.map((reminder) => (
                  <button
                    key={reminder.id}
                    onClick={() => handleToggleReminder(reminder.id)}
                    className={cn(
                      "p-4 rounded-xl transition-colors text-left flex items-start gap-3",
                      selectedReminders.has(reminder.id)
                        ? "bg-amber-50 border-2 border-amber-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5",
                        selectedReminders.has(reminder.id)
                          ? "bg-amber-600 border-amber-600"
                          : "border-gray-300"
                      )}
                    >
                      {selectedReminders.has(reminder.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{reminder.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{reminder.timing}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Personal Message</h3>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Add a personal note to accompany your content..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                This message will be included in the notification sent to patients.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => isFromPatientProfile ? setStep(1) : setStep(2)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all"
            >
              Review & Send
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Send */}
      {step === 4 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selected Items Summary */}
          <div className="space-y-6">
            {/* Videos Summary */}
            {selectedVideosList.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-gray-900">
                      {selectedVideosList.length} Video{selectedVideosList.length !== 1 ? "s" : ""}
                    </h3>
                  </div>
                  <button
                    onClick={() => isFromPatientProfile ? setStep(1) : setStep(2)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-100">
                  {selectedVideosList.map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-4">
                      <div className="w-16 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-200">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500">{video.chapterTitle}</p>
                      </div>
                      <span className="text-xs text-gray-400">{video.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-500">No Videos</h3>
                  </div>
                  <button
                    onClick={() => isFromPatientProfile ? setStep(1) : setStep(2)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Add Videos
                  </button>
                </div>
              </div>
            )}

            {/* Check-ins Summary */}
            {selectedCheckInsList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900">
                      {selectedCheckInsList.length} Check-in{selectedCheckInsList.length !== 1 ? "s" : ""}
                    </h3>
                  </div>
                  <button
                    onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {selectedCheckInsList.map((question) => (
                    <div key={question.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={cn("p-1.5 rounded-lg", getCategoryColor(question.category))}>
                        {question.icon}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{question.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders Summary */}
            {selectedRemindersList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">
                      {selectedRemindersList.length} Reminder{selectedRemindersList.length !== 1 ? "s" : ""}
                    </h3>
                  </div>
                  <button
                    onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {selectedRemindersList.map((reminder) => (
                    <div key={reminder.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                        <p className="text-xs text-gray-500">{reminder.timing}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Summary */}
            {personalMessage.trim() && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-gray-900">Personal Message</h3>
                  </div>
                  <button
                    onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{personalMessage}</p>
                </div>
              </div>
            )}

            {/* Patients Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  <h3 className="font-semibold text-gray-900">
                    {selectedPatientsList.length} Patient{selectedPatientsList.length !== 1 ? "s" : ""}
                  </h3>
                </div>
                {!isFromPatientProfile && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {selectedPatientsList.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={patient.avatarUrl}
                        alt={patient.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {patient.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Send Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Send className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ready to Send</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedVideosList.length > 0 && `${selectedVideosList.length} video${selectedVideosList.length !== 1 ? "s" : ""}`}
                    {selectedVideosList.length > 0 && (selectedCheckInsList.length > 0 || selectedRemindersList.length > 0 || personalMessage.trim()) && ", "}
                    {selectedCheckInsList.length > 0 && `${selectedCheckInsList.length} check-in${selectedCheckInsList.length !== 1 ? "s" : ""}`}
                    {selectedCheckInsList.length > 0 && (selectedRemindersList.length > 0 || personalMessage.trim()) && ", "}
                    {selectedRemindersList.length > 0 && `${selectedRemindersList.length} reminder${selectedRemindersList.length !== 1 ? "s" : ""}`}
                    {selectedRemindersList.length > 0 && personalMessage.trim() && ", "}
                    {personalMessage.trim() && "a message"}
                    {` will be sent to ${selectedPatientsList.length} patient${selectedPatientsList.length !== 1 ? "s" : ""}.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => isFromPatientProfile ? setStep(2) : setStep(3)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || (selectedVideosList.length === 0 && selectedCheckInsList.length === 0 && selectedRemindersList.length === 0 && !personalMessage.trim())}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p>
                Patients will receive an email notification with a link to view their personalized content and respond to check-ins.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SendPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-16 text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <SendContentPage />
    </Suspense>
  );
}
