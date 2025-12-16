"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, Share2, Heart, Search, Volume2, VolumeX, Calendar, ArrowRight } from "lucide-react";
import type { Video, Doctor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: Video;
  doctor?: Doctor;
  isPersonalized?: boolean;
  patientName?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onMessage?: () => void;
  onHeartClick?: () => void;
  onScheduleClick?: () => void;
  isActive: boolean;
  healthScore?: number;
  showDesktopActions?: boolean; // For rendering actions outside video on desktop
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
  onHeartClick,
  onScheduleClick,
  isActive,
  healthScore,
  showDesktopActions = false,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Audio ON by default
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasVideoError) return;

    let mounted = true;

    const playVideo = async () => {
      if (!mounted || !video || hasVideoError) return;
      
      if (isActive) {
        try {
          // Check if video is still connected to DOM
          if (video.isConnected && video.readyState >= 1) {
            // Restart video from beginning when becoming active
            video.currentTime = 0;
            await video.play();
            if (mounted) {
              setIsPlaying(true);
              onPlay?.();
            }
          }
        } catch (error) {
          // Ignore if play was interrupted or video source failed
          if (mounted) {
            console.log("Video play interrupted:", error);
            // Check if it's a source error
            if (error instanceof Error && error.name === 'NotSupportedError') {
              setHasVideoError(true);
            }
          }
        }
      } else {
        if (video.isConnected) {
          video.pause();
        }
        if (mounted) {
          setIsPlaying(false);
        }
      }
    };

    playVideo();

    return () => {
      mounted = false;
    };
  }, [isActive, onPlay, hasVideoError]);

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
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

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
          muted={isMuted}
          playsInline
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
        <Image
          src="/images/1a-icon.png?v=2"
          alt="1Another"
          width={44}
          height={44}
          className="drop-shadow-lg"
          unoptimized
        />
      </div>

      {/* Volume Toggle Button - only show for working videos */}
      {showVideo && (
        <button
          onClick={handleToggleMute}
          className="absolute top-5 right-5 z-20 flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all duration-200"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
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

        {/* Bottom section */}
        <div className="flex justify-between items-center pointer-events-auto pb-8">
          {/* Left side - Video info */}
          <div className="flex-1 pr-4">
            {isPersonalized ? (
              <div className="space-y-2">
                {/* Context badge - continuity */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white/90 text-[10px] font-medium">Since your last visit • 2 weeks ago</span>
                </div>
                
                {/* Value-focused headline */}
                <h3 className="text-white font-bold text-xl drop-shadow-lg">
                  Hey {patientName || "Dave"} — here&apos;s what to do next for your heart health
                </h3>
                
                {/* Doctor context */}
                <p className="text-white/80 text-sm drop-shadow-md">
                  Dr. {doctor?.name || "Lisa Mitchell"} explains your upcoming follow-up and what to expect.
                </p>
                
                {/* Clear action button */}
                <button
                  onClick={onScheduleClick}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
                  aria-label="Schedule your follow-up visit"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
          <div className="flex flex-col gap-6 items-center md:hidden">
            {/* Doctor avatar - FIRST (builds relationship) */}
            {doctor && (
              <button
                className="flex flex-col items-center gap-1"
                onClick={onMessage}
                aria-label={`Message Dr. ${doctor.name}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-transform">
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
                        <span className="text-white font-bold text-lg">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Follow indicator */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    +
                  </div>
                </div>
              </button>
            )}

            {/* Discover button - SECOND */}
            <Link
              href="/discover"
              className="flex items-center justify-center w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/70 hover:scale-110 transition-all duration-200"
              aria-label="Discover Doctors"
              tabIndex={0}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Heart score - THIRD (My Heart) */}
            {healthScore !== undefined && (
              <button
                onClick={onHeartClick}
                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                aria-label="View action items and reminders"
              >
                <div className="relative w-7 h-7">
                  {/* Background heart with subtle shadow */}
                  <div className="absolute inset-0 w-7 h-7 rounded-full blur-md opacity-30 bg-white" />
                  
                  {/* Outer ring/border */}
                  <div className="absolute inset-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm" 
                       style={{
                         WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
                         maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
                         WebkitMaskRepeat: 'no-repeat',
                         maskRepeat: 'no-repeat',
                         WebkitMaskSize: 'contain',
                         maskSize: 'contain',
                         WebkitMaskPosition: 'center',
                         maskPosition: 'center'
                       }}
                  />
                  
                  {/* Filled heart with gradient and clip-path */}
                  <div 
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{ 
                      clipPath: `inset(${100 - healthScore}% 0 0 0)`
                    }}
                  >
                    <div 
                      className={`w-7 h-7 transition-all duration-500 ${
                        healthScore >= 70 ? "bg-gradient-to-br from-emerald-400 to-green-600" : 
                        healthScore >= 40 ? "bg-gradient-to-br from-amber-400 to-orange-500" : 
                        "bg-gradient-to-br from-rose-400 to-red-600"
                      }`}
                      style={{
                        WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\' stroke=\'currentColor\' stroke-width=\'1.5\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
                        maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\' stroke=\'currentColor\' stroke-width=\'1.5\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'%3E%3C/path%3E%3C/svg%3E")',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    />
                  </div>
                </div>
              </button>
            )}

            {/* Share button - only show for non-personalized videos */}
            {!isPersonalized && (
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1"
                aria-label="Share video"
              >
                <Share2 className="w-8 h-8 text-white" />
                <span className="text-white text-xs">Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

