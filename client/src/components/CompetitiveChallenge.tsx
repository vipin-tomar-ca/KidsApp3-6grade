import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Clock, 
  Star, 
  Target, 
  Zap, 
  Medal,
  Crown,
  Flame,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, ProgressBar, Badge, Modal } from "react-bootstrap";
import { useTimer } from 'react-timer-hook';
import { CompetitionQuestion, getCompetitionQuestionsByGrade, getRandomCompetitionQuestion } from '@/data/competitionQuestions';
import { SpeakableText } from '@/components/ui/accessibility';
import { cn } from "@/lib/utils";
import { useForm } from 'react-hook-form';

interface CompetitiveChallengeProps {
  grade: number;
  onComplete?: (score: number, totalQuestions: number) => void;
  onClose?: () => void;
}

interface LeaderboardEntry {
  rank: number;
  score: number;
  timeRemaining: number;
  difficulty: string;
  date: string;
}

const CompetitiveChallenge: React.FC<CompetitiveChallengeProps> = ({
  grade,
  onComplete,
  onClose
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<CompetitionQuestion | null>(null);
  const [questions, setQuestions] = useState<CompetitionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(10);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<{[key: string]: any}>({});
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [personalBest, setPersonalBest] = useState<number>(0);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  // Timer for individual questions
  const [timeExpired, setTimeExpired] = useState(false);
  const {
    seconds,
    minutes,
    isRunning,
    start: startTimer,
    pause: pauseTimer,
    restart: restartTimer
  } = useTimer({
    expiryTimestamp: new Date(Date.now() + 30000), // 30 seconds default
    onExpire: () => handleTimeExpire(),
    autoStart: false
  });

  useEffect(() => {
    loadPersonalBest();
  }, [grade]);

  const loadPersonalBest = () => {
    const saved = localStorage.getItem(`competition_best_grade_${grade}`);
    if (saved) {
      setPersonalBest(parseInt(saved));
    }
  };

  const savePersonalBest = (newScore: number) => {
    if (newScore > personalBest) {
      setPersonalBest(newScore);
      localStorage.setItem(`competition_best_grade_${grade}`, newScore.toString());
    }
  };

  const handleTimeExpire = () => {
    setTimeExpired(true);
    // Auto-submit with no answer after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const startChallenge = () => {
    // Generate challenging questions for the grade
    const allQuestions = getCompetitionQuestionsByGrade(grade);
    const selectedQuestions: CompetitionQuestion[] = [];
    
    // Ensure variety across subjects
    const subjects = ['Math', 'Science', 'English', 'Computer Science', 'Geography', 'History'];
    const questionsPerSubject = Math.ceil(totalQuestions / subjects.length);
    
    subjects.forEach(subject => {
      const subjectQuestions = allQuestions.filter(q => q.subject === subject);
      for (let i = 0; i < questionsPerSubject && selectedQuestions.length < totalQuestions; i++) {
        const randomQ = subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
        if (randomQ && !selectedQuestions.find(q => q.id === randomQ.id)) {
          selectedQuestions.push(randomQ);
        }
      }
    });

    // Fill remaining slots with random questions if needed
    while (selectedQuestions.length < totalQuestions) {
      const remainingQuestions = allQuestions.filter(q => !selectedQuestions.find(sq => sq.id === q.id));
      if (remainingQuestions.length === 0) break;
      const randomQ = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
      selectedQuestions.push(randomQ);
    }

    setQuestions(selectedQuestions);
    setCurrentQuestion(selectedQuestions[0]);
    setCurrentQuestionIndex(0);
    setChallengeStarted(true);
    setQuestionStartTime(new Date());
    setTimeExpired(false);
    
    // Start timer for first question
    const firstQuestion = selectedQuestions[0];
    if (firstQuestion) {
      const expiryTime = new Date(Date.now() + firstQuestion.timeLimit * 1000);
      restartTimer(expiryTime, true);
    }
  };

  const submitAnswer = (data: any) => {
    if (!currentQuestion || timeExpired) return;

    const userAnswer = data[`question_${currentQuestion.id}`];
    let isCorrect = false;

    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'numerical' || currentQuestion.type === 'short-answer') {
      const userNumeric = typeof userAnswer === 'string' ? userAnswer.trim() : userAnswer;
      isCorrect = userNumeric == currentQuestion.correctAnswer;
    }

    setAnswers(prev => ({ 
      ...prev, 
      [currentQuestion.id]: { 
        answer: userAnswer, 
        correct: isCorrect,
        timeSpent: questionStartTime ? Date.now() - questionStartTime.getTime() : 0
      }
    }));

    if (isCorrect) {
      const timeBonus = Math.max(0, Math.floor((currentQuestion.timeLimit - (Date.now() - (questionStartTime?.getTime() || 0)) / 1000) / 10));
      const questionScore = currentQuestion.points + timeBonus;
      setScore(prev => prev + questionScore);
      setStreakCount(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streakCount + 1));
    } else {
      setStreakCount(0);
    }

    // Show brief feedback then move to next question
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    pauseTimer();
    reset();

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(nextQuestion);
      setQuestionStartTime(new Date());
      setTimeExpired(false);

      // Start timer for next question
      const expiryTime = new Date(Date.now() + nextQuestion.timeLimit * 1000);
      restartTimer(expiryTime, true);
    } else {
      // Challenge complete
      completChallenge();
    }
  };

  const completChallenge = () => {
    setChallengeComplete(true);
    setChallengeStarted(false);
    setShowResults(true);
    savePersonalBest(score);
    onComplete?.(score, totalQuestions);
  };

  const restartChallenge = () => {
    setCurrentQuestion(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setChallengeStarted(false);
    setChallengeComplete(false);
    setShowResults(false);
    setAnswers({});
    setStreakCount(0);
    setTimeExpired(false);
    reset();
  };

  const getPerformanceRating = (): { label: string; color: string; icon: React.ReactNode } => {
    const percentage = (score / (questions.length * 25)) * 100; // Assuming average 25 points per question
    
    if (percentage >= 90) return { label: 'Legendary', color: 'text-purple-600', icon: <Crown size={24} /> };
    if (percentage >= 80) return { label: 'Expert', color: 'text-yellow-500', icon: <Medal size={24} /> };
    if (percentage >= 70) return { label: 'Advanced', color: 'text-blue-500', icon: <Star size={24} /> };
    if (percentage >= 60) return { label: 'Proficient', color: 'text-green-500', icon: <Target size={24} /> };
    return { label: 'Developing', color: 'text-gray-500', icon: <Zap size={24} /> };
  };

  const renderStartScreen = () => (
    <Card className="rounded-4 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-4">
        <div className="mb-3">
          <Crown size={48} className="mx-auto mb-2" />
          <CardTitle className="h2 fw-bold">Compete with the Best!</CardTitle>
          <p className="mb-0">Grade {grade} Championship Challenge</p>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="text-center mb-4">
          <Alert variant="info" className="rounded-3">
            <Trophy className="me-2" size={16} />
            <strong>Challenge Features:</strong>
            <ul className="mb-0 mt-2 text-start">
              <li>10 challenging questions from Math, Science, English, Computer Science & more</li>
              <li>Timed questions with bonus points for speed</li>
              <li>Questions from real competitions (AMC 8, Science Olympiad, etc.)</li>
              <li>Track your streak and compete for the highest score!</li>
            </ul>
          </Alert>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <div className="bg-light rounded-3 p-3 text-center">
              <Flame className="text-warning mb-2" size={24} />
              <h6 className="fw-bold">Personal Best</h6>
              <div className="h4 text-primary">{personalBest} pts</div>
            </div>
          </Col>
          <Col md={6}>
            <div className="bg-light rounded-3 p-3 text-center">
              <Medal className="text-success mb-2" size={24} />
              <h6 className="fw-bold">Target Score</h6>
              <div className="h4 text-success">{Math.max(personalBest + 50, 200)} pts</div>
            </div>
          </Col>
        </Row>

        <div className="d-grid gap-2">
          <BootstrapButton
            variant="primary"
            size="lg"
            onClick={startChallenge}
            className="rounded-3 fw-bold"
          >
            <Trophy size={20} className="me-2" />
            Start Championship Challenge
          </BootstrapButton>
          
          <BootstrapButton
            variant="outline-secondary"
            onClick={() => setShowLeaderboard(true)}
            className="rounded-3"
          >
            <Crown size={16} className="me-2" />
            View Leaderboard
          </BootstrapButton>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuestion = () => (
    <Card className="rounded-4 shadow-lg">
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <Badge bg="primary" className="me-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Badge>
            <Badge bg="info" className="me-2">
              {currentQuestion?.subject}
            </Badge>
            <Badge bg="warning">
              {currentQuestion?.difficulty}
            </Badge>
          </div>
          
          <div className="text-end">
            <div className={cn(
              "h5 fw-bold mb-0",
              seconds <= 10 ? "text-danger" : seconds <= 30 ? "text-warning" : "text-success"
            )}>
              <Clock size={20} className="me-1" />
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <small className="text-muted">{currentQuestion?.points} pts</small>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="h5 fw-bold text-primary">Score: {score}</span>
            {streakCount > 1 && (
              <Badge bg="success" className="ms-2">
                <Flame size={12} className="me-1" />
                {streakCount} streak!
              </Badge>
            )}
          </div>
          <ProgressBar 
            now={(currentQuestionIndex / totalQuestions) * 100} 
            style={{ width: '150px', height: '8px' }}
            variant="success"
          />
        </div>
      </CardHeader>

      <CardContent>
        {timeExpired ? (
          <Alert variant="danger" className="rounded-3">
            <XCircle className="me-2" />
            Time's up! Moving to next question...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(submitAnswer)}>
            <SpeakableText text={currentQuestion?.question || ''}>
              <h5 className="fw-bold mb-3">{currentQuestion?.question}</h5>
            </SpeakableText>

            {currentQuestion?.type === 'multiple-choice' && currentQuestion.options && (
              <div className="mb-4">
                {currentQuestion.options.map((option, index) => {
                  const fieldName = `question_${currentQuestion.id}`;
                  return (
                    <div key={index} className="mb-3 p-3 bg-light rounded-3 kid-button">
                      <label className="form-check-label w-100 cursor-pointer">
                        <input
                          type="radio"
                          value={option}
                          {...register(fieldName, { required: true })}
                          className="form-check-input me-2"
                        />
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {(currentQuestion?.type === 'numerical' || currentQuestion?.type === 'short-answer') && (
              <div className="mb-4">
                <input
                  type={currentQuestion.type === 'numerical' ? 'number' : 'text'}
                  className="form-control form-control-lg rounded-3"
                  placeholder="Enter your answer..."
                  {...register(`question_${currentQuestion.id}`, { required: true })}
                />
              </div>
            )}

            <BootstrapButton 
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 rounded-3 fw-bold"
              disabled={timeExpired || !watch(`question_${currentQuestion?.id}`)}
            >
              Submit Answer
            </BootstrapButton>
          </form>
        )}

        {/* Show correct answer briefly after submission */}
        {answers[currentQuestion?.id || ''] && (
          <Alert 
            variant={answers[currentQuestion?.id || '']?.correct ? 'success' : 'danger'}
            className="mt-3 rounded-3"
          >
            {answers[currentQuestion?.id || '']?.correct ? (
              <CheckCircle className="me-2" />
            ) : (
              <XCircle className="me-2" />
            )}
            <strong>
              {answers[currentQuestion?.id || '']?.correct ? 'Correct!' : 'Incorrect'}
            </strong>
            <br />
            <small>{currentQuestion?.explanation}</small>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const performance = getPerformanceRating();
    const accuracy = ((Object.values(answers).filter((a: any) => a.correct).length) / questions.length) * 100;
    
    return (
      <Card className="rounded-4 shadow-lg">
        <CardHeader className="text-center">
          <div className={performance.color + " mb-3"}>
            {performance.icon}
            <CardTitle className="h2 fw-bold mt-2">{performance.label} Performance!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Row className="mb-4 text-center">
            <Col md={3}>
              <div className="bg-primary text-white rounded-3 p-3">
                <h4 className="fw-bold mb-1">{score}</h4>
                <small>Total Score</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="bg-success text-white rounded-3 p-3">
                <h4 className="fw-bold mb-1">{accuracy.toFixed(0)}%</h4>
                <small>Accuracy</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="bg-warning text-white rounded-3 p-3">
                <h4 className="fw-bold mb-1">{maxStreak}</h4>
                <small>Max Streak</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="bg-info text-white rounded-3 p-3">
                <h4 className="fw-bold mb-1">{Object.values(answers).filter((a: any) => a.correct).length}</h4>
                <small>Correct</small>
              </div>
            </Col>
          </Row>

          {score > personalBest && (
            <Alert variant="success" className="rounded-3 text-center">
              <Crown className="me-2" />
              <strong>New Personal Best!</strong> You beat your previous record!
            </Alert>
          )}

          <div className="d-grid gap-2">
            <BootstrapButton
              variant="primary"
              size="lg"
              onClick={restartChallenge}
              className="rounded-3 fw-bold"
            >
              <RotateCcw size={16} className="me-2" />
              Take Challenge Again
            </BootstrapButton>
            
            <BootstrapButton
              variant="outline-secondary"
              onClick={onClose}
              className="rounded-3"
            >
              Back to Learning
            </BootstrapButton>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container className="py-4">
      <div className="max-w-4xl mx-auto">
        {!challengeStarted && !showResults && renderStartScreen()}
        {challengeStarted && !showResults && currentQuestion && renderQuestion()}
        {showResults && renderResults()}
      </div>
    </Container>
  );
};

export default CompetitiveChallenge;