"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: { type: "image" | "video" | "file"; url: string; name: string }[];
}

interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Dave Thompson",
    patientAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    lastMessage: "Thank you for the follow-up video, Dr. Ellis! I have a question about my medication schedule...",
    lastMessageTime: "5 min ago",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "patient",
        text: "Hi Dr. Ellis, I just watched the follow-up video you sent. Very helpful!",
        timestamp: "Yesterday 2:30 PM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "doctor",
        text: "Great to hear, Dave! Let me know if you have any questions about the information covered.",
        timestamp: "Yesterday 3:15 PM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "patient",
        text: "Actually, I do have a question. The video mentioned taking medication with food, but should that be before or after meals?",
        timestamp: "Yesterday 4:00 PM",
        status: "read",
      },
      {
        id: "m4",
        senderId: "doctor",
        text: "Good question! For your specific medication, it's best to take it about 30 minutes after eating. This helps with absorption and reduces any stomach discomfort.",
        timestamp: "Yesterday 4:45 PM",
        status: "read",
      },
      {
        id: "m5",
        senderId: "patient",
        text: "Thank you for the follow-up video, Dr. Ellis! I have a question about my medication schedule - should I take it at the same time every day?",
        timestamp: "5 min ago",
        status: "delivered",
      },
    ],
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Sarah Mitchell",
    patientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "I watched the blood pressure video. Very informative! When should I start monitoring daily?",
    lastMessageTime: "2 hours ago",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        senderId: "doctor",
        text: "Hi Sarah! I've assigned some new videos about blood pressure management to your account. Please take a look when you have time.",
        timestamp: "Yesterday 10:00 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "patient",
        text: "Thanks Dr. Ellis! I'll watch them today.",
        timestamp: "Yesterday 11:30 AM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "patient",
        text: "I watched the blood pressure video. Very informative! When should I start monitoring daily?",
        timestamp: "2 hours ago",
        status: "delivered",
      },
    ],
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Michael Chen",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "All done with the recommended videos. Feeling much more informed about my condition.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "patient",
        text: "Dr. Ellis, I've completed all the videos you assigned. The medication management chapter was particularly helpful.",
        timestamp: "Yesterday 9:00 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "doctor",
        text: "Excellent work, Michael! I'm glad you found them helpful. Your progress has been outstanding.",
        timestamp: "Yesterday 10:30 AM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "patient",
        text: "All done with the recommended videos. Feeling much more informed about my condition.",
        timestamp: "Yesterday 11:00 AM",
        status: "read",
      },
    ],
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Emily Rodriguez",
    patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "I'll try to watch the remaining videos this weekend.",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "doctor",
        text: "Hi Emily, I noticed you haven't watched the latest videos I assigned. Is everything okay?",
        timestamp: "4 days ago",
        status: "read",
      },
      {
        id: "m2",
        senderId: "patient",
        text: "Sorry Dr. Ellis, I've been really busy with work. I'll try to watch the remaining videos this weekend.",
        timestamp: "3 days ago",
        status: "read",
      },
    ],
  },
  {
    id: "5",
    patientId: "5",
    patientName: "James Wilson",
    patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: "The stress management techniques are really helping. Thank you!",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "patient",
        text: "Dr. Ellis, the breathing exercises from the stress management video are amazing!",
        timestamp: "3 days ago",
        status: "read",
      },
      {
        id: "m2",
        senderId: "doctor",
        text: "That's wonderful to hear, James! Consistent practice will help even more over time.",
        timestamp: "2 days ago",
        status: "read",
      },
      {
        id: "m3",
        senderId: "patient",
        text: "The stress management techniques are really helping. Thank you!",
        timestamp: "2 days ago",
        status: "read",
      },
    ],
  },
];

const MessagesContent = () => {
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient");

  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    preselectedPatient
      ? MOCK_CONVERSATIONS.find((c) => c.patientId === preselectedPatient) || null
      : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    // In a real app, this would send the message to the backend
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-sky-500" />;
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col",
            selectedConversation && "hidden md:flex"
          )}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left",
                  selectedConversation?.id === conv.id && "bg-sky-50"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={conv.patientAvatar}
                      alt={conv.patientName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "font-medium text-gray-900 truncate",
                        conv.unreadCount > 0 && "font-semibold"
                      )}
                    >
                      {conv.patientName}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1 truncate",
                      conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                    )}
                  >
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={selectedConversation.patientAvatar}
                  alt={selectedConversation.patientName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {selectedConversation.patientName}
                </p>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Voice call"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Video call"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.senderId === "doctor" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-2.5",
                      message.senderId === "doctor"
                        ? "bg-sky-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 mt-1",
                        message.senderId === "doctor" ? "text-sky-200" : "text-gray-400"
                      )}
                    >
                      <span className="text-xs">{message.timestamp}</span>
                      {message.senderId === "doctor" && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Empty State
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 max-w-sm">
                Choose a conversation from the list to view messages and respond to your patients.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
