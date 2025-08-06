import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, Award, ArrowLeft, CheckCircle, Star, Lock } from 'lucide-react';
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Badge, ProgressBar } from 'react-bootstrap';
import { useLocation } from 'wouter';
import MusicTheoryComponent from '@/components/MusicTheoryComponent';

interface MusicPageState {
  selectedGrade: number;
}

const MusicPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const [currentView, setCurrentView] = useState<'menu' | 'theory' | 'progression'>('menu');
  const [playing, setPlaying] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [totalScore, setTotalScore] = useState(150); // Example score
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  
  // Get grade from navigation state (would normally come from props or context)
  const selectedGrade = 4; // Default for now

  // Enhanced skill levels with progression
  const skillLevels = [
    {
      id: 'beginner',
      name: 'Music Explorer',
      description: 'Discover the basics of music theory and rhythm',
      icon: '🎵',
      color: 'bg-success',
      requiredScore: 0,
      lessons: [
        'Musical Notes & Sounds',
        'Clap Along - Basic Rhythm', 
        'Piano Keys Adventure',
        'Simple Melodies'
      ],
      completed: totalScore >= 100
    },
    {
      id: 'intermediate',
      name: 'Rhythm Master',
      description: 'Master complex rhythms and basic scales',
      icon: '🎼',
      color: 'bg-primary',
      requiredScore: 100,
      lessons: [
        'Musical Scales',
        'Advanced Rhythm Patterns',
        'First Chords',
        'Tempo & Timing'
      ],
      completed: totalScore >= 250
    },
    {
      id: 'advanced',
      name: 'Melody Composer',
      description: 'Create melodies and understand song structure',
      icon: '🎹',
      color: 'bg-warning',
      requiredScore: 250,
      lessons: [
        'Melody Making',
        'Song Building Blocks',
        'Harmony Basics',
        'Musical Expression'
      ],
      completed: totalScore >= 400
    },
    {
      id: 'expert',
      name: 'Music Virtuoso',
      description: 'Master advanced theory and composition',
      icon: '🏆',
      color: 'bg-danger',
      requiredScore: 400,
      lessons: [
        'Advanced Harmony',
        'Full Song Composition',
        'Performance Techniques',
        'Music Analysis'
      ],
      completed: false
    }
  ];

  const musicActivities = [
    {
      id: 'theory',
      title: 'Music Theory Lessons',
      description: 'Learn notes, rhythms, and scales with interactive lessons',
      icon: '🎵',
      color: 'bg-primary',
      level: 'Berklee Inspired',
      action: () => setCurrentView('progression')
    },
    {
      id: 'rhythm',
      title: 'Rhythm Games',
      description: 'Interactive rhythm challenges and beat games',
      icon: '🥁',
      color: 'bg-danger',
      level: 'Interactive',
      action: () => setCurrentView('theory')
    },
    {
      id: 'piano',
      title: 'Virtual Piano',
      description: 'Play and learn with an interactive piano keyboard',
      icon: '🎹',
      color: 'bg-success',
      level: 'Hands-on',
      action: () => setCurrentView('theory')
    },
    {
      id: 'compose',
      title: 'Create Music',
      description: 'Compose your own rhythms and melodies',
      icon: '🎼',
      color: 'bg-warning',
      level: 'Creative',
      action: () => setCurrentView('theory')
    }
  ];

  const playSound = (activityId: string) => {
    if (playing === activityId) {
      setPlaying(null);
    } else {
      setPlaying(activityId);
      // Here you would play actual audio
      setTimeout(() => setPlaying(null), 3000);
    }
  };

  if (currentView === 'theory') {
    return (
      <div className="bg-kid-gradient min-vh-100">
        <NavigationHeader 
          title="Interactive Music Theory"
          showBack={true}
          onBack={() => setCurrentView('menu')}
          theme="dark"
        />
        <div className="pt-3">
          <MusicTheoryComponent 
            grade={selectedGrade}
            onLessonComplete={(lessonId, score) => {
              console.log(`Lesson ${lessonId} completed with score ${score}`);
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'progression') {
    return (
      <div className="bg-kid-gradient min-vh-100">
        <NavigationHeader 
          title="Music Mastery Path"
          showBack={true}
          onBack={() => navigate('/subject-selection')}
          progress={Math.round((totalScore / 500) * 100)}
          theme="dark"
        />

        <Container className="py-3">
          {/* Progress Overview */}
          <Alert variant="info" className="rounded-4 mb-4 bg-white border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="fw-bold mb-1">Your Musical Journey</h6>
                <p className="mb-0 text-muted">Progress through structured levels from beginner to expert</p>
              </div>
              <div className="text-end">
                <div className="h4 fw-bold text-primary">{totalScore}</div>
                <small className="text-muted">Total Points</small>
              </div>
            </div>
          </Alert>

          {/* Skill Level Progression */}
          <div className="mb-5">
            <h5 className="text-white mb-4 fw-bold">🎵 Choose Your Level</h5>
            <Row className="g-4">
              {skillLevels.map((level, index) => {
                const isUnlocked = totalScore >= level.requiredScore;
                const isActive = userLevel === level.id;
                
                return (
                  <Col key={level.id} md={6} lg={3}>
                    <Card 
                      className={`h-100 skill-level-card border-0 shadow-lg rounded-4 ${
                        isUnlocked ? 'bg-white' : 'bg-light'
                      } ${isActive ? 'border-primary border-3' : ''}`}
                      style={{ 
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.6,
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => isUnlocked && setUserLevel(level.id as any)}
                    >
                      <Card.Body className="text-center p-4">
                        <div 
                          className={`skill-level-icon ${level.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                          style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                        >
                          {level.icon}
                        </div>
                        <h6 className="card-title fw-bold">{level.name}</h6>
                        <p className="text-muted small mb-3">{level.description}</p>
                        
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">
                            {level.lessons.length} lessons • {level.requiredScore} pts required
                          </small>
                          <ProgressBar 
                            now={level.completed ? 100 : isUnlocked ? 50 : 0} 
                            className="rounded-pill"
                            style={{ height: '8px' }}
                            variant={level.completed ? 'success' : level.color.split('-')[1]}
                          />
                        </div>
                        
                        {!isUnlocked && (
                          <Badge bg="warning" className="rounded-pill">
                            Need {level.requiredScore - totalScore} more points
                          </Badge>
                        )}
                        {isUnlocked && level.completed && (
                          <Badge bg="success" className="rounded-pill">
                            <Award size={14} className="me-1" />
                            Completed!
                          </Badge>
                        )}
                        {isUnlocked && !level.completed && (
                          <Badge bg="primary" className="rounded-pill">
                            Available
                          </Badge>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Current Level Lessons */}
          <div className="mb-4">
            <h5 className="text-white mb-4 fw-bold">
              {skillLevels.find(l => l.id === userLevel)?.icon} {skillLevels.find(l => l.id === userLevel)?.name} Lessons
            </h5>
            <Row className="g-3">
              {skillLevels.find(l => l.id === userLevel)?.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.has(lesson);
                const isUnlocked = index === 0 || completedLessons.has(skillLevels.find(l => l.id === userLevel)?.lessons[index - 1] || '');
                
                return (
                  <Col key={lesson} md={6} lg={3}>
                    <Card 
                      className={`h-100 lesson-card border-0 shadow-sm rounded-4 ${
                        isUnlocked ? 'bg-white' : 'bg-light'
                      }`}
                      style={{ 
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.5
                      }}
                      onClick={() => isUnlocked && setCurrentView('theory')}
                    >
                      <Card.Body className="text-center p-3">
                        <div className="mb-3">
                          {isCompleted ? (
                            <div className="text-success mb-2">
                              <CheckCircle size={24} />
                            </div>
                          ) : isUnlocked ? (
                            <div className="text-primary mb-2">
                              <Play size={24} />
                            </div>
                          ) : (
                            <div className="text-muted mb-2">
                              <Lock size={24} />
                            </div>
                          )}
                        </div>
                        <h6 className="card-title small fw-bold">{lesson}</h6>
                        <div className="mt-2">
                          {isCompleted && (
                            <Badge bg="success" className="rounded-pill small">
                              <Star size={10} className="me-1" />
                              Complete
                            </Badge>
                          )}
                          {!isCompleted && isUnlocked && (
                            <Badge bg="primary" className="rounded-pill small">
                              Start
                            </Badge>
                          )}
                          {!isUnlocked && (
                            <Badge bg="secondary" className="rounded-pill small">
                              Locked
                            </Badge>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Next Level Preview */}
          {userLevel !== 'expert' && (
            <Alert variant="light" className="rounded-4 border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {skillLevels.find(l => skillLevels.findIndex(sl => sl.id === l.id) === skillLevels.findIndex(sl => sl.id === userLevel) + 1)?.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-1">
                    Next: {skillLevels.find(l => skillLevels.findIndex(sl => sl.id === l.id) === skillLevels.findIndex(sl => sl.id === userLevel) + 1)?.name}
                  </h6>
                  <p className="mb-0 text-muted small">
                    Complete more lessons to unlock the next level and advance your musical skills!
                  </p>
                </div>
              </div>
            </Alert>
          )}
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-kid-gradient min-vh-100">
      <NavigationHeader 
        title="Music Studio"
        showBack={true}
        onBack={() => navigate('/subject-selection')}
        theme="dark"
      />
      <Container className="py-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-4"
        >
          <h1 className="display-4 fw-bold mb-3">
            <Music className="me-3" size={50} />
            Music Studio!
          </h1>
          <p className="lead">
            Explore music theory and create amazing sounds for Grade {selectedGrade}
          </p>
        </motion.div>

        <Alert variant="info" className="rounded-4 mb-4">
          <div className="d-flex align-items-center">
            <Award className="me-3" size={24} />
            <div>
              <strong>Berklee-Inspired Learning:</strong> Learn music theory fundamentals, rhythm patterns, and creative expression through interactive lessons and games!
            </div>
          </div>
        </Alert>

        <Row className="g-4">
          {musicActivities.map((activity, index) => (
            <Col key={activity.id} md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-100 rounded-4 shadow-lg border-0 kid-button">
                  <Card.Body className="text-center p-4">
                    <div className={`${activity.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ fontSize: '2rem' }}>{activity.icon}</span>
                    </div>
                    
                    <h4 className="fw-bold mb-2">{activity.title}</h4>
                    <p className="text-muted mb-3">{activity.description}</p>
                    
                    <div className="mb-3">
                      <span className="badge bg-light text-dark rounded-pill">
                        {activity.level}
                      </span>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        className="rounded-3 fw-bold"
                        onClick={activity.action}
                      >
                        <Play className="me-2" size={16} />
                        Start Learning!
                      </Button>
                      
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-3"
                        onClick={() => playSound(activity.id)}
                      >
                        {playing === activity.id ? (
                          <>
                            <Pause className="me-1" size={14} />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Volume2 className="me-1" size={14} />
                            Preview
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-5"
        >
          <Alert variant="success" className="rounded-4 mb-4">
            <div className="text-center">
              <h5 className="fw-bold mb-2">🎖️ National Standards Aligned</h5>
              <p className="mb-0">
                Our music curriculum follows National Core Arts Standards and incorporates 
                play-based learning principles from NAEYC for engaging, age-appropriate education.
              </p>
            </div>
          </Alert>
          
          <Button
            variant="light"
            size="lg"
            className="rounded-4 fw-bold px-4"
            onClick={() => navigate('/subjects')}
          >
            Back to Subjects
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default MusicPage;