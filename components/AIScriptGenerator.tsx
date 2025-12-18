"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Clock,
  MessageSquare,
  Wand2,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIScriptGeneratorProps {
  onScriptGenerated?: (script: string) => void;
  initialScript?: string;
  healthCondition?: string;
}

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", emoji: "👔" },
  { value: "friendly", label: "Friendly", emoji: "😊" },
  { value: "empathetic", label: "Empathetic", emoji: "💙" },
  { value: "educational", label: "Educational", emoji: "📚" },
] as const;

const DURATION_OPTIONS = [
  { value: "short", label: "30 seconds", words: "~75 words" },
  { value: "medium", label: "1 minute", words: "~150 words" },
  { value: "long", label: "2 minutes", words: "~300 words" },
] as const;

const QUICK_PROMPTS = [
  "Make it shorter",
  "Add more empathy",
  "Simplify the language",
  "Add a call-to-action",
  "Make it more encouraging",
  "Add specific next steps",
];

export const AIScriptGenerator = ({
  onScriptGenerated,
  initialScript,
  healthCondition,
}: AIScriptGeneratorProps) => {
  const [mode, setMode] = useState<"generate" | "chat">("generate");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "empathetic" | "educational">("friendly");
  const [duration, setDuration] = useState<"short" | "medium" | "long">("medium");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedScript, setGeneratedScript] = useState(initialScript || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate script from topic
  const handleGenerateScript = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          healthCondition,
          tone,
          duration,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate script");
      }

      setGeneratedScript(data.data.script);
      onScriptGenerated?.(data.data.script);
      
      // Switch to chat mode for refinements
      setMode("chat");
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: `I've generated a script about "${topic}". Here it is:\n\n${data.data.script}\n\nEstimated duration: ~${data.data.estimatedDuration} seconds (${data.data.wordCount} words)\n\nWould you like me to make any changes?`,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate script");
    } finally {
      setIsGenerating(false);
    }
  };

  // Send chat message for refinements
  const handleSendChat = async (message?: string) => {
    const inputMessage = message || chatInput;
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsSendingChat(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            currentScript: generatedScript,
            healthCondition,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Try to extract updated script from response
      const scriptMatch = data.data.message.match(/```[\s\S]*?```/);
      if (scriptMatch) {
        const newScript = scriptMatch[0].replace(/```/g, "").trim();
        setGeneratedScript(newScript);
        onScriptGenerated?.(newScript);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSendingChat(false);
    }
  };

  // Copy script to clipboard
  const handleCopyScript = async () => {
    if (!generatedScript) return;
    await navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset and start over
  const handleReset = () => {
    setTopic("");
    setGeneratedScript("");
    setMessages([]);
    setMode("generate");
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Script Generator</h2>
            <p className="text-sm text-white/80">
              {mode === "generate" ? "Describe your topic and I'll write the script" : "Refine your script with AI"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Generate Mode */}
      {mode === "generate" && (
        <div className="p-6 space-y-4">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What topic should the video cover?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to take blood pressure medication correctly, Managing stress for heart health, Post-surgery recovery tips..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none transition-all"
            />
          </div>

          {/* Options Row */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowToneDropdown(!showToneDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl hover:border-violet-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{TONE_OPTIONS.find((t) => t.value === tone)?.emoji}</span>
                    <span>{TONE_OPTIONS.find((t) => t.value === tone)?.label}</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showToneDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                    {TONE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTone(option.value);
                          setShowToneDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-violet-50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                          tone === option.value && "bg-violet-50 text-violet-700"
                        )}
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Length
              </label>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                      duration === option.value
                        ? "border-violet-600 bg-violet-50 text-violet-700"
                        : "border-gray-200 text-gray-600 hover:border-violet-300"
                    )}
                  >
                    <div>{option.label}</div>
                    <div className="text-xs opacity-70">{option.words}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Context (collapsible) */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-violet-600 hover:text-violet-700 list-none flex items-center gap-2">
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              Add more context (optional)
            </summary>
            <div className="mt-3">
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Any specific points to cover, patient demographics, or other details..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none transition-all text-sm"
              />
            </div>
          </details>

          {/* Generate Button */}
          <button
            onClick={handleGenerateScript}
            disabled={!topic.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Script
              </>
            )}
          </button>
        </div>
      )}

      {/* Chat Mode */}
      {mode === "chat" && (
        <div className="flex flex-col h-[500px]">
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user"
                      ? "bg-sky-100 text-sky-600"
                      : "bg-violet-100 text-violet-600"
                  )}
                >
                  {message.role === "user" ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl",
                    message.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isSendingChat && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendChat(prompt)}
                disabled={isSendingChat}
                className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-full whitespace-nowrap hover:bg-violet-100 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Ask to refine the script..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || isSendingChat}
                className="px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Script Preview (shown when script exists) */}
      {generatedScript && (
        <div className="border-t border-gray-100">
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                ~{Math.round(generatedScript.split(/\s+/).length / 2.5)} seconds
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">
                {generatedScript.split(/\s+/).length} words
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Script
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {generatedScript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

