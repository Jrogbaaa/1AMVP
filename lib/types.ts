export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  clinicName?: string;
  clinicAddress?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  duration?: number;
  category?: string;
  tags?: string[];
  doctorId?: string;
  isPersonalized: boolean;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  videoId: string;
  position: number;
  reason?: string;
  video?: Video;
  doctor?: Doctor;
}

export interface UserVideoEngagement {
  id: string;
  userId: string;
  videoId: string;
  watched: boolean;
  watchedAt?: string;
  watchDuration?: number;
  liked: boolean;
  saved: boolean;
  completed: boolean;
}

export interface AppointmentRequest {
  id: string;
  userId: string;
  doctorId: string;
  requestedDate: string;
  requestedTime?: string;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface OnboardingState {
  userId: string;
  currentStep: number;
  completed: boolean;
  data: Record<string, any>;
  updatedAt: string;
}

export interface HealthMetrics {
  userId: string;
  score: number;
  watchedDoctorVideo: boolean;
  completedOnboarding: boolean;
  completedNextSteps: boolean;
  submittedCalendarRequest: boolean;
  watchedEducationalVideos: number;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

