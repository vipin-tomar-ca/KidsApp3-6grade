import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Type, ZoomIn, ZoomOut, Contrast } from "lucide-react";
import { cn } from "@/lib/utils";

// Text-to-Speech Component
interface SpeakableTextProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
}

export const SpeakableText: React.FC<SpeakableTextProps> = ({ 
  text, 
  children, 
  className,
  autoPlay = false 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    if (autoPlay && isSupported) {
      speakText();
    }
  }, [autoPlay, isSupported, text]);

  const speakText = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower for children
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative group", className)}>
      {children}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
        onClick={speakText}
        title={isSpeaking ? "Stop reading" : "Read aloud"}
      >
        {isSpeaking ? (
          <VolumeX size={14} className="text-orange-500" />
        ) : (
          <Volume2 size={14} className="text-blue-500" />
        )}
      </Button>
    </div>
  );
};

// Accessibility Toolbar
export const AccessibilityToolbar: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={cn(
        "bg-white shadow-lg rounded-lg border transition-all duration-300",
        isExpanded ? "p-4" : "p-2"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-2"
          title="Accessibility options"
        >
          <Type size={16} />
        </Button>
        
        {isExpanded && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                title="Decrease font size"
                disabled={fontSize <= 12}
              >
                <ZoomOut size={14} />
              </Button>
              <span className="text-xs px-2">{fontSize}px</span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                title="Increase font size"
                disabled={fontSize >= 24}
              >
                <ZoomIn size={14} />
              </Button>
            </div>
            
            <Button
              variant={highContrast ? "default" : "outline"}
              size="sm"
              onClick={toggleHighContrast}
              className="w-full"
              title="Toggle high contrast"
            >
              <Contrast size={14} className="mr-1" />
              {highContrast ? "Normal" : "High Contrast"}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFontSize}
              className="w-full text-xs"
              title="Reset font size"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Keyboard Navigation Helper
export const useKeyboardNavigation = (items: any[], onSelect: (index: number) => void) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setCurrentIndex(prev => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect(currentIndex);
          break;
        case 'Escape':
          setCurrentIndex(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onSelect]);

  return currentIndex;
};

// Focus Management
export const useFocusManagement = () => {
  const focusableElements = useRef<HTMLElement[]>([]);

  const updateFocusableElements = (container: HTMLElement) => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    focusableElements.current = Array.from(
      container.querySelectorAll(selectors.join(','))
    ) as HTMLElement[];
  };

  const focusFirst = () => {
    if (focusableElements.current.length > 0) {
      focusableElements.current[0].focus();
    }
  };

  const focusLast = () => {
    if (focusableElements.current.length > 0) {
      focusableElements.current[focusableElements.current.length - 1].focus();
    }
  };

  return { updateFocusableElements, focusFirst, focusLast };
};