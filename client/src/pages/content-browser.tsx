import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import ContentViewer from '@/components/ContentViewer';
import { LessonContent, contentService, ContentFilter } from '@/services/contentApi';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Star,
  Download,
  Wifi,
  WifiOff,
  Trophy,
  Target,
  Sparkles
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, Form, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContentBrowserState {
  grade: number;
  subject: string;
}

const ContentBrowser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ContentBrowserState;
  
  const [selectedContent, setSelectedContent] = useState<LessonContent | null>(null);
  const [contentList, setContentList] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const grade = state?.grade || 3;
  const subject = state?.subject || 'math';

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load content when component mounts
  useEffect(() => {
    loadContent();
  }, [grade, subject]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const content = await contentService.loadContentByGradeAndSubject(grade, subject);
      setContentList(content);
      
      // Load completed lessons from storage
      const completed = new Set<string>();
      for (const lesson of content) {
        const progress = await contentService.getProgress(lesson.id);
        if (progress && progress.score >= 60) {
          completed.add(lesson.id);
        }
      }
      setCompletedLessons(completed);
      
    } catch (err) {
      setError('Failed to load content. Please check your connection and try again.');
      console.error('Content loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId: string, score: number) => {
    if (score >= 60) {
      setCompletedLessons(prev => new Set([...Array.from(prev), lessonId]));
    }
  };

  const filteredContent = contentList.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'all' || content.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'math': return '🔢';
      case 'english': return '📚';
      case 'science': return '🔬';
      case 'social-studies': return '🌍';
      default: return '📖';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  if (selectedContent) {
    return (
      <ContentViewer
        content={selectedContent}
        onBack={() => setSelectedContent(null)}
        onComplete={handleLessonComplete}
      />
    );
  }

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
              onClick={() => navigate('/subjects')}
            >
              <ArrowLeft size={20} />
            </BootstrapButton>
            
            <div className="text-center">
              <h1 className="h3 fw-bold text-dark mb-1">
                {getSubjectIcon(subject)} Grade {grade} {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </h1>
              <div className="d-flex align-items-center justify-content-center">
                {isOffline ? (
                  <div className="d-flex align-items-center text-warning">
                    <WifiOff size={16} className="me-1" />
                    <small>Offline Mode</small>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-success">
                    <Wifi size={16} className="me-1" />
                    <small>Online</small>
                  </div>
                )}
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              <Trophy className="me-2 text-warning" size={20} />
              <span className="fw-bold text-warning">{completedLessons.size}</span>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <Card className="rounded-4 shadow-lg mb-4">
          <CardContent className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <div className="position-relative">
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                  <Form.Control
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-3 ps-5"
                  />
                </div>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="rounded-3"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-3"
                >
                  <option value="all">All Types</option>
                  <option value="lesson">Lessons</option>
                  <option value="exercise">Exercises</option>
                  <option value="video">Videos</option>
                  <option value="interactive">Interactive</option>
                </Form.Select>
              </Col>
            </Row>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="rounded-4 shadow-lg">
            <CardContent className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h5 className="fw-bold text-muted">Loading Content...</h5>
              <p className="text-muted">Fetching the best educational content for you!</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="danger" className="rounded-4 shadow-lg">
            <div className="d-flex align-items-center">
              <WifiOff className="me-2" size={20} />
              <div>
                <strong>Connection Error</strong>
                <p className="mb-2">{error}</p>
                <BootstrapButton
                  variant="outline-danger"
                  size="sm"
                  onClick={loadContent}
                  className="rounded-3"
                >
                  Try Again
                </BootstrapButton>
              </div>
            </div>
          </Alert>
        )}

        {/* Content List */}
        {!loading && !error && (
          <>
            {/* Stats Overview */}
            <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <Row className="text-center">
                  <Col xs={3}>
                    <div className="h4 fw-bold text-primary">{filteredContent.length}</div>
                    <small className="text-muted">Lessons</small>
                  </Col>
                  <Col xs={3}>
                    <div className="h4 fw-bold text-success">{completedLessons.size}</div>
                    <small className="text-muted">Completed</small>
                  </Col>
                  <Col xs={3}>
                    <div className="h4 fw-bold text-warning">
                      {filteredContent.filter(c => c.quizzes && c.quizzes.length > 0).length}
                    </div>
                    <small className="text-muted">With Quizzes</small>
                  </Col>
                  <Col xs={3}>
                    <div className="h4 fw-bold text-info">
                      {filteredContent.filter(c => c.activities && c.activities.length > 0).length}
                    </div>
                    <small className="text-muted">Interactive</small>
                  </Col>
                </Row>
              </CardContent>
            </Card>

            {/* Content Grid */}
            {filteredContent.length === 0 ? (
              <Card className="rounded-4 shadow-lg">
                <CardContent className="text-center py-5">
                  <div className="text-6xl mb-3">🔍</div>
                  <h5 className="fw-bold text-muted mb-2">No Content Found</h5>
                  <p className="text-muted">Try adjusting your search or filters to find more content.</p>
                </CardContent>
              </Card>
            ) : (
              <Row className="g-4">
                {filteredContent.map((content) => (
                  <Col key={content.id} lg={6} xl={4}>
                    <Card 
                      className={cn(
                        "rounded-4 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl h-100",
                        completedLessons.has(content.id) ? "border-success border-2" : ""
                      )}
                      onClick={() => setSelectedContent(content)}
                    >
                      <CardHeader className="pb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <CardTitle className="h6 fw-bold text-dark mb-2">
                              {content.title}
                            </CardTitle>
                            <SpeakableText text={content.description}>
                              <p className="text-muted small mb-0">{content.description}</p>
                            </SpeakableText>
                          </div>
                          {completedLessons.has(content.id) && (
                            <Trophy className="text-warning ms-2" size={20} />
                          )}
                        </div>
                        
                        <div className="d-flex flex-wrap gap-1">
                          <Badge bg={getDifficultyColor(content.difficulty)} className="rounded-pill">
                            {content.difficulty}
                          </Badge>
                          <Badge bg="secondary" className="rounded-pill">
                            {content.type}
                          </Badge>
                          <Badge bg="info" className="rounded-pill">
                            <Clock size={10} className="me-1" />
                            {content.duration}m
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Content Features */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex gap-2">
                            {content.quizzes && content.quizzes.length > 0 && (
                              <span className="text-primary small">
                                <Target size={12} className="me-1" />
                                {content.quizzes.length} Quiz{content.quizzes.length > 1 ? 'es' : ''}
                              </span>
                            )}
                            {content.activities && content.activities.length > 0 && (
                              <span className="text-success small">
                                <Sparkles size={12} className="me-1" />
                                Interactive
                              </span>
                            )}
                          </div>
                          <Star className="text-warning" size={16} />
                        </div>

                        {/* Keywords Preview */}
                        {content.keywords.slice(0, 3).length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex flex-wrap gap-1">
                              {content.keywords.slice(0, 3).map((keyword, index) => (
                                <span key={index} className="badge bg-light text-dark small">
                                  {keyword}
                                </span>
                              ))}
                              {content.keywords.length > 3 && (
                                <span className="badge bg-light text-muted small">
                                  +{content.keywords.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <BootstrapButton
                          variant={completedLessons.has(content.id) ? "outline-success" : "primary"}
                          size="sm"
                          className="w-100 rounded-3 kid-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContent(content);
                          }}
                        >
                          {completedLessons.has(content.id) ? (
                            <>
                              <Trophy size={16} className="me-2" />
                              Review Lesson
                            </>
                          ) : (
                            <>
                              <BookOpen size={16} className="me-2" />
                              Start Learning
                            </>
                          )}
                        </BootstrapButton>
                      </CardContent>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}

        {/* Offline Notice */}
        {isOffline && (
          <Alert variant="info" className="rounded-4 shadow-lg mt-4">
            <div className="d-flex align-items-center">
              <Download className="me-2" size={20} />
              <div>
                <strong>Offline Mode Active</strong>
                <p className="mb-0">You're viewing cached content. Some features may be limited until you're back online.</p>
              </div>
            </div>
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default ContentBrowser;