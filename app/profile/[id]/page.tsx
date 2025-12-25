"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Play, Calendar, Video, UserPlus, Check } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import type { Video as VideoType, Doctor } from "@/lib/types";

// Extended doctor type with insurer info
interface ExtendedDoctor extends Doctor {
  insurer?: string;
}

// Re-use mock data from discover page
const MOCK_DOCTORS: ExtendedDoctor[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Clinic",
    clinicAddress: "123 Medical Plaza, Boston, MA",
    insurer: "Kaiser",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    clinicName: "Boston Cardiology Center",
    clinicAddress: "456 Health Way, Boston, MA",
    insurer: "UnitedHealthcare",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    clinicName: "Advanced Heart Care",
    clinicAddress: "789 Wellness Dr, Cambridge, MA",
    insurer: "Aetna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "James Martinez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80",
    clinicName: "Cardiovascular Associates",
    clinicAddress: "321 Cardiac Lane, Somerville, MA",
    insurer: "Cigna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Lisa Thompson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart & Vascular Institute",
    clinicAddress: "555 Arterial Ave, Newton, MA",
    insurer: "Blue Cross",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "David Kim",
    specialty: "Mental Health",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80",
    clinicName: "Metro Heart Specialists",
    clinicAddress: "888 Pulse Pkwy, Brookline, MA",
    insurer: "Humana",
    createdAt: new Date().toISOString(),
  },
];

// Mock videos for doctors
const MOCK_VIDEOS: VideoType[] = [
  {
    id: "vid-001",
    title: "Understanding Blood Pressure",
    description: "Learn about the importance of monitoring your blood pressure and what the numbers mean.",
    videoUrl: "/videos/doctor-jack-video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&q=80",
    duration: 180,
    category: "Cardiology",
    tags: ["blood pressure", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vid-002",
    title: "Heart-Healthy Diet Tips",
    description: "Essential nutritional advice for maintaining a healthy heart.",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&q=80",
    duration: 240,
    category: "Nutrition",
    tags: ["diet", "nutrition", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440002",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vid-003",
    title: "Managing Cholesterol Naturally",
    description: "Natural approaches to managing your cholesterol levels.",
    videoUrl: "/videos/doctor-jack-video-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=300&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=300&fit=crop&q=80",
    duration: 330,
    category: "Cardiology",
    tags: ["cholesterol", "natural health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vid-004",
    title: "Exercise for Heart Health",
    description: "The best exercises to strengthen your heart and improve cardiovascular health.",
    videoUrl: "/videos/doctor-jack-video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&q=80",
    duration: 255,
    category: "Fitness",
    tags: ["exercise", "fitness", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "vid-005",
    title: "Understanding Arrhythmia",
    description: "What causes irregular heartbeats and when to seek medical attention.",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop&q=80",
    duration: 360,
    category: "Cardiology",
    tags: ["arrhythmia", "heart rhythm"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
];

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id as string;

  const [isFollowing, setIsFollowing] = React.useState(false);

  // Find the doctor from mock data
  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);

  // Filter videos by this doctor
  const doctorVideos = MOCK_VIDEOS.filter((video) => video.doctorId === doctorId);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center gap-3">
            <Link href="/discover" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Doctor Profile</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Doctor not found.</p>
            <Link href="/discover" className="text-[#00A6CE] hover:underline">
              Back to Discover
            </Link>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/discover" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Doctor Profile</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 ring-2 ring-[#00BFA6]/20">
              {doctor.avatarUrl ? (
                <Image
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {doctor.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name & Specialty */}
            <h2 className="text-2xl font-bold text-gray-900">Dr. {doctor.name}</h2>
            <p className="text-[#00A6CE] font-semibold text-lg">{doctor.specialty}</p>
            
            {/* Clinic Info */}
            <div className="mt-2 text-gray-500 text-sm">
              <p className="font-medium">{doctor.clinicName}</p>
              {doctor.clinicAddress && (
                <p className="mt-0.5">{doctor.clinicAddress}</p>
              )}
            </div>

            {/* Insurer Badge */}
            {doctor.insurer && (
              <span className="mt-3 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {doctor.insurer}
              </span>
            )}

            {/* Stats */}
            <div className="flex items-center gap-8 mt-4 pt-4 border-t border-gray-100 w-full justify-center">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{doctorVideos.length}</p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? "text-amber-400" : "text-amber-400"}`}
                      fill={star <= 4 || star === 5 ? "currentColor" : "none"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm font-semibold text-gray-700">4.9</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5 w-full">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gradient-to-r from-[#00BFA6] to-[#00A6CE] text-white shadow-md"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
              <Link
                href={`/feed?doctor=${doctor.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold border-2 border-[#00BFA6] text-[#00A6CE] hover:bg-[#00BFA6]/5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Link>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-[#00A6CE]" />
            <h3 className="text-lg font-bold text-gray-900">
              Videos by Dr. {doctor.name.split(" ")[0]}
            </h3>
          </div>

          {doctorVideos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {doctorVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/feed?doctor=${doctor.id}&video=${video.id}`}
                  className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <Image
                      src={video.thumbnailUrl || video.posterUrl || ""}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration || 0)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-[#00A6CE] ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#00A6CE] transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-1">
                      {video.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No videos available yet.</p>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

