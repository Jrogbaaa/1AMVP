"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUserSync } from "@/hooks/useUserSync";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  RefreshCw,
  Send,
  ChevronRight,
  Search,
  Pill,
  Activity,
  Heart,
  X,
  Check,
  Loader2,
} from "lucide-react";

type TabType = "messages" | "reminders" | "suggested";
type FrequencyType = "one-time" | "daily" | "weekly";
type CategoryType = "medication" | "appointment" | "lifestyle" | "custom";

interface MessageTemplate {
  _id: Id<"doctorMessageTemplates">;
  doctorId: string;
  title: string;
  content: string;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

interface ReminderTemplate {
  _id: Id<"doctorReminderTemplates">;
  doctorId: string;
  title: string;
  description?: string;
  frequency: FrequencyType;
  category?: string;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

// Suggested templates that doctors can use
const SUGGESTED_MESSAGE_TEMPLATES = [
  {
    title: "Post-visit Follow-up",
    content:
      "Hi! I hope you're feeling well after your visit. Remember to follow the care plan we discussed. Feel free to reach out if you have any questions.",
  },
  {
    title: "Lab Results Ready",
    content:
      "Your recent lab results are ready. Everything looks good! Keep up the great work with your health routine.",
  },
  {
    title: "Medication Reminder",
    content:
      "Just a friendly reminder to take your prescribed medications as directed. Consistency is key to seeing the best results.",
  },
  {
    title: "Appointment Reminder",
    content:
      "Don't forget about your upcoming appointment. Please arrive 10 minutes early and bring any recent health records.",
  },
  {
    title: "Wellness Check-in",
    content:
      "How are you feeling? I wanted to check in and see how things are going. Let me know if you need anything.",
  },
];

const SUGGESTED_REMINDER_TEMPLATES = [
  {
    title: "Take morning medication",
    description: "Remember to take your prescribed medication with breakfast",
    frequency: "daily" as FrequencyType,
    category: "medication",
  },
  {
    title: "Log blood pressure",
    description: "Take and record your blood pressure reading",
    frequency: "daily" as FrequencyType,
    category: "lifestyle",
  },
  {
    title: "30-minute walk",
    description: "Get your daily exercise with a brisk walk",
    frequency: "daily" as FrequencyType,
    category: "lifestyle",
  },
  {
    title: "Weekly weight check",
    description: "Weigh yourself and track your progress",
    frequency: "weekly" as FrequencyType,
    category: "lifestyle",
  },
  {
    title: "Schedule annual physical",
    description: "Book your yearly wellness exam",
    frequency: "one-time" as FrequencyType,
    category: "appointment",
  },
  {
    title: "Refill prescription",
    description: "Call pharmacy to refill your medication",
    frequency: "one-time" as FrequencyType,
    category: "medication",
  },
];

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case "medication":
      return <Pill className="w-4 h-4" />;
    case "appointment":
      return <Calendar className="w-4 h-4" />;
    case "lifestyle":
      return <Activity className="w-4 h-4" />;
    default:
      return <Heart className="w-4 h-4" />;
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case "medication":
      return "bg-blue-100 text-blue-600";
    case "appointment":
      return "bg-purple-100 text-purple-600";
    case "lifestyle":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getFrequencyBadge = (frequency: FrequencyType) => {
  switch (frequency) {
    case "daily":
      return { label: "Daily", icon: <RefreshCw className="w-3 h-3" />, color: "bg-emerald-100 text-emerald-700" };
    case "weekly":
      return { label: "Weekly", icon: <Calendar className="w-3 h-3" />, color: "bg-amber-100 text-amber-700" };
    case "one-time":
      return { label: "One-time", icon: <Clock className="w-3 h-3" />, color: "bg-sky-100 text-sky-700" };
  }
};

export default function MyMessagesPage() {
  const { user } = useUserSync();
  const doctorId = user?.id || "";

  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<MessageTemplate | null>(null);
  const [editingReminder, setEditingReminder] = useState<ReminderTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFrequency, setFormFrequency] = useState<FrequencyType>("daily");
  const [formCategory, setFormCategory] = useState<CategoryType>("custom");
  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const messageTemplates = useQuery(
    api.doctorMessageTemplates.getByDoctor,
    doctorId ? { doctorId } : "skip"
  ) as MessageTemplate[] | undefined;

  const reminderTemplates = useQuery(
    api.doctorReminderTemplates.getByDoctor,
    doctorId ? { doctorId } : "skip"
  ) as ReminderTemplate[] | undefined;

  // Mutations
  const createMessageTemplate = useMutation(api.doctorMessageTemplates.create);
  const updateMessageTemplate = useMutation(api.doctorMessageTemplates.update);
  const deleteMessageTemplate = useMutation(api.doctorMessageTemplates.remove);

  const createReminderTemplate = useMutation(api.doctorReminderTemplates.create);
  const updateReminderTemplate = useMutation(api.doctorReminderTemplates.update);
  const deleteReminderTemplate = useMutation(api.doctorReminderTemplates.remove);

  // Filter templates by search query
  const filteredMessages = messageTemplates?.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReminders = reminderTemplates?.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleOpenCreateModal = () => {
    setFormTitle("");
    setFormContent("");
    setFormDescription("");
    setFormFrequency("daily");
    setFormCategory("custom");
    setEditingMessage(null);
    setEditingReminder(null);
    setIsCreateModalOpen(true);
  };

  const handleEditMessage = (template: MessageTemplate) => {
    setFormTitle(template.title);
    setFormContent(template.content);
    setEditingMessage(template);
    setEditingReminder(null);
    setIsCreateModalOpen(true);
  };

