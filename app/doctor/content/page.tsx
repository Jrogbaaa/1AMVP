"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Film,
  PenTool,
  ChevronRight,
  Play,
  Clock,
  Wand2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIScriptGenerator } from "@/components/AIScriptGenerator";

type ContentMode = "select" | "ai-generate" | "templates" | "library" | "custom";

// Pre-made script templates
const SCRIPT_TEMPLATES = [
  {
    id: "t1",
    title: "Post-Visit Follow-Up",
    description: "Thank patients for their visit and summarize key points",
    category: "General",
    duration: "30s",
    script: `Hi there! Thank you for coming in to see me today. I wanted to follow up on our conversation and make sure you have everything you need.

Remember, it's important to take your medications as prescribed and keep track of any symptoms you experience. If you have any questions or concerns before your next appointment, don't hesitate to reach out.

Take care, and I'll see you at your next visit!`,
  },
  {
    id: "t2",
    title: "Medication Reminder",
    description: "Explain how to take a new medication",
    category: "Treatment",
    duration: "1 min",
    script: `I wanted to talk to you about your new medication. It's important that you take this exactly as prescribed to get the best results.

Take one pill in the morning with food. This helps your body absorb the medication properly and reduces the chance of an upset stomach.

Common side effects might include mild headaches or fatigue for the first few days. These usually go away as your body adjusts. However, if you experience anything severe or concerning, please call our office right away.

Remember to store your medication at room temperature and away from direct sunlight. If you have any questions, I'm here to help.`,
  },
  {
    id: "t3",
    title: "Test Results Explanation",
    description: "Walk through recent test results",
    category: "Diagnostic",
    duration: "1 min",
    script: `I have your test results back, and I wanted to walk you through them personally.

Overall, your results look good. Your cholesterol levels are within the normal range, and your blood pressure readings have improved since your last visit. This tells me that the lifestyle changes you've been making are really working.

There is one area I'd like us to focus on - your blood sugar levels are slightly elevated. This isn't cause for alarm, but it does mean we should pay attention to your diet and exercise habits.

At your next visit, we'll recheck these numbers and discuss any adjustments we might need to make. Keep up the great work!`,
  },
  {
    id: "t4",
    title: "Pre-Procedure Instructions",
    description: "Prepare patients for an upcoming procedure",
    category: "Procedural",
    duration: "2 min",
    script: `I want to make sure you're fully prepared for your upcoming procedure. Let me walk you through what to expect.

First, please don't eat or drink anything after midnight the night before. This includes water, gum, and mints. An empty stomach is important for your safety during the procedure.

On the day of the procedure, wear comfortable, loose-fitting clothing. Leave all jewelry and valuables at home. Make sure someone can drive you home afterward, as you won't be able to drive yourself.

When you arrive, we'll go through a final checklist together. The procedure itself usually takes about 30 to 45 minutes. You'll be given medication to help you relax and stay comfortable throughout.

Afterward, you'll rest in our recovery area for about an hour. Some patients feel a little groggy, which is completely normal. You should plan to take it easy for the rest of the day.

If you have any questions before your procedure date, please call our office. We're here to help make this as smooth as possible for you.`,
  },
  {
    id: "t5",
    title: "Heart-Healthy Diet Tips",
    description: "Nutritional guidance for cardiovascular health",
    category: "Lifestyle",
    duration: "1 min",
    script: `Let's talk about eating for a healthy heart. Small changes to your diet can make a big difference.

Focus on filling half your plate with vegetables at every meal. Choose colorful options like leafy greens, tomatoes, and bell peppers. These are packed with nutrients that support your heart.

Switch to whole grains instead of refined carbohydrates. Brown rice, quinoa, and whole wheat bread are excellent choices that help maintain healthy cholesterol levels.

Limit your salt intake to less than 2,300 milligrams per day. This means reading food labels and cooking at home more often. You'll be surprised how much sodium is hidden in restaurant and packaged foods.

Include fatty fish like salmon or mackerel twice a week. The omega-3 fatty acids in fish are especially good for your heart.

Remember, you don't have to change everything at once. Start with one or two changes and build from there. Every healthy choice counts!`,
  },
  {
    id: "t6",
    title: "Exercise Getting Started",
    description: "Guide for beginning a safe exercise routine",
    category: "Lifestyle",
    duration: "1 min",
    script: `I'm excited to help you start an exercise routine that works for you. The key is to start slowly and build up gradually.

Begin with just 10 minutes of walking each day. This might not sound like much, but it's the foundation we'll build on. Choose a time that works for your schedule and try to stick to it.

As you feel stronger, add 5 minutes each week until you reach 30 minutes most days. This gradual approach helps prevent injury and makes exercise feel manageable.

Listen to your body. It's normal to feel a little tired or sore when you first start, but sharp pain or extreme fatigue means you should slow down.

The best exercise is one you'll actually do. If walking isn't your thing, try swimming, biking, or even dancing. The goal is to move your body regularly in a way you enjoy.

Let me know how it goes at your next appointment. I'm here to support you every step of the way!`,
  },
];

