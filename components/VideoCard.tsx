"use client";

import { useRef, useEffect, useState } from "react";
import { Heart, MessageCircle, Bookmark, Play, Pause, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Video, Doctor } from "@/lib/types";
import Image from "next/image";

interface VideoCardProps {
  video: Video;
  doctor?: Doctor;
  isPersonalized?: boolean;
  patientName?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onMessage?: () => void;
  isActive: boolean;
}

export const VideoCard = ({
  video,
  doctor,
  isPersonalized = false,
  patientName,
  onPlay,
  onPause,
  onComplete,
  onLike,
  onSave,
  onMessage,
  isActive,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
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

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
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

  return (
    <div className="video-card">
      {/* Poster/Thumbnail background */}
      {video.posterUrl && (
        <Image
          src={video.posterUrl}
          alt={video.title}
          fill
          className="absolute inset-0 object-cover"
          priority={isActive}
        />
      )}
      
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={video.posterUrl || video.thumbnailUrl}
        playsInline
        loop={!isPersonalized}
        onEnded={handleVideoEnd}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="video-overlay" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        {/* Top section - Personalized greeting */}
        <div className="flex justify-between items-start pointer-events-auto">
          {isPersonalized && patientName && doctor && (
            <div className="flex-1 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm rounded-2xl p-4 pr-8">
              <h2 className="text-white text-3xl font-bold drop-shadow-lg">
                {patientName}, thanks for coming in today ❤️
              </h2>
            </div>
          )}
        </div>

        {/* Middle section - Play/Pause button */}
        <div className="flex items-center justify-center pointer-events-auto">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            )}
          </button>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-end pointer-events-auto">
          {/* Left side - Video info */}
          <div className="flex-1 pr-4 mb-2">
            {!isPersonalized && (
              <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                {video.title}
              </h3>
            )}
            {video.description && (
              <p className="text-white/90 text-base line-clamp-2 drop-shadow-md">
                {video.description}
              </p>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-4 items-center">
            {/* Doctor avatar */}
            {doctor && (
              <button
                className="flex flex-col items-center gap-1"
                onClick={onMessage}
                aria-label="View doctor profile"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
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

            {/* Like button */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn(
                  "w-8 h-8",
                  liked ? "text-red-500 fill-red-500" : "text-white"
                )}
              />
              <span className="text-white text-xs">Like</span>
            </button>

            {/* Message button */}
            {onMessage && (
              <button
                onClick={onMessage}
                className="flex flex-col items-center gap-1"
                aria-label="Message doctor"
              >
                <MessageCircle className="w-8 h-8 text-white" />
                <span className="text-white text-xs">Message</span>
              </button>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1"
              aria-label="Share video"
            >
              <Share2 className="w-8 h-8 text-white" />
              <span className="text-white text-xs">Share</span>
            </button>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1"
              aria-label={saved ? "Unsave" : "Save"}
            >
              <Bookmark
                className={cn(
                  "w-8 h-8",
                  saved ? "text-yellow-500 fill-yellow-500" : "text-white"
                )}
              />
              <span className="text-white text-xs">Save</span>
            </button>
          </div>
        </div>

        {/* Personalized CTA buttons */}
        {isPersonalized && (
          <div className="mt-4 flex flex-col gap-3 pointer-events-auto">
            {onMessage && (
              <button
                onClick={onMessage}
                className="w-full py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Message your doctor
              </button>
            )}
            <button
              onClick={() => {/* Will be handled by parent */}}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

