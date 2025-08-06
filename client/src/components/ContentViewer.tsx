import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import InteractiveQuiz from './InteractiveQuiz';
import { LessonContent, contentService } from '@/services/contentApi';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  BookOpen, 
  Target, 
  CheckCircle,
  Trophy,
  Sparkles,
  Play,
  Pause,
  Volume2
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, Badge, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContentViewerProps {
  content: LessonContent;
  onBack?: () => void;
  onComplete?: (lessonId: string, score: number) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ 
  content, 
  onBack, 
  onComplete 
}) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'lesson' | 'quiz' | 'completed'>('lesson');
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [lessonScore, setLessonScore] = useState(0);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showObjectives, setShowObjectives] = useState(true);

  // Timer for tracking time spent
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  // Auto-start reading when lesson loads
  useEffect(() => {
    setIsReading(true);
    // Simulate reading progress
    const progressInterval = setInterval(() => {
      setReadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, []);

  const handleQuizComplete = async (score: number, totalQuestions: number) => {
    const finalScore = Math.round((score / (totalQuestions * 20)) * 100); // Normalize to percentage
    setLessonScore(finalScore);
    setCurrentView('completed');
    
    // Save progress
    await contentService.saveProgress(content.id, finalScore, timeSpent);
    
    // Notify parent component
    onComplete?.(content.id, finalScore);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGradeEmoji = (score: number): string => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '⭐';
    if (score >= 70) return '👍';
    if (score >= 60) return '👌';
    return '💪';
  };

  const getEncouragementMessage = (score: number): string => {
    if (score >= 90) return "Outstanding work! You're mastering this subject!";
    if (score >= 80) return "Excellent job! You really understand this material!";
    if (score >= 70) return "Great work! You're making good progress!";
    if (score >= 60) return "Good effort! Keep practicing and you'll improve!";
    return "Nice try! Remember, learning takes practice - keep going!";
  };

  const renderLessonContent = () => {
    return (
      <div className="lesson-content">
        {/* Learning Objectives */}
        {showObjectives && content.objectives.length > 0 && (
          <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="h5 fw-bold d-flex align-items-center">
                  <Target className="me-2 text-success" size={20} />
                  Learning Goals
                </CardTitle>
                <BootstrapButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowObjectives(false)}
                >
                  ×
                </BootstrapButton>
              </div>
            </CardHeader>
            <CardContent>
              <SpeakableText text={`Learning objectives: ${content.objectives.join(', ')}`}>
                <div className="d-flex flex-column gap-2">
                  {content.objectives.map((objective, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <span className="badge bg-success rounded-circle me-3">{index + 1}</span>
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>
              </SpeakableText>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="rounded-4 shadow-lg mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <CardTitle className="h3 fw-bold text-dark mb-2">
                  {content.title}
                </CardTitle>
                <SpeakableText text={content.description}>
                  <p className="text-muted mb-3">{content.description}</p>
                </SpeakableText>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="primary" className="rounded-pill">
                    Grade {content.grade}
                  </Badge>
                  <Badge bg="info" className="rounded-pill">
                    {content.subject}
                  </Badge>
                  <Badge bg="warning" className="rounded-pill">
                    {content.difficulty}
                  </Badge>
                  <Badge bg="success" className="rounded-pill">
                    <Clock size={12} className="me-1" />
                    {content.duration} min
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="h4 fw-bold text-primary">{Math.round(readingProgress)}%</div>
                <small className="text-muted">Progress</small>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Reading Progress */}
            <div className="mb-4">
              <ProgressBar 
                now={readingProgress} 
                className="rounded-pill"
                style={{ height: '8px' }}
                variant="success"
              />
            </div>

            {/* Lesson Content */}
            <div 
              className="lesson-text"
              dangerouslySetInnerHTML={{ __html: content.content }}
              style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.7',
                fontFamily: 'Georgia, serif'
              }}
            />

            {/* Keywords Section */}
            {content.keywords.length > 0 && (
              <div className="mt-4 p-4 bg-light rounded-3">
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <Sparkles className="me-2 text-warning" size={16} />
                  Key Words to Remember
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {content.keywords.map((keyword, index) => (
                    <SpeakableText key={index} text={keyword}>
                      <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                        {keyword}
                      </span>
                    </SpeakableText>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Standards Alignment */}
        {content.standards.length > 0 && (
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="h6 fw-bold d-flex align-items-center">
                <CheckCircle className="me-2 text-info" size={16} />
                Educational Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="d-flex flex-wrap gap-2">
                {content.standards.map((standard, index) => (
                  <Badge key={index} bg="info" className="rounded-pill">
                    {standard}
                  </Badge>
                ))}
              </div>
              <small className="text-muted mt-2 d-block">
                This lesson aligns with Common Core and national education standards.
              </small>
            </CardContent>
          </Card>
        )}

        {/* Quiz Ready Button */}
        {readingProgress >= 80 && !hasStartedQuiz && (
          <Card className="rounded-4 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="text-center py-4">
              <div className="display-4 mb-3">🎯</div>
              <h4 className="fw-bold mb-3">Ready for the Quiz?</h4>
              <SpeakableText text="You've completed most of the lesson! Time to test your knowledge with interactive questions and activities.">
                <p className="mb-4">
                  You've completed most of the lesson! Time to test your knowledge 
                  with interactive questions and activities.
                </p>
              </SpeakableText>
              <BootstrapButton
                variant="light"
                size="lg"
                className="rounded-3 kid-button fw-bold"
                onClick={() => {
                  setCurrentView('quiz');
                  setHasStartedQuiz(true);
                  setIsReading(false);
                }}
              >
                <Play className="me-2" size={20} />
                Start Quiz & Activities
              </BootstrapButton>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderCompletedView = () => {
    return (
      <Card className="rounded-4 shadow-lg text-center">
        <CardContent className="py-5">
          <div className="display-1 mb-4">{getGradeEmoji(lessonScore)}</div>
          <h2 className="h3 fw-bold text-primary mb-3">Lesson Completed!</h2>
          
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="bg-blue-50 rounded-3 p-4">
                <div className="h2 fw-bold text-primary">{lessonScore}%</div>
                <div className="text-muted">Final Score</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-green-50 rounded-3 p-4">
                <div className="h2 fw-bold text-success">{formatTime(timeSpent)}</div>
                <div className="text-muted">Time Spent</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-yellow-50 rounded-3 p-4">
                <div className="h2 fw-bold text-warning">
                  <Star className="text-warning" size={24} />
                </div>
                <div className="text-muted">Achievement</div>
              </div>
            </div>
          </div>

          <Alert variant="success" className="rounded-3 mb-4">
            <SpeakableText text={getEncouragementMessage(lessonScore)}>
              <div className="d-flex align-items-center justify-content-center">
                <Trophy className="me-2" size={20} />
                <strong>{getEncouragementMessage(lessonScore)}</strong>
              </div>
            </SpeakableText>
          </Alert>

          <div className="d-flex justify-content-center gap-3">
            <BootstrapButton
              variant="outline-primary"
              size="lg"
              className="rounded-3"
              onClick={() => setCurrentView('lesson')}
            >
              Review Lesson
            </BootstrapButton>
            <BootstrapButton
              variant="primary"
              size="lg"
              className="rounded-3"
              onClick={() => navigate('/subjects')}
            >
              Continue Learning
            </BootstrapButton>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-kid-gradient min-h-screen pb-6">
      <AccessibilityToolbar />
      
      <Container fluid className="py-4">
        {/* Header */}
        <header className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <BootstrapButton
              variant="outline-secondary"
              className="rounded-circle p-2"
              onClick={onBack || (() => navigate(-1))}
            >
              <ArrowLeft size={20} />
            </BootstrapButton>
            
            <div className="d-flex align-items-center">
              <BookOpen className="me-2 text-primary" size={20} />
              <span className="fw-bold text-muted">
                {currentView === 'lesson' ? 'Reading' : 
                 currentView === 'quiz' ? 'Quiz Time' : 'Complete!'}
              </span>
            </div>
            
            <div className="d-flex align-items-center">
              <Clock className="me-2 text-muted" size={16} />
              <span className="text-muted">{formatTime(timeSpent)}</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {currentView === 'lesson' && renderLessonContent()}
          
          {currentView === 'quiz' && (
            <InteractiveQuiz
              quizzes={content.quizzes || []}
              activities={content.activities || []}
              onComplete={handleQuizComplete}
              onProgressUpdate={(current, total) => {
                // Optional: Handle quiz progress updates
              }}
            />
          )}
          
          {currentView === 'completed' && renderCompletedView()}
        </div>
      </Container>
    </div>
  );
};

export default ContentViewer;