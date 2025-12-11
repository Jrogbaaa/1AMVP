"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Eye,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
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
  healthProvider: string;
  assignedChapters: string[];
  completedChapters: string[];
}

const MOCK_PATIENTS: Patient[] = [
  {
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
    healthProvider: "Kaiser Permanente",
    assignedChapters: ["Heart Health Basics", "Blood Pressure", "Diet & Nutrition"],
    completedChapters: ["Heart Health Basics", "Blood Pressure"],
  },
  {
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
    healthProvider: "United Healthcare",
    assignedChapters: ["Heart Health Basics", "Exercise & Activity"],
    completedChapters: ["Heart Health Basics"],
  },
  {
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
    healthProvider: "Blue Cross",
    assignedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management"],
    completedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management"],
  },
  {
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
    healthProvider: "Aetna",
    assignedChapters: ["Heart Health Basics"],
    completedChapters: [],
  },
  {
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
    healthProvider: "Cigna",
    assignedChapters: ["Heart Health Basics", "Stress Management"],
    completedChapters: ["Heart Health Basics"],
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 678-9012",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    status: "active",
    videosWatched: 6,
    totalVideos: 10,
    lastActivity: "4 hours ago",
    joinedDate: "Nov 22, 2024",
    healthProvider: "Humana",
    assignedChapters: ["Heart Health Basics", "Diet & Nutrition"],
    completedChapters: ["Heart Health Basics"],
  },
  {
    id: "7",
    name: "Robert Martinez",
    email: "r.martinez@email.com",
    phone: "(555) 789-0123",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    status: "completed",
    videosWatched: 10,
    totalVideos: 10,
    lastActivity: "Yesterday",
    joinedDate: "Oct 15, 2024",
    healthProvider: "Kaiser Permanente",
    assignedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management", "Follow-Up Care"],
    completedChapters: ["Heart Health Basics", "Blood Pressure", "Medication Management", "Follow-Up Care"],
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "j.taylor@email.com",
    phone: "(555) 890-1234",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    status: "active",
    videosWatched: 4,
    totalVideos: 8,
    lastActivity: "6 hours ago",
    joinedDate: "Nov 25, 2024",
    healthProvider: "United Healthcare",
    assignedChapters: ["Heart Health Basics", "Exercise & Activity"],
    completedChapters: [],
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "completed">("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredPatients = MOCK_PATIENTS.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCloseDetail = () => {
    setSelectedPatient(null);
  };

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "active":
        return "bg-sky-100 text-sky-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: Patient["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "active":
        return <Play className="w-4 h-4" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">
            {filteredPatients.length} patients total
          </p>
        </div>
        <Link
          href="/doctor/send"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Send Content
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">
              {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                {(["all", "active", "inactive", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                      statusFilter === status && "bg-sky-50 text-sky-700"
                    )}
                  >
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Patient
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Progress
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Last Activity
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Provider
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                        <Image
                          src={patient.avatarUrl}
                          alt={patient.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full",
                        getStatusColor(patient.status)
                      )}
                    >
                      {getStatusIcon(patient.status)}
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            patient.videosWatched === patient.totalVideos
                              ? "bg-emerald-500"
                              : "bg-sky-500"
                          )}
                          style={{
                            width: `${(patient.videosWatched / patient.totalVideos) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {patient.videosWatched}/{patient.totalVideos} videos
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {patient.lastActivity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{patient.healthProvider}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/doctor/send?patient=${patient.id}`;
                        }}
                        className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        aria-label="Send content"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/doctor/messages?patient=${patient.id}`;
                        }}
                        className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        aria-label="Send message"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Sidebar */}
      {selectedPatient && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={handleCloseDetail}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
              <button
                onClick={handleCloseDetail}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-100">
                  <Image
                    src={selectedPatient.avatarUrl}
                    alt={selectedPatient.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedPatient.name}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full mt-1",
                      getStatusColor(selectedPatient.status)
                    )}
                  >
                    {getStatusIcon(selectedPatient.status)}
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Joined {selectedPatient.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Video Progress
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round((selectedPatient.videosWatched / selectedPatient.totalVideos) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        selectedPatient.videosWatched === selectedPatient.totalVideos
                          ? "bg-emerald-500"
                          : "bg-sky-500"
                      )}
                      style={{
                        width: `${(selectedPatient.videosWatched / selectedPatient.totalVideos) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedPatient.videosWatched} of {selectedPatient.totalVideos} videos watched
                  </p>
                </div>
              </div>

              {/* Assigned Chapters */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Assigned Chapters
                </h4>
                <div className="space-y-2">
                  {selectedPatient.assignedChapters.map((chapter) => {
                    const isCompleted = selectedPatient.completedChapters.includes(chapter);
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

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Link
                  href={`/doctor/send?patient=${selectedPatient.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Send Content
                </Link>
                <Link
                  href={`/doctor/messages?patient=${selectedPatient.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Message
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
