import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  User, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Activity,
  TrendingUp,
  Filter,
  FileText,
  Download,
  Trash2
} from "lucide-react";
import { Container, Row, Col, Form, Alert, Button as BootstrapButton, Modal, Tabs, Tab, ProgressBar, Badge } from "react-bootstrap";
import { 
  childSafetyService, 
  ParentalSettings, 
  AnonymizedUser,
  ParentalReport,
  SessionData
} from '@/services/childSafetyApi';
import { cn } from "@/lib/utils";

interface ParentalDashboardProps {
  onClose?: () => void;
}

const ParentalDashboard: React.FC<ParentalDashboardProps> = ({ onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [hasPasswordSet, setHasPasswordSet] = useState(false);

  // Dashboard state
  const [currentUser, setCurrentUser] = useState<AnonymizedUser | null>(null);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [currentReport, setCurrentReport] = useState<ParentalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Time management
  const [dailyTimeUsed, setDailyTimeUsed] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDataExportModal, setShowDataExportModal] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const initializeDashboard = async () => {
    try {
      const passwordSet = await childSafetyService.isParentalPasswordSet();
      setHasPasswordSet(passwordSet);
      
      if (passwordSet) {
        setLoading(false);
      } else {
        // No password set, show setup
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [user, settings] = await Promise.all([
        childSafetyService.getCurrentUser(),
        childSafetyService.getParentalSettings()
      ]);
      
      setCurrentUser(user);
      setParentalSettings(settings);
      
      if (user) {
        const timeUsed = await childSafetyService.getTodaySessionTime(user.id);
        setDailyTimeUsed(timeUsed);
        
        const report = await childSafetyService.generateParentalReport(user.id, 7);
        setCurrentReport(report);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      const success = await childSafetyService.setupParentalPassword(newPassword);
      if (success) {
        setHasPasswordSet(true);
        setIsAuthenticated(true);
        setAuthError('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAuthError('Failed to set up password. Please try again.');
      }
    } catch (error) {
      setAuthError('Error setting up password');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = await childSafetyService.verifyParentalPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        setAuthError('');
        setPassword('');
      } else {
        setAuthError('Invalid password');
      }
    } catch (error) {
      setAuthError('Authentication error');
    }
  };

  const handleSettingsSave = async (updatedSettings: ParentalSettings) => {
    try {
      await childSafetyService.saveParentalSettings(updatedSettings);
      setParentalSettings(updatedSettings);
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDataExport = async () => {
    if (!currentUser) return;
    
    try {
      const exportData = await childSafetyService.exportUserData(currentUser.id);
      const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `child_learning_data_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      setShowDataExportModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDataClear = async () => {
    if (!confirm('Are you sure you want to clear all user data? This action cannot be undone.')) {
      return;
    }
    
    try {
      await childSafetyService.clearAllUserData();
      await loadDashboardData();
      alert('All user data has been cleared in compliance with COPPA regulations.');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeUsageColor = (): string => {
    if (!parentalSettings) return 'success';
    const usage = (dailyTimeUsed / parentalSettings.dailyTimeLimit) * 100;
    if (usage >= 90) return 'danger';
    if (usage >= 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <h5 className="fw-bold">Loading Parental Dashboard...</h5>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Password setup screen
  if (!hasPasswordSet) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="mx-auto mb-3 text-primary" size={48} />
            <CardTitle className="h4 fw-bold">Parental Dashboard Setup</CardTitle>
            <p className="text-muted">Create a secure password to protect your child's learning environment</p>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handlePasswordSetup}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Create Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a secure password (min 8 characters)"
                    required
                    minLength={8}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="position-absolute end-0 top-0 h-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </Form.Group>
              
              {authError && (
                <Alert variant="danger" className="small">{authError}</Alert>
              )}
              
              <div className="d-grid gap-2">
                <BootstrapButton 
                  type="submit" 
                  variant="primary"
                  className="fw-bold"
                >
                  <Lock size={16} className="me-2" />
                  Set Up Dashboard
                </BootstrapButton>
                {onClose && (
                  <BootstrapButton 
                    variant="outline-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </BootstrapButton>
                )}
              </div>
            </Form>
            
            <Alert variant="info" className="mt-4 small">
              <strong>COPPA & GDPR-K Compliance:</strong> This dashboard helps you monitor your child's learning 
              while protecting their privacy. No personal information is collected or stored.
            </Alert>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="mx-auto mb-3 text-primary" size={48} />
            <CardTitle className="h4 fw-bold">Parental Access</CardTitle>
            <p className="text-muted">Enter your password to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handlePasswordLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="position-absolute end-0 top-0 h-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </Form.Group>
              
              {authError && (
                <Alert variant="danger" className="small">{authError}</Alert>
              )}
              
              <div className="d-grid gap-2">
                <BootstrapButton 
                  type="submit" 
                  variant="primary"
                  className="fw-bold"
                >
                  <Unlock size={16} className="me-2" />
                  Access Dashboard
                </BootstrapButton>
                {onClose && (
                  <BootstrapButton 
                    variant="outline-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </BootstrapButton>
                )}
              </div>
            </Form>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-light">
      <Container fluid className="py-4">
        {/* Header */}
        <Card className="rounded-4 shadow-lg mb-4">
          <CardContent className="p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-1 d-flex align-items-center">
                  <Shield className="me-2 text-primary" size={32} />
                  Parental Dashboard
                </h2>
                <p className="text-muted mb-0">Monitor and manage your child's learning experience</p>
              </div>
              <div className="d-flex gap-2">
                <BootstrapButton
                  variant="outline-primary"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings size={16} className="me-2" />
                  Settings
                </BootstrapButton>
                {onClose && (
                  <BootstrapButton
                    variant="outline-secondary"
                    onClick={onClose}
                  >
                    Close
                  </BootstrapButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="rounded-3 shadow border-0">
              <CardContent className="p-4 text-center">
                <Clock className={`mb-2 text-${getTimeUsageColor()}`} size={32} />
                <h5 className="fw-bold mb-1">{formatTime(dailyTimeUsed)}</h5>
                <small className="text-muted">Today's Screen Time</small>
                {parentalSettings && (
                  <ProgressBar 
                    now={(dailyTimeUsed / parentalSettings.dailyTimeLimit) * 100}
                    variant={getTimeUsageColor()}
                    className="mt-2"
                    style={{ height: '6px' }}
                  />
                )}
              </CardContent>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="rounded-3 shadow border-0">
              <CardContent className="p-4 text-center">
                <Activity className="mb-2 text-success" size={32} />
                <h5 className="fw-bold mb-1">{currentReport?.activitiesCompleted || 0}</h5>
                <small className="text-muted">Activities Completed</small>
              </CardContent>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="rounded-3 shadow border-0">
              <CardContent className="p-4 text-center">
                <BarChart3 className="mb-2 text-info" size={32} />
                <h5 className="fw-bold mb-1">{currentReport?.subjectsExplored.length || 0}</h5>
                <small className="text-muted">Subjects Explored</small>
              </CardContent>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="rounded-3 shadow border-0">
              <CardContent className="p-4 text-center">
                <CheckCircle className="mb-2 text-success" size={32} />
                <h5 className="fw-bold mb-1">Safe</h5>
                <small className="text-muted">Content Status</small>
              </CardContent>
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card className="rounded-4 shadow-lg">
          <CardContent className="p-0">
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key || 'overview')}
              className="px-4 pt-4"
            >
              <Tab eventKey="overview" title="Overview">
                <div className="p-4">
                  <Row className="g-4">
                    {/* Time Management */}
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center">
                            <Clock className="me-2 text-primary" />
                            Time Management
                          </h6>
                          
                          {parentalSettings && (
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Daily Limit</span>
                                <span className="fw-bold">{formatTime(parentalSettings.dailyTimeLimit)}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Time Used</span>
                                <span className={`fw-bold text-${getTimeUsageColor()}`}>
                                  {formatTime(dailyTimeUsed)}
                                </span>
                              </div>
                              <ProgressBar 
                                now={(dailyTimeUsed / parentalSettings.dailyTimeLimit) * 100}
                                variant={getTimeUsageColor()}
                                style={{ height: '8px' }}
                              />
                            </div>
                          )}
                          
                          <div className="text-center">
                            <Badge 
                              bg={getTimeUsageColor()} 
                              className="px-3 py-2"
                            >
                              {parentalSettings && dailyTimeUsed >= parentalSettings.dailyTimeLimit 
                                ? 'Time Limit Reached' 
                                : 'Within Limits'
                              }
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Col>

                    {/* Learning Progress */}
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3 d-flex align-items-center">
                            <TrendingUp className="me-2 text-success" />
                            Learning Progress
                          </h6>
                          
                          {currentReport && (
                            <div>
                              <div className="mb-3">
                                <small className="text-muted">Strength Areas</small>
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                  {currentReport.strengthAreas.map(area => (
                                    <Badge key={area} bg="success" className="small">
                                      {area}
                                    </Badge>
                                  ))}
                                  {currentReport.strengthAreas.length === 0 && (
                                    <span className="small text-muted">Building foundations...</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <small className="text-muted">Areas to Explore</small>
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                  {currentReport.improvementAreas.slice(0, 3).map(area => (
                                    <Badge key={area} bg="light" text="dark" className="small">
                                      {area}
                                    </Badge>
                                  ))}
                                  {currentReport.improvementAreas.length === 0 && (
                                    <span className="small text-muted">Great exploration!</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="safety" title="Safety & Privacy">
                <div className="p-4">
                  <Alert variant="success" className="mb-4">
                    <CheckCircle className="me-2" size={20} />
                    <strong>COPPA & GDPR-K Compliant:</strong> This platform collects no personal information 
                    and all data is stored locally on your device.
                  </Alert>
                  
                  <Row className="g-4">
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3">Data Protection</h6>
                          <ul className="list-unstyled small">
                            <li className="mb-2">
                              <CheckCircle size={16} className="me-2 text-success" />
                              No personal information collected
                            </li>
                            <li className="mb-2">
                              <CheckCircle size={16} className="me-2 text-success" />
                              Anonymous user identification
                            </li>
                            <li className="mb-2">
                              <CheckCircle size={16} className="me-2 text-success" />
                              Local data storage only
                            </li>
                            <li className="mb-2">
                              <CheckCircle size={16} className="me-2 text-success" />
                              Automatic content moderation
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Col>
                    
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3">Content Safety</h6>
                          <ul className="list-unstyled small">
                            <li className="mb-2">
                              <Shield size={16} className="me-2 text-primary" />
                              Educational content whitelist
                            </li>
                            <li className="mb-2">
                              <Filter size={16} className="me-2 text-primary" />
                              Automatic topic filtering
                            </li>
                            <li className="mb-2">
                              <XCircle size={16} className="me-2 text-danger" />
                              No external links or ads
                            </li>
                            <li className="mb-2">
                              <User size={16} className="me-2 text-warning" />
                              Age-appropriate content only
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="data" title="Data Management">
                <div className="p-4">
                  <Row className="g-4">
                    <Col md={8}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3">Data Rights & Compliance</h6>
                          <p className="small text-muted mb-3">
                            In accordance with COPPA and GDPR-K regulations, you have full control 
                            over your child's learning data.
                          </p>
                          
                          <div className="d-grid gap-2">
                            <BootstrapButton
                              variant="outline-primary"
                              onClick={() => setShowDataExportModal(true)}
                            >
                              <Download size={16} className="me-2" />
                              Export Learning Data
                            </BootstrapButton>
                            
                            <BootstrapButton
                              variant="outline-info"
                              onClick={() => setShowReportModal(true)}
                            >
                              <FileText size={16} className="me-2" />
                              Generate Activity Report
                            </BootstrapButton>
                            
                            <BootstrapButton
                              variant="outline-danger"
                              onClick={handleDataClear}
                            >
                              <Trash2 size={16} className="me-2" />
                              Clear All Data
                            </BootstrapButton>
                          </div>
                        </CardContent>
                      </Card>
                    </Col>
                    
                    <Col md={4}>
                      <Card className="border-0 bg-light">
                        <CardContent className="p-4">
                          <h6 className="fw-bold mb-3">Data Summary</h6>
                          {currentUser && (
                            <div className="small">
                              <div className="d-flex justify-content-between mb-2">
                                <span>User ID:</span>
                                <span className="font-monospace text-truncate" style={{ maxWidth: '100px' }}>
                                  {currentUser.id}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Created:</span>
                                <span>{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Last Active:</span>
                                <span>{new Date(currentUser.lastActivity).toLocaleDateString()}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Grade:</span>
                                <span>{currentUser.grade}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </CardContent>
        </Card>

        {/* Settings Modal */}
        {showSettingsModal && parentalSettings && (
          <ParentalSettingsModal 
            settings={parentalSettings}
            onSave={handleSettingsSave}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {/* Data Export Modal */}
        <Modal show={showDataExportModal} onHide={() => setShowDataExportModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Export Learning Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>This will download all stored learning data in JSON format, including:</p>
            <ul>
              <li>Anonymous user preferences</li>
              <li>Learning session history</li>
              <li>Progress statistics</li>
            </ul>
            <Alert variant="info" className="small">
              No personal information is included in the export.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="secondary" onClick={() => setShowDataExportModal(false)}>
              Cancel
            </BootstrapButton>
            <BootstrapButton variant="primary" onClick={handleDataExport}>
              <Download size={16} className="me-2" />
              Download Data
            </BootstrapButton>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

// Parental Settings Modal Component
interface ParentalSettingsModalProps {
  settings: ParentalSettings;
  onSave: (settings: ParentalSettings) => void;
  onClose: () => void;
}

const ParentalSettingsModal: React.FC<ParentalSettingsModalProps> = ({ 
  settings, 
  onSave, 
  onClose 
}) => {
  const [formSettings, setFormSettings] = useState<ParentalSettings>(settings);

  const handleSave = () => {
    onSave(formSettings);
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Parental Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Daily Time Limit (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  min="15"
                  max="480"
                  value={formSettings.dailyTimeLimit}
                  onChange={(e) => setFormSettings({
                    ...formSettings,
                    dailyTimeLimit: parseInt(e.target.value) || 60
                  })}
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Report Frequency</Form.Label>
                <Form.Select
                  value={formSettings.reportFrequency}
                  onChange={(e) => setFormSettings({
                    ...formSettings,
                    reportFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                  })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Allowed Subjects</Form.Label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {['math', 'english', 'science', 'social-studies', 'art', 'music'].map(subject => (
                    <Form.Check
                      key={subject}
                      type="checkbox"
                      id={subject}
                      label={subject.charAt(0).toUpperCase() + subject.slice(1)}
                      checked={formSettings.allowedSubjects.includes(subject)}
                      onChange={(e) => {
                        const newSubjects = e.target.checked
                          ? [...formSettings.allowedSubjects, subject]
                          : formSettings.allowedSubjects.filter(s => s !== subject);
                        setFormSettings({
                          ...formSettings,
                          allowedSubjects: newSubjects
                        });
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Check
                type="checkbox"
                id="contentApproval"
                label="Require content approval for new materials"
                checked={formSettings.contentApprovalRequired}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  contentApprovalRequired: e.target.checked
                })}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <BootstrapButton variant="secondary" onClick={onClose}>
          Cancel
        </BootstrapButton>
        <BootstrapButton variant="primary" onClick={handleSave}>
          Save Settings
        </BootstrapButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ParentalDashboard;