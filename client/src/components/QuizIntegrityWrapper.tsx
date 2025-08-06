import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { useTimer } from 'react-timer-hook';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Clock,
  Lightbulb,
  Target,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { Alert, Badge, Form, ProgressBar } from "react-bootstrap";
import { 
  academicIntegrityService, 
  QuizSession, 
  AutomatedFeedback,
  QuizResponse 
} from '@/services/academicIntegrityApi';
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  points: number;
  rubric: {
    excellent: string;
    good: string;
    needsWork: string;
  };
}

interface QuizIntegrityWrapperProps {
  userId: string;
  subject: string;
  grade: number;
  questions: QuizQuestion[];
  timeLimit?: number; // minutes
  onComplete: (session: QuizSession) => void;
}

const QuizIntegrityWrapper: React.FC<QuizIntegrityWrapperProps> = ({
  userId,
  subject,
  grade,
  questions,
  timeLimit = 30,
  onComplete
}) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<AutomatedFeedback[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [typingData, setTypingData] = useState<{ intervals: number[], revisions: number }>({ intervals: [], revisions: 0 });
  
  const lastKeystrokeTime = useRef(0);
  const quillRef = useRef<ReactQuill>(null);

  // Quiz timer
  const quizTimer = useTimer({
    expiryTimestamp: new Date(Date.now() + timeLimit * 60 * 1000),
    onExpire: handleTimeUp,
    autoStart: true
  });

  useEffect(() => {
    initializeQuiz();
    return () => {
      if (session && !isCompleted) {
        endQuiz();
      }
    };
  }, []);

  const initializeQuiz = async () => {
    try {
      const newSession = await academicIntegrityService.startQuizSession(userId, subject, grade);
      setSession(newSession);
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error starting quiz session:', error);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Track typing pattern
    const now = Date.now();
    if (lastKeystrokeTime.current > 0) {
      const interval = now - lastKeystrokeTime.current;
      setTypingData(prev => ({
        intervals: [...prev.intervals.slice(-19), interval], // Keep last 20 intervals
        revisions: prev.revisions
      }));
    }
    lastKeystrokeTime.current = now;
  };

  const handleRevision = () => {
    setTypingData(prev => ({
      ...prev,
      revisions: prev.revisions + 1
    }));
  };

  const recordQuestionResponse = async (questionId: string, answer: string) => {
    if (!session) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    const responseFeedback = await academicIntegrityService.recordQuizResponse(
      session.id,
      questionId,
      answer,
      timeSpent,
      typingData
    );

    setFeedback(prev => [...prev, ...responseFeedback]);

    // Reset for next question
    setTypingData({ intervals: [], revisions: 0 });
    lastKeystrokeTime.current = 0;
    setQuestionStartTime(Date.now());
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id] || '';
    
    await recordQuestionResponse(currentQuestion.id, answer);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await endQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  function handleTimeUp() {
    endQuiz();
  }

  const endQuiz = async () => {
    if (!session || isCompleted) return;

    try {
      // Record final question if answered
      const currentQuestion = questions[currentQuestionIndex];
      const answer = answers[currentQuestion.id] || '';
      
      if (answer.trim()) {
        await recordQuestionResponse(currentQuestion.id, answer);
      }

      // Calculate final score
      let totalScore = 0;
      let maxScore = 0;
      
      questions.forEach(question => {
        maxScore += question.points;
        const userAnswer = answers[question.id];
        
        if (question.type === 'multiple-choice' && userAnswer === question.correctAnswer) {
          totalScore += question.points;
        } else if (question.type === 'short-answer' || question.type === 'essay') {
          // Simple length-based scoring for demo
          if (userAnswer && userAnswer.trim().length > 10) {
            totalScore += Math.floor(question.points * 0.8); // Give partial credit
          }
        }
      });

      const finalSession: QuizSession = {
        ...session,
        endTime: new Date().toISOString(),
        overallScore: Math.round((totalScore / maxScore) * 100),
        feedback,
        flaggedForReview: session.integrityScore < 70
      };

      setSession(finalSession);
      setIsCompleted(true);
      onComplete(finalSession);
    } catch (error) {
      console.error('Error ending quiz:', error);
    }
  };

  const generateScoreBasedFeedback = (score: number, question: QuizQuestion): string => {
    if (score >= 90) return question.rubric.excellent;
    if (score >= 70) return question.rubric.good;
    return question.rubric.needsWork;
  };

  const getFeedbackIcon = (type: AutomatedFeedback['type']) => {
    switch (type) {
      case 'encouragement': return <CheckCircle className="text-success" size={16} />;
      case 'suggestion': return <Lightbulb className="text-warning" size={16} />;
      case 'question': return <MessageSquare className="text-info" size={16} />;
      case 'concern': return <AlertCircle className="text-danger" size={16} />;
      default: return <Brain className="text-secondary" size={16} />;
    }
  };

  if (!session) {
    return (
      <Card className="rounded-4 shadow-lg">
        <CardContent className="text-center py-4">
          <Target className="mb-3" size={48} />
          <h5>Preparing Quiz...</h5>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="rounded-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="h4 fw-bold text-success">
            <CheckCircle className="me-2" size={32} />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="display-4 fw-bold text-primary mb-2">
              {session.overallScore}%
            </div>
            <Badge bg="success" className="px-3 py-2">
              Well Done!
            </Badge>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6 text-center">
              <div className="h5 fw-bold text-info">{session.integrityScore}</div>
              <small className="text-muted">Integrity Score</small>
            </div>
            <div className="col-6 text-center">
              <div className="h5 fw-bold text-secondary">
                {Math.floor((new Date().getTime() - new Date(session.startTime).getTime()) / 60000)}m
              </div>
              <small className="text-muted">Time Taken</small>
            </div>
          </div>

          {/* Final Feedback */}
          {session.feedback.length > 0 && (
            <Alert variant="info">
              <h6 className="fw-bold">Teacher Feedback:</h6>
              <ul className="mb-0">
                {session.feedback.slice(-3).map((fb, index) => (
                  <li key={index} className="small">{fb.message}</li>
                ))}
              </ul>
            </Alert>
          )}

          {session.flaggedForReview && (
            <Alert variant="warning">
              <AlertCircle className="me-2" size={16} />
              Your responses will be reviewed by your teacher.
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="container py-4">
      {/* Quiz Header */}
      <Card className="rounded-4 shadow mb-4">
        <CardContent className="p-3">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h6 className="fw-bold mb-1">{subject} Quiz</h6>
              <small className="text-muted">Grade {grade}</small>
            </div>
            <div className="col-md-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <Clock size={16} className="text-info" />
                <span className="fw-bold">
                  {String(Math.floor(quizTimer.totalSeconds / 60)).padStart(2, '0')}:
                  {String(quizTimer.totalSeconds % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end gap-2">
                <span className="small">Progress:</span>
                <div style={{ width: '100px' }}>
                  <ProgressBar now={progress} variant="primary" style={{ height: '6px' }} />
                </div>
                <span className="small fw-bold">{currentQuestionIndex + 1}/{questions.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="row g-4">
        <div className="col-md-8">
          {/* Question */}
          <Card className="rounded-4 shadow-lg">
            <CardHeader>
              <CardTitle className="h5 fw-bold">
                Question {currentQuestionIndex + 1}
                <Badge bg="secondary" className="ms-2">{currentQuestion.points} pts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="lead">{currentQuestion.question}</p>
              </div>

              {/* Answer Input */}
              {currentQuestion.type === 'multiple-choice' && (
                <div className="mb-4">
                  {currentQuestion.options?.map((option, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`option-${index}`}
                      name={currentQuestion.id}
                      label={option}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short-answer' && (
                <div className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    onKeyDown={() => {
                      const now = Date.now();
                      if (lastKeystrokeTime.current > 0) {
                        const interval = now - lastKeystrokeTime.current;
                        setTypingData(prev => ({
                          intervals: [...prev.intervals.slice(-19), interval],
                          revisions: prev.revisions
                        }));
                      }
                      lastKeystrokeTime.current = now;
                    }}
                  />
                </div>
              )}

              {currentQuestion.type === 'essay' && (
                <div className="mb-4">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    onChangeSelection={() => handleRevision()}
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                      ]
                    }}
                    placeholder="Write your detailed answer here..."
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleNextQuestion}
                  className="fw-bold"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-md-4">
          {/* Live Feedback */}
          <Card className="rounded-4 shadow mb-3">
            <CardHeader>
              <CardTitle className="h6 fw-bold">
                <Brain className="me-2" size={16} />
                Live Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.length === 0 ? (
                <p className="text-muted small">
                  Keep working! Feedback will appear as you progress.
                </p>
              ) : (
                <div className="space-y-2">
                  {feedback.slice(-3).map((fb, index) => (
                    <Alert key={index} variant="light" className="p-2 border-0">
                      <div className="d-flex align-items-start">
                        {getFeedbackIcon(fb.type)}
                        <div className="ms-2">
                          <small className="d-block">{fb.message}</small>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integrity Score */}
          <Card className="rounded-4 shadow">
            <CardContent className="p-3 text-center">
              <TrendingUp className="mb-2 text-success" size={24} />
              <div className="h5 fw-bold text-success">{session.integrityScore}/100</div>
              <small className="text-muted">Academic Integrity</small>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizIntegrityWrapper;