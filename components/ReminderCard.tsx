"use client";

import { useState } from "react";
import { CheckCircle2, Calendar, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";
import {
  ALL_REMINDERS,
  type Reminder,
} from "@/lib/reminders";

interface ReminderCardProps {
  isActive: boolean;
  onScheduleClick?: () => void;
}

// Category colors for visual distinction
const getCategoryStyle = (category: Reminder["category"]) => {
  switch (category) {
    case "annual":
      return "border-l-4 border-l-sky-500 bg-white";
    case "today":
      return "border-l-4 border-l-emerald-500 bg-white";
    case "week":
      return "border-l-4 border-l-amber-500 bg-white";
    default:
      return "bg-white";
  }
};

export const ReminderCard = ({ isActive, onScheduleClick }: ReminderCardProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = ALL_REMINDERS.length;

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
              <p className="text-xs text-gray-500">
                {completedCount}/{totalItems} completed
              </p>
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

      {/* Scrollable Content - Single Unified List */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="space-y-2">
          {ALL_REMINDERS.map((reminder) => {
            const isScheduleType = reminder.actionType === "schedule";
            const isChecked = checkedItems[reminder.id];

            return (
              <div
                key={reminder.id}
                className={`p-3 rounded-xl transition-all shadow-sm ${getCategoryStyle(reminder.category)} ${
                  isChecked ? "opacity-60" : ""
                } ${!isScheduleType ? "cursor-pointer hover:shadow-md" : ""}`}
                onClick={() => !isScheduleType && handleCheckboxChange(reminder.id)}
                role={!isScheduleType ? "checkbox" : undefined}
                aria-checked={!isScheduleType ? isChecked : undefined}
                tabIndex={!isScheduleType ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!isScheduleType && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleCheckboxChange(reminder.id);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Checkbox or Icon */}
                    {isScheduleType ? (
                      <span className="text-lg flex-shrink-0">{reminder.icon}</span>
                    ) : (
                      <div className="flex-shrink-0">
                        {isChecked ? (
                          <CheckCircle2
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                            <span className="text-xs">{reminder.icon}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p
                          className={`font-semibold text-sm truncate ${
                            isChecked ? "text-gray-500 line-through" : "text-gray-900"
                          }`}
                        >
                          {reminder.title}
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg flex-shrink-0">
                          +{reminder.scoreBoost}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {reminder.dueDate ? `Due: ${reminder.dueDate}` : reminder.description}
                      </p>
                    </div>
                  </div>
                  {isScheduleType && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleClick?.();
                      }}
                      className="px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-lg hover:bg-sky-700 transition-colors flex-shrink-0"
                    >
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to My Health */}
        <Link
          href="/my-health"
          className="block w-full p-4 mt-4 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-xl text-center text-white font-semibold hover:from-sky-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          View Full Health Dashboard
          <ChevronRight className="w-4 h-4 inline ml-1" />
        </Link>
      </div>
    </div>
  );
};
