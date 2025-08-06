import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Volume2, Award, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import MusicTheoryComponent from '@/components/MusicTheoryComponent';

interface MusicPageState {
  selectedGrade: number;
}

const MusicPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'menu' | 'theory'>('menu');
  const [playing, setPlaying] = useState<string | null>(null);
  
  // Get grade from navigation state (would normally come from props or context)
  const selectedGrade = 4; // Default for now

  const musicActivities = [
    {
      id: 'theory',
      title: 'Music Theory Lessons',
      description: 'Learn notes, rhythms, and scales with interactive lessons',
      icon: '🎵',
      color: 'bg-primary',
      level: 'Berklee Inspired',
      action: () => setCurrentView('theory')
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
      <div>
        <div className="position-fixed top-0 start-0 p-3 z-50">
          <Button
            variant="light"
            className="rounded-circle"
            onClick={() => setCurrentView('menu')}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
        <MusicTheoryComponent 
          grade={selectedGrade}
          onLessonComplete={(lessonId, score) => {
            console.log(`Lesson ${lessonId} completed with score ${score}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-kid-gradient min-vh-100">
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-5"
        >
          <h1 className="display-3 fw-bold mb-3">
            <Music className="me-3" size={60} />
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
            onClick={() => setLocation('/subjects')}
          >
            Back to Subjects
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default MusicPage;