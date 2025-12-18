"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Building2,
  Bell,
  Shield,
  Save,
  Camera,
  Check,
  Sparkles,
  ExternalLink,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENT_DOCTOR = {
  name: "Jack Ellis",
  email: "dr.ellis@1another.com",
  phone: "(555) 123-4567",
  specialty: "Cardiology",
  clinic: "1Another Cardiology",
  avatarUrl: "/images/doctors/doctor-jack.jpg",
  bio: "Board-certified cardiologist with over 15 years of experience in interventional cardiology and preventive care.",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "ai-avatar" | "notifications" | "security">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Profile state
  const [name, setName] = useState(CURRENT_DOCTOR.name);
  const [email, setEmail] = useState(CURRENT_DOCTOR.email);
  const [phone, setPhone] = useState(CURRENT_DOCTOR.phone);
  const [specialty, setSpecialty] = useState(CURRENT_DOCTOR.specialty);
  const [clinic, setClinic] = useState(CURRENT_DOCTOR.clinic);
  const [bio, setBio] = useState(CURRENT_DOCTOR.bio);

  // HeyGen AI Avatar state
  const [heygenAvatarId, setHeygenAvatarId] = useState("");
  const [heygenVoiceId, setHeygenVoiceId] = useState("");
  const [avatarStatus, setAvatarStatus] = useState<"not_configured" | "pending" | "active" | "error">("not_configured");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Notification settings
  const [notifications, setNotifications] = useState({
    newPatient: true,
    videoWatched: true,
    patientMessage: true,
    weeklyReport: false,
    emailDigest: true,
  });

  // Validate HeyGen credentials
  const handleValidateHeyGen = async () => {
    if (!heygenAvatarId || !heygenVoiceId) {
      setValidationError("Both Avatar ID and Voice ID are required");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      // In production, this would call the API to validate
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate successful validation
      setAvatarStatus("active");
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch {
      setValidationError("Failed to validate credentials. Please check your Avatar ID and Voice ID.");
      setAvatarStatus("error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "ai-avatar", label: "AI Avatar", icon: <Sparkles className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "text-sky-600 border-sky-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
                  <Image
                    src={CURRENT_DOCTOR.avatarUrl}
                    alt={CURRENT_DOCTOR.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 transition-colors"
                  aria-label="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a professional photo that helps patients recognize you.
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    Upload New
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic/Practice Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                  placeholder="Tell patients a bit about yourself..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Avatar Tab */}
      {activeTab === "ai-avatar" && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={cn(
            "rounded-xl p-4 border flex items-start gap-4",
            avatarStatus === "active"
              ? "bg-emerald-50 border-emerald-200"
              : avatarStatus === "error"
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          )}>
            <div className={cn(
              "p-2 rounded-full",
              avatarStatus === "active"
                ? "bg-emerald-100"
                : avatarStatus === "error"
                ? "bg-red-100"
                : "bg-amber-100"
            )}>
              {avatarStatus === "active" ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : avatarStatus === "error" ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <h3 className={cn(
                "font-semibold",
                avatarStatus === "active"
                  ? "text-emerald-800"
                  : avatarStatus === "error"
                  ? "text-red-800"
                  : "text-amber-800"
              )}>
                {avatarStatus === "active"
                  ? "AI Avatar Active"
                  : avatarStatus === "error"
                  ? "Configuration Error"
                  : "AI Avatar Not Configured"}
              </h3>
              <p className={cn(
                "text-sm mt-1",
                avatarStatus === "active"
                  ? "text-emerald-700"
                  : avatarStatus === "error"
                  ? "text-red-700"
                  : "text-amber-700"
              )}>
                {avatarStatus === "active"
                  ? "Your HeyGen avatar is configured and ready to generate videos."
                  : avatarStatus === "error"
                  ? "There was an issue with your configuration. Please check your credentials."
                  : "Configure your HeyGen avatar to start generating personalized videos."}
              </p>
            </div>
          </div>

          {/* HeyGen Setup Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Train Your Avatar on HeyGen</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Go to HeyGen and upload a 2-3 minute video of yourself speaking. This trains your AI avatar.
                  </p>
                  <a
                    href="https://app.heygen.com/avatars"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                  >
                    Open HeyGen Avatar Studio
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Copy Your Avatar ID</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Once your avatar is trained, find your Avatar ID in the HeyGen dashboard and paste it below.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Your Voice ID</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your Voice ID is created alongside your avatar. Find it in the voices section of HeyGen.
                  </p>
                  <a
                    href="https://app.heygen.com/voices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                  >
                    Open HeyGen Voices
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* HeyGen Credentials Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">HeyGen Credentials</h2>
            
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {validationError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar ID
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    aria-label="Help with Avatar ID"
                  >
                    <HelpCircle className="w-4 h-4 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  value={heygenAvatarId}
                  onChange={(e) => setHeygenAvatarId(e.target.value)}
                  placeholder="e.g., avatar_1234567890abcdef"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found in HeyGen under Avatars → Your Avatar → Avatar ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice ID
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    aria-label="Help with Voice ID"
                  >
                    <HelpCircle className="w-4 h-4 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  value={heygenVoiceId}
                  onChange={(e) => setHeygenVoiceId(e.target.value)}
                  placeholder="e.g., voice_1234567890abcdef"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found in HeyGen under Voices → Your Voice → Voice ID
                </p>
              </div>

              <button
                onClick={handleValidateHeyGen}
                disabled={isValidating || (!heygenAvatarId && !heygenVoiceId)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-all",
                  isValidating || (!heygenAvatarId && !heygenVoiceId)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                )}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : avatarStatus === "active" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Update Configuration
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Save & Validate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Need Help?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Training an avatar typically takes 24 hours. Make sure your video has good lighting,
                  clear audio, and shows your face directly to the camera.
                </p>
                <a
                  href="https://docs.heygen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  View HeyGen Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              {
                key: "newPatient",
                label: "New Patient Assigned",
                description: "Receive notifications when a new patient is added to your roster.",
              },
              {
                key: "videoWatched",
                label: "Video Watched",
                description: "Get notified when a patient watches an assigned video.",
              },
              {
                key: "patientMessage",
                label: "Patient Messages",
                description: "Receive notifications for new patient messages.",
              },
              {
                key: "weeklyReport",
                label: "Weekly Progress Report",
                description: "Receive a weekly summary of patient engagement.",
              },
              {
                key: "emailDigest",
                label: "Email Digest",
                description: "Receive a daily email digest of all notifications.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifications],
                    }))
                  }
                  className={cn(
                    "relative w-12 h-7 rounded-full transition-colors",
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-sky-600"
                      : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                      notifications[item.key as keyof typeof notifications]
                        ? "translate-x-6"
                        : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>
              <button className="px-6 py-2.5 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <button className="px-6 py-2.5 border-2 border-sky-600 text-sky-600 font-medium rounded-xl hover:bg-sky-50 transition-colors">
              Enable 2FA
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h2>
            <p className="text-gray-600 mb-4">
              Manage your active sessions across different devices.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Current Session</p>
                  <p className="text-sm text-gray-500">MacBook Pro • San Francisco, CA</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  Active Now
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex items-center justify-end gap-4">
        {showSaved && (
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">Changes saved!</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
