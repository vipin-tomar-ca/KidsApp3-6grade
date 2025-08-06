import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle,
  Timer,
  Hourglass,
  StopCircle
} from "lucide-react";
import { Alert, ProgressBar, Badge, Modal } from "react-bootstrap";
import { childSafetyService, ParentalSettings } from '@/services/childSafetyApi';
import { cn } from "@/lib/utils";

interface TimeManagementProps {
  userId: string;
  onTimeUp?: () => void;
  onSessionEnd?: (timeSpent: number) => void;
}

const TimeManagement: React.FC<TimeManagementProps> = ({ 
  userId, 
  onTimeUp, 
  onSessionEnd 
}) => {
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [dailyTimeUsed, setDailyTimeUsed] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  
  // Create timer expiry time (will be updated based on remaining time)
  const getTimerExpiry = () => {
    if (!parentalSettings) return new Date(Date.now() + 60 * 60 * 1000); // 1 hour default
    
    const remainingMinutes = Math.max(0, parentalSettings.dailyTimeLimit - dailyTimeUsed);
    return new Date(Date.now() + remainingMinutes * 60 * 1000);
  };

  const handleTimeExpire = () => {
    setSessionActive(false);
    setShowTimeUpModal(true);
    
    if (sessionStartTime) {
      const sessionTime = Math.floor((Date.now() - sessionStartTime.getTime()) / (1000 * 60));
      onSessionEnd?.(sessionTime);
    }
    
    onTimeUp?.();
  };

  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getTimerExpiry(),
    onExpire: handleTimeExpire,
    autoStart: false
  });

  useEffect(() => {
    loadParentalSettings();
    loadDailyTimeUsed();
  }, [userId]);

  useEffect(() => {
    // Check for time warnings
    if (parentalSettings && sessionActive) {
      const totalMinutes = hours * 60 + minutes;
      const remainingMinutes = parentalSettings.dailyTimeLimit - dailyTimeUsed - getSessionTimeSpent();
      
      // Show warning when 10 minutes left
      if (remainingMinutes <= 10 && remainingMinutes > 0 && !showTimeWarning) {
        setShowTimeWarning(true);
      }
    }
  }, [minutes, hours, parentalSettings, dailyTimeUsed, sessionActive]);

  const loadParentalSettings = async () => {
    try {
      const settings = await childSafetyService.getParentalSettings();
      setParentalSettings(settings);
    } catch (error) {
      console.error('Error loading parental settings:', error);
    }
  };

  const loadDailyTimeUsed = async () => {
    try {
      const timeUsed = await childSafetyService.getTodaySessionTime(userId);
      setDailyTimeUsed(timeUsed);
    } catch (error) {
      console.error('Error loading daily time used:', error);
    }
  };

  const getSessionTimeSpent = (): number => {
    if (!sessionStartTime) return 0;
    return Math.floor((Date.now() - sessionStartTime.getTime()) / (1000 * 60));
  };

  const startSession = async () => {
    if (!parentalSettings) return;
    
    // Check if daily limit is already reached
    if (dailyTimeUsed >= parentalSettings.dailyTimeLimit) {
      setShowTimeUpModal(true);
      return;
    }
    
    // Check restricted hours
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (isInRestrictedHours(currentTime)) {
      alert('Learning time is currently restricted. Please try again later.');
      return;
    }
    
    setSessionStartTime(new Date());
    setSessionActive(true);
    
    // Start session tracking
    await childSafetyService.startSession(userId);
    
    // Calculate remaining time and start timer
    const remainingMinutes = Math.max(0, parentalSettings.dailyTimeLimit - dailyTimeUsed);
    const expiryTime = new Date(Date.now() + remainingMinutes * 60 * 1000);
    restart(expiryTime, true);
  };

  const pauseSession = () => {
    setSessionActive(false);
    pause();
  };

  const resumeSession = () => {
    if (!parentalSettings) return;
    
    // Recalculate remaining time
    const currentSessionTime = getSessionTimeSpent();
    const totalUsed = dailyTimeUsed + currentSessionTime;
    const remainingMinutes = Math.max(0, parentalSettings.dailyTimeLimit - totalUsed);
    
    if (remainingMinutes <= 0) {
      handleTimeExpire();
      return;
    }
    
    setSessionActive(true);
    resume();
  };

  const endSession = async () => {
    setSessionActive(false);
    pause();
    
    if (sessionStartTime) {
      const sessionTime = getSessionTimeSpent();
      await childSafetyService.endSession();
      setDailyTimeUsed(prev => prev + sessionTime);
      onSessionEnd?.(sessionTime);
    }
    
    setSessionStartTime(null);
  };

  const isInRestrictedHours = (currentTime: string): boolean => {
    if (!parentalSettings) return false;
    
    const { start, end } = parentalSettings.restrictedHours;
    
    // Simple time comparison (assumes same day)
    if (start < end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Spans midnight
      return currentTime >= start || currentTime <= end;
    }
  };

  const formatTime = (h: number, m: number, s: number): string => {
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = (): number => {
    if (!parentalSettings) return 0;
    const currentSessionTime = getSessionTimeSpent();
    return Math.max(0, parentalSettings.dailyTimeLimit - dailyTimeUsed - currentSessionTime);
  };

  const getTimeUsagePercentage = (): number => {
    if (!parentalSettings) return 0;
    const totalUsed = dailyTimeUsed + getSessionTimeSpent();
    return Math.min((totalUsed / parentalSettings.dailyTimeLimit) * 100, 100);
  };

  const getUsageColor = (): string => {
    const percentage = getTimeUsagePercentage();
    if (percentage >= 95) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  if (!parentalSettings) {
    return (
      <Card className="rounded-3 shadow border-0">
        <CardContent className="p-4 text-center">
          <Hourglass className="mb-2 text-muted" size={32} />
          <p className="text-muted">Loading time management...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="rounded-4 shadow-lg">
        <CardHeader>
          <CardTitle className="h5 fw-bold d-flex align-items-center">
            <Timer className="me-2 text-primary" />
            Screen Time Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Time Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="small text-muted">Daily Usage</span>
              <span className="small fw-bold">
                {Math.floor((dailyTimeUsed + getSessionTimeSpent()))} / {parentalSettings.dailyTimeLimit} minutes
              </span>
            </div>
            <ProgressBar 
              now={getTimeUsagePercentage()}
              variant={getUsageColor()}
              style={{ height: '12px' }}
            />
          </div>

          {/* Current Session Timer */}
          <div className="text-center mb-4">
            <div className={cn(
              "display-6 fw-bold mb-2",
              isRunning && sessionActive ? "text-success" : "text-muted"
            )}>
              {formatTime(hours, minutes, seconds)}
            </div>
            <Badge 
              bg={sessionActive ? 'success' : 'secondary'}
              className="mb-3"
            >
              {sessionActive ? 'Session Active' : 'Session Inactive'}
            </Badge>
            
            <div className="small text-muted">
              Remaining Today: {getRemainingTime()} minutes
            </div>
          </div>

          {/* Session Controls */}
          <div className="d-grid gap-2">
            {!sessionActive ? (
              <Button
                onClick={startSession}
                disabled={dailyTimeUsed >= parentalSettings.dailyTimeLimit}
                className="fw-bold"
              >
                <Play size={16} className="me-2" />
                Start Learning Session
              </Button>
            ) : (
              <div className="row g-2">
                <div className="col">
                  <Button
                    variant="secondary"
                    onClick={pauseSession}
                    className="w-100 fw-bold"
                    disabled={!isRunning}
                  >
                    <Pause size={16} className="me-2" />
                    Pause
                  </Button>
                </div>
                <div className="col">
                  <Button
                    variant="outline"
                    onClick={resumeSession}
                    className="w-100 fw-bold"
                    disabled={isRunning}
                  >
                    <Play size={16} className="me-2" />
                    Resume
                  </Button>
                </div>
                <div className="col">
                  <Button
                    variant="destructive"
                    onClick={endSession}
                    className="w-100 fw-bold"
                  >
                    <StopCircle size={16} className="me-2" />
                    End
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Time Status Alerts */}
          {getRemainingTime() <= 10 && getRemainingTime() > 0 && (
            <Alert variant="warning" className="mt-3 mb-0">
              <AlertTriangle size={16} className="me-2" />
              <strong>Almost time's up!</strong> {getRemainingTime()} minutes remaining.
            </Alert>
          )}

          {dailyTimeUsed >= parentalSettings.dailyTimeLimit && (
            <Alert variant="info" className="mt-3 mb-0">
              <CheckCircle size={16} className="me-2" />
              <strong>Daily limit reached!</strong> Great job learning today. 
              Time for other activities!
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Time Warning Modal */}
      <Modal show={showTimeWarning} onHide={() => setShowTimeWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Clock className="me-2" size={24} />
            Time Reminder
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <AlertTriangle className="me-2" />
            You have <strong>10 minutes</strong> left in your learning time today. 
            Start wrapping up your current activity!
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={() => setShowTimeWarning(false)}>
            OK, Got It!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Time Up Modal */}
      <Modal show={showTimeUpModal} onHide={() => setShowTimeUpModal(false)} backdrop="static">
        <Modal.Header>
          <Modal.Title>
            <Hourglass className="me-2" size={24} />
            Learning Time Complete!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <CheckCircle className="text-success mb-3" size={48} />
            <h5>Great job learning today!</h5>
            <p className="text-muted">
              You've completed your daily screen time limit. Time for other fun activities 
              like playing outside, reading a book, or spending time with family!
            </p>
          </div>
          
          <Alert variant="success">
            <strong>Today's Learning Summary:</strong>
            <br />
            Time Spent: {Math.floor(dailyTimeUsed + getSessionTimeSpent())} minutes
            <br />
            Activities Completed: Check your progress report!
          </Alert>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="default" onClick={() => setShowTimeUpModal(false)}>
            <CheckCircle size={16} className="me-2" />
            Thanks for Learning!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimeManagement;