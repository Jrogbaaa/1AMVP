"use client";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ReminderCardProps {
  isActive: boolean;
  onScheduleClick?: () => void;
  doctorName?: string;
  doctorAvatarUrl?: string;
}

export const ReminderCard = ({ 
  isActive, 
  onScheduleClick,
  doctorName = "Lisa Mitchell",
  doctorAvatarUrl = "/images/doctors/doctor-lisa.jpg"
}: ReminderCardProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex flex-col items-center justify-center">
      {/* Module title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center px-4">
        What Your Doctor Wants You to Do
      </h1>
      
      {/* Centered single reminder card */}
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
          {/* Doctor Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-sky-100 shadow-lg">
                <Image
                  src={doctorAvatarUrl}
                  alt={`Dr. ${doctorName}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-sm">🩺</span>
              </div>
            </div>
          </div>
          
          {/* Doctor Name */}
          <p className="text-center text-sm text-gray-500 mb-3">
            From <span className="font-semibold text-gray-700">Dr. {doctorName}</span>
          </p>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Schedule Colonoscopy
          </h2>

          {/* Due date badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>60 days away</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-center text-sm mb-6">
            Your preventive screening is coming up. Schedule now to secure your preferred time.
          </p>

          {/* Score boost */}
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg">
              +15% Health Score
            </span>
          </div>

          {/* Schedule button */}
          <button
            onClick={onScheduleClick}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Schedule Now
          </button>

          {/* Link to full health dashboard */}
          <Link
            href="/my-health"
            className="block text-center text-sm text-sky-600 font-medium mt-4 hover:underline"
          >
            View all reminders →
          </Link>
        </div>
      </div>
    </div>
  );
};
