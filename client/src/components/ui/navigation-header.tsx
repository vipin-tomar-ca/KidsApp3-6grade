import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Trophy, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  className?: string;
  showBackButton?: boolean;
  title?: string;
  progress?: number;
}

export function NavigationHeader({ 
  className, 
  showBackButton = true, 
  title,
  progress 
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={cn(
      "bg-white shadow-lg rounded-b-3xl p-4 mb-6 sticky top-0 z-50",
      className
    )}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 hover:bg-gray-50 rounded-2xl p-2 transition-colors group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-slow group-hover:scale-110 transition-transform">
              <BookOpen className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Learning Hub
              </h1>
              <p className="text-xs text-gray-500">For young learners</p>
            </div>
          </button>
          
          {title && (
            <>
              <div className="w-px h-8 bg-gray-300 hidden sm:block" />
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
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