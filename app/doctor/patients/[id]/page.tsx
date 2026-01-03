"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Play,
  Eye,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Video,
  MoreVertical,
  Heart,
  Pill,
  Activity,
  Apple,
  AlertCircle,
  ChevronRight,
  Plus,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock patient data - in production this would come from Convex
const MOCK_PATIENTS: Record<string, {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: "active" | "inactive" | "completed";
  videosWatched: number;
  totalVideos: number;
  lastActivity: string;
  joinedDate: string;
  healthSystemGroup: string;
  dateOfBirth: string;
  assignedChapters: string[];
  completedChapters: string[];
}> = {
  "1": {
    id: "1",
    name: "Dave Thompson",
    email: "dave.t@email.com",
    phone: "(555) 123-4567",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    status: "active",
    videosWatched: 8,
    totalVideos: 10,
    lastActivity: "2 minutes ago",
    joinedDate: "Nov 15, 2024",
    healthSystemGroup: "Kaiser Permanente",
    dateOfBirth: "March 15, 1975",
    assignedChapters: ["Heart Health Basics", "Blood Pressure", "Diet & Nutrition"],
    completedChapters: ["Heart Health Basics", "Blood Pressure"],
  },
  "2": {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    phone: "(555) 234-5678",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "active",
    videosWatched: 5,
    totalVideos: 10,
    lastActivity: "1 hour ago",
    joinedDate: "Nov 20, 2024",
    healthSystemGroup: "United Healthcare",
    dateOfBirth: "June 22, 1982",
    assignedChapters: ["Heart Health Basics", "Exercise & Activity"],
    completedChapters: ["Heart Health Basics"],
  },
  "3": {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 345-6789",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "completed",
    videosWatched: 10,
    totalVideos: 10,
    lastActivity: "3 hours ago",
    joinedDate: "Oct 28, 2024",
    healthSystemGroup: "Blue Cross Blue Shield",
    dateOfBirth: "January 8, 1968",
    assignedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management"],
    completedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management"],
  },
  "4": {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 456-7890",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "inactive",
    videosWatched: 3,
    totalVideos: 10,
    lastActivity: "5 days ago",
    joinedDate: "Nov 5, 2024",
    healthSystemGroup: "Aetna",
    dateOfBirth: "September 30, 1990",
    assignedChapters: ["Heart Health Basics"],
    completedChapters: [],
  },
  "5": {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@email.com",
    phone: "(555) 567-8901",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "active",
    videosWatched: 7,
    totalVideos: 10,
    lastActivity: "2 days ago",
    joinedDate: "Nov 10, 2024",
    healthSystemGroup: "Cigna",
    dateOfBirth: "December 12, 1979",
    assignedChapters: ["Heart Health Basics", "Stress Management"],
    completedChapters: ["Heart Health Basics"],
  },
};

// Mock videos sent to patient
const MOCK_VIDEOS_SENT = [
  {
    id: "vs-1",
    title: "Welcome to Your Heart Health Journey",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
    duration: "3:45",
    sentAt: "Dec 20, 2024",
    viewedAt: "Dec 20, 2024",
    completedAt: "Dec 20, 2024",
  },
  {
    id: "vs-2",
    title: "Understanding Blood Pressure",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
    duration: "5:20",
    sentAt: "Dec 18, 2024",
    viewedAt: "Dec 19, 2024",
    completedAt: null,
  },
  {
    id: "vs-3",
    title: "Medication Guide",
    thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
    duration: "4:15",
    sentAt: "Dec 15, 2024",
    viewedAt: null,
    completedAt: null,
  },
];

// Mock communication history (doctor messages + patient survey responses)
const MOCK_COMMUNICATION = [
  {
    id: "c-1",
    type: "doctor_message" as const,
    content: "Hi Dave, I wanted to follow up on your recent appointment. Please watch the new medication video I've sent you when you have a chance.",
    timestamp: "Dec 20, 2024 at 2:30 PM",
  },
  {
    id: "c-2",
    type: "check_in_response" as const,
    questionId: "feeling-today",
    question: "How are you feeling today?",
    answer: "Good",
    emoji: "🙂",
    timestamp: "Dec 20, 2024 at 10:15 AM",
  },
  {
    id: "c-3",
    type: "check_in_response" as const,
    questionId: "took-meds",
    question: "Did you take your medications today?",
    answer: "Yes, all of them",
    emoji: "✅",
    timestamp: "Dec 20, 2024 at 9:00 AM",
  },
  {
    id: "c-4",
    type: "doctor_message" as const,
    content: "Great progress on the videos! I see you've completed the Blood Pressure module. Let me know if you have any questions.",
    timestamp: "Dec 19, 2024 at 4:45 PM",
  },
  {
    id: "c-5",
    type: "check_in_response" as const,
    questionId: "activity-level",
    question: "How active have you been this week?",
    answer: "Moderately active",
    emoji: "🚶",
    timestamp: "Dec 18, 2024 at 11:30 AM",
  },
];

