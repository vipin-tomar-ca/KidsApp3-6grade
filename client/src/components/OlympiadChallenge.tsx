import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { 
  Timer, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  Target,
  Zap,
  RotateCcw,
  Play,
  Pause,
  Flag
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, ProgressBar, Badge, Form } from "react-bootstrap";
import { 
  OlympiadProblem, 
  OlympiadSet, 
  OlympiadAttempt, 
  olympiadService 
} from '@/services/olympiadApi';
import { cn } from "@/lib/utils";

interface OlympiadChallengeProps {
  grade: number;
  category: 'math' | 'science';
  onComplete?: (attempt: OlympiadAttempt) => void;
  onExit?: () => void;
}

interface ProblemAnswer {
  problemId: string;
  answer: string;
  timeSpent: number;
  correct?: boolean;
}

interface ChallengeForm {
  answers: { [problemId: string]: string };
}

const OlympiadChallenge: React.FC<OlympiadChallengeProps> = ({ 
  grade, 
  category, 
  onComplete, 
  onExit 
}) => {
  // State management
  const [currentSet, setCurrentSet] = useState<OlympiadSet | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [problemId: string]: string }>({});
  const [problemStartTime, setProblemStartTime] = useState<number>(Date.now());
  const [challengeStartTime] = useState<number>(Date.now());
  const [challengeState, setChallengeState] = useState<'setup' | 'active' | 'paused' | 'completed'>('setup');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ [problemId: string]: { correct: boolean; explanation: string } }>({});
  const [showResults, setShowResults] = useState(false);
  const [availableSets, setAvailableSets] = useState<OlympiadSet[]>([]);

  // Form handling
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ChallengeForm>({
    defaultValues: { answers: {} }
  });

  // Timer setup
  const challengeExpiryTime = new Date();
  challengeExpiryTime.setSeconds(challengeExpiryTime.getSeconds() + (currentSet?.timeLimit || 1800)); // 30 min default

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: challengeExpiryTime,
    onExpire: () => handleTimeUp(),
    autoStart: false
  });

  const currentProblem = currentSet?.problems[currentProblemIndex] || null;

  useEffect(() => {
    loadAvailableSets();
  }, [grade, category]);

  useEffect(() => {
    if (challengeState === 'active' && !isRunning) {
      start();
    } else if (challengeState === 'paused' && isRunning) {
      pause();
    }
  }, [challengeState, isRunning, start, pause]);

  const loadAvailableSets = async () => {
    try {
      let sets = await olympiadService.getAvailableSets(category, grade);
      
      // If no sets exist, create default ones
      if (sets.length === 0) {
        const newSet = await olympiadService.createOlympiadSet(
          `${category === 'math' ? 'AMC 8' : 'NSO'} Practice - Grade ${grade}`,
          category,
          grade,
          10
        );
        sets = [newSet];
      }
      
      setAvailableSets(sets);
      if (sets.length > 0) {
        setCurrentSet(sets[0]);
      }
    } catch (error) {
      console.error('Error loading olympiad sets:', error);
    }
  };

  const handleStartChallenge = (selectedSet: OlympiadSet) => {
    setCurrentSet(selectedSet);
    setChallengeState('active');
    setProblemStartTime(Date.now());
    
    // Reset timer with correct expiry time
    const newExpiryTime = new Date();
    newExpiryTime.setSeconds(newExpiryTime.getSeconds() + selectedSet.timeLimit);
    restart(newExpiryTime, true);
  };

  const handleAnswerSubmit = (problemId: string, answer: string) => {
    const newAnswers = { ...answers, [problemId]: answer };
    setAnswers(newAnswers);
    setValue(`answers.${problemId}`, answer);

    // Check answer immediately for feedback
    if (currentProblem) {
      const isCorrect = answer.toLowerCase().trim() === currentProblem.correctAnswer.toLowerCase().trim();
      setFeedback(prev => ({
        ...prev,
        [problemId]: {
          correct: isCorrect,
          explanation: currentProblem.explanation
        }
      }));

      if (isCorrect) {
        setScore(prev => prev + currentProblem.points);
      }
    }
  };

  const handleNextProblem = () => {
    if (currentSet && currentProblemIndex < currentSet.problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setProblemStartTime(Date.now());
    } else {
      handleChallengeComplete();
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setProblemStartTime(Date.now());
    }
  };

  const handleTimeUp = () => {
    setChallengeState('completed');
    handleChallengeComplete();
  };

  const handleChallengeComplete = async () => {
    if (!currentSet) return;

    setChallengeState('completed');
    pause();

    const endTime = Date.now();
    const totalTimeSpent = endTime - challengeStartTime;

    // Calculate final score and accuracy
    let correctAnswers = 0;
    const totalProblems = currentSet.problems.length;

    currentSet.problems.forEach(problem => {
      const userAnswer = answers[problem.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === problem.correctAnswer.toLowerCase().trim()) {
        correctAnswers++;
      }
    });

    const accuracy = (correctAnswers / totalProblems) * 100;

    const attempt: OlympiadAttempt = {
      id: `attempt_${Date.now()}`,
      setId: currentSet.id,
      userId: 'current_user', // TODO: Get from auth context
      startTime: new Date(challengeStartTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      timeSpent: Math.floor(totalTimeSpent / 1000),
      answers,
      score: correctAnswers,
      totalPoints: totalProblems,
      accuracy,
      completed: true,
      grade
    };

    // Save attempt
    await olympiadService.saveAttempt(attempt);
    
    setShowResults(true);
    onComplete?.(attempt);
  };

  const formatTime = (h: number, m: number, s: number): string => {
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderSetupScreen = () => (
    <Container className="py-4">
      <Card className="rounded-4 shadow-lg">
        <CardHeader>
          <CardTitle className="h3 fw-bold text-center">
            {category === 'math' ? '🏆 Math Olympiad Challenge' : '🔬 Science Olympiad Challenge'}
          </CardTitle>
          <p className="text-center text-muted">
            Grade {grade} • {category === 'math' ? 'AMC 8 Style' : 'NSO Style'} Problems
          </p>
        </CardHeader>
        <CardContent>
          <Alert variant="info" className="rounded-3 mb-4">
            <Target className="me-2" size={20} />
            <strong>Challenge Rules:</strong>
            <ul className="mb-0 mt-2">
              <li>Answer all problems within the time limit</li>
              <li>You can navigate between problems freely</li>
              <li>Immediate feedback after each answer</li>
              <li>Challenge simulates real competition environment</li>
            </ul>
          </Alert>

          <div className="available-sets">
            <h5 className="fw-bold mb-3">Choose Your Challenge:</h5>
            <Row className="g-3">
              {availableSets.map((set) => (
                <Col key={set.id} md={6}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-bold">{set.name}</h6>
                        <Badge bg="primary">{set.problems.length} problems</Badge>
                      </div>
                      <p className="text-muted small">{set.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="small text-muted">
                          <Clock size={14} className="me-1" />
                          {Math.floor(set.timeLimit / 60)} minutes
                        </div>
                        <div className="small text-muted">
                          <Trophy size={14} className="me-1" />
                          {set.totalPoints} points
                        </div>
                      </div>
                      <BootstrapButton
                        variant="primary"
                        className="w-100 mt-3 rounded-3"
                        onClick={() => handleStartChallenge(set)}
                      >
                        <Play size={16} className="me-2" />
                        Start Challenge
                      </BootstrapButton>
                    </CardContent>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </CardContent>
      </Card>
    </Container>
  );

  const renderProblemScreen = () => {
    if (!currentSet || !currentProblem) return null;

    const problemFeedback = feedback[currentProblem.id];

    return (
      <Container fluid className="py-4">
        {/* Header with timer and progress */}
        <Card className="rounded-4 shadow-lg mb-4">
          <CardContent className="p-3">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="d-flex align-items-center">
                  <Timer className={cn(
                    "me-2",
                    minutes < 5 ? "text-danger" : "text-primary"
                  )} size={20} />
                  <span className={cn(
                    "h5 fw-bold mb-0",
                    minutes < 5 ? "text-danger" : "text-dark"
                  )}>
                    {formatTime(hours, minutes, seconds)}
                  </span>
                </div>
              </Col>
              <Col md={6}>
                <div className="progress-section">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Problem {currentProblemIndex + 1} of {currentSet.problems.length}</span>
                    <span>{score} / {currentSet.totalPoints} points</span>
                  </div>
                  <ProgressBar 
                    now={((currentProblemIndex + 1) / currentSet.problems.length) * 100}
                    variant="success"
                    style={{ height: '8px' }}
                  />
                </div>
              </Col>
              <Col md={3} className="text-end">
                <div className="d-flex gap-2 justify-content-end">
                  <BootstrapButton
                    variant="outline-warning"
                    size="sm"
                    onClick={() => setChallengeState('paused')}
                    disabled={challengeState !== 'active'}
                  >
                    <Pause size={14} />
                  </BootstrapButton>
                  <BootstrapButton
                    variant="outline-danger"
                    size="sm"
                    onClick={handleChallengeComplete}
                  >
                    <Flag size={14} />
                  </BootstrapButton>
                </div>
              </Col>
            </Row>
          </CardContent>
        </Card>

        {/* Problem content */}
        <Row className="g-4">
          <Col lg={8}>
            <Card className="rounded-4 shadow-lg">
              <CardHeader>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <CardTitle className="h5 fw-bold">
                      Problem {currentProblem.problemNumber}: {currentProblem.title}
                    </CardTitle>
                    <div className="d-flex gap-2 mt-2">
                      <Badge bg="info">{currentProblem.source}</Badge>
                      <Badge bg="warning">Difficulty: {currentProblem.difficulty}/5</Badge>
                      <Badge bg="success">{currentProblem.points} points</Badge>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="small text-muted">Time limit</div>
                    <div className="fw-bold">{Math.floor(currentProblem.timeLimit / 60)}:{(currentProblem.timeLimit % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SpeakableText text={currentProblem.statement}>
                  <div className="problem-statement mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {currentProblem.statement}
                  </div>
                </SpeakableText>

                {currentProblem.imageUrl && (
                  <div className="problem-image mb-4 text-center">
                    <img 
                      src={currentProblem.imageUrl} 
                      alt="Problem diagram"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}

                <Form onSubmit={handleSubmit(() => {})}>
                  {currentProblem.type === 'multiple-choice' && currentProblem.choices && (
                    <div className="choices-section">
                      <h6 className="fw-bold mb-3">Choose your answer:</h6>
                      <Controller
                        name={`answers.${currentProblem.id}`}
                        control={control}
                        rules={{ required: "Please select an answer" }}
                        render={({ field }) => (
                          <div className="choices-grid">
                            {currentProblem.choices?.map((choice, index) => (
                              <div key={index} className="mb-3 p-3 bg-light rounded-3 kid-button">
                                <Form.Check
                                  type="radio"
                                  id={`choice-${index}`}
                                  label={choice}
                                  value={choice}
                                  checked={field.value === choice}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    // Don't auto-submit, let user click submit button
                                  }}
                                  className="form-check-lg"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  )}

                  {(currentProblem.type === 'short-answer' || currentProblem.type === 'numerical') && (
                    <div className="answer-input-section">
                      <h6 className="fw-bold mb-3">Enter your answer:</h6>
                      <Controller
                        name={`answers.${currentProblem.id}`}
                        control={control}
                        render={({ field }) => (
                          <div className="input-group mb-3">
                            <Form.Control
                              type={currentProblem.type === 'numerical' ? 'number' : 'text'}
                              placeholder="Type your answer here..."
                              value={field.value || ''}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              onBlur={() => {
                                if (field.value) {
                                  handleAnswerSubmit(currentProblem.id, field.value);
                                }
                              }}
                              style={{ fontSize: '1.1rem', padding: '12px' }}
                            />
                            <BootstrapButton
                              variant="primary"
                              onClick={() => {
                                if (field.value) {
                                  handleAnswerSubmit(currentProblem.id, field.value);
                                }
                              }}
                            >
                              Submit
                            </BootstrapButton>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </Form>

                {/* Immediate feedback */}
                {problemFeedback && (
                  <Alert 
                    variant={problemFeedback.correct ? 'success' : 'danger'} 
                    className="rounded-3 mt-4"
                  >
                    <div className="d-flex align-items-start">
                      {problemFeedback.correct ? (
                        <CheckCircle className="me-2 mt-1" size={20} />
                      ) : (
                        <XCircle className="me-2 mt-1" size={20} />
                      )}
                      <div>
                        <strong>
                          {problemFeedback.correct ? 'Correct!' : 'Incorrect'}
                        </strong>
                        <p className="mb-0 mt-1">{problemFeedback.explanation}</p>
                      </div>
                    </div>
                  </Alert>
                )}

                {/* Navigation */}
                <div className="d-flex justify-content-between mt-4">
                  <BootstrapButton
                    variant="outline-secondary"
                    onClick={handlePreviousProblem}
                    disabled={currentProblemIndex === 0}
                  >
                    Previous
                  </BootstrapButton>
                  <BootstrapButton
                    variant="primary"
                    onClick={handleNextProblem}
                  >
                    {currentProblemIndex === currentSet.problems.length - 1 ? 'Finish Challenge' : 'Next Problem'}
                  </BootstrapButton>
                </div>
              </CardContent>
            </Card>
          </Col>

          {/* Sidebar with problem overview */}
          <Col lg={4}>
            <Card className="rounded-4 shadow-lg">
              <CardHeader>
                <CardTitle className="h6 fw-bold">Problem Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="problem-grid">
                  {currentSet.problems.map((problem, index) => (
                    <button
                      key={problem.id}
                      className={cn(
                        "btn btn-outline-primary btn-sm m-1",
                        currentProblemIndex === index && "btn-primary",
                        answers[problem.id] && "btn-success"
                      )}
                      onClick={() => setCurrentProblemIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-3 small text-muted">
                  <div>Answered: {Object.keys(answers).length} / {currentSet.problems.length}</div>
                  <div>Current Score: {score} / {currentSet.totalPoints}</div>
                </div>
              </CardContent>
            </Card>

            {/* Topics covered */}
            <Card className="rounded-4 shadow-lg mt-4">
              <CardHeader>
                <CardTitle className="h6 fw-bold">Topics in This Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="d-flex flex-wrap gap-1">
                  {Array.from(new Set(currentSet.problems.flatMap(p => p.topics))).map(topic => (
                    <Badge key={topic} bg="light" text="dark" className="rounded-pill">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  const renderResultsScreen = () => {
    if (!currentSet) return null;

    const totalProblems = currentSet.problems.length;
    const correctAnswers = Object.values(feedback).filter(f => f.correct).length;
    const accuracy = (correctAnswers / totalProblems) * 100;

    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-3">
              <Trophy className="text-warning" size={48} />
            </div>
            <CardTitle className="h3 fw-bold">Challenge Complete!</CardTitle>
            <p className="text-muted">Here's how you performed</p>
          </CardHeader>
          <CardContent>
            <Row className="text-center g-4 mb-4">
              <Col md={3}>
                <div className="stat-card p-3 bg-light rounded-3">
                  <div className="h3 fw-bold text-primary">{correctAnswers}</div>
                  <div className="small text-muted">Correct Answers</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card p-3 bg-light rounded-3">
                  <div className="h3 fw-bold text-success">{accuracy.toFixed(1)}%</div>
                  <div className="small text-muted">Accuracy</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card p-3 bg-light rounded-3">
                  <div className="h3 fw-bold text-info">{score}</div>
                  <div className="small text-muted">Points Earned</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card p-3 bg-light rounded-3">
                  <div className="h3 fw-bold text-warning">
                    {formatTime(hours, minutes, seconds)}
                  </div>
                  <div className="small text-muted">Time Remaining</div>
                </div>
              </Col>
            </Row>

            <Alert variant={accuracy >= 80 ? 'success' : accuracy >= 60 ? 'warning' : 'info'} className="rounded-3 mb-4">
              <Award className="me-2" size={20} />
              <strong>
                {accuracy >= 80 ? 'Excellent work!' : 
                 accuracy >= 60 ? 'Good effort!' : 
                 'Keep practicing!'}
              </strong>
              {accuracy >= 80 && ' You showed strong olympiad problem-solving skills.'}
              {accuracy >= 60 && accuracy < 80 && ' You\'re developing solid problem-solving abilities.'}
              {accuracy < 60 && ' Every attempt helps you improve. Try more practice problems!'}
            </Alert>

            <div className="d-flex gap-3 justify-content-center">
              <BootstrapButton
                variant="primary"
                onClick={() => {
                  setChallengeState('setup');
                  setCurrentProblemIndex(0);
                  setAnswers({});
                  setFeedback({});
                  setScore(0);
                  setShowResults(false);
                }}
              >
                <RotateCcw size={16} className="me-2" />
                Try Another Challenge
              </BootstrapButton>
              <BootstrapButton
                variant="outline-secondary"
                onClick={onExit}
              >
                Back to Menu
              </BootstrapButton>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  };

  if (challengeState === 'setup' && !showResults) {
    return (
      <div className="bg-kid-gradient min-h-screen">
        <AccessibilityToolbar />
        {renderSetupScreen()}
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="bg-kid-gradient min-h-screen">
        <AccessibilityToolbar />
        {renderResultsScreen()}
      </div>
    );
  }

  if (challengeState === 'paused') {
    return (
      <div className="bg-kid-gradient min-h-screen d-flex align-items-center justify-content-center">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center p-5">
            <Pause className="text-warning mb-3" size={48} />
            <h4 className="fw-bold">Challenge Paused</h4>
            <p className="text-muted">Take a break when you're ready to continue.</p>
            <BootstrapButton
              variant="primary"
              onClick={() => setChallengeState('active')}
            >
              Resume Challenge
            </BootstrapButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen">
      <AccessibilityToolbar />
      {renderProblemScreen()}
    </div>
  );
};

export default OlympiadChallenge;