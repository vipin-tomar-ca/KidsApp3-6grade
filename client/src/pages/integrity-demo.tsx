import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Target, 
  Brain, 
  FileText, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Activity
} from "lucide-react";
import { Container, Row, Col, Alert, Badge, Tabs, Tab } from "react-bootstrap";
import QuizIntegrityWrapper from '@/components/QuizIntegrityWrapper';
import IntegrityMonitor from '@/components/IntegrityMonitor';
import { academicIntegrityService, QuizSession, SuspiciousEvent } from '@/services/academicIntegrityApi';

const IntegrityDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'quiz' | 'workspace' | 'monitoring'>('quiz');
  const [completedSessions, setCompletedSessions] = useState<QuizSession[]>([]);
  const [suspiciousEvents, setSuspiciousEvents] = useState<SuspiciousEvent[]>([]);

  // Sample quiz questions for different subjects
  const mathQuestions = [
    {
      id: 'math1',
      question: 'Sarah has 24 stickers. She wants to share them equally among 6 friends. How many stickers will each friend get?',
      type: 'short-answer' as const,
      points: 5,
      correctAnswer: '4',
      rubric: {
        excellent: 'Perfect! You showed your division work clearly: 24 ÷ 6 = 4',
        good: 'Good job! Try showing your work step by step next time.',
        needsWork: 'Try explaining your answer! Can you show me how you solved 24 ÷ 6?'
      }
    },
    {
      id: 'math2',
      question: 'Which fraction is larger: 1/2 or 1/4? Explain your reasoning.',
      type: 'essay' as const,
      points: 8,
      rubric: {
        excellent: 'Excellent explanation! You clearly understand that 1/2 = 2/4, so 1/2 is larger.',
        good: 'Good thinking! Try drawing pictures or using examples to explain fractions.',
        needsWork: 'Try explaining your answer! Can you think of pizza slices or pie pieces?'
      }
    },
    {
      id: 'math3',
      question: 'What is 7 × 8?',
      type: 'multiple-choice' as const,
      options: ['54', '56', '64', '72'],
      correctAnswer: '56',
      points: 3,
      rubric: {
        excellent: 'Perfect! 7 × 8 = 56',
        good: 'Good job!',
        needsWork: 'Try practicing your multiplication tables!'
      }
    }
  ];

  const scienceQuestions = [
    {
      id: 'sci1',
      question: 'Name three things plants need to grow and explain why each one is important.',
      type: 'essay' as const,
      points: 10,
      rubric: {
        excellent: 'Excellent! You explained how sunlight, water, and nutrients help plants grow.',
        good: 'Good job naming the needs! Try explaining why each one helps the plant.',
        needsWork: 'Try explaining your answer! Think about what you see plants doing.'
      }
    },
    {
      id: 'sci2',
      question: 'Which of these is NOT a mammal?',
      type: 'multiple-choice' as const,
      options: ['Dog', 'Whale', 'Eagle', 'Elephant'],
      correctAnswer: 'Eagle',
      points: 4,
      rubric: {
        excellent: 'Correct! Eagles are birds, not mammals.',
        good: 'Good job!',
        needsWork: 'Remember: mammals feed milk to their babies!'
      }
    }
  ];

  const handleQuizComplete = (session: QuizSession) => {
    setCompletedSessions(prev => [...prev, session]);
    
    if (session.flaggedForReview) {
      setSuspiciousEvents(prev => [...prev, {
        id: `quiz_${session.id}`,
        timestamp: new Date().toISOString(),
        type: 'pattern_break',
        severity: 'medium',
        description: 'Quiz session flagged for review',
        context: `Integrity score: ${session.integrityScore}/100`
      }]);
    }
  };

  const handleSuspiciousActivity = (events: SuspiciousEvent[]) => {
    setSuspiciousEvents(prev => [...prev, ...events]);
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="h3 fw-bold d-flex align-items-center">
            <Shield className="me-3 text-primary" size={36} />
            Academic Integrity Tools Demo
            <Badge bg="success" className="ms-3">Grades 3-6</Badge>
          </CardTitle>
          <p className="text-muted mb-0">
            Personify AI-inspired cheat detection with minimal false positives, designed for elementary students
          </p>
        </CardHeader>
      </Card>

      {/* Demo Navigation */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card 
            className={`cursor-pointer transition-all border-2 ${activeDemo === 'quiz' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
            onClick={() => setActiveDemo('quiz')}
          >
            <CardContent className="text-center p-4">
              <Target className="mb-2 text-primary" size={32} />
              <h5 className="fw-bold">Quiz Monitoring</h5>
              <p className="text-muted small mb-0">
                Real-time integrity monitoring during quizzes with typing pattern analysis
              </p>
            </CardContent>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className={`cursor-pointer transition-all border-2 ${activeDemo === 'workspace' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
            onClick={() => setActiveDemo('workspace')}
          >
            <CardContent className="text-center p-4">
              <FileText className="mb-2 text-success" size={32} />
              <h5 className="fw-bold">Workspace Monitor</h5>
              <p className="text-muted small mb-0">
                Background monitoring for writing assignments and creative work
              </p>
            </CardContent>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className={`cursor-pointer transition-all border-2 ${activeDemo === 'monitoring' ? 'border-info bg-info bg-opacity-10' : 'border-light'}`}
            onClick={() => setActiveDemo('monitoring')}
          >
            <CardContent className="text-center p-4">
              <Activity className="mb-2 text-info" size={32} />
              <h5 className="fw-bold">Integrity Reports</h5>
              <p className="text-muted small mb-0">
                View detection results and parental review dashboard
              </p>
            </CardContent>
          </Card>
        </Col>
      </Row>

      {/* Demo Content */}
      {activeDemo === 'quiz' && (
        <div>
          <Alert variant="info" className="mb-4">
            <Target className="me-2" />
            <strong>Quiz Integrity Demo:</strong> This simulates a real quiz environment with typing pattern monitoring, 
            paste detection, and automated feedback. Try different typing speeds and copy-paste actions to see the monitoring in action.
          </Alert>
          
          <Tabs defaultActiveKey="math" className="mb-4">
            <Tab eventKey="math" title="Math Quiz (Grade 4)">
              <QuizIntegrityWrapper
                userId="demo-student"
                subject="math"
                grade={4}
                questions={mathQuestions}
                timeLimit={15} // 15 minutes for demo
                onComplete={handleQuizComplete}
              />
            </Tab>
            <Tab eventKey="science" title="Science Quiz (Grade 3)">
              <QuizIntegrityWrapper
                userId="demo-student"
                subject="science"
                grade={3}
                questions={scienceQuestions}
                timeLimit={10} // 10 minutes for demo
                onComplete={handleQuizComplete}
              />
            </Tab>
          </Tabs>
        </div>
      )}

      {activeDemo === 'workspace' && (
        <div>
          <Alert variant="success" className="mb-4">
            <Brain className="me-2" />
            <strong>Workspace Integrity Demo:</strong> Start typing in the text area below. The system will monitor 
            your typing patterns, detect paste events, and provide encouraging feedback while ensuring academic honesty.
          </Alert>
          
          <Row className="g-4">
            <Col md={8}>
              <Card className="rounded-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="h5">Creative Writing Assignment</CardTitle>
                  <p className="text-muted mb-0">Write about your favorite season and why you like it.</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-auto">
                        <Badge bg="primary">Subject: English</Badge>
                      </div>
                      <div className="col-auto">
                        <Badge bg="secondary">Grade: 4</Badge>
                      </div>
                      <div className="col-auto">
                        <Badge bg="info">Type: Creative Writing</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <textarea
                    className="form-control"
                    rows={12}
                    placeholder="Start writing your creative story here. The integrity monitor will track your progress and provide helpful feedback!"
                    style={{ minHeight: '300px', fontSize: '16px', lineHeight: '1.6' }}
                  />
                  
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      Tip: Write in your own words and take your time to think!
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="me-2" size={14} />
                      Save Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Col>
            
            <Col md={4}>
              <IntegrityMonitor
                userId="demo-student"
                subject="english"
                activityType="creative"
                grade={4}
                onFeedback={(feedback) => console.log('Feedback:', feedback)}
                onSuspiciousActivity={handleSuspiciousActivity}
              />
            </Col>
          </Row>
        </div>
      )}

      {activeDemo === 'monitoring' && (
        <div>
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="me-2" />
            <strong>Integrity Reports Demo:</strong> This shows how parents and teachers can review flagged activities. 
            The system focuses on learning support rather than punishment.
          </Alert>
          
          <Row className="g-4">
            <Col md={6}>
              <Card className="rounded-4 shadow">
                <CardHeader>
                  <CardTitle className="h6 fw-bold">Completed Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedSessions.length === 0 ? (
                    <p className="text-muted">Complete a quiz to see session results here.</p>
                  ) : (
                    completedSessions.map((session, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold">{session.subject} Quiz</h6>
                            <small className="text-muted">Grade {session.grade}</small>
                          </div>
                          <Badge bg={session.integrityScore >= 90 ? 'success' : session.integrityScore >= 70 ? 'warning' : 'danger'}>
                            {session.integrityScore}/100
                          </Badge>
                        </div>
                        <div className="small">
                          <div>Score: <strong>{session.overallScore}%</strong></div>
                          <div>Questions: <strong>{session.responses.length}</strong></div>
                          <div>Flagged: <strong>{session.flaggedForReview ? 'Yes' : 'No'}</strong></div>
                        </div>
                        {session.feedback.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">Recent Feedback:</small>
                            <ul className="mb-0 mt-1">
                              {session.feedback.slice(-2).map((fb, i) => (
                                <li key={i} className="small">{fb.message}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="rounded-4 shadow">
                <CardHeader>
                  <CardTitle className="h6 fw-bold">Integrity Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {suspiciousEvents.length === 0 ? (
                    <div className="text-center py-3">
                      <CheckCircle className="text-success mb-2" size={32} />
                      <p className="text-muted mb-0">No integrity concerns detected!</p>
                      <small className="text-success">Great academic honesty! 🌟</small>
                    </div>
                  ) : (
                    suspiciousEvents.map((event, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <AlertTriangle 
                              className={`me-2 ${event.severity === 'high' ? 'text-danger' : event.severity === 'medium' ? 'text-warning' : 'text-info'}`} 
                              size={16} 
                            />
                            <div>
                              <div className="fw-bold small">{event.description}</div>
                              <div className="text-muted small">{event.context}</div>
                            </div>
                          </div>
                          <Badge bg={event.severity === 'high' ? 'danger' : event.severity === 'medium' ? 'warning' : 'info'}>
                            {event.severity}
                          </Badge>
                        </div>
                        <div className="small text-muted">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {suspiciousEvents.length > 0 && (
                    <Alert variant="info" className="mt-3 mb-0 small">
                      <Lightbulb size={14} className="me-2" />
                      <strong>For Parents/Teachers:</strong> These events help identify when students might need 
                      additional support or clarification on academic integrity expectations.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Features Overview */}
      <Card className="rounded-4 shadow-lg mt-4">
        <CardHeader>
          <CardTitle className="h5 fw-bold">
            <Brain className="me-2 text-success" />
            Key Features & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row className="g-4">
            <Col md={3}>
              <div className="text-center">
                <Shield className="text-primary mb-2" size={32} />
                <h6 className="fw-bold">Real-time Monitoring</h6>
                <small className="text-muted">
                  Tracks typing patterns, paste events, and time usage without being intrusive
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <Target className="text-success mb-2" size={32} />
                <h6 className="fw-bold">Minimal False Positives</h6>
                <small className="text-muted">
                  Designed for grades 3-6 with age-appropriate detection thresholds
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <Lightbulb className="text-warning mb-2" size={32} />
                <h6 className="fw-bold">Educational Feedback</h6>
                <small className="text-muted">
                  Provides helpful suggestions and encouragement rather than punishment
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <CheckCircle className="text-info mb-2" size={32} />
                <h6 className="fw-bold">Privacy Focused</h6>
                <small className="text-muted">
                  All data stored locally with COPPA/GDPR-K compliance
                </small>
              </div>
            </Col>
          </Row>
        </CardContent>
      </Card>
    </Container>
  );
};

export default IntegrityDemo;