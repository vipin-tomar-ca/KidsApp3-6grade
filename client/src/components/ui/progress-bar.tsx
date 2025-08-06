import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  color = "blue",
  showPercentage = false,
  animated = true 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    blue: "bg-kid-blue",
    green: "bg-kid-green",
    purple: "bg-kid-purple",
    orange: "bg-kid-orange",
    red: "bg-kid-red",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colorClasses[color],
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className={cn("text-sm font-bold", `text-kid-${color}`)}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
