import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  User, 
  Settings, 
  Lock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Alert, Modal, Button as BootstrapButton, Spinner } from "react-bootstrap";
import { 
  childSafetyService, 
  AnonymizedUser, 
  ParentalSettings 
} from '@/services/childSafetyApi';
import ParentalDashboard from './ParentalDashboard';
import TimeManagement from './TimeManagement';
import ContentModerator from './ContentModerator';
import { cn } from "@/lib/utils";

interface ChildSafetyWrapperProps {
  children: React.ReactNode;
  subject?: string;
  grade?: number;
}

const ChildSafetyWrapper: React.FC<ChildSafetyWrapperProps> = ({ 
  children, 
  subject = 'general',
  grade = 4 
}) => {
  const [currentUser, setCurrentUser] = useState<AnonymizedUser | null>(null);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [showParentalDashboard, setShowParentalDashboard] = useState(false);
  const [showTimeManagement, setShowTimeManagement] = useState(false);
  const [showContentModeration, setShowContentModeration] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [dailyTimeExceeded, setDailyTimeExceeded] = useState(false);

  useEffect(() => {
    initializeChildSafety();
  }, [grade]);

  const initializeChildSafety = async () => {
    try {
      setLoading(true);
      
      // Check if user exists, if not create anonymous user
      let user = await childSafetyService.getCurrentUser();
      
      if (!user) {
        user = await childSafetyService.createAnonymizedUser(grade);
      }
      
      setCurrentUser(user);
      
      // Load parental settings
      const settings = await childSafetyService.getParentalSettings();
      setParentalSettings(settings);
      
      // Check daily time usage
      if (user) {
        const dailyTime = await childSafetyService.getTodaySessionTime(user.id);
        setDailyTimeExceeded(dailyTime >= settings.dailyTimeLimit);
      }
      
      // Check if compliance has been accepted (stored in localStorage for session)
      const complianceStatus = localStorage.getItem('coppa_gdpr_compliance_accepted');
      setComplianceAccepted(complianceStatus === 'true');
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing child safety:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplianceAccept = () => {
    localStorage.setItem('coppa_gdpr_compliance_accepted', 'true');
    setComplianceAccepted(true);
  };

  const handleTimeUp = () => {
    setDailyTimeExceeded(true);
  };

  const handleSessionEnd = async (timeSpent: number) => {
    if (currentUser) {
      await childSafetyService.updateUserActivity(currentUser.id);
      
      // Refresh daily time status
      const dailyTime = await childSafetyService.getTodaySessionTime(currentUser.id);
      if (parentalSettings) {
        setDailyTimeExceeded(dailyTime >= parentalSettings.dailyTimeLimit);
      }
    }
  };

  // Check if current time is in restricted hours
  const isInRestrictedHours = (): boolean => {
    if (!parentalSettings) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = parentalSettings.restrictedHours;
    
    if (start < end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Spans midnight
      return currentTime >= start || currentTime <= end;
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center p-5">
            <Spinner className="mb-3 text-primary" />
            <h5 className="fw-bold">Initializing Safe Learning Environment</h5>
            <p className="text-muted">Setting up COPPA & GDPR-K compliant features...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // COPPA/GDPR-K Compliance Notice
  if (!complianceAccepted) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Card className="rounded-4 shadow-lg" style={{ maxWidth: '600px' }}>
          <CardContent className="p-5">
            <div className="text-center mb-4">
              <Shield className="text-primary mb-3" size={64} />
              <h3 className="fw-bold">Child Safety & Privacy Protection</h3>
            </div>
            
            <Alert variant="success" className="mb-4">
              <CheckCircle className="me-2" />
              <strong>COPPA & GDPR-K Compliant Platform</strong>
              <br />
              This educational platform is designed specifically for children aged 8-11 with comprehensive privacy protection.
            </Alert>
            
            <div className="mb-4">
              <h6 className="fw-bold">Privacy Protection Features:</h6>
              <ul className="small">
                <li>No personal information collection (names, emails, addresses)</li>
                <li>Anonymous user identification only</li>
                <li>All data stored locally on your device</li>
                <li>Parental controls and time management</li>
                <li>Automatic content moderation and filtering</li>
                <li>No external links, ads, or social features</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h6 className="fw-bold">Parental Rights:</h6>
              <ul className="small">
                <li>Access parental dashboard to monitor activity</li>
                <li>Set time limits and restricted hours</li>
                <li>Export or delete all learning data at any time</li>
                <li>Control content access and approval settings</li>
              </ul>
            </div>
            
            <Alert variant="info" className="mb-4">
              <strong>For Parents:</strong> Click the shield icon (🛡️) in the top-right corner to access parental controls and monitoring features.
            </Alert>
            
            <div className="d-grid">
              <BootstrapButton
                variant="primary"
                size="lg"
                onClick={handleComplianceAccept}
                className="fw-bold"
              >
                <CheckCircle size={20} className="me-2" />
                Accept & Start Safe Learning
              </BootstrapButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Time exceeded notice
  if (dailyTimeExceeded) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Card className="rounded-4 shadow-lg" style={{ maxWidth: '500px' }}>
          <CardContent className="text-center p-5">
            <Clock className="text-warning mb-3" size={64} />
            <h3 className="fw-bold">Learning Time Complete!</h3>
            <p className="text-muted mb-4">
              You've reached today's screen time limit. Great job learning! 
              Time for other fun activities like playing outside, reading a book, or spending time with family.
            </p>
            
            <Alert variant="success" className="mb-4">
              <strong>Healthy Balance:</strong> Taking breaks from screens helps your brain grow strong and keeps your eyes healthy!
            </Alert>
            
            <div className="d-flex gap-2 justify-content-center">
              <BootstrapButton
                variant="outline-primary"
                onClick={() => setShowParentalDashboard(true)}
              >
                <Shield size={16} className="me-2" />
                Parent Controls
              </BootstrapButton>
              <BootstrapButton
                variant="success"
                onClick={() => window.location.reload()}
              >
                Check Time Tomorrow
              </BootstrapButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Restricted hours notice
  if (isInRestrictedHours()) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Card className="rounded-4 shadow-lg" style={{ maxWidth: '500px' }}>
          <CardContent className="text-center p-5">
            <Lock className="text-info mb-3" size={64} />
            <h3 className="fw-bold">Learning Time Restricted</h3>
            <p className="text-muted mb-4">
              Your parents have set restricted learning hours. Learning time is available from{' '}
              {parentalSettings?.restrictedHours.end} to {parentalSettings?.restrictedHours.start}.
            </p>
            
            <Alert variant="info" className="mb-4">
              <strong>Rest Time:</strong> This is a great time for sleep, family time, or offline activities!
            </Alert>
            
            <BootstrapButton
              variant="outline-primary"
              onClick={() => setShowParentalDashboard(true)}
            >
              <Shield size={16} className="me-2" />
              Parent Controls
            </BootstrapButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main application with safety wrapper
  return (
    <div className="position-relative">
      {/* Child Safety Controls Header */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill"
            onClick={() => setShowTimeManagement(!showTimeManagement)}
            title="Time Management"
          >
            <Clock size={16} />
          </Button>
          
          <Button
            variant="outline-success"
            size="sm"
            className="rounded-pill"
            onClick={() => setShowContentModeration(!showContentModeration)}
            title="Content Safety"
          >
            <Shield size={16} />
          </Button>
          
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill"
            onClick={() => setShowParentalDashboard(true)}
            title="Parental Controls"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>

      {/* Time Management Panel */}
      {showTimeManagement && currentUser && (
        <div className="position-fixed top-0 end-0 mt-5 me-3" style={{ zIndex: 1040, width: '300px' }}>
          <TimeManagement
            userId={currentUser.id}
            onTimeUp={handleTimeUp}
            onSessionEnd={handleSessionEnd}
          />
        </div>
      )}

      {/* Content Moderation Panel */}
      {showContentModeration && (
        <div className="position-fixed top-0 end-0 mt-5 me-3" style={{ zIndex: 1040, width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
          <ContentModerator
            subject={subject}
            grade={grade}
          />
        </div>
      )}

      {/* Main Application Content */}
      <div className={cn(
        "min-vh-100",
        (showTimeManagement || showContentModeration) && "me-5"
      )}>
        {children}
      </div>

      {/* Parental Dashboard Modal */}
      {showParentalDashboard && (
        <Modal show={true} onHide={() => setShowParentalDashboard(false)} size="xl" fullscreen>
          <Modal.Body className="p-0">
            <ParentalDashboard onClose={() => setShowParentalDashboard(false)} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ChildSafetyWrapper;