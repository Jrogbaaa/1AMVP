"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Share2,
  Search,
  Volume2,
  VolumeX,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
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
  isMuted?: boolean;
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
  onMuteChange,
  isActive,
  isMuted: controlledMuted = false,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Handle video ready state (fires when enough data is loaded)
  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
    setIsLoading(false);
  }, []);

  // Handle video loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    setIsVideoReady(true);
    setIsLoading(false);
  }, []);

  // Handle video loading start
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasVideoError(false);
  }, []);

  // Handle waiting (buffering)
  const handleWaiting = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Handle can play through (buffering complete)
  const handleCanPlayThrough = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Retry loading video after error
  const handleRetry = useCallback(() => {
    setHasVideoError(false);
    setIsLoading(true);
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
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
            setAutoplayBlocked(false);
            // Restore mute state after successful play
            videoElement.muted = controlledMuted;
            onPlay?.();
          }
        }
      } catch (error) {
        if (!mounted) return;

        // Handle specific error types
        if (error instanceof Error) {
          if (error.name === "NotAllowedError") {
            // Autoplay blocked - show tap to play UI
            console.log("Autoplay blocked - waiting for user interaction");
            setIsPlaying(false);
            setAutoplayBlocked(true);
          } else if (error.name === "NotSupportedError") {
            // Source not supported
            console.error("Video format not supported");
            setHasVideoError(true);
          } else if (error.name === "AbortError") {
            // Play was interrupted (e.g., by scrolling away)
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
        videoElement.addEventListener("canplaythrough", onCanPlayThrough, {
          once: true,
        });

        // Also try after a short delay as fallback
        playAttemptTimeout = setTimeout(() => {
          if (mounted && isActive && videoElement.readyState >= 1) {
            attemptPlay();
          }
        }, 500);

        return () => {
          mounted = false;
          videoElement.removeEventListener("canplaythrough", onCanPlayThrough);
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

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          onPlay?.();
        })
        .catch((err) => {
          console.error("Play failed:", err);
        });
    }
  }, [isPlaying, onPause, onPlay]);

  // Handle tap on video area (for mobile touch)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Only handle single touch
      if (e.touches.length === 1) {
        e.preventDefault();
        handlePlayPause();
      }
    },
    [handlePlayPause]
  );

  const handleToggleMute = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (!videoRef.current) return;

      const newMutedState = !controlledMuted;
      videoRef.current.muted = newMutedState;
      onMuteChange?.(newMutedState);
    },
    [controlledMuted, onMuteChange]
  );

  // Sync video muted state with controlled prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = controlledMuted;
    }
  }, [controlledMuted]);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    onComplete?.();
  }, [onComplete]);

  // Sync React state with native video play/pause events
  // This handles cases where video is paused/played externally (e.g., by browser or programmatically)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleNativePlay = () => {
      setIsPlaying(true);
    };

    const handleNativePause = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener("play", handleNativePlay);
    videoElement.addEventListener("pause", handleNativePause);

    return () => {
      videoElement.removeEventListener("play", handleNativePlay);
      videoElement.removeEventListener("pause", handleNativePause);
    };
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: video.title,
      text: video.description || `Check out this video: ${video.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [video.title, video.description]);

  const imageSrc = video.posterUrl || video.thumbnailUrl || "";

  const handleVideoError = useCallback(() => {
    setHasVideoError(true);
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  // Show video element only if we have a URL and no error
  const showVideo = video.videoUrl && !hasVideoError;

  // Show play button overlay when:
  // 1. Video exists and is not playing
  // 2. Autoplay was blocked (tap to play)
  // 3. User paused the video
  const showPlayOverlay =
    showVideo && !isPlaying && (autoplayBlocked || !isLoading);

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
          webkit-playsinline="true"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlayThrough={handleCanPlayThrough}
          onWaiting={handleWaiting}
          onEnded={handleVideoEnd}
          onClick={handlePlayPause}
          onTouchStart={handleTouchStart}
          onError={handleVideoError}
          data-testid="video-element"
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

      {/* Loading State - Spinner overlay */}
      {showVideo && isLoading && !hasVideoError && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/40"
          data-testid="video-loading"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <span className="text-white/80 text-sm font-medium">
              Loading video...
            </span>
          </div>
        </div>
      )}

      {/* Play/Pause overlay - tap to play */}
      {showPlayOverlay && (
        <button
          onClick={handlePlayPause}
          onTouchStart={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 transition-opacity hover:bg-black/30 active:bg-black/40"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          data-testid="play-overlay"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl active:scale-95 transition-transform">
              <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
            </div>
            {autoplayBlocked && (
              <span className="text-white font-medium text-sm drop-shadow-lg">
                Tap to play
              </span>
            )}
          </div>
        </button>
      )}

      {/* Error State - With retry button */}
      {hasVideoError && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 bg-black/60"
          data-testid="video-error"
        >
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1">
                Video unavailable
              </h4>
              <p className="text-white/70 text-sm">
                There was a problem loading this video
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-full text-white font-medium transition-all"
              aria-label="Retry loading video"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* No overlay - TikTok style clean look */}

      {/* 1A Logo Watermark */}
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <Logo
          variant="icon"
          width={44}
          height={44}
          className="drop-shadow-lg"
        />
      </div>

      {/* Volume Toggle Button - only show for working videos */}
      {showVideo && !hasVideoError && (
        <button
          onClick={handleToggleMute}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-5 right-5 z-20 flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 active:bg-black/70 transition-all duration-200"
          aria-label={controlledMuted ? "Unmute video" : "Mute video"}
          data-testid="mute-toggle"
        >
          {controlledMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      {/* Right side actions - positioned independently */}
      <div className="absolute right-3 bottom-32 md:hidden flex flex-col gap-5 items-center pointer-events-auto z-20">
        {/* Doctor avatar */}
        {doctor && (
          <Link
            href={`/profile/${doctor.id}`}
            className="flex flex-col items-center"
            aria-label={`View Dr. ${doctor.name}'s profile`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                {doctor.avatarUrl ? (
                  <Image
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    width={48}
                    height={48}
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
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                +
              </div>
            </div>
          </Link>
        )}

        {/* Discover button */}
        <Link
          href="/discover"
          className="flex items-center justify-center w-12 h-12"
          aria-label="Discover Doctors"
        >
          <Search className="w-7 h-7 text-white [filter:_drop-shadow(0_2px_4px_rgb(0_0_0_/_90%))]" />
        </Link>

        {/* Share button */}
        {!isPersonalized && (
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-12 h-12"
            aria-label="Share video"
          >
            <Share2 className="w-7 h-7 text-white [filter:_drop-shadow(0_2px_4px_rgb(0_0_0_/_90%))]" />
          </button>
        )}
      </div>

      {/* Bottom text - at absolute bottom edge */}
      <div className="absolute bottom-1 left-0 right-16 px-3 pointer-events-none z-20">
        {isPersonalized ? (
          <div>
            <p className="text-white font-bold text-[13px] [text-shadow:_0_1px_3px_rgb(0_0_0_/_100%),_0_0_8px_rgb(0_0_0_/_80%)]">
              @dr.{doctor?.name?.toLowerCase().replace(' ', '') || "doctor"}
            </p>
            <p className="text-white text-[13px] [text-shadow:_0_1px_3px_rgb(0_0_0_/_100%),_0_0_8px_rgb(0_0_0_/_80%)]">
              Hey {patientName || "Dave"} — here&apos;s what to do next
            </p>
          </div>
        ) : (
          <div>
            {doctor && (
              <p className="text-white font-bold text-[13px] [text-shadow:_0_1px_3px_rgb(0_0_0_/_100%),_0_0_8px_rgb(0_0_0_/_80%)]">
                @dr.{doctor.name.toLowerCase().replace(' ', '')}
              </p>
            )}
            <p className="text-white text-[13px] [text-shadow:_0_1px_3px_rgb(0_0_0_/_100%),_0_0_8px_rgb(0_0_0_/_80%)] line-clamp-1">
              {video.title}{video.description ? ` - ${video.description}` : ''} <span className="font-semibold">...more</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
