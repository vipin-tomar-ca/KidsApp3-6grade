import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Cloud, 
  RefreshCw, 
  BookOpen,
  Users,
  Shield,
  Download,
  Upload,
  Activity,
  CheckCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { Container, Row, Col, Alert, Badge, Form, Tabs, Tab, Table } from "react-bootstrap";
import FirebaseSync from '@/components/FirebaseSync';
import { contentService, LessonContent, UserProgress } from '@/services/contentService';
import { useChildSafety } from '@/hooks/useChildSafety';

const FirebaseDemo: React.FC = () => {
  const { currentUser, parentalDashboard } = useChildSafety();
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectivityStatus, setConnectivityStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    checkConnectivity();
    loadLessons();
    loadUserProgress();
  }, [selectedGrade, selectedSubject]);

  const checkConnectivity = async () => {
    setConnectivityStatus('checking');
    try {
      // Test Firebase connectivity
      await contentService.getLessonsByGradeAndSubject(3, 'math', false);
      setConnectivityStatus('online');
    } catch (error) {
      setConnectivityStatus('offline');
    }
  };

  const loadLessons = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const lessonData = await contentService.getLessonsByGradeAndSubject(
        selectedGrade, 
        selectedSubject, 
        true // Use cache
      );
      setLessons(lessonData);
    } catch (error) {
      console.error('Error loading lessons:', error);
      setError('Failed to load lessons. Using offline cache if available.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!currentUser) return;
    
    try {
      const progressData = await contentService.getUserProgress(currentUser.id);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const simulateProgress = async () => {
    if (!currentUser || lessons.length === 0) return;
    
    const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
    
    await contentService.updateUserProgress(
      currentUser.id,
      randomLesson.id,
      {
        subject: randomLesson.subject,
        grade: randomLesson.grade,
        status: Math.random() > 0.5 ? 'completed' : 'in-progress',
        progressPercentage: Math.floor(Math.random() * 100),
        timeSpent: Math.floor(Math.random() * 30) + 5,
        scores: {
          quizScore: Math.floor(Math.random() * 100),
          comprehensionScore: Math.floor(Math.random() * 100)
        }
      },
      parentalDashboard.dataCollectionConsent
    );
    
    await loadUserProgress();
  };

  const searchLessons = async () => {
    if (!searchQuery.trim()) {
      loadLessons();
      return;
    }
    
    setIsLoading(true);
    try {
      const searchResults = await contentService.searchLessons(
        searchQuery,
        selectedGrade,
        selectedSubject,
        10
      );
      setLessons(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressForLesson = (lessonId: string): UserProgress | undefined => {
    return userProgress.find(p => p.lessonId === lessonId);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'mastered': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="h3 fw-bold d-flex align-items-center">
            <Database className="me-3 text-primary" size={36} />
            Firebase Content & Progress Demo
            <Badge bg={connectivityStatus === 'online' ? 'success' : 'warning'} className="ms-3">
              {connectivityStatus === 'checking' ? 'Checking...' : 
               connectivityStatus === 'online' ? 'Online' : 'Offline Mode'}
            </Badge>
          </CardTitle>
          <p className="text-muted mb-0">
            Firebase Firestore integration for educational content management and COPPA-compliant progress syncing
          </p>
        </CardHeader>
      </Card>

      {/* Connectivity Alert */}
      <Alert variant={connectivityStatus === 'online' ? 'success' : 'warning'} className="mb-4">
        <div className="d-flex align-items-center">
          {connectivityStatus === 'online' ? (
            <Cloud className="me-2" size={16} />
          ) : (
            <Activity className="me-2" size={16} />
          )}
          <div>
            <strong>Status:</strong> {
              connectivityStatus === 'online' 
                ? 'Connected to Firebase - Real-time content and progress sync available'
                : 'Working offline - Using cached content and local progress storage'
            }
          </div>
        </div>
      </Alert>

      <Row className="g-4">
        {/* Content Management */}
        <Col md={8}>
          <Tabs defaultActiveKey="lessons" className="mb-4">
            <Tab eventKey="lessons" title="Educational Content">
              <Card className="rounded-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="h5 d-flex align-items-center">
                    <BookOpen className="me-2 text-primary" size={20} />
                    Lesson Content Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Content Controls */}
                  <Row className="g-3 mb-4">
                    <Col md={3}>
                      <Form.Label>Subject</Form.Label>
                      <Form.Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="math">Math</option>
                        <option value="english">English</option>
                        <option value="science">Science</option>
                        <option value="music">Music</option>
                        <option value="art">Art</option>
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Label>Grade</Form.Label>
                      <Form.Select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                      >
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                        <option value="6">Grade 6</option>
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Search</Form.Label>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search lessons..."
                          onKeyPress={(e) => e.key === 'Enter' && searchLessons()}
                        />
                        <Button onClick={searchLessons} className="ms-2">
                          Search
                        </Button>
                      </div>
                    </Col>
                    <Col md={2}>
                      <Form.Label>&nbsp;</Form.Label>
                      <Button 
                        onClick={loadLessons}
                        variant="outline"
                        className="w-100"
                        disabled={isLoading}
                      >
                        <RefreshCw className="me-1" size={14} />
                        Refresh
                      </Button>
                    </Col>
                  </Row>

                  {error && (
                    <Alert variant="warning" className="mb-3">
                      <AlertTriangle className="me-2" size={16} />
                      {error}
                    </Alert>
                  )}

                  {/* Lessons List */}
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mt-2">Loading lessons...</p>
                    </div>
                  ) : lessons.length === 0 ? (
                    <Alert variant="info" className="text-center">
                      <BookOpen className="mb-2" size={32} />
                      <div>No lessons found for {selectedSubject} grade {selectedGrade}</div>
                      <small className="text-muted">
                        {connectivityStatus === 'offline' ? 
                          'Check your internet connection for latest content' :
                          'Content may not be available yet for this combination'
                        }
                      </small>
                    </Alert>
                  ) : (
                    <div className="border rounded-3 overflow-hidden">
                      <Table responsive hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Source</th>
                            <th>Type</th>
                            <th>Difficulty</th>
                            <th>Duration</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => {
                            const progress = getProgressForLesson(lesson.id);
                            return (
                              <tr key={lesson.id}>
                                <td>
                                  <div>
                                    <div className="fw-bold">{lesson.title}</div>
                                    <small className="text-muted">{lesson.description.substring(0, 60)}...</small>
                                  </div>
                                </td>
                                <td>
                                  <Badge bg="info" className="text-capitalize">
                                    {lesson.source.replace('-', ' ')}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge bg="secondary" className="text-capitalize">
                                    {lesson.contentType}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge bg={lesson.difficulty === 'easy' ? 'success' : 
                                             lesson.difficulty === 'medium' ? 'warning' : 'danger'}>
                                    {lesson.difficulty}
                                  </Badge>
                                </td>
                                <td>{lesson.estimatedTime} min</td>
                                <td>
                                  {progress ? (
                                    <div>
                                      <Badge bg={getStatusColor(progress.status)} className="mb-1">
                                        {progress.status.replace('-', ' ')}
                                      </Badge>
                                      <div className="small text-muted">
                                        {progress.progressPercentage}% • {progress.timeSpent}min
                                      </div>
                                    </div>
                                  ) : (
                                    <Badge bg="secondary">Not Started</Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {/* Demo Actions */}
                  <div className="mt-3 d-flex justify-content-between">
                    <small className="text-muted">
                      Showing {lessons.length} lessons • 
                      Cache: {connectivityStatus === 'offline' ? 'Active' : 'Updated'}
                    </small>
                    
                    <Button 
                      onClick={simulateProgress}
                      size="sm"
                      variant="outline"
                      disabled={lessons.length === 0}
                    >
                      <Activity className="me-1" size={12} />
                      Simulate Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Tab>

            <Tab eventKey="progress" title="User Progress">
              <Card className="rounded-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="h5 d-flex align-items-center">
                    <Users className="me-2 text-success" size={20} />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProgress.length === 0 ? (
                    <Alert variant="info" className="text-center">
                      <Activity className="mb-2" size={32} />
                      <div>No progress data found</div>
                      <small className="text-muted">
                        Start learning activities to see progress tracking in action
                      </small>
                    </Alert>
                  ) : (
                    <div>
                      <div className="row g-3 mb-4">
                        {['completed', 'in-progress', 'not-started'].map(status => (
                          <div key={status} className="col-md-4">
                            <div className="bg-light rounded-3 p-3 text-center">
                              <div className="h4 fw-bold text-primary">
                                {userProgress.filter(p => p.status === status).length}
                              </div>
                              <div className="small text-muted text-capitalize">
                                {status.replace('-', ' ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border rounded-3 overflow-hidden">
                        <Table responsive hover className="mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Subject</th>
                              <th>Grade</th>
                              <th>Status</th>
                              <th>Progress</th>
                              <th>Time Spent</th>
                              <th>Last Access</th>
                              <th>Sync Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userProgress.slice(0, 10).map((progress) => (
                              <tr key={progress.id}>
                                <td className="text-capitalize">{progress.subject}</td>
                                <td>Grade {progress.grade}</td>
                                <td>
                                  <Badge bg={getStatusColor(progress.status)}>
                                    {progress.status.replace('-', ' ')}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className="progress-bar" 
                                      style={{ width: `${progress.progressPercentage}%` }}
                                    ></div>
                                  </div>
                                  <small>{progress.progressPercentage}%</small>
                                </td>
                                <td>{progress.timeSpent} min</td>
                                <td>
                                  <small>{progress.lastAccessed.toDate().toLocaleDateString()}</small>
                                </td>
                                <td>
                                  {progress.canSyncToCloud ? (
                                    <CheckCircle className="text-success" size={16} />
                                  ) : (
                                    <Shield className="text-warning" size={16} />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        {/* Firebase Sync Panel */}
        <Col md={4}>
          <FirebaseSync
            userId={currentUser?.id || 'demo-user'}
            onSyncComplete={(status) => {
              console.log('Sync completed:', status);
              loadUserProgress();
            }}
          />

          {/* COPPA Compliance Info */}
          <Alert variant="success" className="mt-4">
            <Shield className="me-2" size={16} />
            <div>
              <strong>COPPA Compliance Features:</strong>
              <ul className="mb-0 mt-2 small">
                <li>Parental consent required for cloud sync</li>
                <li>All data stored locally by default</li>
                <li>Educational content from trusted sources</li>
                <li>Data export and deletion available</li>
                <li>No personal information collection</li>
                <li>Age-appropriate content filtering</li>
              </ul>
            </div>
          </Alert>

          {/* Technical Details */}
          <Card className="rounded-4 shadow mt-3">
            <CardHeader>
              <CardTitle className="h6">Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="small">
                <div className="mb-2">
                  <strong>Backend:</strong> Firebase Firestore
                </div>
                <div className="mb-2">
                  <strong>Offline Support:</strong> localforage caching
                </div>
                <div className="mb-2">
                  <strong>Content Sources:</strong> Khan Academy, CK-12, Olympiad
                </div>
                <div className="mb-2">
                  <strong>Data Security:</strong> Encrypted, COPPA-compliant
                </div>
                <div>
                  <strong>Sync Strategy:</strong> Consent-based, offline-first
                </div>
              </div>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FirebaseDemo;