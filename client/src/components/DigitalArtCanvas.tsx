import React, { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { 
  Palette, 
  Eraser, 
  RotateCcw, 
  Download, 
  Save, 
  Eye,
  EyeOff,
  Brush,
  Circle,
  Square,
  Triangle,
  Minus,
  Plus,
  Play,
  Pause,
  BookOpen,
  Award
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, Modal, Badge, Form } from "react-bootstrap";
import { ArtLesson, ArtStep, DrawingProject, artEducationService } from '@/services/artEducationApi';
import { cn } from "@/lib/utils";

interface DigitalArtCanvasProps {
  grade: number;
  lessonId?: string;
  onProjectSave?: (project: DrawingProject) => void;
}

interface CanvasSettings {
  strokeWidth: number;
  strokeColor: string;
  backgroundColor: string;
  canvasSize: { width: number; height: number };
}

const DigitalArtCanvas: React.FC<DigitalArtCanvasProps> = ({ 
  grade, 
  lessonId,
  onProjectSave 
}) => {
  // Canvas and lesson state
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [currentLesson, setCurrentLesson] = useState<ArtLesson | null>(null);
  const [currentStep, setCurrentStep] = useState<ArtStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lessons, setLessons] = useState<ArtLesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Canvas settings state
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    strokeWidth: 5,
    strokeColor: '#000000',
    backgroundColor: '#ffffff',
    canvasSize: { width: 800, height: 600 }
  });

  // UI state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showStepsPanel, setShowStepsPanel] = useState(true);
  const [projectTitle, setProjectTitle] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<Set<number>>(new Set());

  // Tool state
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);

  // Color palette
  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#90EE90', '#87CEEB'
  ];

  // Timer for tracking time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadArtLessons();
  }, [grade]);

  useEffect(() => {
    if (lessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentStep(lesson.steps[0]);
        setProjectTitle(`${lesson.title} - Grade ${grade}`);
      }
    }
  }, [lessonId, lessons, grade]);

  const loadArtLessons = async () => {
    setLoading(true);
    try {
      const artLessons = await artEducationService.getDrawingLessons(grade);
      setLessons(artLessons);
    } catch (error) {
      console.error('Failed to load art lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (color: string) => {
    setCanvasSettings(prev => ({ ...prev, strokeColor: color }));
    setCurrentTool('pen');
  };

  const handleStrokeWidthChange = (width: number) => {
    setCanvasSettings(prev => ({ ...prev, strokeWidth: width }));
  };

  const clearCanvas = async () => {
    if (canvasRef.current) {
      await canvasRef.current.clearCanvas();
    }
  };

  const undoLastStroke = async () => {
    if (canvasRef.current) {
      await canvasRef.current.undo();
    }
  };

  const redoLastStroke = async () => {
    if (canvasRef.current) {
      await canvasRef.current.redo();
    }
  };

  const downloadDrawing = async () => {
    if (canvasRef.current) {
      const dataURL = await canvasRef.current.exportImage('png');
      const link = document.createElement('a');
      link.download = `${projectTitle || 'my-artwork'}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const saveProject = async () => {
    if (!canvasRef.current) return;

    try {
      const canvasData = await canvasRef.current.exportPaths();
      const imageData = await canvasRef.current.exportImage('png');
      
      const project: DrawingProject = {
        id: `project_${Date.now()}`,
        title: projectTitle || 'Untitled Artwork',
        lessonId: currentLesson?.id || '',
        canvasData: JSON.stringify(canvasData),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        grade,
        isCompleted: stepsCompleted.size === (currentLesson?.steps.length || 0),
        timeSpent,
        tags: currentLesson ? [currentLesson.category, currentLesson.difficulty] : []
      };

      await artEducationService.saveDrawingProject(project);
      onProjectSave?.(project);
      setShowSaveModal(false);
      
      // Show success message
      alert('Your artwork has been saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Sorry, there was an error saving your artwork. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentLesson && currentStepIndex < currentLesson.steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      setCurrentStep(currentLesson.steps[newIndex]);
      setStepsCompleted(prev => new Set([...prev, currentStepIndex]));
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      setCurrentStep(currentLesson.steps[newIndex]);
    }
  };

  const completeStep = () => {
    setStepsCompleted(prev => new Set([...prev, currentStepIndex]));
    
    // Auto-advance to next step after a brief delay
    setTimeout(() => {
      if (currentLesson && currentStepIndex < currentLesson.steps.length - 1) {
        nextStep();
      }
    }, 1000);
  };

  const selectLesson = (lesson: ArtLesson) => {
    setCurrentLesson(lesson);
    setCurrentStep(lesson.steps[0]);
    setCurrentStepIndex(0);
    setStepsCompleted(new Set());
    setProjectTitle(`${lesson.title} - Grade ${grade}`);
    setShowLessonModal(false);
    clearCanvas();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderToolbar = () => (
    <Card className="rounded-4 shadow-lg mb-4">
      <CardContent className="p-3">
        <Row className="g-3">
          {/* Drawing Tools */}
          <Col md={3}>
            <div className="tool-section">
              <h6 className="fw-bold mb-2">Tools</h6>
              <div className="btn-group w-100">
                <BootstrapButton
                  variant={currentTool === 'pen' ? "primary" : "outline-primary"}
                  onClick={() => setCurrentTool('pen')}
                  className="rounded-start-3"
                >
                  <Brush size={16} />
                </BootstrapButton>
                <BootstrapButton
                  variant={currentTool === 'eraser' ? "danger" : "outline-danger"}
                  onClick={() => setCurrentTool('eraser')}
                  className="rounded-end-3"
                >
                  <Eraser size={16} />
                </BootstrapButton>
              </div>
            </div>
          </Col>

          {/* Brush Size */}
          <Col md={3}>
            <div className="brush-size-section">
              <h6 className="fw-bold mb-2">Brush Size: {canvasSettings.strokeWidth}px</h6>
              <div className="d-flex align-items-center gap-2">
                <BootstrapButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleStrokeWidthChange(Math.max(1, canvasSettings.strokeWidth - 1))}
                  disabled={canvasSettings.strokeWidth <= 1}
                >
                  <Minus size={14} />
                </BootstrapButton>
                <Form.Range
                  min="1"
                  max="20"
                  value={canvasSettings.strokeWidth}
                  onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
                  className="flex-grow-1"
                />
                <BootstrapButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleStrokeWidthChange(Math.min(20, canvasSettings.strokeWidth + 1))}
                  disabled={canvasSettings.strokeWidth >= 20}
                >
                  <Plus size={14} />
                </BootstrapButton>
              </div>
            </div>
          </Col>

          {/* Colors */}
          <Col md={4}>
            <div className="color-section">
              <h6 className="fw-bold mb-2">Colors</h6>
              <div className="color-palette d-flex flex-wrap gap-1">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "color-swatch border-0 rounded-circle",
                      canvasSettings.strokeColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ 
                      backgroundColor: color, 
                      width: '30px', 
                      height: '30px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </Col>

          {/* Actions */}
          <Col md={2}>
            <div className="action-section">
              <h6 className="fw-bold mb-2">Actions</h6>
              <div className="d-flex gap-1">
                <BootstrapButton
                  variant="outline-warning"
                  size="sm"
                  onClick={undoLastStroke}
                  title="Undo"
                >
                  <RotateCcw size={14} />
                </BootstrapButton>
                <BootstrapButton
                  variant="outline-danger"
                  size="sm"
                  onClick={clearCanvas}
                  title="Clear Canvas"
                >
                  <Eraser size={14} />
                </BootstrapButton>
              </div>
            </div>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );

  const renderStepsPanel = () => {
    if (!currentLesson || !currentStep) return null;

    return (
      <Card className={cn(
        "rounded-4 shadow-lg transition-all duration-300",
        showStepsPanel ? "mb-4" : "position-fixed bottom-4 right-4 z-50"
      )}>
        <CardHeader className="pb-3">
          <div className="d-flex justify-content-between align-items-center">
            <CardTitle className="h6 fw-bold mb-0">
              Step {currentStep.stepNumber}: {currentStep.title}
            </CardTitle>
            <BootstrapButton
              variant="ghost"
              size="sm"
              onClick={() => setShowStepsPanel(!showStepsPanel)}
            >
              {showStepsPanel ? <EyeOff size={16} /> : <Eye size={16} />}
            </BootstrapButton>
          </div>
          <div className="progress mt-2" style={{ height: '6px' }}>
            <div 
              className="progress-bar bg-success"
              style={{ width: `${((currentStepIndex + 1) / currentLesson.steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        {showStepsPanel && (
          <CardContent className="pt-0">
            <SpeakableText text={currentStep.instruction}>
              <p className="mb-3">{currentStep.instruction}</p>
            </SpeakableText>
            
            {currentStep.tip && (
              <Alert variant="info" className="rounded-3 mb-3">
                <strong>💡 Tip:</strong> {currentStep.tip}
              </Alert>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <div className="step-navigation">
                <BootstrapButton
                  variant="outline-secondary"
                  size="sm"
                  onClick={previousStep}
                  disabled={currentStepIndex === 0}
                  className="me-2"
                >
                  Previous
                </BootstrapButton>
                <BootstrapButton
                  variant="outline-primary"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStepIndex === currentLesson.steps.length - 1}
                >
                  Next Step
                </BootstrapButton>
              </div>
              
              <BootstrapButton
                variant="success"
                size="sm"
                onClick={completeStep}
                disabled={stepsCompleted.has(currentStepIndex)}
              >
                {stepsCompleted.has(currentStepIndex) ? (
                  <>
                    <Award size={14} className="me-1" />
                    Completed
                  </>
                ) : (
                  'Mark Complete'
                )}
              </BootstrapButton>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <h5 className="fw-bold">Loading Art Studio...</h5>
            <p className="text-muted">Preparing your digital canvas!</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen">
      <AccessibilityToolbar />
      
      <Container fluid className="py-4">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="display-4 fw-bold text-white mb-2">
            🎨 Digital Art Studio - Grade {grade}
          </h1>
          <div className="d-flex justify-content-center align-items-center gap-4 text-white">
            <div>
              <Badge bg="info" className="rounded-pill">
                Time: {formatTime(timeSpent)}
              </Badge>
            </div>
            {currentLesson && (
              <div>
                <Badge bg="success" className="rounded-pill">
                  {stepsCompleted.size}/{currentLesson.steps.length} Steps
                </Badge>
              </div>
            )}
            <div className="d-flex gap-2">
              <BootstrapButton
                variant="light"
                size="sm"
                onClick={() => setShowLessonModal(true)}
              >
                <BookOpen size={16} className="me-1" />
                Choose Lesson
              </BootstrapButton>
              <BootstrapButton
                variant="success"
                size="sm"
                onClick={() => setShowSaveModal(true)}
              >
                <Save size={16} className="me-1" />
                Save Art
              </BootstrapButton>
              <BootstrapButton
                variant="warning"
                size="sm"
                onClick={downloadDrawing}
              >
                <Download size={16} className="me-1" />
                Download
              </BootstrapButton>
            </div>
          </div>
        </header>

        {/* Lesson Info */}
        {currentLesson && (
          <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <Row>
                <Col md={8}>
                  <h4 className="fw-bold text-primary mb-2">{currentLesson.title}</h4>
                  <p className="text-muted mb-2">{currentLesson.description}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="primary">{currentLesson.difficulty}</Badge>
                    <Badge bg="info">{currentLesson.duration} min</Badge>
                    <Badge bg="warning">{currentLesson.category}</Badge>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="materials-list">
                    <h6 className="fw-bold">Materials (if drawing on paper):</h6>
                    <ul className="small mb-0">
                      {currentLesson.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            </CardContent>
          </Card>
        )}

        <Row className="g-4">
          {/* Steps Panel */}
          <Col lg={3}>
            {renderStepsPanel()}
          </Col>

          {/* Main Canvas Area */}
          <Col lg={9}>
            {renderToolbar()}
            
            {/* Canvas */}
            <Card className="rounded-4 shadow-lg">
              <CardContent className="p-4">
                <div className="canvas-container bg-white rounded-3 p-3" style={{ overflow: 'auto' }}>
                  <ReactSketchCanvas
                    ref={canvasRef}
                    width={canvasSettings.canvasSize.width}
                    height={canvasSettings.canvasSize.height}
                    strokeWidth={canvasSettings.strokeWidth}
                    strokeColor={currentTool === 'pen' ? canvasSettings.strokeColor : canvasSettings.backgroundColor}
                    canvasColor={canvasSettings.backgroundColor}
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    onStroke={() => setIsDrawing(true)}
                    allowOnlyPointerType="all"
                  />
                </div>
              </CardContent>
            </Card>
          </Col>
        </Row>

        {/* Lesson Selection Modal */}
        <Modal 
          show={showLessonModal} 
          onHide={() => setShowLessonModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Choose an Art Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              {lessons.map((lesson) => (
                <Col key={lesson.id} md={6}>
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => selectLesson(lesson)}
                  >
                    <CardContent className="p-3">
                      <h6 className="fw-bold">{lesson.title}</h6>
                      <p className="text-muted small">{lesson.description}</p>
                      <div className="d-flex gap-2">
                        <Badge bg="info">{lesson.difficulty}</Badge>
                        <Badge bg="secondary">{lesson.duration} min</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
        </Modal>

        {/* Save Project Modal */}
        <Modal 
          show={showSaveModal} 
          onHide={() => setShowSaveModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Save Your Artwork</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Artwork Title</Form.Label>
                <Form.Control
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Give your artwork a name..."
                />
              </Form.Group>
              <Alert variant="info">
                Your artwork will be saved locally and can be accessed from your profile page.
              </Alert>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="secondary" onClick={() => setShowSaveModal(false)}>
              Cancel
            </BootstrapButton>
            <BootstrapButton 
              variant="primary" 
              onClick={saveProject}
              disabled={!projectTitle.trim()}
            >
              Save Artwork
            </BootstrapButton>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default DigitalArtCanvas;