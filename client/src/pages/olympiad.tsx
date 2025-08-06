import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, Award, ArrowLeft, Play, BookOpen, Zap, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OlympiadWorkspace from '@/components/OlympiadWorkspace';

interface OlympiadPageState {
  selectedGrade: number;
}

const OlympiadPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'menu' | 'workspace'>('menu');
  
  // Get grade from navigation state (would normally come from props or context)
  const selectedGrade = 4; // Default for now

  const olympiadFeatures = [
    {
      id: 'amc8-math',
      title: 'AMC 8 Math Training',
      description: 'Practice authentic AMC 8 style problems adapted for your grade level',
      icon: '🔢',
      color: 'bg-primary',
      level: 'Mathematical Problem Solving',
      benefits: ['Number theory', 'Algebra', 'Geometry', 'Combinatorics'],
      action: () => setCurrentView('workspace')
    },
    {
      id: 'nso-science',
      title: 'NSO Science Challenges',
      description: 'Explore physics, chemistry, biology, and earth science competition problems',
      icon: '🔬',
      color: 'bg-success',
      level: 'Scientific Reasoning',
      benefits: ['Physics concepts', 'Chemistry basics', 'Life science', 'Earth systems'],
      action: () => setCurrentView('workspace')
    },
    {
      id: 'timed-practice',
      title: 'Timed Competitions',
      description: 'Simulate real olympiad conditions with time limits and scoring',
      icon: '⏱️',
      color: 'bg-warning',
      level: 'Competition Simulation',
      benefits: ['Time management', 'Pressure handling', 'Strategy building', 'Performance tracking'],
      action: () => setCurrentView('workspace')
    },
    {
      id: 'progress-tracking',
      title: 'Progress Analytics',
      description: 'Track your improvement across different topics and difficulty levels',
      icon: '📊',
      color: 'bg-info',
      level: 'Performance Monitoring',
      benefits: ['Score tracking', 'Weakness identification', 'Achievement system', 'Growth metrics'],
      action: () => setCurrentView('workspace')
    }
  ];

  const skillAreas = [
    { area: 'Problem Solving', description: 'Develop systematic approaches to complex challenges' },
    { area: 'Critical Thinking', description: 'Analyze information and make logical connections' },
    { area: 'Time Management', description: 'Work efficiently under competition pressure' },
    { area: 'Mathematical Reasoning', description: 'Apply math concepts to novel situations' },
    { area: 'Scientific Inquiry', description: 'Use scientific methods to solve problems' },
    { area: 'Pattern Recognition', description: 'Identify trends and relationships in data' }
  ];

  if (currentView === 'workspace') {
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
        <OlympiadWorkspace 
          grade={selectedGrade}
          onNavigateBack={() => setCurrentView('menu')}
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
            <Trophy className="me-3" size={60} />
            Olympiad Training!
          </h1>
          <p className="lead">
            Master competition math and science problems for Grade {selectedGrade}
          </p>
        </motion.div>

        <Alert variant="info" className="rounded-4 mb-4">
          <div className="d-flex align-items-center">
            <Award className="me-3" size={24} />
            <div>
              <strong>Authentic Competition Preparation:</strong> Practice with problems inspired by AMC 8 and National Science Olympiad, 
              adapted specifically for elementary grades with age-appropriate difficulty and content.
            </div>
          </div>
        </Alert>

        {/* Main Features */}
        <Row className="g-4 mb-5">
          {olympiadFeatures.map((feature, index) => (
            <Col key={feature.id} md={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-100 rounded-4 shadow-lg border-0 kid-button">
                  <Card.Body className="text-center p-4">
                    <div className={`${feature.color} text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
                    </div>
                    
                    <h4 className="fw-bold mb-2">{feature.title}</h4>
                    <p className="text-muted mb-3">{feature.description}</p>
                    
                    <div className="mb-3">
                      <span className="badge bg-light text-dark rounded-pill">
                        {feature.level}
                      </span>
                    </div>

                    <div className="benefits-list mb-3">
                      <div className="small text-muted">Key Areas:</div>
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="small">• {benefit}</div>
                      ))}
                    </div>
                    
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        className="rounded-3 fw-bold"
                        onClick={feature.action}
                      >
                        <Play className="me-2" size={16} />
                        Start Training!
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Skills Development Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-5"
        >
          <h3 className="text-white text-center mb-4">Skills You'll Develop</h3>
          <Row className="g-3">
            {skillAreas.map((skill, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="rounded-3 shadow border-0 h-100">
                  <Card.Body className="p-3">
                    <h6 className="fw-bold text-primary">{skill.area}</h6>
                    <p className="small text-muted mb-0">{skill.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Competition Information */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-5"
        >
          <Row className="g-4">
            <Col md={6}>
              <Card className="rounded-4 shadow-lg border-0">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <Target className="text-primary me-3" size={32} />
                    <h5 className="fw-bold mb-0">About AMC 8</h5>
                  </div>
                  <p className="text-muted mb-3">
                    The American Mathematics Competitions 8 (AMC 8) is a 25-question, 40-minute multiple choice examination 
                    designed to promote the development of problem-solving skills.
                  </p>
                  <ul className="small">
                    <li>25 multiple choice problems</li>
                    <li>40-minute time limit</li>
                    <li>Topics: arithmetic, algebra, counting, geometry, number theory, and probability</li>
                    <li>Designed for middle school students</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="rounded-4 shadow-lg border-0">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <Zap className="text-success me-3" size={32} />
                    <h5 className="fw-bold mb-0">About NSO</h5>
                  </div>
                  <p className="text-muted mb-3">
                    The National Science Olympiad emphasizes hands-on, inquiry-based learning with a focus on 
                    STEM education through competitive tournaments.
                  </p>
                  <ul className="small">
                    <li>Multiple science disciplines</li>
                    <li>Hands-on experiments and problem solving</li>
                    <li>Topics: physics, chemistry, biology, earth science</li>
                    <li>Promotes scientific literacy and teamwork</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Alert variant="success" className="rounded-4 mb-4">
            <div className="text-center">
              <h5 className="fw-bold mb-2">🎯 Ready to Excel in Competitions?</h5>
              <p className="mb-0">
                Start with problems matched to your current grade level and gradually build up to more challenging olympiad-style questions. 
                Every great mathematician and scientist started with curiosity and practice!
              </p>
            </div>
          </Alert>
          
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button
              variant="warning"
              size="lg"
              className="rounded-4 fw-bold px-4"
              onClick={() => setCurrentView('workspace')}
            >
              <Medal size={20} className="me-2" />
              Start Training Now
            </Button>
            <Button
              variant="light"
              size="lg"
              className="rounded-4 fw-bold px-4"
              onClick={() => navigate('/subjects')}
            >
              Back to Subjects
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default OlympiadPage;