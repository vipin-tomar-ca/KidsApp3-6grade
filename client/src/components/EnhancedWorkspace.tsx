import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { useForm } from 'react-hook-form';
import localforage from 'localforage';
import { useTimer } from 'react-timer-hook';
import { 
  Save, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calculator, 
  Palette,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface WorkspaceContent {
  text: string;
  math: string;
  drawing: string;
  timestamp: number;
  timeSpent: number;
  keystrokes: number[];
}

interface OlympiadProblem {
  id: string;
  subject: 'math' | 'science';
  problem: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface EnhancedWorkspaceProps {
  selectedContent?: any;
  mode?: 'assignment' | 'olympiad' | 'creative';
}

export const EnhancedWorkspace: React.FC<EnhancedWorkspaceProps> = ({ 
  selectedContent, 
  mode = 'assignment' 
}) => {
  const [content, setContent] = useState<WorkspaceContent>({
    text: '',
    math: '',
    drawing: '',
    timestamp: Date.now(),
    timeSpent: 0,
    keystrokes: []
  });
  
  const [activeTab, setActiveTab] = useState('text');
  const [saved, setSaved] = useState(false);
  const [integrityFlags, setIntegrityFlags] = useState<string[]>([]);
  const [currentProblem, setCurrentProblem] = useState<OlympiadProblem | null>(null);
  const [startTime] = useState(Date.now());

  // Timer for session tracking
  const expiryTimestamp = new Date();
  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + 60); // 1 hour session
  
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    pause,
    resume,
  } = useTimer({ 
    expiryTimestamp, 
    onExpire: () => saveWorkspace()
  });

  // Form handling for olympiad problems
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  // Sample Olympiad Problems
  const olympiadProblems: OlympiadProblem[] = [
    {
      id: 'amc8-1',
      subject: 'math',
      problem: 'If 3x + 5 = 14, what is the value of x?',
      options: ['A) 2', 'B) 3', 'C) 4', 'D) 5'],
      answer: 'B) 3',
      explanation: 'Subtract 5 from both sides: 3x = 9, then divide by 3: x = 3'
    },
    {
      id: 'nso-1',
      subject: 'science',
      problem: 'Which of the following is NOT a renewable energy source?',
      options: ['A) Solar', 'B) Wind', 'C) Coal', 'D) Hydroelectric'],
      answer: 'C) Coal',
      explanation: 'Coal is a fossil fuel and is not renewable, unlike solar, wind, and hydroelectric power.'
    }
  ];

  useEffect(() => {
    loadWorkspace();
    if (mode === 'olympiad') {
      loadRandomProblem();
    }
  }, [mode]);

  useEffect(() => {
    // Auto-save every 30 seconds
    const interval = setInterval(saveWorkspace, 30000);
    return () => clearInterval(interval);
  }, [content]);

  const loadWorkspace = async () => {
    try {
      const saved = await localforage.getItem<WorkspaceContent>('workspace-content');
      if (saved) {
        setContent(saved);
      }
    } catch (error) {
      console.error('Failed to load workspace:', error);
    }
  };

  const saveWorkspace = async () => {
    try {
      const timeSpent = Date.now() - startTime;
      const updatedContent = { ...content, timeSpent, timestamp: Date.now() };
      
      await localforage.setItem('workspace-content', updatedContent);
      
      // Log interaction for parental review
      const interactions = await localforage.getItem<any[]>('interaction-log') || [];
      interactions.push({
        timestamp: Date.now(),
        mode,
        timeSpent,
        flags: integrityFlags,
        contentLength: content.text.length
      });
      
      await localforage.setItem('interaction-log', interactions);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save workspace:', error);
    }
  };

  const loadRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * olympiadProblems.length);
    setCurrentProblem(olympiadProblems[randomIndex]);
  };

  // Academic integrity monitoring
  const handleTextChange = useCallback((value: string) => {
    const previousLength = content.text.length;
    const currentLength = value.length;
    const changeSize = Math.abs(currentLength - previousLength);
    
    // Flag potential copy-paste (large text addition)
    if (changeSize > 50) {
      setIntegrityFlags(prev => [...prev, `Large text addition: ${changeSize} characters at ${new Date().toLocaleTimeString()}`]);
    }
    
    // Track keystroke patterns
    const keystrokeTime = Date.now();
    setContent(prev => ({
      ...prev,
      text: value,
      keystrokes: [...prev.keystrokes, keystrokeTime].slice(-10) // Keep last 10 keystrokes
    }));
  }, [content.text.length]);

  const handleMathChange = (value: string) => {
    setContent(prev => ({ ...prev, math: value }));
  };

  const onOlympiadSubmit = (data: any) => {
    if (!currentProblem) return;
    
    const isCorrect = data.answer === currentProblem.answer;
    
    // Provide immediate feedback
    alert(isCorrect ? 
      `Correct! ${currentProblem.explanation}` : 
      `Incorrect. The correct answer is ${currentProblem.answer}. ${currentProblem.explanation}`
    );
    
    // Load next problem
    loadRandomProblem();
    reset();
  };

  const renderQuillToolbar = () => (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-font"></select>
        <select className="ql-size"></select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-link"></button>
        <button className="ql-image"></button>
      </span>
      <span className="ql-formats">
        <button className="ql-clean"></button>
      </span>
    </div>
  );

  const modules = {
    toolbar: {
      container: "#toolbar"
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Session Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Session Time: {hours.toString().padStart(2, '0')}:
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <Badge variant={mode === 'olympiad' ? 'destructive' : 'secondary'}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {integrityFlags.length > 0 && (
                <Badge variant="destructive" className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {integrityFlags.length} flags
                </Badge>
              )}
              
              <Button 
                onClick={saveWorkspace} 
                variant="outline" 
                size="sm"
                className={saved ? "bg-green-100" : ""}
              >
                <Save className="h-4 w-4 mr-2" />
                {saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Olympiad Problem Display */}
      {mode === 'olympiad' && currentProblem && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="mr-2">{currentProblem.subject.toUpperCase()}</Badge>
              Olympiad Problem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onOlympiadSubmit)}>
              <div className="mb-4">
                <p className="text-lg mb-4">{currentProblem.problem}</p>
                
                {currentProblem.options && (
                  <div className="space-y-2">
                    {currentProblem.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={option}
                          {...register('answer', { required: 'Please select an answer' })}
                          className="form-radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {errors.answer && (
                <p className="text-red-600 text-sm mb-2">{errors.answer.message as string}</p>
              )}
              
              <div className="flex space-x-2">
                <Button type="submit">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Answer
                </Button>
                <Button type="button" variant="outline" onClick={loadRandomProblem}>
                  Skip Problem
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Workspace Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Student Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Text & Notes
              </TabsTrigger>
              <TabsTrigger value="math" className="flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Math & Equations
              </TabsTrigger>
              <TabsTrigger value="drawing" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Drawing & Sketching
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                {renderQuillToolbar()}
                <ReactQuill
                  value={content.text}
                  onChange={handleTextChange}
                  modules={modules}
                  placeholder="Start typing your notes, essays, or responses here..."
                  style={{ height: '400px' }}
                />
              </div>
            </TabsContent>

            <TabsContent value="math" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Math Expression (LaTeX format):
                  </label>
                  <textarea
                    value={content.math}
                    onChange={(e) => handleMathChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Enter LaTeX math expressions (e.g., x = \frac{-b \pm \sqrt{b^2-4ac}}{2a})"
                  />
                </div>
                
                {content.math && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Preview:</h4>
                    <BlockMath math={content.math} />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium">Common LaTeX Examples:</h5>
                    <ul className="space-y-1 mt-2">
                      <li><code>\frac{1}{2}</code> → <InlineMath math="\frac{1}{2}" /></li>
                      <li><code>x^2 + y^2 = r^2</code> → <InlineMath math="x^2 + y^2 = r^2" /></li>
                      <li><code>\sqrt{25} = 5</code> → <InlineMath math="\sqrt{25} = 5" /></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium">More Examples:</h5>
                    <ul className="space-y-1 mt-2">
                      <li><code>\sum_&#123;i=1&#125;^n i</code> → <InlineMath math="\sum_{i=1}^n i" /></li>
                      <li><code>\int_0^1 x dx</code> → <InlineMath math="\int_0^1 x dx" /></li>
                      <li><code>\alpha + \beta = \gamma</code> → <InlineMath math="\alpha + \beta = \gamma" /></li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drawing" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Digital Drawing Canvas</h4>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      // Canvas clear functionality would go here
                    }}>
                      Clear Canvas
                    </Button>
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactSketchCanvas
                    style={{
                      border: "none",
                      width: "100%",
                      height: "400px"
                    }}
                    strokeWidth={2}
                    strokeColor="black"
                    canvasColor="white"
                    allowOnlyPointerType="all"
                  />
                </div>
                
                <p className="text-sm text-gray-600">
                  Use your mouse, trackpad, or touch screen to draw. Perfect for math diagrams, 
                  science illustrations, or creative art projects!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Academic Integrity Alerts */}
      {integrityFlags.length > 0 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Activity Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-2">
              The following activities have been logged for review:
            </p>
            <ul className="space-y-1 text-sm">
              {integrityFlags.slice(-3).map((flag, index) => (
                <li key={index} className="text-orange-600">• {flag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedWorkspace;