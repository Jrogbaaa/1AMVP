"use client";

import { useState } from "react";
import { CheckCircle2, Calendar, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";
import {
  ANNUAL_REMINDERS,
  TODAY_REMINDERS,
  WEEK_REMINDERS,
  type Reminder,
} from "@/lib/reminders";

interface ReminderCardProps {
  isActive: boolean;
  onScheduleClick?: () => void;
}

export const ReminderCard = ({ isActive, onScheduleClick }: ReminderCardProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalTodayItems = TODAY_REMINDERS.length;

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Reminders</h2>
              <p className="text-xs text-gray-500">Stay on track with your health</p>
            </div>
          </div>
          <Link
            href="/my-health"
            className="text-xs text-sky-600 font-medium flex items-center gap-0.5 hover:underline"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
        {/* Annual Reminders */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span>📅</span> Coming Up
          </h3>
          <div className="space-y-2">
            {ANNUAL_REMINDERS.slice(0, 2).map((reminder) => (
              <div
                key={reminder.id}
                className="p-3 rounded-xl bg-white border border-sky-100 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{reminder.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {reminder.title}
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex-shrink-0">
                          +{reminder.scoreBoost}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Due: {reminder.dueDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onScheduleClick}
                    className="px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-lg hover:bg-sky-700 transition-colors flex-shrink-0"
                  >
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <span>✅</span> Today
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
              {completedCount}/{totalTodayItems} done
            </span>
          </div>
          <div className="space-y-2">
            {TODAY_REMINDERS.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  checkedItems[reminder.id]
                    ? "bg-green-50 border border-green-200"
                    : "bg-white border border-emerald-100 hover:bg-emerald-50"
                }`}
                onClick={() => handleCheckboxChange(reminder.id)}
                role="checkbox"
                aria-checked={checkedItems[reminder.id]}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCheckboxChange(reminder.id);
                  }
                }}
              >
                <div className="flex-shrink-0">
                  {checkedItems[reminder.id] ? (
                    <CheckCircle2
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm flex-shrink-0">{reminder.icon}</span>
                    <p
                      className={`font-semibold text-sm ${
                        checkedItems[reminder.id]
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {reminder.title}
                    </p>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex-shrink-0">
                      +{reminder.scoreBoost}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{reminder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* This Week */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <span>📆</span> This Week
          </h3>
          <div className="space-y-2">
            {WEEK_REMINDERS.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  checkedItems[reminder.id]
                    ? "bg-green-50 border border-green-200"
                    : "bg-white border border-amber-100 hover:bg-amber-50"
                }`}
                onClick={() => handleCheckboxChange(reminder.id)}
                role="checkbox"
                aria-checked={checkedItems[reminder.id]}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCheckboxChange(reminder.id);
                  }
                }}
              >
                <div className="flex-shrink-0">
                  {checkedItems[reminder.id] ? (
                    <CheckCircle2
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm flex-shrink-0">{reminder.icon}</span>
                    <p
                      className={`font-semibold text-sm ${
                        checkedItems[reminder.id]
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {reminder.title}
                    </p>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex-shrink-0">
                      +{reminder.scoreBoost}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{reminder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to My Health */}
        <Link
          href="/my-health"
          className="block w-full p-4 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-xl text-center text-white font-semibold hover:from-sky-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          View Full Health Dashboard
          <ChevronRight className="w-4 h-4 inline ml-1" />
        </Link>
      </div>
    </div>
  );
};

