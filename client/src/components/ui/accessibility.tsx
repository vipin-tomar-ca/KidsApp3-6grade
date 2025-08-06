import { Volume2, VolumeX, Type, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react";
import { textToSpeech } from "@/utils/textToSpeech";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccessibilityToolbarProps {
  className?: string;
}

export function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const [fontSize, setFontSize] = useState(100);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  useEffect(() => {
    // Apply font size to document root
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80));
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechEnabled) {
      textToSpeech.stop();
    }
  };

  return (
    <div className={cn("fixed top-4 right-4 bg-white rounded-2xl shadow-lg p-2 z-50 flex space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={decreaseFontSize}
        className="p-2 hover:bg-gray-100"
        title="Decrease text size"
      >
        <ZoomOut size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={increaseFontSize}
        className="p-2 hover:bg-gray-100"
        title="Increase text size"
      >
        <ZoomIn size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSpeech}
        className={cn(
          "p-2 hover:bg-gray-100",
          speechEnabled ? "bg-kid-blue text-white hover:bg-blue-600" : ""
        )}
        title={speechEnabled ? "Turn off text-to-speech" : "Turn on text-to-speech"}
      >
        {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </Button>
      
      <div className="text-xs bg-gray-100 rounded-lg px-2 py-1 flex items-center">
        <Type size={12} className="mr-1" />
        {fontSize}%
      </div>
    </div>
  );
}

interface SpeakableTextProps {
  children: React.ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
}

export function SpeakableText({ children, text, className, onClick }: SpeakableTextProps) {
  const handleClick = () => {
    const textToSpeak = text || (typeof children === 'string' ? children : '');
    if (textToSpeak && textToSpeech.isSupported()) {
      textToSpeech.speak(textToSpeak);
    }
    onClick?.();
  };

  return (
    <div 
      className={cn("cursor-pointer hover:bg-blue-50 rounded transition-colors", className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </div>
  );
}