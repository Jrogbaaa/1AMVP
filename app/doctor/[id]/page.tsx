"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Play, Plus, Check, MessageCircle, Share2, MapPin, Phone, Calendar } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import Image from "next/image";
import Link from "next/link";
import type { Doctor, Video } from "@/lib/types";

// Mock doctors data (same as in feed page)
const MOCK_DOCTORS: Record<string, Doctor & { insurer?: string }> = {
  "550e8400-e29b-41d4-a716-446655440000": {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Ryan Mitchell",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-ryan.jpg",
    clinicName: "Heart Health Partners",
    clinicAddress: "456 Medical Center Blvd, Boston, MA 02116",
    phone: "(617) 555-0200",
    insurer: "Kaiser",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Clinic",
    clinicAddress: "123 Medical Center Dr, Boston, MA 02115",
    phone: "(617) 555-0100",
    insurer: "Kaiser",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    clinicName: "Boston Cardiology Center",
    clinicAddress: "789 Healthcare Ave, Boston, MA 02117",
    phone: "(617) 555-0300",
    insurer: "UnitedHealthcare",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440003": {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    clinicName: "Advanced Heart Care",
    clinicAddress: "321 Wellness Way, Boston, MA 02118",
    phone: "(617) 555-0400",
    insurer: "Aetna",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440004": {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Jack Ellis",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-jack.jpg",
    clinicName: "1Another Cardiology",
    clinicAddress: "555 Innovation Dr, Boston, MA 02119",
    phone: "(617) 555-0500",
    insurer: "Cigna",
    createdAt: new Date().toISOString(),
  },
};