// Check-in questions for sending
const CHECK_IN_QUESTIONS = [
  { id: "feeling-today", question: "How are you feeling today?", icon: <Heart className="w-4 h-4" />, color: "text-rose-600 bg-rose-100" },
  { id: "took-meds", question: "Did you take your medications today?", icon: <Pill className="w-4 h-4" />, color: "text-blue-600 bg-blue-100" },
  { id: "activity-level", question: "How active have you been this week?", icon: <Activity className="w-4 h-4" />, color: "text-orange-600 bg-orange-100" },
  { id: "diet-changes", question: "Have you made changes to your diet?", icon: <Apple className="w-4 h-4" />, color: "text-green-600 bg-green-100" },
];

// Template messages for quick send
const MESSAGE_TEMPLATES = [
  { id: "follow-up", title: "Post-Visit Follow-Up", content: "Thank you for your visit today. I wanted to follow up and remind you to continue following the care plan we discussed." },
  { id: "lab-results", title: "Lab Results Ready", content: "Your recent lab results are ready. Please log in to view them or reach out if you have any questions." },
  { id: "med-reminder", title: "Medication Reminder", content: "This is a friendly reminder to take your prescribed medications as directed. Consistency is key!" },
  { id: "wellness-check", title: "Wellness Check", content: "I hope you're doing well! I wanted to check in and see how you're feeling. Let me know if you need anything." },
];

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "communication">("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalTab, setMessageModalTab] = useState<"templates" | "checkin" | "custom">("templates");
  const [messageContent, setMessageContent] = useState("");
  
  // Get patient data
  const patient = MOCK_PATIENTS[patientId];
  
  if (!patient) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
        <p className="text-gray-500 mb-4">The patient you're looking for doesn't exist.</p>
        <Link
          href="/doctor/patients"
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          Back to Patients
        </Link>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    // In production, this would send to Convex
    console.log("Sending message to patient:", patientId, messageContent);
    setMessageContent("");
    setShowMessageModal(false);
    setMessageModalTab("templates");
  };

  const handleSendTemplate = (template: { id: string; title: string; content: string }) => {
    // In production, this would send to Convex
    console.log("Sending template message to patient:", patientId, template);
    setShowMessageModal(false);
    setMessageModalTab("templates");
  };

  const handleSendCheckIn = (questionId: string) => {
    // In production, this would send to Convex
    console.log("Sending check-in question:", questionId, "to patient:", patientId);
    setShowMessageModal(false);
    setMessageModalTab("templates");
  };

  // Calculate progress percentage for the ring
  const progressPercent = Math.round((patient.videosWatched / patient.totalVideos) * 100);
  const circumference = 2 * Math.PI * 58; // radius of 58
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Patient CV-Style Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Large Photo with Progress Ring */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              {/* Progress Ring SVG */}
              <svg className="w-36 h-36 md:w-40 md:h-40 transform -rotate-90" viewBox="0 0 128 128">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke={progressPercent === 100 ? "#10b981" : "#0ea5e9"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              {/* Photo in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={patient.avatarUrl}
                    alt={patient.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Progress label */}
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{progressPercent}%</p>
              <p className="text-sm text-gray-500">{patient.videosWatched}/{patient.totalVideos} videos</p>
            </div>
          </div>

          {/* Right Side - All Patient Info */}
          <div className="flex-1 min-w-0">
            {/* Name and completion badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              {patient.status === "completed" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-4 h-4" />
                  Course Completed
                </span>
              )}
            </div>

            {/* Contact and provider info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>{patient.healthSystemGroup}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>Joined {patient.joinedDate}</span>
              </div>
            </div>

            {/* Last activity */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Clock className="w-4 h-4" />
              <span>Last activity: {patient.lastActivity}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </button>
              <Link
                href={`/doctor/send?patient=${patient.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Video className="w-4 h-4" />
                Send Video
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
            { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
            { id: "videos", label: "Videos Sent", icon: <Video className="w-4 h-4" /> },
            { id: "communication", label: "Communication", icon: <MessageSquare className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-sky-600 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Health System</span>
                <span className="font-medium text-gray-900">{patient.healthSystemGroup}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-medium text-gray-900">{patient.dateOfBirth}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-900">{patient.joinedDate}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Last Activity</span>
                <span className="font-medium text-gray-900">{patient.lastActivity}</span>
              </div>
            </div>
          </div>

          {/* Assigned Chapters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assigned Chapters</h3>
            <div className="space-y-2">
              {patient.assignedChapters.map((chapter) => {
                const isCompleted = patient.completedChapters.includes(chapter);
                return (
                  <div
                    key={chapter}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      isCompleted
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Play className="w-5 h-5 text-gray-400" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          isCompleted ? "text-emerald-700" : "text-gray-700"
                        )}
                      >
                        {chapter}
                      </span>
                    </div>
                    {isCompleted && (
                      <span className="text-xs font-medium text-emerald-600">
                        Completed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Videos Sent to {patient.name.split(" ")[0]}</h3>
            <Link
              href={`/doctor/send?patient=${patient.id}`}
              className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <Plus className="w-4 h-4" />
              Send New Video
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {MOCK_VIDEOS_SENT.map((video) => (
              <div key={video.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{video.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Sent: {video.sentAt}</span>
                    {video.viewedAt && (
                      <span className="flex items-center gap-1 text-sky-600">
                        <Eye className="w-3.5 h-3.5" />
                        Viewed: {video.viewedAt}
                      </span>
                    )}
                    {video.completedAt && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!video.viewedAt && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      Not viewed
                    </span>
                  )}
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "communication" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Communication History</h3>
            <button
              onClick={() => setShowMessageModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {MOCK_COMMUNICATION.map((item) => (
              <div key={item.id} className="p-4">
                {item.type === "doctor_message" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">You</span>
                        <span className="text-xs text-gray-400">{item.timestamp}</span>
                      </div>
                      <p className="text-gray-700 bg-sky-50 rounded-lg p-3">{item.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={patient.avatarUrl}
                        alt={patient.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{patient.name.split(" ")[0]}</span>
                        <span className="text-xs text-gray-400">{item.timestamp}</span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                          Check-in Response
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-500 mb-2">{item.question}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.emoji}</span>
                          <span className="font-medium text-gray-900">{item.answer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unified Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Send Message to {patient.name.split(" ")[0]}</h3>
              <p className="text-sm text-gray-500 mt-1">Choose a template, check-in question, or write your own message.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setMessageModalTab("templates")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  messageModalTab === "templates"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Templates
              </button>
              <button
                onClick={() => setMessageModalTab("checkin")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  messageModalTab === "checkin"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Check-ins
              </button>
              <button
                onClick={() => setMessageModalTab("custom")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                  messageModalTab === "custom"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Custom
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Templates Tab */}
              {messageModalTab === "templates" && (
                <div className="p-4 space-y-2">
                  {MESSAGE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSendTemplate(template)}
                      className="w-full p-4 bg-gray-50 hover:bg-sky-50 rounded-xl transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 group-hover:text-sky-700">{template.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600" />
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{template.content}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Check-in Tab */}
              {messageModalTab === "checkin" && (
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-500 mb-3">Send a quick check-in question to {patient.name.split(" ")[0]}</p>
                  {CHECK_IN_QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleSendCheckIn(q.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left flex items-center gap-3"
                    >
                      <div className={cn("p-2 rounded-lg", q.color)}>
                        {q.icon}
                      </div>
                      <span className="font-medium text-gray-900">{q.question}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              )}

              {/* Custom Tab */}
              {messageModalTab === "custom" && (
                <div className="p-6">
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                    aria-label="Custom message"
                  />
                  <p className="text-xs text-gray-400 mt-2">This is a one-way message. Patients cannot reply with text.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageModalTab("templates");
                  setMessageContent("");
                }}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {messageModalTab === "custom" && (
                <button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim()}
                  className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

