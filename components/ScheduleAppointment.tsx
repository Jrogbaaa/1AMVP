"use client";

import { useState } from "react";
import { Calendar, Clock, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

interface ScheduleAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  userId: string;
}

export const ScheduleAppointment = ({
  isOpen,
  onClose,
  doctor,
  userId,
}: ScheduleAppointmentProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would make an API call to save the appointment request
    console.log("Appointment request:", {
      userId,
      doctorId: doctor.id,
      date: selectedDate,
      time: selectedTime,
      reason,
    });

    setIsSubmitted(true);

    // Close modal after 3 seconds
    setTimeout(() => {
      onClose();
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setReason("");
      setIsSubmitted(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Schedule Follow-Up
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor info */}
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Appointment with</p>
              <p className="font-semibold text-gray-900">
                Dr. {doctor.name}
              </p>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              {doctor.clinicName && (
                <p className="text-sm text-gray-600 mt-2">
                  {doctor.clinicName}
                </p>
              )}
            </div>

            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className="input"
              />
            </div>

            {/* Time picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Preferred Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="input"
              >
                <option value="">Select a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Brief description of what you'd like to discuss..."
                className="input resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Appointment
            </button>

            <p className="text-xs text-gray-500 text-center">
              This is a request. The clinic will confirm your appointment shortly.
            </p>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-600">
              Your request has been submitted. The clinic will confirm shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

