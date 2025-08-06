import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Palette, Paintbrush, Camera, Award, ArrowLeft, Play, Pause } from 'lucide-react';
import { useLocation } from 'wouter';
import DigitalArtCanvas from '@/components/DigitalArtCanvas';

interface ArtPageState {
  selectedGrade: number;
}

const ArtPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'menu' | 'canvas'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<string | undefined>(undefined);
  
  // Get grade from navigation state (would normally come from props or context)
  const selectedGrade = 4; // Default for now

  const artActivities = [
    {
      id: 'drawing-lessons',
      title: 'Drawing Lessons',
      description: 'Learn to draw with step-by-step tutorials from Art for Kids Hub',
      icon: '✏️',
      color: 'bg-primary',
      level: 'Art for Kids Hub',
      action: () => {
        setCurrentView('canvas');
        setSelectedLesson(undefined);
      }
    },
    {
      id: 'guided-tutorials',
      title: 'Guided Tutorials',
      description: 'Follow along with interactive drawing guides',
      icon: '🎨',
      color: 'bg-success',
      level: 'Step-by-Step',
      action: () => {
        setCurrentView('canvas');
        setSelectedLesson('art_hub_drawing_4_1'); // Default to cute cat lesson
      }
    },
    {
      id: 'free-drawing',
      title: 'Free Drawing',
      description: 'Create your own masterpiece on the digital canvas',
      icon: '🖌️',
      color: 'bg-warning',
      level: 'Creative Mode',
      action: () => {
        setCurrentView('canvas');
        setSelectedLesson(undefined);
      }
    },
    {
      id: 'art-gallery',
      title: 'My Art Gallery',
      description: 'View and manage your saved artwork',
      icon: '🖼️',
      color: 'bg-info',
      level: 'Portfolio',
      action: () => {
        // TODO: Navigate to art gallery
        alert('Art Gallery feature coming soon!');
      }
    }
  ];

  if (currentView === 'canvas') {
    return (
      <div>
        <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1000 }}>
          <Button
            variant="light"
            className="rounded-circle"
            onClick={() => setCurrentView('menu')}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
        <DigitalArtCanvas 
          grade={selectedGrade}
          lessonId={selectedLesson}
          onProjectSave={(project) => {
            console.log('Project saved:', project);
            // You could show a success message or update UI here
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
            <Palette className="me-3" size={60} />
            Art Studio!
          </h1>
          <p className="lead">
            Create amazing digital artwork and learn drawing skills for Grade {selectedGrade}
          </p>
        </motion.div>

        <Alert variant="info" className="rounded-4 mb-4">
          <div className="d-flex align-items-center">
            <Award className="me-3" size={24} />
            <div>
              <strong>Art for Kids Hub Inspired:</strong> Learn drawing fundamentals with guided tutorials adapted from popular YouTube art lessons, designed for young artists!
            </div>
          </div>
        </Alert>

        <Row className="g-4">
          {artActivities.map((activity, index) => (
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
                        Start Creating!
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Featured Tutorials Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5"
        >
          <h3 className="text-white text-center mb-4">Featured Drawing Tutorials</h3>
          <Row className="g-3">
            {[
              { id: 'cat', title: 'Cute Cartoon Cat', difficulty: 'Easy', time: '30 min', emoji: '🐱' },
              { id: 'landscape', title: 'Simple Landscape', difficulty: 'Medium', time: '45 min', emoji: '🏔️' },
              { id: 'portrait', title: 'Self Portrait', difficulty: 'Medium', time: '50 min', emoji: '👤' },
              { id: 'still-life', title: 'Fruit Bowl', difficulty: 'Hard', time: '60 min', emoji: '🍎' }
            ].map((tutorial) => (
              <Col key={tutorial.id} md={6} lg={3}>
                <Card className="rounded-3 shadow border-0">
                  <Card.Body className="text-center p-3">
                    <div className="mb-2" style={{ fontSize: '2rem' }}>{tutorial.emoji}</div>
                    <h6 className="fw-bold">{tutorial.title}</h6>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>{tutorial.difficulty}</span>
                      <span>{tutorial.time}</span>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-2 w-100"
                      onClick={() => {
                        setSelectedLesson(`art_hub_drawing_${selectedGrade}_${tutorial.id === 'cat' ? '1' : tutorial.id === 'landscape' ? '2' : tutorial.id === 'portrait' ? '3' : '4'}`);
                        setCurrentView('canvas');
                      }}
                    >
                      Try This!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-5"
        >
          <Alert variant="success" className="rounded-4 mb-4">
            <div className="text-center">
              <h5 className="fw-bold mb-2">🎨 National Visual Arts Standards</h5>
              <p className="mb-0">
                Our art curriculum follows National Visual Arts Standards and NAEYC play-based learning principles, 
                encouraging creativity, observation skills, and artistic expression in age-appropriate ways.
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

export default ArtPage;