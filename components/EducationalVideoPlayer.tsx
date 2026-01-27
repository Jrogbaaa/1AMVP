"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Share2,
  Volume2,
  VolumeX,
  Loader2,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { EducationalVideo } from "@/data/educationalVideos";

interface EducationalVideoPlayerProps {
  video: EducationalVideo;
}

export function EducationalVideoPlayer({ video }: EducationalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Play failed:", err);
      });
    }
  }, [isPlaying]);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const handleShare = useCallback(async () => {
    // Generate shareable /learn/[slug] URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${baseUrl}/learn/${video.slug}`;
    const shareData = {
      title: video.title,
      text: video.description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [video.title, video.description, video.slug]);

  // Sync React state with native video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleNativePlay = () => setIsPlaying(true);
    const handleNativePause = () => setIsPlaying(false);

    videoElement.addEventListener("play", handleNativePlay);
    videoElement.addEventListener("pause", handleNativePause);

    return () => {
      videoElement.removeEventListener("play", handleNativePlay);
      videoElement.removeEventListener("pause", handleNativePause);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Video */}
      {!hasError && (
        <video
          ref={videoRef}
          src={video.videoPath}
          poster={video.thumbnailPath}
          className="absolute inset-0 w-full h-full object-contain"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onClick={handlePlayPause}
        />
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <span className="text-white/80 text-sm font-medium">Loading video...</span>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isLoading && !hasError && !isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 hover:bg-black/30 transition-colors"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1">Video unavailable</h4>
              <p className="text-white/70 text-sm">There was a problem loading this video</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
        {/* Back button */}
        <Link
          href="/discover"
          className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
          aria-label="Back to discover"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        {/* Logo */}
        <Logo variant="icon" width={40} height={40} className="drop-shadow-lg" />

        {/* Mute toggle */}
        {!hasError && (
          <button
            onClick={handleToggleMute}
            className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
        <div className="flex items-end justify-between gap-4">
          {/* Video Info */}
          <div className="flex-1">
            {video.category && (
              <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm rounded-full">
                {video.category}
              </span>
            )}
            <h1 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
              {video.title}
            </h1>
            <p className="text-white/80 text-sm line-clamp-2 drop-shadow-md">
              {video.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Play/Pause (when playing) */}
            {isPlaying && (
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                aria-label="Pause"
              >
                <Pause className="w-5 h-5 text-white" fill="currentColor" />
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors relative"
              aria-label="Share"
            >
              {showCopied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Share2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
