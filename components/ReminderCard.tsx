"use client";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface ReminderCardProps {
  isActive: boolean;
  onScheduleClick?: () => void;
}

export const ReminderCard = ({ isActive, onScheduleClick }: ReminderCardProps) => {
  // Calculate days until colonoscopy (60 days from now)
  const daysAway = 60;

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
      {/* Half-page centered card */}
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <span className="text-3xl">🩺</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Schedule Colonoscopy
          </h2>

          {/* Due date badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>{daysAway} days away</span>
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
