import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  MessageCircle, 
  Lightbulb, 
  BookOpen,
  Calculator,
  Music,
  Palette,
  FlaskConical,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Container, Row, Col, Alert, Badge, Form, Tabs, Tab } from "react-bootstrap";
import HintAssistant from '@/components/HintAssistant';
import { llmHintService, HintInteraction } from '@/services/llmHintService';

const LLMDemo: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'english' | 'music' | 'art' | 'science'>('math');
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [userInput, setUserInput] = useState('');
  const [context, setContext] = useState('');
  const [activityType, setActivityType] = useState<'problem-solving' | 'creative-writing' | 'music-composition' | 'drawing' | 'science-experiment'>('problem-solving');
  const [allInteractions, setAllInteractions] = useState<HintInteraction[]>([]);
  const [modelStatus, setModelStatus] = useState(llmHintService.getModelStatus());

  useEffect(() => {
    loadInteractions();
    
    // Update model status periodically
    const statusInterval = setInterval(() => {
      setModelStatus(llmHintService.getModelStatus());
    }, 3000);

    return () => clearInterval(statusInterval);
  }, []);

  const loadInteractions = async () => {
    try {
      const interactions = await llmHintService.getInteractionHistory();
      setAllInteractions(interactions);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const handleHintGenerated = async (hint: any) => {
    await loadInteractions();
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'math': return Calculator;
      case 'english': return BookOpen;
      case 'music': return Music;
      case 'art': return Palette;
      case 'science': return FlaskConical;
      default: return Brain;
    }
  };

  const samplePrompts = {
    math: [
      { context: 'Fraction word problem', userInput: 'Sarah ate 1/4 of a pizza and her brother ate 2/4. How much pizza is left?', activityType: 'problem-solving' as const },
      { context: 'Geometry shapes', userInput: 'I need to find the area of a rectangle that is 6 units long and 4 units wide', activityType: 'problem-solving' as const },
      { context: 'Number patterns', userInput: 'What comes next in this pattern: 2, 4, 6, 8, ?', activityType: 'problem-solving' as const }
    ],
    english: [
      { context: 'Creative writing assignment', userInput: 'I want to write a story about a magical forest but I dont know how to start', activityType: 'creative-writing' as const },
      { context: 'Grammar practice', userInput: 'When do I use "was" vs "were" in sentences?', activityType: 'creative-writing' as const },
      { context: 'Reading comprehension', userInput: 'I read the story but I dont understand why the character made that choice', activityType: 'creative-writing' as const }
    ],
    music: [
      { context: 'Rhythm practice', userInput: 'I want to create a simple beat for my song but Im stuck', activityType: 'music-composition' as const },
      { context: 'Learning piano', userInput: 'My fingers keep getting tangled when I try to play scales', activityType: 'music-composition' as const },
      { context: 'Melody creation', userInput: 'How do I make my melody sound more interesting?', activityType: 'music-composition' as const }
    ],
    science: [
      { context: 'Weather experiment', userInput: 'Im studying how clouds form but my experiment isnt working', activityType: 'science-experiment' as const },
      { context: 'Plant growth observation', userInput: 'Why are some of my plants growing faster than others?', activityType: 'science-experiment' as const },
      { context: 'Simple machines', userInput: 'I need to explain how a lever makes work easier', activityType: 'science-experiment' as const }
    ],
    art: [
      { context: 'Portrait drawing', userInput: 'I want to draw a face but I cant get the proportions right', activityType: 'drawing' as const },
      { context: 'Color mixing', userInput: 'What colors should I mix to get a nice sunset orange?', activityType: 'drawing' as const },
      { context: 'Creative project', userInput: 'Im making art about my family but I want to make it more creative', activityType: 'drawing' as const }
    ]
  };

  const useSamplePrompt = (prompt: any) => {
    setContext(prompt.context);
    setUserInput(prompt.userInput);
    setActivityType(prompt.activityType);
  };

  const SubjectIcon = getSubjectIcon(selectedSubject);

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="h3 fw-bold d-flex align-items-center">
            <Brain className="me-3 text-primary" size={36} />
            On-Device LLM Hint System Demo
            <Badge bg="success" className="ms-3">Grades 3-6</Badge>
          </CardTitle>
          <p className="text-muted mb-0">
            Lightweight AI-powered personalized hints using TensorFlow.js with educational content filtering and parental logging
          </p>
        </CardHeader>
      </Card>

      {/* Model Status */}
      <Alert variant={modelStatus.isLoaded ? "success" : "info"} className="mb-4">
        <div className="d-flex align-items-center">
          <Activity className="me-2" size={16} />
          <div>
            <strong>AI System Status:</strong> {modelStatus.isLoaded ? 'Advanced AI Model Active' : 'Educational Template System Active'}
            {!modelStatus.isLoaded && modelStatus.error && (
              <div className="small text-muted mt-1">
                {modelStatus.error} - This ensures reliable, age-appropriate educational content.
              </div>
            )}
          </div>
        </div>
      </Alert>

      <Row className="g-4">
        {/* Controls */}
        <Col md={8}>
          <Card className="rounded-4 shadow-lg">
            <CardHeader>
              <CardTitle className="h5 d-flex align-items-center">
                <SubjectIcon className="me-2 text-primary" size={20} />
                Interactive Hint Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Subject and Grade Selection */}
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Label>Subject</Form.Label>
                  <Form.Select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as any)}
                  >
                    <option value="math">Math</option>
                    <option value="english">English/Language Arts</option>
                    <option value="science">Science</option>
                    <option value="music">Music</option>
                    <option value="art">Art</option>
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label>Grade Level</Form.Label>
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
              </Row>

              {/* Sample Prompts */}
              <div className="mb-4">
                <Form.Label>Try Sample Prompts:</Form.Label>
                <div className="row g-2">
                  {samplePrompts[selectedSubject]?.map((prompt, index) => (
                    <div key={index} className="col-12">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => useSamplePrompt(prompt)}
                        className="w-100 text-start"
                      >
                        <strong>{prompt.context}:</strong> {prompt.userInput.substring(0, 50)}...
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Label>Activity Context</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe what the student is working on..."
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Student Question/Input</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="What the student is asking or having trouble with..."
                  />
                </Col>
              </Row>

              <div className="mb-4">
                <Form.Label>Activity Type</Form.Label>
                <Form.Select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as any)}
                >
                  <option value="problem-solving">Problem Solving</option>
                  <option value="creative-writing">Creative Writing</option>
                  <option value="music-composition">Music Composition</option>
                  <option value="drawing">Drawing/Art</option>
                  <option value="science-experiment">Science Experiment</option>
                </Form.Select>
              </div>

              {/* Hint Assistant */}
              <HintAssistant
                userId="demo-student"
                subject={selectedSubject}
                grade={selectedGrade}
                context={context}
                userInput={userInput}
                activityType={activityType}
                onHintGenerated={handleHintGenerated}
              />
            </CardContent>
          </Card>
        </Col>

        {/* Interaction History */}
        <Col md={4}>
          <Card className="rounded-4 shadow-lg">
            <CardHeader>
              <CardTitle className="h6 fw-bold">
                <MessageCircle className="me-2" size={16} />
                Recent Interactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allInteractions.length === 0 ? (
                <div className="text-center py-3">
                  <Lightbulb className="text-muted mb-2" size={32} />
                  <p className="text-muted mb-0">Generate a hint to see interaction history!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {allInteractions.slice(-5).reverse().map((interaction, index) => (
                    <div key={interaction.id} className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="primary" className="small">
                          {interaction.request.subject}
                        </Badge>
                        <Badge bg="secondary" className="small">
                          Grade {interaction.request.grade}
                        </Badge>
                      </div>
                      
                      <div className="small mb-2">
                        <strong>Context:</strong> {interaction.request.context.substring(0, 40)}...
                      </div>
                      
                      <div className="small mb-2">
                        <strong>Question:</strong> {interaction.request.userInput.substring(0, 40)}...
                      </div>
                      
                      <div className="small mb-2">
                        <strong>Hint:</strong> {interaction.response.hint.substring(0, 60)}...
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <Badge bg={interaction.response.category === 'encourage' ? 'success' : 'info'}>
                          {interaction.response.category}
                        </Badge>
                        
                        {interaction.helpful !== undefined && (
                          <div className="d-flex align-items-center">
                            {interaction.helpful ? (
                              <CheckCircle className="text-success" size={14} />
                            ) : (
                              <AlertTriangle className="text-warning" size={14} />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-muted small mt-1">
                        {new Date(interaction.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Alert variant="success" className="mt-4">
            <Shield className="me-2" size={16} />
            <div>
              <strong>Safety Features Active:</strong>
              <ul className="mb-0 mt-2 small">
                <li>Educational topic whitelist filtering</li>
                <li>Age-appropriate content only</li>
                <li>All interactions logged for parental review</li>
                <li>On-device processing for privacy</li>
                <li>COPPA/GDPR-K compliant storage</li>
              </ul>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Features Overview */}
      <Card className="rounded-4 shadow-lg mt-4">
        <CardHeader>
          <CardTitle className="h5 fw-bold">
            <Brain className="me-2 text-success" />
            LLM Hint System Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row className="g-4">
            <Col md={3}>
              <div className="text-center">
                <Brain className="text-primary mb-2" size={32} />
                <h6 className="fw-bold">On-Device AI</h6>
                <small className="text-muted">
                  Lightweight TensorFlow.js models running entirely in the browser for privacy
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <Shield className="text-success mb-2" size={32} />
                <h6 className="fw-bold">Content Filtering</h6>
                <small className="text-muted">
                  Educational topic whitelist ensures only appropriate learning content
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <Lightbulb className="text-warning mb-2" size={32} />
                <h6 className="fw-bold">Personalized Hints</h6>
                <small className="text-muted">
                  Subject and grade-level appropriate suggestions tailored to student needs
                </small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <Activity className="text-info mb-2" size={32} />
                <h6 className="fw-bold">Low Latency</h6>
                <small className="text-muted">
                  Fast response times with template fallbacks for reliable performance
                </small>
              </div>
            </Col>
          </Row>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LLMDemo;