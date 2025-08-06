import React from 'react';
import { useLocation } from 'wouter';
import { Home, BookOpen, Trophy, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  className?: string;
  showBack?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  progress?: number;
  theme?: 'light' | 'dark';
}

export function NavigationHeader({ 
  className, 
  showBack = false,
  showBackButton = true, 
  onBack,
  title,
  progress,
  theme = 'light'
}: NavigationHeaderProps) {
  const [location, navigate] = useLocation();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1 as any); // Go back in history
    }
  };

  return (
    <header className={cn(
      "shadow-lg rounded-b-3xl p-4 mb-6 sticky top-0 z-50",
      theme === 'dark' ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-white",
      className
    )}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side - Back Button and Title */}
        <div className="flex items-center space-x-3">
          {(showBack || showBackButton) && (
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className={cn(
                "rounded-xl p-2 transition-colors",
                theme === 'dark' ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"
              )}
            >
              ← Back
            </Button>
          )}
          
          <button
            onClick={handleHomeClick}
            className={cn(
              "flex items-center space-x-2 rounded-2xl p-2 transition-colors group",
              theme === 'dark' ? "hover:bg-white/10" : "hover:bg-gray-50"
            )}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-slow group-hover:scale-110 transition-transform">
              <BookOpen className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                "text-lg font-bold transition-colors",
                theme === 'dark' ? "text-white group-hover:text-blue-200" : "text-gray-800 group-hover:text-blue-600"
              )}>
                Learning Hub
              </h1>
              <p className={cn(
                "text-xs",
                theme === 'dark' ? "text-blue-100" : "text-gray-500"
              )}>For young learners</p>
            </div>
          </button>
          
          {title && (
            <>
              <div className={cn(
                "w-px h-8 hidden sm:block",
                theme === 'dark' ? "bg-white/30" : "bg-gray-300"
              )} />
              <h2 className={cn(
                "text-xl font-bold",
                theme === 'dark' ? "text-white" : "text-gray-800"
              )}>{title}</h2>
            </>
          )}
        </div>

        {/* Center - Progress (if provided) */}
        {progress !== undefined && (
          <div className="hidden md:flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <div className="bg-gray-200 rounded-full h-2 w-32">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{progress}%</span>
          </div>
        )}

        {/* Right side - Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="rounded-full w-10 h-10 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Home size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfileClick}
            className="rounded-full w-10 h-10 p-0 hover:bg-green-50 hover:text-green-600"
          >
            <User size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;