// Pre-generated video library (mock data)
const VIDEO_LIBRARY = [
  {
    id: "v1",
    title: "Understanding Your Heart",
    description: "Basic anatomy and how your heart works",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
    duration: "4:32",
    category: "Education",
    views: 1234,
  },
  {
    id: "v2",
    title: "Blood Pressure Basics",
    description: "What the numbers mean and why they matter",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
    duration: "3:45",
    category: "Education",
    views: 892,
  },
  {
    id: "v3",
    title: "Managing Stress",
    description: "Techniques for reducing stress and anxiety",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    duration: "5:15",
    category: "Lifestyle",
    views: 2156,
  },
];

export default function ContentPage() {
  const [mode, setMode] = useState<ContentMode>("select");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof SCRIPT_TEMPLATES[0] | null>(null);
  const [customScript, setCustomScript] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle script generation from template
  const handleUseTemplate = (template: typeof SCRIPT_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setCustomScript(template.script);
    setMode("custom");
  };

  // Copy script
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate video from script
  const handleGenerateVideo = async (script: string) => {
    if (!script.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/heygen/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedTemplate?.title || "Custom Video",
          script,
          description: selectedTemplate?.description || "Custom generated video",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start video generation");
      }

      // Success - redirect to library or show success message
      alert("Video generation started! Check your video library for the result.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Content</h1>
        <p className="text-gray-500 mt-1">
          Generate personalized patient education videos
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mode Selection */}
      {mode === "select" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Script Generator */}
          <button
            onClick={() => setMode("ai-generate")}
            className="group relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white text-left hover:from-violet-600 hover:to-purple-700 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">AI Script Generator</h3>
                <p className="text-white/80 text-sm">
                  Describe your topic and let AI write the perfect script for you. Refine it through conversation.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <Wand2 className="w-4 h-4" />
              <span>Powered by GPT-4</span>
            </div>
          </button>

          {/* Pre-made Templates */}
          <button
            onClick={() => setMode("templates")}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-sky-300 hover:bg-sky-50/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-sky-100 rounded-xl text-sky-600">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pre-made Scripts</h3>
                <p className="text-gray-500 text-sm">
                  Choose from professionally written templates for common patient scenarios.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span>{SCRIPT_TEMPLATES.length} templates available</span>
            </div>
          </button>

          {/* Video Library */}
          <button
            onClick={() => setMode("library")}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Film className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Library</h3>
                <p className="text-gray-500 text-sm">
                  Browse and send pre-generated videos to your patients.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span>{VIDEO_LIBRARY.length} videos ready to send</span>
            </div>
          </button>

          {/* Custom Script */}
          <button
            onClick={() => setMode("custom")}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <PenTool className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Write Your Own</h3>
                <p className="text-gray-500 text-sm">
                  Type or paste your own script and generate a personalized video.
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span>Full creative control</span>
            </div>
          </button>
        </div>
      )}

      {/* AI Generator Mode */}
      {mode === "ai-generate" && (
        <div className="space-y-4">
          <button
            onClick={() => setMode("select")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to options
          </button>
          <AIScriptGenerator
            onScriptGenerated={(script) => setGeneratedScript(script)}
          />
          {generatedScript && (
            <div className="flex justify-end">
              <button
                onClick={() => handleGenerateVideo(generatedScript)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Templates Mode */}
      {mode === "templates" && (
        <div className="space-y-4">
          <button
            onClick={() => setMode("select")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to options
          </button>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCRIPT_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {template.duration}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-sky-600 transition-all"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handleCopy(template.script)}
                    className="px-3 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Library Mode */}
      {mode === "library" && (
        <div className="space-y-4">
          <button
            onClick={() => setMode("select")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to options
          </button>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VIDEO_LIBRARY.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-3 bg-white/90 rounded-full">
                      <Play className="w-6 h-6 text-gray-900" fill="currentColor" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {video.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{video.views.toLocaleString()} views</span>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                      Send to Patient
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Script Mode */}
      {mode === "custom" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setMode("select");
              setSelectedTemplate(null);
              setCustomScript("");
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to options
          </button>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedTemplate ? `Editing: ${selectedTemplate.title}` : "Write Your Script"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Type or paste your script below. Your AI avatar will speak these words in the video.
              </p>
            </div>

            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              rows={12}
              placeholder="Hi there! I wanted to talk to you about..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{customScript.split(/\s+/).filter(Boolean).length} words</span>
                <span>~{Math.round(customScript.split(/\s+/).filter(Boolean).length / 2.5)} seconds</span>
              </div>
              <button
                onClick={() => handleGenerateVideo(customScript)}
                disabled={!customScript.trim() || isGenerating}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all",
                  customScript.trim() && !isGenerating
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

