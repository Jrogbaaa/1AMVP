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

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Dave Thompson",
    email: "dave.t@email.com",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
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

  // If coming from a patient profile, skip step 1 (patient selection)
  const isFromPatientProfile = !!preselectedPatientId;
  const [step, setStep] = useState<1 | 2 | 3>(isFromPatientProfile ? 2 : 1);
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
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["1"]));
  const [patientSearch, setPatientSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
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

  if (sendSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Content Sent Successfully!</h1>
        <p className="text-gray-500 mb-8">
          {selectedVideosList.length} video{selectedVideosList.length !== 1 ? "s" : ""} sent to{" "}
          {selectedPatientsList.length} patient{selectedPatientsList.length !== 1 ? "s" : ""}. They will receive a notification shortly.
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
              setPersonalMessage("");
            }}
            className="px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-colors"
          >
            Send More Content
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Send Content to Patients</h1>
        <p className="text-gray-500 mt-1">
          Select patients and videos to send personalized health content
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex items-center gap-3 flex-1"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                s === step
                  ? "bg-sky-600 text-white"
                  : s < step
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span
              className={cn(
                "font-medium text-sm hidden sm:block",
                s === step ? "text-gray-900" : "text-gray-400"
              )}
            >
              {s === 1 ? "Select Patients" : s === 2 ? "Choose Content" : "Review & Send"}
            </span>
            {s < 3 && (
              <div className="flex-1 h-0.5 bg-gray-200 hidden sm:block">
                <div
                  className={cn(
                    "h-full bg-emerald-500 transition-all",
                    s < step ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Patients */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Patients</h2>
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
            <p className="text-sm text-gray-500">
              {selectedPatients.size} patient{selectedPatients.size !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={() => setStep(2)}
              disabled={selectedPatients.size === 0}
              className="px-6 py-2.5 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Content */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Choose Videos</h2>
              <p className="text-sm text-gray-500">
                {selectedVideos.size} video{selectedVideos.size !== 1 ? "s" : ""} selected
              </p>
            </div>
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
              onClick={() => {
                if (isFromPatientProfile) {
                  router.back();
                } else {
                  setStep(1);
                }
              }}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedVideos.size === 0}
              className="px-6 py-2.5 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Send */}
      {step === 3 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selected Items Summary */}
          <div className="space-y-6">
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

            {/* Videos Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-sky-600" />
                  <h3 className="font-semibold text-gray-900">
                    {selectedVideosList.length} Video{selectedVideosList.length !== 1 ? "s" : ""}
                  </h3>
                </div>
                <button
                  onClick={() => setStep(2)}
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
          </div>

          {/* Personal Message & Send */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-600" />
                Add Personal Message (Optional)
              </h3>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Add a personal note to accompany these videos..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                This message will be included in the email notification sent to patients.
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Send className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ready to Send</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedVideosList.length} video{selectedVideosList.length !== 1 ? "s" : ""} will be sent to{" "}
                    {selectedPatientsList.length} patient{selectedPatientsList.length !== 1 ? "s" : ""}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex-1 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Content
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-500">
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p>
                Patients will receive an email notification with a link to view the assigned videos in their personalized feed.
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
