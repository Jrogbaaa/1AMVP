"use client";

import { Calendar, CheckCircle2 } from "lucide-react";
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
  doctorName = "Jack Ellis",
  doctorAvatarUrl = "/images/doctors/doctor-jack.jpg"
}: ReminderCardProps) => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
      {/* Doctor photo with check mark icon */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
                <Image
                  src={doctorAvatarUrl}
                  alt={`Dr. ${doctorName}`}
              width={64}
              height={64}
                  className="w-full h-full object-cover"
                />
              </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
        <div>
          <p className="text-white font-bold text-base">Dr. {doctorName}</p>
          <p className="text-emerald-400 text-sm font-medium">Reminder</p>
        </div>
          </div>
          
      {/* Reminder content */}
      <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20 mx-4">
        <h2 className="text-white text-lg font-bold mb-2">
            Schedule Colonoscopy
          </h2>

        <p className="text-white/70 text-sm mb-4">
          Based on your family history, let&apos;s get this scheduled.
        </p>

          {/* Due date badge */}
        <div className="flex justify-start mb-4">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium border border-amber-500/30">
            <Calendar className="w-4 h-4" />
            <span>Due in 60 days</span>
          </div>
          </div>

          {/* Schedule button */}
          <button
            onClick={onScheduleClick}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
          aria-label="Schedule colonoscopy appointment"
          tabIndex={0}
          >
          <Calendar className="w-4 h-4" />
            Schedule Now
          </button>

          {/* Link to full health dashboard */}
          <Link
            href="/my-health"
          className="block text-center text-sm text-sky-400 font-medium mt-4 hover:text-sky-300 transition-colors"
          >
            View all reminders →
          </Link>
      </div>
    </div>
  );
};
