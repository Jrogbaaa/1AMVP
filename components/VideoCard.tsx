"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, Share2, Search, Volume2, VolumeX, Calendar, ArrowRight } from "lucide-react";
import type { Video, Doctor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface VideoCardProps {
  video: Video;
  doctor?: Doctor;
  isPersonalized?: boolean;
  patientName?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onMessage?: () => void;
  onScheduleClick?: () => void;
  onMuteChange?: (muted: boolean) => void;
  isActive: boolean;
  isMuted?: boolean; // Controlled mute state from parent
  showDesktopActions?: boolean;
}

export const VideoCard = ({
  video,
  doctor,
  isPersonalized = false,
  patientName,
  onPlay,
  onPause,
  onComplete,
  onMessage,
  onScheduleClick,
  onMuteChange,
  isActive,
  isMuted: controlledMuted = false,
  showDesktopActions = false,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Handle video ready state (fires when enough data is loaded)
  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // Handle video loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    // Video metadata is loaded - dimensions, duration available
    setIsVideoReady(true);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || hasVideoError) return;

    let mounted = true;
    let playAttemptTimeout: NodeJS.Timeout | null = null;

    const attemptPlay = async () => {
      if (!mounted || !videoElement || hasVideoError) return;

      try {
        // Ensure video is muted for autoplay (required by Chrome policy)
        videoElement.muted = true;
        
        // Reset to beginning
        videoElement.currentTime = 0;
        
        // Use play() promise with proper error handling for mobile browsers
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          if (mounted) {
            setIsPlaying(true);
            // Restore mute state after successful play
            videoElement.muted = controlledMuted;
            onPlay?.();
          }
        }
      } catch (error) {
        if (!mounted) return;
        
        // Handle specific error types
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            // Autoplay blocked - this is normal on some browsers
            // User will need to tap to play
            console.log("Autoplay blocked - waiting for user interaction");
            setIsPlaying(false);
          } else if (error.name === 'NotSupportedError') {
            // Source not supported
            console.error("Video format not supported");
            setHasVideoError(true);
          } else if (error.name === 'AbortError') {
            // Play was interrupted (e.g., by scrolling away)
            // This is normal, don't treat as error
            console.log("Video play interrupted");
          } else {
            console.log("Video play error:", error.message);
          }
        }
      }
    };

    if (isActive) {
      // Wait for video to be ready before attempting to play
      if (isVideoReady || videoElement.readyState >= 2) {
        attemptPlay();
      } else {
        // Set up listener for when video becomes ready
        const onCanPlayThrough = () => {
          if (mounted && isActive) {
            attemptPlay();
          }
        };
        videoElement.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        
        // Also try after a short delay as fallback
        playAttemptTimeout = setTimeout(() => {
          if (mounted && isActive && videoElement.readyState >= 1) {
            attemptPlay();
          }
        }, 500);

        return () => {
          mounted = false;
          videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
          if (playAttemptTimeout) clearTimeout(playAttemptTimeout);
        };
      }
    } else {
      // Not active - pause the video
      if (videoElement.isConnected && !videoElement.paused) {
        videoElement.pause();
      }
      if (mounted) {
        setIsPlaying(false);
      }
    }

    return () => {
      mounted = false;
      if (playAttemptTimeout) clearTimeout(playAttemptTimeout);
    };
  }, [isActive, onPlay, hasVideoError, isVideoReady, controlledMuted]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    const newMutedState = !controlledMuted;
    videoRef.current.muted = newMutedState;
    onMuteChange?.(newMutedState);
  };

  // Sync video muted state with controlled prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = controlledMuted;
    }
  }, [controlledMuted]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  const handleShare = async () => {
    const shareData = {
      title: video.title,
      text: video.description || `Check out this video: ${video.title}`,
      url: window.location.href,
    };

    try {
      // Use Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const imageSrc = video.posterUrl || video.thumbnailUrl || '';

  const handleVideoError = () => {
    setHasVideoError(true);
    setIsPlaying(false);
  };

  // Show video element only if we have a URL and no error
  const showVideo = video.videoUrl && !hasVideoError;

  return (
    <div className="video-card">
      {/* Video Element */}
      {showVideo && (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={imageSrc}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={controlledMuted}
          playsInline
          preload="auto"
          // Cross-browser compatibility attributes
          // @ts-expect-error - webkit-playsinline is a Safari-specific attribute
          webkit-playsinline="true"
          onCanPlay={handleCanPlay}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd}
          onClick={handlePlayPause}
          onError={handleVideoError}
        />
      )}

      {/* Fallback to poster image if no video or video error */}
      {(!video.videoUrl || hasVideoError) && imageSrc && (
        <Image
          src={imageSrc}
          alt={video.title}
          fill
          className="absolute inset-0 object-cover"
          priority={isActive}
        />
      )}

      {/* Play/Pause indicator - only show for working videos */}
      {showVideo && !isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 transition-opacity hover:bg-black/30"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Overlay gradient */}
      <div className="video-overlay" />

      {/* 1A Logo Watermark */}
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <Logo variant="icon" width={44} height={44} className="drop-shadow-lg" />
      </div>

      {/* Volume Toggle Button - only show for working videos */}
      {showVideo && (
        <button
          onClick={handleToggleMute}
          className="absolute top-5 right-5 z-20 flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all duration-200"
          aria-label={controlledMuted ? "Unmute video" : "Mute video"}
        >
          {controlledMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        {/* Top section - Empty for cleaner look */}
        <div className="flex justify-between items-start pointer-events-auto">
        </div>

        {/* Middle section - Empty (no play button for static images) */}
        <div className="flex items-center justify-center pointer-events-auto">
        </div>

        {/* Bottom section - extra bottom padding on mobile for bottom nav */}
        <div className="flex justify-between items-end pointer-events-auto pb-16 md:pb-8">
          {/* Left side - Video info */}
          <div className="flex-1 pr-4">
            {isPersonalized ? (
              <div className="space-y-2">
                {/* Value-focused headline */}
                <h3 className="text-white font-bold text-xl drop-shadow-lg">
                  Hey {patientName || "Dave"} — here&apos;s what to do next for your heart health
                </h3>
                
                {/* Doctor context */}
                <p className="text-white/80 text-sm drop-shadow-md">
                  Dr. {doctor?.name || "Ryan Mitchell"} explains your upcoming follow-up and what to expect.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-white/90 text-base line-clamp-2 drop-shadow-md">
                    {video.description}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Right side - Actions (mobile only, hidden on desktop) */}
          <div className="flex flex-col gap-4 items-center md:hidden">
            {/* Doctor avatar - FIRST (builds relationship) */}
            {doctor && (
              <Link
                href={`/doctor/${doctor.id}`}
                className="flex flex-col items-center gap-1"
                aria-label={`View Dr. ${doctor.name}'s profile`}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-transform">
                    {doctor.avatarUrl ? (
                      <Image
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-bold text-base">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Follow indicator */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                    +
                  </div>
                </div>
              </Link>
            )}

            {/* Discover button - SECOND */}
            <Link
              href="/discover"
              className="flex items-center justify-center w-11 h-11 bg-white/40 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-200"
              aria-label="Discover Doctors"
              tabIndex={0}
            >
              <Search className="w-5 h-5 text-white" />
            </Link>

            {/* Share button - only show for non-personalized videos */}
            {!isPersonalized && (
              <button
                onClick={handleShare}
                className="flex items-center justify-center w-11 h-11 bg-white/40 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/60 hover:scale-110 transition-all duration-200"
                aria-label="Share video"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

