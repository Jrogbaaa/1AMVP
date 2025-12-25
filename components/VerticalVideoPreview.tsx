"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Volume2, VolumeX } from "lucide-react";
import type { Video, Doctor } from "@/lib/types";

interface VerticalVideoPreviewProps {
  video: Video;
  doctor?: Doctor;
  href: string;
}

export const VerticalVideoPreview = ({
  video,
  doctor,
  href,
}: VerticalVideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
      setHasStartedPlaying(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Link
      href={href}
      className="flex-shrink-0 w-36 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Watch ${video.title} by ${doctor?.name || "Doctor"}`}
    >
      {/* TikTok-style vertical preview container */}
      <div className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
        {/* Thumbnail / Poster */}
        {!hasStartedPlaying && (
          <Image
            src={video.thumbnailUrl || video.posterUrl || ""}
            alt={video.title}
            fill
            className="object-cover"
            sizes="144px"
          />
        )}

        {/* Video element - shows on hover */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Play indicator (when not hovering) */}
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}

        {/* Mute toggle (when hovering) */}
        {isHovering && (
          <button
            onClick={handleToggleMute}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-transform hover:scale-110"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-12 right-2 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">
          {formatDuration(video.duration)}
        </div>

        {/* Doctor info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          {doctor && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border border-white/30">
                {doctor.avatarUrl ? (
                  <Image
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-[8px] font-bold">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-white text-[10px] font-medium truncate">
                Dr. {doctor.name.split(" ")[0]}
              </span>
            </div>
          )}
          <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight">
            {video.title}
          </h3>
        </div>

        {/* Hover indicator bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className={`h-full bg-gradient-to-r from-[#00BFA6] to-[#00A6CE] transition-all duration-300 ${
              isHovering ? "w-full" : "w-0"
            }`}
          />
        </div>
      </div>
    </Link>
  );
};

