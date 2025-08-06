import { cn } from "@/lib/utils";
import { Star, Medal, Trophy } from "lucide-react";

interface AchievementBadgeProps {
  name: string;
  icon?: string;
  color?: "yellow" | "green" | "blue" | "purple" | "orange";
  type?: "badge" | "medal" | "trophy";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function AchievementBadge({ 
  name, 
  icon, 
  color = "yellow", 
  type = "badge",
  size = "md",
  animated = true,
  className 
}: AchievementBadgeProps) {
  const colorClasses = {
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    green: "bg-gradient-to-br from-green-400 to-green-600",
    blue: "bg-gradient-to-br from-blue-400 to-blue-600",
    purple: "bg-gradient-to-br from-purple-400 to-purple-600",
    orange: "bg-gradient-to-br from-orange-400 to-orange-600",
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const IconComponent = type === "medal" ? Medal : type === "trophy" ? Trophy : Star;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "rounded-full flex items-center justify-center shadow-lg",
          colorClasses[color],
          sizeClasses[size],
          animated && "animate-pulse-slow hover:animate-bounce"
        )}
      >
        <IconComponent className="text-white" size={size === "lg" ? 24 : size === "md" ? 16 : 12} />
      </div>
      <span className={cn(
        "text-gray-600 mt-1 text-center font-medium",
        size === "sm" ? "text-xs" : "text-xs"
      )}>
        {name}
      </span>
    </div>
  );
}