// Mock videos per doctor
const MOCK_VIDEOS_BY_DOCTOR: Record<string, Video[]> = {
  "550e8400-e29b-41d4-a716-446655440000": [
    {
      id: "v1",
      title: "Hey Dave - Your Heart Update",
      description: "Personalized health update",
      videoUrl: "/videos/hey-dave.mp4",
      thumbnailUrl: "/images/doctors/doctor-ryan.jpg",
      posterUrl: "/images/doctors/doctor-ryan.jpg",
      duration: 60,
      category: "Follow-Up",
      tags: ["personalized", "follow-up"],
      doctorId: "550e8400-e29b-41d4-a716-446655440000",
      isPersonalized: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "v2",
      title: "Blood Pressure Basics",
      description: "Understanding your numbers",
      videoUrl: "/videos/doctor-jack-video-1.mp4",
      thumbnailUrl: "/images/doctors/doctor-ryan.jpg",
      posterUrl: "/images/doctors/doctor-ryan.jpg",
      duration: 180,
      category: "Education",
      tags: ["blood pressure", "basics"],
      doctorId: "550e8400-e29b-41d4-a716-446655440000",
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "v3",
      title: "Heart-Healthy Eating",
      description: "Nutrition tips for your heart",
      videoUrl: "/videos/doctor-jack-video-2.mp4",
      thumbnailUrl: "/images/doctors/doctor-ryan.jpg",
      posterUrl: "/images/doctors/doctor-ryan.jpg",
      duration: 240,
      category: "Education",
      tags: ["nutrition", "diet"],
      doctorId: "550e8400-e29b-41d4-a716-446655440000",
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
  ],
  "550e8400-e29b-41d4-a716-446655440004": [
    {
      id: "v4",
      title: "Understanding Your Heart Rhythm",
      description: "Learn the basics",
      videoUrl: "/videos/doctor-jack-video-1.mp4",
      thumbnailUrl: "/images/doctors/doctor-jack.jpg",
      posterUrl: "/images/doctors/doctor-jack.jpg",
      duration: 180,
      category: "Education",
      tags: ["heart rhythm", "cardiology"],
      doctorId: "550e8400-e29b-41d4-a716-446655440004",
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "v5",
      title: "Managing Cholesterol Levels",
      description: "Effective strategies",
      videoUrl: "/videos/doctor-jack-video-2.mp4",
      thumbnailUrl: "/images/doctors/doctor-jack.jpg",
      posterUrl: "/images/doctors/doctor-jack.jpg",
      duration: 210,
      category: "Education",
      tags: ["cholesterol", "prevention"],
      doctorId: "550e8400-e29b-41d4-a716-446655440004",
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "v6",
      title: "Signs of Heart Disease",
      description: "Early warning signs",
      videoUrl: "/videos/doctor-jack-video-3.mp4",
      thumbnailUrl: "/images/doctors/doctor-jack.jpg",
      posterUrl: "/images/doctors/doctor-jack.jpg",
      duration: 240,
      category: "Education",
      tags: ["warning signs", "heart disease"],
      doctorId: "550e8400-e29b-41d4-a716-446655440004",
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

// Generate default videos for other doctors
["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"].forEach(doctorId => {
  const doctor = MOCK_DOCTORS[doctorId];
  MOCK_VIDEOS_BY_DOCTOR[doctorId] = [
    {
      id: `${doctorId}-v1`,
      title: "Understanding Blood Pressure",
      description: "Learn about blood pressure management",
      videoUrl: "/videos/doctor-jack-video-1.mp4",
      thumbnailUrl: doctor?.avatarUrl || "",
      posterUrl: doctor?.avatarUrl || "",
      duration: 180,
      category: "Education",
      tags: ["blood pressure", "cardiology"],
      doctorId,
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `${doctorId}-v2`,
      title: "Heart-Healthy Diet Tips",
      description: "Nutrition advice for your heart",
      videoUrl: "/videos/doctor-jack-video-2.mp4",
      thumbnailUrl: doctor?.avatarUrl || "",
      posterUrl: doctor?.avatarUrl || "",
      duration: 210,
      category: "Education",
      tags: ["nutrition", "diet"],
      doctorId,
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `${doctorId}-v3`,
      title: "Exercise & Heart Health",
      description: "Staying active for a healthy heart",
      videoUrl: "/videos/doctor-jack-video-3.mp4",
      thumbnailUrl: doctor?.avatarUrl || "",
      posterUrl: doctor?.avatarUrl || "",
      duration: 240,
      category: "Education",
      tags: ["exercise", "fitness"],
      doctorId,
      isPersonalized: false,
      createdAt: new Date().toISOString(),
    },
  ];
});

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;
  
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  const [isFollowing, setIsFollowing] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  
  const doctor = MOCK_DOCTORS[doctorId];
  const videos = MOCK_VIDEOS_BY_DOCTOR[doctorId] || [];
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Doctor not found</h1>
          <Link href="/discover" className="text-[#00BFA6] hover:underline">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }
  
  const patientName = session?.user?.name?.split(" ")[0] || "there";

  const handleFollow = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setIsFollowing(!isFollowing);
  };

  const handleVideoHover = (videoId: string) => {
    setHoveredVideo(videoId);
    const video = videoRefs.current[videoId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleVideoLeave = (videoId: string) => {
    setHoveredVideo(null);
    const video = videoRefs.current[videoId];
    if (video) {
      video.pause();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Dr. ${doctor.name}`,
      text: `Check out Dr. ${doctor.name}'s profile on 1Another`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3 md:px-6">
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Dr. {doctor.name}
              </h1>
            </div>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share profile"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-3 md:px-6 py-4 pb-20 max-w-4xl mx-auto">
        {/* Doctor Profile Header */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                {doctor.avatarUrl ? (
                  <Image
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Dr. {doctor.name}
              </h2>
              <p className="text-gray-600 mb-2">{doctor.specialty}</p>
              
              {doctor.clinicName && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.clinicName}</span>
                </div>
              )}
              
              {doctor.insurer && (
                <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 mb-3">
                  {doctor.insurer}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-3 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{videos.length}</p>
                  <p className="text-xs text-gray-500">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">2.4K</p>
                  <p className="text-xs text-gray-500">Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">4.9</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    isFollowing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gradient-to-r from-[#00BFA6] to-[#00A6CE] text-white hover:opacity-90"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid - TikTok Style */}
        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3 px-1">Videos</h3>
          <div className="grid grid-cols-3 gap-1">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/feed?doctor=${doctorId}`}
                className="relative aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden group"
                onMouseEnter={() => handleVideoHover(video.id)}
                onMouseLeave={() => handleVideoLeave(video.id)}
              >
                {/* Video/Thumbnail */}
                {video.videoUrl && (
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.videoUrl}
                    poster={video.posterUrl || video.thumbnailUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                )}
                
                {/* Fallback to image */}
                {(!video.videoUrl || hoveredVideo !== video.id) && video.thumbnailUrl && (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Play indicator */}
                {hoveredVideo !== video.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Video info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-lg">
                    {video.title}
                  </p>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {Math.floor((video.duration || 0) / 60)}:{((video.duration || 0) % 60).toString().padStart(2, '0')}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <h3 className="text-base font-bold text-gray-900 mb-3">Contact</h3>
          <div className="space-y-3">
            {doctor.clinicAddress && (
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{doctor.clinicName}</p>
                  <p className="text-sm">{doctor.clinicAddress}</p>
                </div>
              </div>
            )}
            {doctor.phone && (
              <a 
                href={`tel:${doctor.phone}`}
                className="flex items-center gap-3 text-gray-600 hover:text-[#00BFA6] transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{doctor.phone}</span>
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Mobile navigation */}
      <MobileBottomNav />

      {/* Auth Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger="follow_doctor"
      />

      {/* Chat */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        doctor={doctor}
        patientName={patientName}
        userId={session?.user?.id || "anonymous"}
      />

      {/* Schedule Appointment */}
      <ScheduleAppointment
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        doctor={doctor}
        userId={session?.user?.id || "anonymous"}
      />
    </div>
  );
}

