"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Video,
  Square,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  X,
  Camera,
  Mic,
  MicOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onVideoRecorded?: (blob: Blob) => void;
  onAvatarCreated?: (avatarId: string) => void;
  maxDuration?: number; // in seconds
}

type RecordingState = "idle" | "countdown" | "recording" | "preview" | "uploading" | "processing" | "complete" | "error";

const RECORDING_TIPS = [
  "Look directly at the camera",
  "Speak clearly and naturally",
  "Good lighting on your face",
  "Quiet environment",
  "Neutral background",
];

export const VideoRecorder = ({
  onVideoRecorded,
  onAvatarCreated,
  maxDuration = 120, // 2 minutes default
}: VideoRecorderProps) => {
  const [state, setState] = useState<RecordingState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request camera/mic permissions and start stream
  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      streamRef.current = stream;
      setHasCameraPermission(true);
      setHasMicPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
      setError("Could not access camera or microphone. Please grant permissions.");
      setHasCameraPermission(false);
      setHasMicPermission(false);
    }
  }, []);

  // Stop all tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start countdown then recording
  const startRecording = useCallback(() => {
    setState("countdown");
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          beginRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Actually start recording
  const beginRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      onVideoRecorded?.(blob);
      setState("preview");
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Collect data every second
    setState("recording");
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= maxDuration - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxDuration, onVideoRecorded]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopStream();
  }, [stopStream]);

  // Re-record
  const handleReRecord = useCallback(async () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingTime(0);
    setState("idle");
    await startStream();
  }, [previewUrl, startStream]);

  // Upload video to create avatar
  const handleUpload = async () => {
    if (!recordedBlob) return;

    setState("uploading");
    setError(null);
    setUploadProgress(0);

    try {
      // Create FormData with the video
      const formData = new FormData();
      formData.append("video", recordedBlob, "avatar-recording.webm");

      // Simulate upload progress (real implementation would use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch("/api/heygen/create-avatar", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create avatar");
      }

      setState("processing");

      // In production, you'd poll for avatar status
      // For now, simulate processing time
      setTimeout(() => {
        setState("complete");
        onAvatarCreated?.(data.data?.avatarId || "demo_avatar_id");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video");
      setState("error");
    }
  };

  // Toggle preview playback
  const togglePlayback = () => {
    if (!previewVideoRef.current) return;

    if (isPlaying) {
      previewVideoRef.current.pause();
    } else {
      previewVideoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize stream on mount
  useEffect(() => {
    startStream();
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Record Your Avatar</h2>
            <p className="text-sm text-white/80">
              Record a short video to create your AI avatar
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Video Area */}
      <div className="relative aspect-video bg-gray-900">
        {/* Live Preview */}
        {(state === "idle" || state === "countdown" || state === "recording") && (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Countdown Overlay */}
            {state === "countdown" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-8xl font-bold text-white animate-pulse">{countdown}</div>
              </div>
            )}

            {/* Recording Indicator */}
            {state === "recording" && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-full">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">REC</span>
                <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}

            {/* Permission indicators */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className={cn("p-2 rounded-full", hasCameraPermission ? "bg-emerald-500" : "bg-red-500")}>
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div className={cn("p-2 rounded-full", hasMicPermission ? "bg-emerald-500" : "bg-red-500")}>
                {hasMicPermission ? (
                  <Mic className="w-4 h-4 text-white" />
                ) : (
                  <MicOff className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </>
        )}

        {/* Preview Playback */}
        {state === "preview" && previewUrl && (
          <>
            <video
              ref={previewVideoRef}
              src={previewUrl}
              className="w-full h-full object-cover transform -scale-x-100"
              onEnded={() => setIsPlaying(false)}
            />
            <button
              onClick={togglePlayback}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="p-4 bg-white/90 rounded-full">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-gray-900" />
                ) : (
                  <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
                )}
              </div>
            </button>
          </>
        )}

        {/* Uploading State */}
        {state === "uploading" && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white">
            <Upload className="w-12 h-12 mb-4 animate-bounce" />
            <p className="text-lg font-medium mb-2">Uploading Video...</p>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{uploadProgress}%</p>
          </div>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-pink-500" />
            <p className="text-lg font-medium mb-2">Creating Your Avatar...</p>
            <p className="text-sm text-gray-400">This may take a few minutes</p>
          </div>
        )}

        {/* Complete State */}
        {state === "complete" && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 flex flex-col items-center justify-center text-white">
            <CheckCircle className="w-16 h-16 mb-4" />
            <p className="text-2xl font-bold mb-2">Avatar Created!</p>
            <p className="text-sm text-white/80">Your AI avatar is ready to use</p>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-lg font-medium mb-2">Something went wrong</p>
            <button
              onClick={handleReRecord}
              className="px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6">
        {/* Idle/Recording Controls */}
        {(state === "idle" || state === "recording") && (
          <div className="flex items-center justify-center gap-4">
            {state === "idle" ? (
              <button
                onClick={startRecording}
                disabled={!hasCameraPermission || !hasMicPermission}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                <Square className="w-4 h-4" fill="currentColor" />
                Stop Recording
              </button>
            )}
          </div>
        )}

        {/* Preview Controls */}
        {state === "preview" && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReRecord}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Re-record
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Create Avatar
            </button>
          </div>
        )}

        {/* Tips */}
        {state === "idle" && (
          <div className="mt-6 p-4 bg-pink-50 rounded-xl">
            <p className="text-sm font-medium text-pink-800 mb-2">Recording Tips:</p>
            <ul className="grid grid-cols-2 gap-2">
              {RECORDING_TIPS.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-pink-700">
                  <CheckCircle className="w-4 h-4 text-pink-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Duration Info */}
        {state === "recording" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Recording: {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </p>
            <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${(recordingTime / maxDuration) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

