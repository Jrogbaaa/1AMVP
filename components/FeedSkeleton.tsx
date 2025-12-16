"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * FeedSkeleton Component
 * 
 * Loading skeleton for the video feed that matches the actual feed layout.
 * Prevents Cumulative Layout Shift (CLS) during initial load.
 */

interface FeedSkeletonProps {
  count?: number;
}

export const FeedItemSkeleton = () => {
  return (
    <div className="snap-item h-screen w-full flex items-center justify-center">
      <div className="h-full w-full md:h-[calc(100vh-2rem)] md:max-h-[900px] md:w-auto md:aspect-[9/16] md:rounded-2xl md:overflow-hidden relative bg-gray-900">
        {/* Video placeholder */}
        <Skeleton className="absolute inset-0 bg-gray-800" />
        
        {/* Gradient overlay skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        
        {/* Bottom content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 md:pb-4 space-y-3">
          {/* Doctor info skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-3 w-32 bg-gray-700/50" />
            </div>
          </div>
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
          </div>
          
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-gray-700/50" />
            <Skeleton className="h-6 w-20 rounded-full bg-gray-700/50" />
            <Skeleton className="h-6 w-14 rounded-full bg-gray-700/50" />
          </div>
        </div>
        
        {/* Right side action buttons skeleton */}
        <div className="absolute right-4 bottom-32 md:hidden flex flex-col gap-4 items-center">
          <Skeleton className="w-12 h-12 rounded-full bg-gray-700/50" />
          <Skeleton className="w-12 h-12 rounded-full bg-gray-700/50" />
          <Skeleton className="w-12 h-12 rounded-full bg-gray-700/50" />
        </div>
        
        {/* Play button skeleton (center) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-16 h-16 rounded-full bg-gray-700/30" />
        </div>
      </div>
      
      {/* Desktop sidebar skeleton */}
      <div className="hidden md:flex flex-col gap-6 items-center py-8 ml-4">
        <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
        <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
        <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
      </div>
    </div>
  );
};

export const FeedSkeleton = ({ count = 1 }: FeedSkeletonProps) => {
  return (
    <div className="feed-wrapper">
      {/* Desktop sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
        {/* Logo skeleton */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-12 w-40 bg-gray-200" />
            <Skeleton className="h-4 w-28 bg-gray-100" />
          </div>
        </div>
        
        {/* Navigation skeleton */}
        <nav className="flex-1 p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-6 h-6 rounded bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-100 mt-4">
            <Skeleton className="h-3 w-24 bg-gray-100 mb-3 mx-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200" />
              </div>
            ))}
          </div>
        </nav>
        
        {/* User section skeleton */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-3 w-16 bg-gray-100" />
            </div>
          </div>
        </div>
      </aside>
      
      {/* Feed container skeleton */}
      <div className="feed-container relative lg:ml-64">
        <div className="snap-container">
          {Array.from({ length: count }).map((_, index) => (
            <FeedItemSkeleton key={index} />
          ))}
        </div>
        
        {/* Mobile navigation skeleton */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
          <div className="flex items-center justify-around py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="w-5 h-5 bg-gray-200" />
                <Skeleton className="w-10 h-2 bg-gray-100" />
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default FeedSkeleton;

