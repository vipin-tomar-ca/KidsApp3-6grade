import React, { useState, useEffect, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Eye,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Lightbulb
} from "lucide-react";
import { Alert, Badge, ProgressBar, Tooltip, OverlayTrigger } from "react-bootstrap";
import { 
  academicIntegrityService, 
  ActivitySession, 
  SuspiciousEvent,
  AutomatedFeedback 
} from '@/services/academicIntegrityApi';
import { cn } from "@/lib/utils";

interface IntegrityMonitorProps {
  userId: string;
  subject: string;
  activityType: 'quiz' | 'writing' | 'worksheet' | 'creative';
  grade: number;
  onSuspiciousActivity?: (events: SuspiciousEvent[]) => void;
  onFeedback?: (feedback: AutomatedFeedback[]) => void;
}

const IntegrityMonitor: React.FC<IntegrityMonitorProps> = ({
  userId,
  subject,
  activityType,
  grade,
  onSuspiciousActivity,
  onFeedback
}) => {
  const [session, setSession] = useState<ActivitySession | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentIntegrityScore, setCurrentIntegrityScore] = useState(100);
  const [recentFeedback, setRecentFeedback] = useState<AutomatedFeedback[]>([]);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [inactivityWarning, setInactivityWarning] = useState(false);

  // Timer for inactivity detection
  const inactivityTimer = useTimer({
    expiryTimestamp: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    onExpire: handleInactivityDetected,
    autoStart: false
  });

  useEffect(() => {
    // Auto-start monitoring when component mounts
    startMonitoring();

    return () => {
      // Clean up when component unmounts
      if (session) {
        endMonitoring();
      }
    };
  }, [userId, subject, activityType]);

  const startMonitoring = async () => {
    try {
      const newSession = await academicIntegrityService.startSession(userId, subject, activityType);
      setSession(newSession);
      setIsMonitoring(true);
      setCurrentIntegrityScore(100);
      
      // Start inactivity timer
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      inactivityTimer.restart(expiryTime);
      
      console.log('Academic integrity monitoring started for', subject, activityType);
    } catch (error) {
      console.error('Error starting integrity monitoring:', error);
    }
  };

  const endMonitoring = async () => {
    if (!session) return;

    try {
      const completedSession = await academicIntegrityService.endSession();
      if (completedSession) {
        setCurrentIntegrityScore(completedSession.integrityScore);
        
        // Report any suspicious activities
        if (completedSession.suspiciousEvents.length > 0) {
          onSuspiciousActivity?.(completedSession.suspiciousEvents);
        }
      }
      
      setIsMonitoring(false);
      inactivityTimer.pause();
      console.log('Academic integrity monitoring ended');
    } catch (error) {
      console.error('Error ending integrity monitoring:', error);
    }
  };

  // Handle user activity (typing, clicking, etc.)
  const handleUserActivity = useCallback(() => {
    if (!isMonitoring) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;

    // Record keystroke for pattern analysis
    academicIntegrityService.recordKeystroke(now);
    setKeystrokeCount(prev => prev + 1);
    setLastActivityTime(now);

    // Check for long inactivity gap
    if (timeSinceLastActivity > 300000) { // 5 minutes
      void academicIntegrityService.handleInactivityGap(timeSinceLastActivity);
    }

    // Reset inactivity timer
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    inactivityTimer.restart(expiryTime);
    setInactivityWarning(false);
  }, [isMonitoring, lastActivityTime, inactivityTimer]);

  // Handle paste events
  const handlePasteDetected = useCallback(async (pastedLength: number, timeSpent: number) => {
    if (!isMonitoring) return;

    await academicIntegrityService.handlePasteEvent(pastedLength, timeSpent);
    
    // Show immediate feedback for large pastes
    if (pastedLength > 100) {
      const feedback: AutomatedFeedback = {
        type: 'suggestion',
        message: 'Remember to use your own words and ideas! 💭',
        priority: 'medium'
      };
      
      setRecentFeedback(prev => [...prev, feedback]);
      if (onFeedback) {
        onFeedback([feedback]);
      }
      
      // Remove feedback after 10 seconds
      setTimeout(() => {
        setRecentFeedback(prev => prev.filter(f => f !== feedback));
      }, 10000);
    }
  }, [isMonitoring, onFeedback]);

  function handleInactivityDetected() {
    setInactivityWarning(true);
    
    // Generate friendly reminder
    const feedback: AutomatedFeedback = {
      type: 'encouragement',
      message: 'Take your time! Good thinking is worth the wait. 🤔',
      priority: 'low'
    };
    
    setRecentFeedback(prev => [...prev, feedback]);
    if (onFeedback) {
      onFeedback([feedback]);
    }
    
    setTimeout(() => {
      setRecentFeedback(prev => prev.filter(f => f !== feedback));
      setInactivityWarning(false);
    }, 8000);
  }

  const getIntegrityColor = (score: number): string => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
  };

  const getActivityTypeIcon = () => {
    switch (activityType) {
      case 'quiz': return Target;
      case 'writing': return FileText;
      case 'worksheet': return Brain;
      case 'creative': return Lightbulb;
      default: return Activity;
    }
  };

  const ActivityIcon = getActivityTypeIcon();

  // Attach event listeners for user activity
  useEffect(() => {
    if (!isMonitoring) return;

    const handleKeyDown = () => handleUserActivity();
    const handleMouseMove = () => handleUserActivity();
    const handleClick = () => handleUserActivity();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [isMonitoring, handleUserActivity]);

  if (!session || !isMonitoring) {
    return (
      <Card className="rounded-3 border-info">
        <CardContent className="p-3 text-center">
          <Shield className="mb-2 text-muted" size={24} />
          <small className="text-muted">Integrity monitoring ready</small>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1040, maxWidth: '300px' }}>
      {/* Main Integrity Monitor */}
      <Card className="rounded-4 shadow-lg mb-2 border-primary">
        <CardHeader className="pb-2">
          <CardTitle className="h6 fw-bold d-flex align-items-center">
            <Shield className="me-2 text-primary" size={16} />
            Learning Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Activity Type */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <ActivityIcon className="me-2 text-secondary" size={14} />
              <small className="text-muted">{activityType} - {subject}</small>
            </div>
            <Badge bg="primary" className="small">Grade {grade}</Badge>
          </div>

          {/* Integrity Score */}
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">Integrity Score</small>
              <small className={`fw-bold text-${getIntegrityColor(currentIntegrityScore)}`}>
                {currentIntegrityScore}/100
              </small>
            </div>
            <ProgressBar 
              now={currentIntegrityScore} 
              variant={getIntegrityColor(currentIntegrityScore)}
              style={{ height: '6px' }}
            />
          </div>

          {/* Activity Indicators */}
          <div className="row g-2 text-center">
            <div className="col-6">
              <div className="small">
                <Activity size={14} className="text-success mb-1" />
                <div className="text-muted">Active</div>
                <div className="fw-bold">{keystrokeCount}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="small">
                <Clock size={14} className="text-info mb-1" />
                <div className="text-muted">Time</div>
                <div className="fw-bold">
                  {Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000)}m
                </div>
              </div>
            </div>
          </div>

          {/* Inactivity Warning */}
          {inactivityWarning && (
            <Alert variant="info" className="mt-2 mb-0 p-2 small">
              <Clock size={14} className="me-1" />
              Still working? Take your time! 😊
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      {recentFeedback.map((feedback, index) => (
        <Card key={index} className={cn(
          "rounded-3 shadow mb-2",
          feedback.type === 'concern' ? 'border-warning' : 'border-success'
        )}>
          <CardContent className="p-2">
            <div className="d-flex align-items-start">
              <div className="me-2">
                {feedback.type === 'encouragement' && <CheckCircle size={16} className="text-success" />}
                {feedback.type === 'suggestion' && <Lightbulb size={16} className="text-warning" />}
                {feedback.type === 'question' && <Brain size={16} className="text-info" />}
                {feedback.type === 'concern' && <AlertTriangle size={16} className="text-warning" />}
              </div>
              <div className="flex-1">
                <small className="d-block">{feedback.message}</small>
                <div className="mt-1">
                  <Badge 
                    bg={feedback.priority === 'high' ? 'warning' : 'light'} 
                    text={feedback.priority === 'high' ? 'dark' : 'muted'}
                    className="small"
                  >
                    {feedback.type}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Positive Reinforcement */}
      {currentIntegrityScore >= 90 && keystrokeCount > 50 && (
        <Card className="rounded-3 shadow border-success">
          <CardContent className="p-2 text-center">
            <TrendingUp className="text-success mb-1" size={16} />
            <small className="text-success fw-bold d-block">Great work!</small>
            <small className="text-muted">Keep up the honest effort! ⭐</small>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Hook for easy integration with form components
export const useIntegrityMonitoring = (
  userId: string,
  subject: string,
  activityType: 'quiz' | 'writing' | 'worksheet' | 'creative',
  grade: number
) => {
  const [feedback, setFeedback] = useState<AutomatedFeedback[]>([]);
  const [suspiciousEvents, setSuspiciousEvents] = useState<SuspiciousEvent[]>([]);

  const handleFeedback = useCallback((newFeedback: AutomatedFeedback[]) => {
    setFeedback(prev => [...prev, ...newFeedback]);
  }, []);

  const handleSuspiciousActivity = useCallback((events: SuspiciousEvent[]) => {
    setSuspiciousEvents(prev => [...prev, ...events]);
  }, []);

  // Create paste handler for React Quill
  const createPasteHandler = useCallback(() => {
    return (delta: any, source: string) => {
      if (source === 'user') {
        const pastedText = delta.ops?.find((op: any) => typeof op.insert === 'string')?.insert || '';
        if (pastedText.length > 10) {
          void academicIntegrityService.handlePasteEvent(pastedText.length, 100); // Assume quick paste
        }
      }
    };
  }, []);

  return {
    feedback,
    suspiciousEvents,
    handleFeedback,
    handleSuspiciousActivity,
    createPasteHandler,
    IntegrityMonitor: () => (
      <IntegrityMonitor
        userId={userId}
        subject={subject}
        activityType={activityType}
        grade={grade}
        onFeedback={handleFeedback}
        onSuspiciousActivity={handleSuspiciousActivity}
      />
    )
  };
};

export default IntegrityMonitor;