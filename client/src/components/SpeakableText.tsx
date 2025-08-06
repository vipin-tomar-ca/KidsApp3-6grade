import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

interface SpeakableTextProps {
  text: string;
  children: React.ReactNode;
  emphasize?: string[];
  showControls?: boolean;
  className?: string;
}

const SpeakableText: React.FC<SpeakableTextProps> = ({
  text,
  children,
  emphasize = [],
  showControls = false,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window);
    
    // Cleanup on unmount
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const createUtterance = (textToSpeak: string): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Child-friendly voice settings
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 0.8;
    
    // Try to use a child-friendly voice
    const voices = window.speechSynthesis.getVoices();
    const childVoice = voices.find(voice => 
      voice.name.includes('Child') || 
      voice.name.includes('Female') ||
      voice.lang.includes('en-US')
    );
    
    if (childVoice) {
      utterance.voice = childVoice;
    }

    // Event listeners
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    utterance.onpause = () => setIsPlaying(false);

    return utterance;
  };

  const handleSpeak = () => {
    if (!isSupported) return;

    try {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      // Process text with emphasis
      let processedText = text;
      emphasize.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processedText = processedText.replace(regex, `${word}... ${word}`);
      });

      utteranceRef.current = createUtterance(processedText);
      window.speechSynthesis.speak(utteranceRef.current);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!isSupported) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`speakable-text ${className}`}>
      <div className="d-flex align-items-start gap-2">
        <div className="flex-grow-1">
          {children}
        </div>
        
        <div className="d-flex gap-1">
          <Button
            onClick={handleSpeak}
            variant="outline"
            size="sm"
            aria-label={isPlaying ? "Stop reading" : "Read aloud"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          {showControls && (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                size="sm"
                disabled={!isPlaying}
                aria-label="Pause reading"
              >
                <Pause size={16} />
              </Button>
              
              <Button
                onClick={handleStop}
                variant="outline"
                size="sm"
                disabled={!isPlaying}
                aria-label="Stop reading"
              >
                <Square size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakableText;