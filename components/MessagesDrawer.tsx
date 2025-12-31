"use client";

import { useState } from "react";
import { X, Search, ChevronRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { Doctor } from "@/lib/types";

interface Message {
  id: string;
  doctorId: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

// Mock messages
const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    preview: "Great progress on your blood pressure! Keep up the good work.",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "m2",
    doctorId: "550e8400-e29b-41d4-a716-446655440002",
    preview: "Your lab results look good. Let's discuss at your next visit.",
    timestamp: "Yesterday",
    unread: true,
  },
  {
    id: "m3",
    doctorId: "550e8400-e29b-41d4-a716-446655440003",
    preview: "Remember to take your medication with food.",
    timestamp: "2 days ago",
    unread: false,
  },
];

export const MessagesDrawer = ({
  isOpen,
  onClose,
  doctors,
  onSelectDoctor,
}: MessagesDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter doctors by search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get message for each doctor
  const getDoctorMessage = (doctorId: string) => {
    return MOCK_MESSAGES.find((m) => m.doctorId === doctorId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative bg-white rounded-t-3xl w-full sm:max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/30 focus:border-[#00BFA6] transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          {filteredDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No doctors found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredDoctors.map((doctor) => {
                const message = getDoctorMessage(doctor.id);
                
                return (
                  <button
                    key={doctor.id}
                    onClick={() => onSelectDoctor(doctor)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                        {doctor.avatarUrl ? (
                          <Image
                            src={doctor.avatarUrl}
                            alt={doctor.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {doctor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Unread indicator */}
                      {message?.unread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-semibold text-sm truncate ${message?.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          Dr. {doctor.name}
                        </p>
                        {message && (
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {message.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
                      {message && (
                        <p className={`text-sm truncate mt-0.5 ${message.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {message.preview}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Messages with your healthcare providers
          </p>
        </div>
      </div>
    </div>
  );
};

