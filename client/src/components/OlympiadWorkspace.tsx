import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { 
  Trophy, 
  Target, 
  Clock, 
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  Zap,
  Medal,
  Star,
  TrendingUp,
  Play
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, ProgressBar, Badge, Tabs, Tab } from "react-bootstrap";
import { 
  OlympiadSet, 
  OlympiadAttempt, 
  UserOlympiadProgress, 
  olympiadService 
} from '@/services/olympiadApi';
import OlympiadChallenge from './OlympiadChallenge';
import { cn } from "@/lib/utils";

interface OlympiadWorkspaceProps {
  grade: number;
  onNavigateBack?: () => void;
}

const OlympiadWorkspace: React.FC<OlympiadWorkspaceProps> = ({ 
  grade, 
  onNavigateBack 
}) => {
  // State management
  const [currentView, setCurrentView] = useState<'dashboard' | 'challenge'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<'math' | 'science'>('math');
  const [availableSets, setAvailableSets] = useState<{ math: OlympiadSet[], science: OlympiadSet[] }>({ math: [], science: [] });
  const [userProgress, setUserProgress] = useState<UserOlympiadProgress | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<OlympiadAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<OlympiadSet | null>(null);

  const userId = 'current_user'; // TODO: Get from auth context

  useEffect(() => {
    loadOlympiadData();
  }, [grade]);

  const loadOlympiadData = async () => {
    setLoading(true);
    try {
      // Load available sets for both categories
      const [mathSets, scienceSets] = await Promise.all([
        olympiadService.getAvailableSets('math', grade),
        olympiadService.getAvailableSets('science', grade)
      ]);

      // Create default sets if none exist
      let finalMathSets = mathSets;
      let finalScienceSets = scienceSets;

      if (mathSets.length === 0) {
        const newMathSet = await olympiadService.createOlympiadSet(
          `AMC 8 Practice - Grade ${grade}`,
          'math',
          grade,
          8
        );
        finalMathSets = [newMathSet];
      }

      if (scienceSets.length === 0) {
        const newScienceSet = await olympiadService.createOlympiadSet(
          `NSO Practice - Grade ${grade}`,
          'science',
          grade,
          8
        );
        finalScienceSets = [newScienceSet];
      }

      setAvailableSets({ math: finalMathSets, science: finalScienceSets });

      // Load user progress and recent attempts
      const [progress, attempts] = await Promise.all([
        olympiadService.getUserProgress(userId),
        olympiadService.getUserAttempts(userId)
      ]);

      setUserProgress(progress);
      setRecentAttempts(attempts.slice(0, 5)); // Show last 5 attempts

    } catch (error) {
      console.error('Error loading olympiad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeComplete = async (attempt: OlympiadAttempt) => {
    // Refresh user data after completing a challenge
    await loadOlympiadData();
    setCurrentView('dashboard');
  };

  const handleStartChallenge = (category: 'math' | 'science', set?: OlympiadSet) => {
    setSelectedCategory(category);
    setSelectedSet(set || null);
    setCurrentView('challenge');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (accuracy: number): string => {
    if (accuracy >= 80) return 'success';
    if (accuracy >= 60) return 'warning';
    return 'danger';
  };

  const renderDashboard = () => (
    <Container fluid className="py-4">
      {/* Header */}
      <header className="mb-4">
        <h1 className="display-4 fw-bold text-white text-center mb-2">
          🏆 Olympiad Training Center
        </h1>
        <p className="text-white text-center lead">
          Master Math & Science competition problems for Grade {grade}
        </p>
      </header>

      {/* Progress Overview */}
      <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <Row className="text-center">
            <Col xs={6} md={3}>
              <div className="h4 fw-bold text-primary">{userProgress?.totalAttempts || 0}</div>
              <small className="text-muted">Total Attempts</small>
            </Col>
            <Col xs={6} md={3}>
              <div className="h4 fw-bold text-success">{userProgress?.bestScore || 0}%</div>
              <small className="text-muted">Best Score</small>
            </Col>
            <Col xs={6} md={3}>
              <div className="h4 fw-bold text-warning">{userProgress?.completedSets.length || 0}</div>
              <small className="text-muted">Sets Completed</small>
            </Col>
            <Col xs={6} md={3}>
              <div className="h4 fw-bold text-info">
                {userProgress?.averageScore ? Math.round(userProgress.averageScore) : 0}%
              </div>
              <small className="text-muted">Average Score</small>
            </Col>
          </Row>
        </CardContent>
      </Card>

      <Row className="g-4">
        {/* Challenge Categories */}
        <Col lg={8}>
          <Tabs
            activeKey={selectedCategory}
            onSelect={(key) => setSelectedCategory(key as 'math' | 'science')}
            className="mb-4"
          >
            <Tab eventKey="math" title="🔢 Math Olympiad">
              <Card className="rounded-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="h5 fw-bold d-flex align-items-center">
                    <Target className="me-2 text-primary" />
                    AMC 8 Style Challenges
                  </CardTitle>
                  <p className="text-muted mb-0">
                    Practice problems inspired by the American Mathematics Competitions
                  </p>
                </CardHeader>
                <CardContent>
                  <Row className="g-3">
                    {availableSets.math.map((set) => (
                      <Col key={set.id} md={6}>
                        <Card className="border-0 bg-light">
                          <CardContent className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold">{set.name}</h6>
                              <Badge bg="primary">{set.problems.length} problems</Badge>
                            </div>
                            <p className="text-muted small mb-3">{set.description}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="small text-muted">
                                <Clock size={14} className="me-1" />
                                {Math.floor(set.timeLimit / 60)} min
                              </div>
                              <div className="small text-muted">
                                <Trophy size={14} className="me-1" />
                                {set.totalPoints} pts
                              </div>
                            </div>
                            <BootstrapButton
                              variant="primary"
                              size="sm"
                              className="w-100 rounded-3"
                              onClick={() => handleStartChallenge('math', set)}
                            >
                              <Play size={14} className="me-2" />
                              Start Challenge
                            </BootstrapButton>
                          </CardContent>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  
                  <Alert variant="info" className="rounded-3 mt-4">
                    <BookOpen className="me-2" size={20} />
                    <strong>About AMC 8:</strong> The American Mathematics Competitions 8 is designed for students in grades 8 and below. 
                    These practice problems are adapted to be appropriate for Grade {grade} level.
                  </Alert>
                </CardContent>
              </Card>
            </Tab>

            <Tab eventKey="science" title="🔬 Science Olympiad">
              <Card className="rounded-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="h5 fw-bold d-flex align-items-center">
                    <Zap className="me-2 text-success" />
                    NSO Style Challenges
                  </CardTitle>
                  <p className="text-muted mb-0">
                    Practice problems inspired by the National Science Olympiad
                  </p>
                </CardHeader>
                <CardContent>
                  <Row className="g-3">
                    {availableSets.science.map((set) => (
                      <Col key={set.id} md={6}>
                        <Card className="border-0 bg-light">
                          <CardContent className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-bold">{set.name}</h6>
                              <Badge bg="success">{set.problems.length} problems</Badge>
                            </div>
                            <p className="text-muted small mb-3">{set.description}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="small text-muted">
                                <Clock size={14} className="me-1" />
                                {Math.floor(set.timeLimit / 60)} min
                              </div>
                              <div className="small text-muted">
                                <Trophy size={14} className="me-1" />
                                {set.totalPoints} pts
                              </div>
                            </div>
                            <BootstrapButton
                              variant="success"
                              size="sm"
                              className="w-100 rounded-3"
                              onClick={() => handleStartChallenge('science', set)}
                            >
                              <Play size={14} className="me-2" />
                              Start Challenge
                            </BootstrapButton>
                          </CardContent>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  
                  <Alert variant="info" className="rounded-3 mt-4">
                    <BookOpen className="me-2" size={20} />
                    <strong>About NSO:</strong> The National Science Olympiad promotes STEM education through competitive tournaments. 
                    These practice problems cover physics, chemistry, biology, and earth science appropriate for Grade {grade}.
                  </Alert>
                </CardContent>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        {/* Sidebar with progress and stats */}
        <Col lg={4}>
          {/* Recent Performance */}
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="h6 fw-bold d-flex align-items-center">
                <BarChart3 className="me-2 text-warning" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttempts.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No attempts yet. Start your first challenge!
                </p>
              ) : (
                <div className="attempts-list">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="attempt-item mb-3 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="small fw-bold">
                            {attempt.setId.includes('math') ? '📊 Math' : '🔬 Science'} Challenge
                          </div>
                          <div className="small text-muted">
                            {formatDate(attempt.startTime)}
                          </div>
                        </div>
                        <Badge bg={getPerformanceColor(attempt.accuracy)}>
                          {Math.round(attempt.accuracy)}%
                        </Badge>
                      </div>
                      <ProgressBar
                        now={attempt.accuracy}
                        variant={getPerformanceColor(attempt.accuracy)}
                        className="mt-2"
                        style={{ height: '4px' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="h6 fw-bold d-flex align-items-center">
                <Medal className="me-2 text-warning" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="achievements-grid">
                {[
                  { name: 'First Challenge', icon: '🎯', unlocked: (userProgress?.totalAttempts || 0) >= 1 },
                  { name: 'Perfect Score', icon: '⭐', unlocked: (userProgress?.bestScore || 0) >= 100 },
                  { name: 'Math Master', icon: '🔢', unlocked: recentAttempts.some(a => a.setId.includes('math') && a.accuracy >= 80) },
                  { name: 'Science Star', icon: '🔬', unlocked: recentAttempts.some(a => a.setId.includes('science') && a.accuracy >= 80) },
                  { name: 'Persistent', icon: '💪', unlocked: (userProgress?.totalAttempts || 0) >= 5 },
                  { name: 'Rising Star', icon: '🌟', unlocked: (userProgress?.averageScore || 0) >= 70 }
                ].map((achievement) => (
                  <div
                    key={achievement.name}
                    className={cn(
                      "achievement-badge text-center p-2 rounded",
                      achievement.unlocked ? "bg-warning bg-opacity-25" : "bg-light opacity-50"
                    )}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{achievement.icon}</div>
                    <div className="small">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="rounded-4 shadow-lg">
            <CardHeader>
              <CardTitle className="h6 fw-bold d-flex align-items-center">
                <Zap className="me-2 text-info" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="d-grid gap-2">
                <BootstrapButton
                  variant="outline-primary"
                  onClick={() => handleStartChallenge('math')}
                >
                  <Target size={16} className="me-2" />
                  Random Math Challenge
                </BootstrapButton>
                <BootstrapButton
                  variant="outline-success"
                  onClick={() => handleStartChallenge('science')}
                >
                  <Star size={16} className="me-2" />
                  Random Science Challenge
                </BootstrapButton>
              </div>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Jump right into a challenge with problems matched to your grade level!
                </small>
              </div>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Container>
  );

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <h5 className="fw-bold">Loading Olympiad Center...</h5>
            <p className="text-muted">Preparing your competition training!</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (currentView === 'challenge') {
    return (
      <OlympiadChallenge
        grade={grade}
        category={selectedCategory}
        onComplete={handleChallengeComplete}
        onExit={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen">
      <AccessibilityToolbar />
      {renderDashboard()}
    </div>
  );
};

export default OlympiadWorkspace;