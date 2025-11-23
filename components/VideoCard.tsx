"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause, Share2, Heart, Search } from "lucide-react";
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
  isActive: boolean;
  healthScore?: number;
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
  isActive,
  healthScore,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const playVideo = async () => {
      if (!mounted || !video) return;
      
      if (isActive) {
        try {
          // Check if video is still connected to DOM
          if (video.isConnected) {
            await video.play();
            if (mounted) {
              setIsPlaying(true);
              onPlay?.();
            }
          }
        } catch (error) {
          // Ignore if play was interrupted
          if (mounted) {
            console.log("Video play interrupted:", error);
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
  }, [isActive, onPlay]);

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

  return (
    <div className="video-card">
      {/* Doctor Photo */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={video.title}
          fill
          className="absolute inset-0 object-cover"
          priority={isActive}
        />
      )}

      {/* Overlay gradient */}
      <div className="video-overlay" />

      {/* 1A Watermark */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="text-white/40 text-2xl font-bold drop-shadow-lg">
          1A
        </div>
      </div>

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
            {isPersonalized && patientName ? (
              <div className="space-y-3">
                <h3 className="text-white font-bold text-2xl drop-shadow-lg">
                  Hey {patientName}, good to see you today!
                </h3>
                <p className="text-white/90 text-sm drop-shadow-md mt-3">
                  📅 Reminder: Schedule your follow-up visit in 3 months
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

          {/* Right side - Actions */}
          <div className="flex flex-col gap-6 items-center">
            {/* Discover button */}
            <Link
              href="/discover"
              className="flex items-center justify-center w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/70 hover:scale-110 transition-all duration-200"
              aria-label="Discover Doctors"
              tabIndex={0}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Doctor avatar */}
            {doctor && (
              <button
                className="flex flex-col items-center gap-1"
                onClick={onMessage}
                aria-label="Message doctor"
              >
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
              </button>
            )}

            {/* Heart score - show above share button */}
            {healthScore !== undefined && (
              <button
                onClick={onHeartClick}
                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                aria-label="View action items and reminders"
              >
                <div className="relative w-14 h-14">
                  {/* Background heart with subtle shadow */}
                  <div className="absolute inset-0 w-14 h-14 rounded-full blur-md opacity-30 bg-white" />
                  
                  {/* Outer ring/border */}
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm" 
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
                      className={`w-14 h-14 transition-all duration-500 ${
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
                  
                  {/* Score text overlay with better contrast */}
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10">
                    {healthScore}%
                  </span>
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

