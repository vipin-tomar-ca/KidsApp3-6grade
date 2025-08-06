import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpeakableText } from "@/components/ui/accessibility";
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Star, 
  Trophy, 
  RotateCcw,
  ChevronRight,
  Heart
} from "lucide-react";
import { Alert, Button as BootstrapButton, Form } from "react-bootstrap";
import { Quiz, Activity, ActivityItem } from "@/services/contentApi";
import { cn } from "@/lib/utils";

interface InteractiveQuizProps {
  quizzes: Quiz[];
  activities?: Activity[];
  onComplete: (score: number, totalQuestions: number) => void;
  onProgressUpdate?: (current: number, total: number) => void;
}

interface QuizFormData {
  [key: string]: string | number;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quizzes,
  activities = [],
  onComplete,
  onProgressUpdate
}) => {
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showingQuizzes, setShowingQuizzes] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hearts, setHearts] = useState(3); // Lives system
  const [dragItems, setDragItems] = useState<ActivityItem[]>([]);
  const [dropItems, setDropItems] = useState<ActivityItem[]>([]);

  // Form management
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<QuizFormData>();

  const currentQuiz = quizzes[currentQuestionIndex];
  const currentActivity = activities[currentActivityIndex];
  const totalItems = quizzes.length + activities.length;
  const currentItemIndex = showingQuizzes ? currentQuestionIndex : quizzes.length + currentActivityIndex;

  // Initialize drag-drop items for current activity
  useEffect(() => {
    if (currentActivity && currentActivity.type === 'drag-drop') {
      setDragItems([...currentActivity.items]);
      setDropItems([]);
    }
  }, [currentActivity]);

  // Update progress
  useEffect(() => {
    onProgressUpdate?.(currentItemIndex + 1, totalItems);
  }, [currentItemIndex, totalItems, onProgressUpdate]);

  const submitAnswer = (data: QuizFormData) => {
    if (!currentQuiz) return;

    const userAnswer = data[`question_${currentQuiz.id}`];
    console.log('User answer:', userAnswer, 'Correct answer:', currentQuiz.correctAnswer);
    
    let correct = false;
    
    // Handle different question types
    if (currentQuiz.type === 'multiple-choice') {
      // Convert user answer index to actual answer
      const answerIndex = parseInt(userAnswer as string);
      const selectedAnswer = currentQuiz.options?.[answerIndex];
      correct = selectedAnswer === currentQuiz.correctAnswer;
    } else if (currentQuiz.type === 'true-false') {
      correct = userAnswer === currentQuiz.correctAnswer;
    } else if (currentQuiz.type === 'fill-blank') {
      // Case-insensitive comparison for text answers
      const userText = (userAnswer as string).toLowerCase().trim();
      const correctText = (currentQuiz.correctAnswer as string).toLowerCase().trim();
      correct = userText === correctText;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + currentQuiz.points);
      setAnswers(prev => ({ ...prev, [currentQuiz.id]: userAnswer }));
      console.log('Correct answer! Score increased.');
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      console.log('Incorrect answer. Heart lost.');
    }

    // Auto-advance after showing feedback
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setShowHint(false);
    setAttempts(0);
    reset();

    if (showingQuizzes) {
      if (currentQuestionIndex < quizzes.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (activities.length > 0) {
        setShowingQuizzes(false);
        setCurrentActivityIndex(0);
      } else {
        completeQuiz();
      }
    } else {
      if (currentActivityIndex < activities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        completeQuiz();
      }
    }
  };

  const completeQuiz = () => {
    const totalQuestions = quizzes.length + activities.length;
    onComplete(score, totalQuestions);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items = source.droppableId === 'drag-items' ? [...dragItems] : [...dropItems];
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      if (source.droppableId === 'drag-items') {
        setDragItems(items);
      } else {
        setDropItems(items);
      }
    } else {
      // Moving between lists
      const sourceItems = source.droppableId === 'drag-items' ? [...dragItems] : [...dropItems];
      const destItems = destination.droppableId === 'drag-items' ? [...dragItems] : [...dropItems];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      if (source.droppableId === 'drag-items') {
        setDragItems(sourceItems);
        setDropItems(destItems);
      } else {
        setDragItems(destItems);
        setDropItems(sourceItems);
      }
    }
  };

  const checkActivityAnswer = () => {
    if (!currentActivity) return;

    let correct = false;

    if (currentActivity.type === 'drag-drop' && currentActivity.correctOrder) {
      const userOrder = dropItems.map(item => item.id);
      correct = JSON.stringify(userOrder) === JSON.stringify(currentActivity.correctOrder);
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 20); // Award points for activities
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const resetActivity = () => {
    if (currentActivity) {
      setDragItems([...currentActivity.items]);
      setDropItems([]);
    }
  };

  if (totalItems === 0) {
    return (
      <Card className="rounded-4 shadow-lg">
        <CardContent className="text-center py-5">
          <div className="text-6xl mb-3">📚</div>
          <h3 className="h5 fw-bold text-muted">No quizzes available</h3>
          <p className="text-muted">Complete the lesson to unlock interactive activities!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Trophy className="text-warning me-2" size={24} />
              <span className="h5 fw-bold mb-0">Quiz Progress</span>
            </div>
            <div className="d-flex align-items-center">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart 
                  key={i} 
                  className={cn(
                    "mx-1",
                    i < hearts ? "text-red-500 fill-current" : "text-gray-300"
                  )} 
                  size={20} 
                />
              ))}
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Question {currentItemIndex + 1} of {totalItems}</span>
            <span className="fw-bold text-primary">Score: {score} pts</span>
          </div>
          
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-gradient-to-r from-blue-500 to-purple-600"
              style={{ width: `${((currentItemIndex + 1) / totalItems) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiz Questions */}
      {showingQuizzes && currentQuiz && (
        <Card className="rounded-4 shadow-lg mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <SpeakableText text={currentQuiz.question}>
                  <CardTitle className="h4 fw-bold text-dark mb-2">
                    {currentQuiz.question}
                  </CardTitle>
                </SpeakableText>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary rounded-pill">{currentQuiz.type}</span>
                  <span className="badge bg-success rounded-pill">{currentQuiz.points} points</span>
                </div>
              </div>
              {currentQuiz.hints && currentQuiz.hints.length > 0 && (
                <BootstrapButton
                  variant="outline-warning"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-3"
                >
                  <Lightbulb size={16} />
                </BootstrapButton>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Hint Display */}
            {showHint && currentQuiz.hints && (
              <Alert variant="info" className="mb-4 rounded-3">
                <Lightbulb className="me-2" size={16} />
                <strong>Hint:</strong> {currentQuiz.hints[0]}
              </Alert>
            )}

            {/* Question Form */}
            <Form onSubmit={handleSubmit(submitAnswer)}>
              {currentQuiz.type === 'multiple-choice' && currentQuiz.options && (
                <div className="mb-4">
                  {currentQuiz.options.map((option, index) => {
                    const fieldName = `question_${currentQuiz.id}`;
                    const watchedValue = watch(fieldName);
                    return (
                      <div key={index} className="mb-3 p-3 bg-light rounded-3 kid-button">
                        <Form.Check
                          type="radio"
                          id={`option-${index}`}
                          label={option}
                          value={index.toString()}
                          checked={watchedValue === index.toString()}
                          {...register(fieldName, { required: true })}
                          className="form-check-lg"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuiz.type === 'true-false' && (
                <div className="mb-4">
                  <div className="mb-3 p-3 bg-light rounded-3 kid-button">
                    <Form.Check
                      type="radio"
                      id="true-option"
                      label="True ✓"
                      value="true"
                      checked={watch(`question_${currentQuiz.id}`) === "true"}
                      {...register(`question_${currentQuiz.id}`, { required: true })}
                      className="form-check-lg"
                    />
                  </div>
                  <div className="mb-3 p-3 bg-light rounded-3 kid-button">
                    <Form.Check
                      type="radio"
                      id="false-option"
                      label="False ✗"
                      value="false"
                      checked={watch(`question_${currentQuiz.id}`) === "false"}
                      {...register(`question_${currentQuiz.id}`, { required: true })}
                      className="form-check-lg"
                    />
                  </div>
                </div>
              )}

              {currentQuiz.type === 'fill-blank' && (
                <div className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Type your answer here..."
                    className="form-control-lg rounded-3"
                    {...register(`question_${currentQuiz.id}`, { required: true })}
                  />
                </div>
              )}

              {!showFeedback && (
                <BootstrapButton 
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 rounded-3 kid-button"
                  disabled={!watch(`question_${currentQuiz.id}`)}
                >
                  Submit Answer
                </BootstrapButton>
              )}
            </Form>

            {/* Feedback */}
            {showFeedback && (
              <Alert 
                variant={isCorrect ? 'success' : 'danger'} 
                className="mt-4 rounded-3 animate-bounce-gentle"
              >
                <div className="d-flex align-items-center mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="me-2" size={20} />
                      <strong>Excellent! 🎉</strong>
                    </>
                  ) : (
                    <>
                      <XCircle className="me-2" size={20} />
                      <strong>Not quite right 🤔</strong>
                    </>
                  )}
                </div>
                <SpeakableText text={currentQuiz.explanation}>
                  <p className="mb-0">{currentQuiz.explanation}</p>
                </SpeakableText>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Component */}
      {!showingQuizzes && currentActivity && (
        <Card className="rounded-4 shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="h4 fw-bold text-dark">
              {currentActivity.title}
            </CardTitle>
            <SpeakableText text={currentActivity.instructions}>
              <p className="text-muted mb-0">{currentActivity.instructions}</p>
            </SpeakableText>
          </CardHeader>
          
          <CardContent>
            {currentActivity.type === 'drag-drop' && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Drag from here:</h6>
                    <Droppable droppableId="drag-items">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "border-2 border-dashed rounded-3 p-4 min-h-32",
                            snapshot.isDraggingOver ? "border-primary bg-blue-50" : "border-gray-300 bg-gray-50"
                          )}
                          style={{ minHeight: '200px' }}
                        >
                          {dragItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-white border rounded-3 p-3 mb-2 cursor-move kid-button",
                                    snapshot.isDragging ? "shadow-lg rotate-2" : "shadow-sm"
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Drop in correct order:</h6>
                      <BootstrapButton
                        variant="outline-secondary"
                        size="sm"
                        onClick={resetActivity}
                        className="rounded-3"
                      >
                        <RotateCcw size={16} />
                      </BootstrapButton>
                    </div>
                    <Droppable droppableId="drop-items">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "border-2 border-dashed rounded-3 p-4 min-h-32",
                            snapshot.isDraggingOver ? "border-success bg-green-50" : "border-gray-300 bg-gray-50"
                          )}
                          style={{ minHeight: '200px' }}
                        >
                          {dropItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-success text-white border rounded-3 p-3 mb-2 cursor-move kid-button",
                                    snapshot.isDragging ? "shadow-lg rotate-2" : "shadow-sm"
                                  )}
                                >
                                  {index + 1}. {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </DragDropContext>
            )}

            {!showFeedback && (
              <div className="text-center mt-4">
                <BootstrapButton 
                  variant="primary"
                  size="lg"
                  onClick={checkActivityAnswer}
                  className="rounded-3 kid-button"
                  disabled={dropItems.length === 0}
                >
                  Check My Answer
                </BootstrapButton>
              </div>
            )}

            {/* Activity Feedback */}
            {showFeedback && (
              <Alert 
                variant={isCorrect ? 'success' : 'danger'} 
                className="mt-4 rounded-3 animate-bounce-gentle"
              >
                <div className="d-flex align-items-center mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="me-2" size={20} />
                      <strong>Perfect! 🌟</strong>
                    </>
                  ) : (
                    <>
                      <XCircle className="me-2" size={20} />
                      <strong>Try again! 🔄</strong>
                    </>
                  )}
                </div>
                <p className="mb-0">
                  {isCorrect 
                    ? "You got the correct order! Great job understanding the sequence!" 
                    : "Not quite right. Think about the logical order of events and try again!"
                  }
                </p>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="text-center">
        <BootstrapButton
          variant="outline-primary"
          onClick={nextQuestion}
          className="rounded-3 kid-button"
          disabled={!showFeedback}
        >
          {currentItemIndex === totalItems - 1 ? 'Finish Quiz' : 'Next Question'}
          <ChevronRight className="ms-2" size={16} />
        </BootstrapButton>
      </div>
    </div>
  );
};

export default InteractiveQuiz;