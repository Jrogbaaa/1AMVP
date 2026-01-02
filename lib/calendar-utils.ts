/**
 * Calendar utilities for generating .ics files
 * Works with Google Calendar, Apple Calendar, Outlook, and other calendar apps
 */

export interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  frequency?: "daily" | "weekly";
  reminderId?: string;
}

/**
 * Format a date to iCalendar format (YYYYMMDDTHHMMSS)
 */
const formatICSDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Generate a unique ID for the calendar event
 */
const generateUID = (reminderId?: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  const id = reminderId || randomPart;
  return `${id}-${timestamp}@1another.health`;
};

/**
 * Escape special characters in ICS text fields
 */
const escapeICSText = (text: string): string => {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
};

/**
 * Generate RRULE string for recurring events
 */
const generateRRule = (frequency?: "daily" | "weekly"): string => {
  switch (frequency) {
    case "daily":
      return "RRULE:FREQ=DAILY";
    case "weekly":
      return "RRULE:FREQ=WEEKLY";
    default:
      return "";
  }
};

/**
 * Generate .ics file content for a calendar event
 */
export const generateICS = (event: CalendarEvent): string => {
  const now = new Date();
  const endDate = event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration
  const uid = generateUID(event.reminderId);
  const rrule = generateRRule(event.frequency);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//1Another Health//Health Reminders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  if (rrule) {
    lines.push(rrule);
  }

  // Add alarm/reminder 15 minutes before
  lines.push(
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${escapeICSText(event.title)}`,
    "END:VALARM"
  );

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
};

/**
 * Download an ICS file to the user's device
 */
export const downloadICS = (event: CalendarEvent): void => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a Google Calendar URL for the event
 */
export const generateGoogleCalendarURL = (event: CalendarEvent): string => {
  const startDate = event.startDate.toISOString().replace(/-|:|\.\d+/g, "");
  const endDate = (event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000))
    .toISOString()
    .replace(/-|:|\.\d+/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || "",
  });

  if (event.location) {
    params.append("location", event.location);
  }

  // Add recurrence for Google Calendar
  if (event.frequency === "daily") {
    params.append("recur", "RRULE:FREQ=DAILY");
  } else if (event.frequency === "weekly") {
    params.append("recur", "RRULE:FREQ=WEEKLY");
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Open Google Calendar in a new window to add the event
 */
export const openGoogleCalendar = (event: CalendarEvent): void => {
  const url = generateGoogleCalendarURL(event);
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Create calendar event from a reminder
 */
export const createCalendarEventFromReminder = (reminder: {
  title: string;
  description?: string;
  dueDate?: number;
  frequency: "one-time" | "daily" | "weekly";
  _id?: string;
}): CalendarEvent => {
  // For one-time reminders, use due date or default to tomorrow 9am
  let startDate: Date;
  if (reminder.dueDate) {
    startDate = new Date(reminder.dueDate);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(9, 0, 0, 0);
  }

  // For daily reminders, set to tomorrow 9am
  if (reminder.frequency === "daily") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(9, 0, 0, 0);
  }

  // For weekly reminders, set to next Monday 9am
  if (reminder.frequency === "weekly") {
    startDate = new Date();
    const daysUntilMonday = (8 - startDate.getDay()) % 7 || 7;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
    startDate.setHours(9, 0, 0, 0);
  }

  return {
    title: `🩺 ${reminder.title}`,
    description: reminder.description
      ? `${reminder.description}\n\nFrom your healthcare provider via 1Another Health`
      : "Health reminder from your healthcare provider via 1Another Health",
    startDate,
    frequency: reminder.frequency === "one-time" ? undefined : reminder.frequency,
    reminderId: reminder._id,
  };
};