  const handleEditReminder = (template: ReminderTemplate) => {
    setFormTitle(template.title);
    setFormDescription(template.description || "");
    setFormFrequency(template.frequency);
    setFormCategory((template.category as CategoryType) || "custom");
    setEditingReminder(template);
    setEditingMessage(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveMessage = async () => {
    if (!doctorId || !formTitle.trim() || !formContent.trim()) return;

    setIsSaving(true);
    try {
      if (editingMessage) {
        await updateMessageTemplate({
          templateId: editingMessage._id,
          title: formTitle.trim(),
          content: formContent.trim(),
        });
      } else {
        await createMessageTemplate({
          doctorId,
          title: formTitle.trim(),
          content: formContent.trim(),
        });
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error saving message template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveReminder = async () => {
    if (!doctorId || !formTitle.trim()) return;

    setIsSaving(true);
    try {
      if (editingReminder) {
        await updateReminderTemplate({
          templateId: editingReminder._id,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          frequency: formFrequency,
          category: formCategory,
        });
      } else {
        await createReminderTemplate({
          doctorId,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          frequency: formFrequency,
          category: formCategory,
        });
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error saving reminder template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMessage = async (templateId: Id<"doctorMessageTemplates">) => {
    setIsDeleting(templateId);
    try {
      await deleteMessageTemplate({ templateId });
    } catch (error) {
      console.error("Error deleting message template:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteReminder = async (templateId: Id<"doctorReminderTemplates">) => {
    setIsDeleting(templateId);
    try {
      await deleteReminderTemplate({ templateId });
    } catch (error) {
      console.error("Error deleting reminder template:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUseSuggestedMessage = async (suggested: typeof SUGGESTED_MESSAGE_TEMPLATES[0]) => {
    if (!doctorId) return;
    setIsSaving(true);
    try {
      await createMessageTemplate({
        doctorId,
        title: suggested.title,
        content: suggested.content,
      });
    } catch (error) {
      console.error("Error creating from suggested:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseSuggestedReminder = async (suggested: typeof SUGGESTED_REMINDER_TEMPLATES[0]) => {
    if (!doctorId) return;
    setIsSaving(true);
    try {
      await createReminderTemplate({
        doctorId,
        title: suggested.title,
        description: suggested.description,
        frequency: suggested.frequency,
        category: suggested.category,
      });
    } catch (error) {
      console.error("Error creating from suggested:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "messages" as TabType, label: "Message Templates", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "reminders" as TabType, label: "Reminder Templates", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "suggested" as TabType, label: "Suggested", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Check-ins and Reminders</h1>
        <p className="text-gray-600 mt-1">
          Create and manage reusable templates for patient communication
        </p>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "suggested" && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          )}
        </div>

        {/* Search Bar */}
        {activeTab !== "suggested" && (
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-3">
              {filteredMessages?.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No message templates yet</h3>
                  <p className="text-gray-500 mb-4">Create your first template or use a suggested one</p>
                  <button
                    onClick={() => setActiveTab("suggested")}
                    className="text-sky-600 font-medium hover:underline"
                  >
                    View suggested templates →
                  </button>
                </div>
              ) : (
                filteredMessages?.map((template) => (
                  <div
                    key={template._id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{template.title}</h3>
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                            Used {template.usageCount}x
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{template.content}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditMessage(template)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                          aria-label="Edit template"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(template._id)}
                          disabled={isDeleting === template._id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                          aria-label="Delete template"
                        >
                          {isDeleting === template._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                          aria-label="Send to patient"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === "reminders" && (
            <div className="space-y-3">
              {filteredReminders?.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No reminder templates yet</h3>
                  <p className="text-gray-500 mb-4">Create your first template or use a suggested one</p>
                  <button
                    onClick={() => setActiveTab("suggested")}
                    className="text-sky-600 font-medium hover:underline"
                  >
                    View suggested templates →
                  </button>
                </div>
              ) : (
                filteredReminders?.map((template) => {
                  const frequencyBadge = getFrequencyBadge(template.frequency);
                  return (
                    <div
                      key={template._id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", getCategoryColor(template.category))}>
                            {getCategoryIcon(template.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{template.title}</h3>
                              <span className={cn("flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", frequencyBadge.color)}>
                                {frequencyBadge.icon}
                                {frequencyBadge.label}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                                Used {template.usageCount}x
                              </span>
                            </div>
                            {template.description && (
                              <p className="text-gray-600 text-sm">{template.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditReminder(template)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                            aria-label="Edit template"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(template._id)}
                            disabled={isDeleting === template._id}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete template"
                          >
                            {isDeleting === template._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            aria-label="Send to patient"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Suggested Tab */}
          {activeTab === "suggested" && (
            <div className="space-y-6">
              {/* Suggested Messages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-600" />
                  Suggested Message Templates
                </h3>
                <div className="space-y-3">
                  {SUGGESTED_MESSAGE_TEMPLATES.map((suggested, index) => (
                    <div
                      key={index}
                      className="p-4 bg-sky-50 rounded-xl border border-sky-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">{suggested.title}</h4>
                          <p className="text-gray-600 text-sm">{suggested.content}</p>
                        </div>
                        <button
                          onClick={() => handleUseSuggestedMessage(suggested)}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Use This
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Reminders */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Suggested Reminder Templates
                </h3>
                <div className="space-y-3">
                  {SUGGESTED_REMINDER_TEMPLATES.map((suggested, index) => {
                    const frequencyBadge = getFrequencyBadge(suggested.frequency);
                    return (
                      <div
                        key={index}
                        className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg", getCategoryColor(suggested.category))}>
                              {getCategoryIcon(suggested.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-gray-900">{suggested.title}</h4>
                                <span className={cn("flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", frequencyBadge.color)}>
                                  {frequencyBadge.icon}
                                  {frequencyBadge.label}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{suggested.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUseSuggestedReminder(suggested)}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Use This
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingMessage
                  ? "Edit Message Template"
                  : editingReminder
                  ? "Edit Reminder Template"
                  : activeTab === "messages"
                  ? "Create Message Template"
                  : "Create Reminder Template"}
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              {/* Content (for messages) */}
              {(activeTab === "messages" || editingMessage) && (
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Message Content
                  </label>
                  <textarea
                    id="content"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Enter your message..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                  />
                </div>
              )}

              {/* Description (for reminders) */}
              {(activeTab === "reminders" || editingReminder) && !editingMessage && (
                <>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Add a description..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <div className="flex gap-2">
                      {(["daily", "weekly", "one-time"] as FrequencyType[]).map((freq) => {
                        const badge = getFrequencyBadge(freq);
                        return (
                          <button
                            key={freq}
                            onClick={() => setFormFrequency(freq)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                              formFrequency === freq
                                ? badge.color + " ring-2 ring-offset-1 ring-gray-300"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            {badge.icon}
                            {badge.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["medication", "appointment", "lifestyle", "custom"] as CategoryType[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFormCategory(cat)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                            formCategory === cat
                              ? getCategoryColor(cat) + " ring-2 ring-offset-1 ring-gray-300"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {getCategoryIcon(cat)}
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingMessage || activeTab === "messages" ? handleSaveMessage : handleSaveReminder}
                disabled={isSaving || !formTitle.trim() || (activeTab === "messages" && !formContent.trim())}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {editingMessage || editingReminder ? "Save Changes" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

