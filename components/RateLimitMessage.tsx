import { Clock } from "lucide-react";

interface RateLimitMessageProps {
  remainingScrolls?: number;
}

export const RateLimitMessage = ({ remainingScrolls }: RateLimitMessageProps) => {
  if (remainingScrolls !== undefined && remainingScrolls > 0) {
    return (
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-2 z-50">
        <Clock className="w-5 h-5" />
        <span className="font-medium">
          {remainingScrolls} videos remaining in this session
        </span>
      </div>
    );
  }

  return (
    <div className="snap-item flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-8">
      <div className="text-center max-w-md">
        <Clock className="w-16 h-16 text-white mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-3">
          Take a breather
        </h2>
        <p className="text-white/90 text-lg mb-6">
          You've reached your viewing limit for now. Come back later for more personalized content.
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white/80 text-sm">
          <p>
            This helps ensure you have time to absorb the important health information your doctor has shared.
          </p>
        </div>
      </div>
    </div>
  );
};

