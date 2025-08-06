import { GraduationCap } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Getting Ready..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-kid-gradient flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 animate-bounce-gentle mx-auto">
          <GraduationCap className="text-kid-blue text-3xl" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{message}</h3>
        <div className="flex justify-center space-x-1">
          <div 
            className="w-2 h-2 bg-kid-blue rounded-full animate-bounce" 
            style={{ animationDelay: "0.1s" }}
          />
          <div 
            className="w-2 h-2 bg-kid-green rounded-full animate-bounce" 
            style={{ animationDelay: "0.2s" }}
          />
          <div 
            className="w-2 h-2 bg-kid-orange rounded-full animate-bounce" 
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}
