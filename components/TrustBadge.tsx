import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  className?: string;
  variant?: "default" | "compact";
}

export const TrustBadge = ({ className, variant = "default" }: TrustBadgeProps) => {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-medical-trust", className)}>
        <Shield className="w-4 h-4" />
        <span>Secure & Private</span>
      </div>
    );
  }

  return (
    <div className={cn("trust-badge", className)}>
      <Shield className="w-5 h-5" />
      <span>Your information is secure and private to you and your doctor</span>
    </div>
  );
};

