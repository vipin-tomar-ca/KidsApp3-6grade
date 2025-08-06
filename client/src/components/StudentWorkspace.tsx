import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import localforage from 'localforage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { 
  Save, 
  FileText, 
  Calculator, 
  Palette, 
  Trash2, 
  Download, 
  Upload,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Shield,
  Target,
  Brain
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, Modal, Form } from "react-bootstrap";
import { cn } from "@/lib/utils";
import IntegrityMonitor, { useIntegrityMonitoring } from './IntegrityMonitor';
import QuizIntegrityWrapper from './QuizIntegrityWrapper';
import HintAssistant from './HintAssistant';
import { useChildSafety } from '@/hooks/useChildSafety';

interface WorkspaceData {
  id: string;
  title: string;
  textContent: string;
  mathContent: string;
  drawingData: string;
  lastSaved: string;
  type: 'assignment' | 'olympiad' | 'practice';
  subject: string;
}

interface FeedbackMessage {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

const StudentWorkspace: React.FC = () => {
  // Child safety integration
  const { currentUser, isSubjectAllowed, checkTimeLimit } = useChildSafety(4); // Default grade 4

  // State management
  const [activeTab, setActiveTab] = useState<'text' | 'math' | 'drawing' | 'quiz'>('text');
  const [textContent, setTextContent] = useState('');
  const [mathInput, setMathInput] = useState('');
  const [mathPreview, setMathPreview] = useState('');
  const [workspaceId] = useState(() => `workspace_${Date.now()}`);
  const [isLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [savedWorkspaces, setSavedWorkspaces] = useState<WorkspaceData[]>([]);
  const [showWorkspaceList, setShowWorkspaceList] = useState(false);
  
  // Academic integrity state
  const [currentSubject, setCurrentSubject] = useState('math');
  const [currentGrade, setCurrentGrade] = useState(4);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [activityType, setActivityType] = useState<'quiz' | 'writing' | 'worksheet' | 'creative'>('writing');

  // Academic integrity monitoring
  const {
    feedback: integrityFeedback,
    suspiciousEvents,
    handleFeedback,
    handleSuspiciousActivity,
    createPasteHandler,
    IntegrityMonitor: IntegrityMonitorComponent
  } = useIntegrityMonitoring(
    currentUser?.id || 'demo-user',
    currentSubject,
    activityType,
    currentGrade
  );

  // Refs
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const quillRef = useRef<ReactQuill>(null);

  // Enhanced Quill modules for kids
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'] }],
      [{ 'background': ['#FFE4E6', '#E6FFFA', '#EBF8FF', '#F0FFF4', '#FFFBEB', '#F5F0FF'] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  // Math equation examples for kids
  const mathExamples = [
    { label: 'Simple Addition', latex: '2 + 3 = 5' },
    { label: 'Fraction', latex: '\\frac{1}{2}' },
    { label: 'Square Root', latex: '\\sqrt{9} = 3' },
    { label: 'Exponent', latex: '2^3 = 8' },
    { label: 'Formula', latex: 'A = \\pi r^2' }
  ];

  // Initialize localforage
  useEffect(() => {
    localforage.config({
      name: 'StudentWorkspace',
      version: 1.0,
      size: 4980736, // 5MB
      storeName: 'workspaces',
      description: 'Student workspace data storage'
    });

    loadSavedWorkspaces();
  }, []);

  // Update word count when text changes
  useEffect(() => {
    const plainText = textContent.replace(/<[^>]*>/g, '').trim();
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    // Provide encouraging feedback based on word count
    if (words.length > 0 && words.length % 25 === 0) {
      showFeedback('success', `Great job! You've written ${words.length} words. Keep it up!`);
    }
  }, [textContent]);

  // Update math preview
  useEffect(() => {
    if (mathInput.trim()) {
      try {
        setMathPreview(mathInput);
      } catch (error) {
        console.log('Math preview error:', error);
      }
    }
  }, [mathInput]);

  const showFeedback = (type: FeedbackMessage['type'], message: string) => {
    setFeedback({ type, message, timestamp: Date.now() });
    setTimeout(() => setFeedback(null), 5000);
  };

  const saveWorkspace = async () => {
    setSaveLoading(true);
    try {
      const canvasData = await canvasRef.current?.exportPaths();
      const drawingDataURL = await canvasRef.current?.exportImage('png');
      
      const workspaceData: WorkspaceData = {
        id: workspaceId,
        title: `Workspace ${new Date().toLocaleDateString()}`,
        textContent,
        mathContent: mathInput,
        drawingData: drawingDataURL || '',
        lastSaved: new Date().toISOString(),
        type: 'practice',
        subject: 'General'
      };

      await localforage.setItem(`workspace_${workspaceId}`, workspaceData);
      
      showFeedback('success', 'Your work has been saved! Great job staying organized!');
      loadSavedWorkspaces();
    } catch (error) {
      showFeedback('error', 'Oops! There was a problem saving your work. Try again!');
      console.error('Save error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const loadSavedWorkspaces = async () => {
    try {
      const keys = await localforage.keys();
      const workspaceKeys = keys.filter(key => key.startsWith('workspace_'));
      const workspaces: WorkspaceData[] = [];
      
      for (const key of workspaceKeys) {
        const data = await localforage.getItem<WorkspaceData>(key);
        if (data) workspaces.push(data);
      }
      
      setSavedWorkspaces(workspaces.sort((a, b) => 
        new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
      ));
    } catch (error) {
      console.error('Load workspaces error:', error);
    }
  };

  const loadWorkspace = async (workspace: WorkspaceData) => {
    setTextContent(workspace.textContent);
    setMathInput(workspace.mathContent);
    setShowWorkspaceList(false);
    showFeedback('info', `Loaded your work from ${new Date(workspace.lastSaved).toLocaleDateString()}!`);
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
    showFeedback('info', 'Canvas cleared! Ready for your next masterpiece!');
  };

  const exportWork = async () => {
    try {
      const drawingDataURL = await canvasRef.current?.exportImage('png');
      const workData = {
        text: textContent,
        math: mathInput,
        drawing: drawingDataURL,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(workData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_work_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showFeedback('success', 'Your work has been downloaded! Share it with your teacher!');
    } catch (error) {
      showFeedback('error', 'Could not export your work. Try again!');
    }
  };

  const getEncouragingMessage = () => {
    const messages = [
      "You're doing amazing work! Keep exploring!",
      "Great job using different tools! You're becoming a super learner!",
      "Your creativity is shining through! Keep it up!",
      "Fantastic problem-solving skills! You're getting stronger!",
      "Love seeing your ideas come to life! Keep creating!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="bg-kid-gradient min-h-screen pb-6">
      <AccessibilityToolbar />
      
      <Container fluid className="py-4">
        {/* Header */}
        <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="pb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3 p-3 me-3 animate-pulse-slow">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <SpeakableText text="Student Workspace - Your place to learn, create, and explore">
                    <CardTitle className="h3 fw-bold text-dark mb-1">Student Workspace</CardTitle>
                    <p className="text-muted mb-0">Your place to learn, create, and explore! 🌟</p>
                  </SpeakableText>
                </div>
              </div>
              <div className="d-flex gap-2">
                <BootstrapButton
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowWorkspaceList(!showWorkspaceList)}
                  className="rounded-3"
                >
                  <Upload size={16} className="me-1" />
                  My Work
                </BootstrapButton>
                <BootstrapButton
                  variant="success"
                  size="sm"
                  disabled={isLoading}
                  onClick={saveWorkspace}
                  className="rounded-3"
                >
                  <Save size={16} className="me-1" />
                  {isLoading ? 'Saving...' : 'Save'}
                </BootstrapButton>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Feedback Alert */}
        {feedback && (
          <Alert 
            variant={feedback.type === 'success' ? 'success' : 
                   feedback.type === 'error' ? 'danger' : 
                   feedback.type === 'warning' ? 'warning' : 'info'}
            className="rounded-4 shadow-sm mb-4 animate-bounce-gentle"
            dismissible
            onClose={() => setFeedback(null)}
          >
            <div className="d-flex align-items-center">
              {feedback.type === 'success' && <CheckCircle size={20} className="me-2" />}
              {feedback.type === 'error' && <AlertCircle size={20} className="me-2" />}
              {feedback.type === 'info' && <Lightbulb size={20} className="me-2" />}
              <SpeakableText text={feedback.message}>
                <strong>{feedback.message}</strong>
              </SpeakableText>
            </div>
          </Alert>
        )}

        {/* Saved Workspaces List */}
        {showWorkspaceList && (
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="h5">📁 Your Saved Work</CardTitle>
            </CardHeader>
            <CardContent>
              {savedWorkspaces.length === 0 ? (
                <p className="text-muted text-center py-4">No saved work yet. Start creating something amazing!</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {savedWorkspaces.slice(0, 5).map((workspace) => (
                    <div key={workspace.id} className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                      <div>
                        <h6 className="fw-bold mb-1">{workspace.title}</h6>
                        <small className="text-muted">
                          Saved: {new Date(workspace.lastSaved).toLocaleString()}
                        </small>
                      </div>
                      <BootstrapButton
                        size="sm"
                        variant="outline-primary"
                        onClick={() => loadWorkspace(workspace)}
                        className="rounded-3"
                      >
                        Load
                      </BootstrapButton>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Row className="g-4">
          {/* Main Workspace */}
          <Col lg={8}>
            {/* Tab Navigation */}
            <Card className="rounded-4 shadow-lg mb-4">
              <CardHeader className="pb-2">
                <div className="d-flex gap-2">
                  <BootstrapButton
                    variant={activeTab === 'text' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('text')}
                    className="rounded-3 d-flex align-items-center"
                  >
                    <FileText size={16} className="me-2" />
                    Writing ✏️
                  </BootstrapButton>
                  <BootstrapButton
                    variant={activeTab === 'math' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('math')}
                    className="rounded-3 d-flex align-items-center"
                  >
                    <Calculator size={16} className="me-2" />
                    Math 🔢
                  </BootstrapButton>
                  <BootstrapButton
                    variant={activeTab === 'drawing' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('drawing')}
                    className="rounded-3 d-flex align-items-center"
                  >
                    <Palette size={16} className="me-2" />
                    Drawing 🎨
                  </BootstrapButton>
                </div>
              </CardHeader>
              
              <CardContent style={{ minHeight: '400px' }}>
                {/* Text Editor Tab */}
                {activeTab === 'text' && (
                  <div className="h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <SpeakableText text="Write your thoughts, stories, and answers here">
                        <h5 className="fw-bold mb-0">📝 Write Your Ideas</h5>
                      </SpeakableText>
                      <div className="text-muted small">
                        Words: {wordCount}
                      </div>
                    </div>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={textContent}
                      onChange={setTextContent}
                      modules={quillModules}
                      placeholder="Start writing your amazing ideas here! Tell a story, answer questions, or share your thoughts... 🌟"
                      style={{ height: '300px' }}
                    />
                  </div>
                )}

                {/* Math Editor Tab */}
                {activeTab === 'math' && (
                  <div className="h-100">
                    <SpeakableText text="Create math equations and solve problems">
                      <h5 className="fw-bold mb-3">🔢 Math Equations</h5>
                    </SpeakableText>
                    
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Type your equation:</label>
                          <textarea
                            className="form-control rounded-3"
                            rows={4}
                            value={mathInput}
                            onChange={(e) => setMathInput(e.target.value)}
                            placeholder="Type math like: 2 + 2 = 4 or x^2 + y^2 = z^2"
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Examples to try:</label>
                          <div className="d-flex flex-wrap gap-2">
                            {mathExamples.map((example, index) => (
                              <BootstrapButton
                                key={index}
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setMathInput(example.latex)}
                                className="rounded-pill"
                              >
                                {example.label}
                              </BootstrapButton>
                            ))}
                          </div>
                        </div>
                      </Col>
                      
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Preview:</label>
                          <div className="border rounded-3 p-4 bg-light" style={{ minHeight: '150px' }}>
                            {mathPreview ? (
                              <div className="text-center">
                                <BlockMath math={mathPreview} />
                              </div>
                            ) : (
                              <p className="text-muted text-center">Your math will appear here! ✨</p>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Drawing Canvas Tab */}
                {activeTab === 'drawing' && (
                  <div className="h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <SpeakableText text="Draw, sketch, and create artwork">
                        <h5 className="fw-bold mb-0">🎨 Draw & Create</h5>
                      </SpeakableText>
                      <div className="d-flex gap-2">
                        <BootstrapButton
                          variant="outline-danger"
                          size="sm"
                          onClick={clearCanvas}
                          className="rounded-3"
                        >
                          <Trash2 size={16} className="me-1" />
                          Clear
                        </BootstrapButton>
                        <BootstrapButton
                          variant="outline-success"
                          size="sm"
                          onClick={exportWork}
                          className="rounded-3"
                        >
                          <Download size={16} className="me-1" />
                          Export
                        </BootstrapButton>
                      </div>
                    </div>
                    
                    <div className="border rounded-3 overflow-hidden shadow-sm">
                      <ReactSketchCanvas
                        ref={canvasRef}
                        style={{ 
                          border: 'none',
                          borderRadius: '12px'
                        }}
                        width="100%"
                        height="350px"
                        strokeWidth={4}
                        strokeColor="#2563EB"
                        canvasColor="#FFFFFF"
                        backgroundImage=""
                        exportWithBackgroundImage={true}
                        preserveBackgroundImageAspectRatio="xMidYMid meet"
                        allowOnlyPointerType="all"
                      />
                    </div>
                    
                    <div className="mt-3">
                      <small className="text-muted">
                        💡 Tip: Use your mouse or finger to draw! You can sketch diagrams, solve problems visually, or create artwork!
                      </small>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Encouragement Card */}
            <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-green-400 to-blue-500">
              <CardContent className="pt-4 text-white text-center">
                <div className="display-4 mb-3">🌟</div>
                <SpeakableText text={getEncouragingMessage()}>
                  <h5 className="fw-bold mb-3">Keep Going!</h5>
                  <p className="text-light">{getEncouragingMessage()}</p>
                </SpeakableText>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="rounded-4 shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="h6">📊 Your Progress Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="bg-blue-50 rounded-3 p-3">
                      <div className="h4 fw-bold text-primary">{wordCount}</div>
                      <div className="small text-muted">Words Written</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-green-50 rounded-3 p-3">
                      <div className="h4 fw-bold text-success">{savedWorkspaces.length}</div>
                      <div className="small text-muted">Works Saved</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="rounded-4 shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="h6">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex">
                    <span className="me-2">✏️</span>
                    <small>Use colors to make your writing more fun!</small>
                  </div>
                  <div className="d-flex">
                    <span className="me-2">🔢</span>
                    <small>Try the math examples to learn new equations!</small>
                  </div>
                  <div className="d-flex">
                    <span className="me-2">🎨</span>
                    <small>Draw diagrams to help explain your ideas!</small>
                  </div>
                  <div className="d-flex">
                    <span className="me-2">💾</span>
                    <small>Save your work regularly so you don't lose it!</small>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Hint Assistant */}
            <HintAssistant
              userId={currentUser?.id || 'demo-student'}
              subject={currentSubject as 'math' | 'english' | 'music' | 'art' | 'science'}
              grade={currentGrade}
              context={`Student is working on ${activeTab} activity in the workspace`}
              userInput={textContent || mathInput || 'drawing activity'}
              activityType={activityType}
              onHintGenerated={(hint) => {
                // Show hint in feedback system
                showFeedback('info', `AI Hint: ${hint.hint}`);
              }}
              className="mb-4"
            />

            {/* Achievement Badge */}
            <Card className="rounded-4 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500">
              <CardContent className="pt-4 text-white text-center">
                <div className="display-4 mb-2">🏆</div>
                <SpeakableText text="Great job exploring the workspace! You're becoming a fantastic learner!">
                  <h6 className="fw-bold mb-2">Explorer Badge</h6>
                  <small className="text-light">You're using all the tools like a pro!</small>
                </SpeakableText>
              </CardContent>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentWorkspace;