"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Check,
  CheckCheck,
  ArrowLeft,
  MessageCircle,
  Calendar,
  Pill,
  Heart,
  Apple,
  Activity,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Automated check-in questions that doctors can send to patients
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

interface PatientCheckIn {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  lastCheckIn: string;
  pendingQuestions: string[];
  responses: {
    questionId: string;
    answerId: string;
    timestamp: string;
  }[];
  requiresAttention: boolean;
}

const MOCK_PATIENT_CHECKINS: PatientCheckIn[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Dave Thompson",
    patientAvatar: "/images/patients/dave-thompson.jpg",
    lastCheckIn: "2 hours ago",
    pendingQuestions: ["feeling-today", "took-meds"],
    responses: [
      { questionId: "meds-working", answerId: "working-well", timestamp: "Yesterday" },
      { questionId: "diet-changes", answerId: "partially", timestamp: "2 days ago" },
    ],
    requiresAttention: true,
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Sarah Mitchell",
    patientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastCheckIn: "Today",
    pendingQuestions: [],
    responses: [
      { questionId: "feeling-today", answerId: "great", timestamp: "Today" },
      { questionId: "took-meds", answerId: "yes-all", timestamp: "Today" },
      { questionId: "activity-level", answerId: "very-active", timestamp: "Today" },
    ],
    requiresAttention: false,
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Michael Chen",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastCheckIn: "Yesterday",
    pendingQuestions: ["diet-changes", "activity-level", "symptoms"],
    responses: [
      { questionId: "feeling-today", answerId: "okay", timestamp: "Yesterday" },
    ],
    requiresAttention: true,
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Emily Rodriguez",
    patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastCheckIn: "3 days ago",
    pendingQuestions: ["feeling-today", "took-meds", "meds-working", "symptoms"],
    responses: [],
    requiresAttention: true,
  },
  {
    id: "5",
    patientId: "5",
    patientName: "James Wilson",
    patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastCheckIn: "Today",
    pendingQuestions: [],
    responses: [
      { questionId: "feeling-today", answerId: "good", timestamp: "Today" },
      { questionId: "took-meds", answerId: "yes-all", timestamp: "Today" },
      { questionId: "meds-working", answerId: "some-improvement", timestamp: "Today" },
      { questionId: "diet-changes", answerId: "yes-following", timestamp: "Today" },
    ],
    requiresAttention: false,
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

const MessagesContent = () => {
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient");

  const [patients] = useState<PatientCheckIn[]>(MOCK_PATIENT_CHECKINS);
  const [selectedPatient, setSelectedPatient] = useState<PatientCheckIn | null>(
    preselectedPatient
      ? MOCK_PATIENT_CHECKINS.find((p) => p.patientId === preselectedPatient) || null
      : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient: PatientCheckIn) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  const handleSendQuestion = (questionId: string) => {
    // In real app, this would send the question to the patient
    console.log("Sending question:", questionId, "to patient:", selectedPatient?.patientId);
    setShowQuestionSelector(false);
  };

  const getQuestionById = (id: string) => CHECK_IN_QUESTIONS.find((q) => q.id === id);
  const getOptionById = (questionId: string, optionId: string) => {
    const question = getQuestionById(questionId);
    return question?.options.find((o) => o.id === optionId);
  };

  return (
    <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* Patient List */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col",
            selectedPatient && "hidden md:flex"
          )}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Patient Check-ins</h2>
            <p className="text-sm text-gray-500 mb-3">Automated health monitoring</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left",
                  selectedPatient?.id === patient.id && "bg-sky-50"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={patient.patientAvatar}
                      alt={patient.patientName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {patient.requiresAttention && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {patient.patientName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {patient.pendingQuestions.length > 0 ? (
                      <span className="text-sm text-amber-600 font-medium">
                        {patient.pendingQuestions.length} pending response{patient.pendingQuestions.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        All caught up
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Detail / Check-in View */}
        {selectedPatient ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to patient list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={selectedPatient.patientAvatar}
                  alt={selectedPatient.patientName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {selectedPatient.patientName}
                </p>
                <p className="text-sm text-gray-500">Last check-in: {selectedPatient.lastCheckIn}</p>
              </div>
            </div>

            {/* Chat History Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {/* Combine pending questions and responses into a chat-style timeline */}
                {selectedPatient.responses.map((response, index) => {
                  const question = getQuestionById(response.questionId);
                  const option = getOptionById(response.questionId, response.answerId);
                  if (!question || !option) return null;
                  return (
                    <div key={`response-${index}`} className="space-y-3">
                      {/* Doctor's question - aligned right */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-lg bg-white/20">
                              {question.icon}
                            </div>
                            <span className="text-xs opacity-80">{question.category}</span>
                          </div>
                          <p className="font-medium">{question.question}</p>
                        </div>
                      </div>
                      {/* Patient's response - aligned left */}
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={selectedPatient.patientAvatar}
                            alt={selectedPatient.patientName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-[80%]">
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{option.emoji}</span>
                              <span className="font-medium text-gray-900">{option.label}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 ml-2">{response.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pending questions - shown as sent messages awaiting response */}
                {selectedPatient.pendingQuestions.map((questionId, index) => {
                  const question = getQuestionById(questionId);
                  if (!question) return null;
                  return (
                    <div key={`pending-${index}`} className="space-y-3">
                      {/* Doctor's question - aligned right */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 rounded-lg bg-white/20">
                              {question.icon}
                            </div>
                            <span className="text-xs opacity-80">{question.category}</span>
                          </div>
                          <p className="font-medium">{question.question}</p>
                        </div>
                      </div>
                      {/* Pending indicator */}
                      <div className="flex items-center gap-2 ml-10">
                        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span className="text-xs text-amber-600">Awaiting response...</span>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State */}
                {selectedPatient.pendingQuestions.length === 0 && selectedPatient.responses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                    <p className="text-gray-500 max-w-sm">
                      Send check-in questions to monitor this patient's health progress.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Send Check-in Button */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setShowQuestionSelector(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Send Check-in Question
              </button>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Automated Patient Check-ins
              </h3>
              <p className="text-gray-500 max-w-sm">
                Select a patient to view their check-in responses and send automated health monitoring questions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question Selector Modal */}
      {showQuestionSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuestionSelector(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Send Check-in Question</h3>
              <p className="text-sm text-gray-500">Select a question to send to {selectedPatient?.patientName}</p>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {CHECK_IN_QUESTIONS.map((question) => (
                <button
                  key={question.id}
                  onClick={() => handleSendQuestion(question.id)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left flex items-center gap-3"
                >
                  <div className={cn("p-2 rounded-lg", getCategoryColor(question.category))}>
                    {question.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question.question}</p>
                    <p className="text-sm text-gray-500 capitalize">{question.category}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowQuestionSelector(false)}
                className="w-full py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <div className="text-gray-500">Loading check-ins...</div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
