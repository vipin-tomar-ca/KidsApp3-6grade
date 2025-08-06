import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { 
  Play, 
  Pause, 
  Volume2, 
  Music, 
  Award, 
  Clock,
  RotateCcw,
  CheckCircle,
  Star,
  Headphones
} from "lucide-react";
import { Container, Row, Col, Alert, Button as BootstrapButton, ProgressBar, Badge } from "react-bootstrap";
import { MusicLesson, MusicExercise, musicEducationService } from '@/services/musicEducationApi';
import { cn } from "@/lib/utils";
import * as Tone from 'tone';

interface MusicTheoryProps {
  grade: number;
  onLessonComplete?: (lessonId: string, score: number) => void;
}

interface MusicSkillLevel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredScore: number;
  lessons: EnhancedMusicLesson[];
}

interface EnhancedMusicLesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  concepts: string[];
  exercises: MusicExercise[];
  completed: boolean;
  score: number;
  unlocked: boolean;
}

interface RhythmPattern {
  beats: boolean[];
  name: string;
  difficulty: number;
}

const MusicTheoryComponent: React.FC<MusicTheoryProps> = ({ 
  grade, 
  onLessonComplete 
}) => {
  // Simplified state management for working component
  const [lessons, setLessons] = useState<MusicLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<MusicLesson | null>(null);
  const [currentExercise, setCurrentExercise] = useState<MusicExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [rhythmPattern, setRhythmPattern] = useState<boolean[]>([]);
  const [userRhythmInput, setUserRhythmInput] = useState<boolean[]>([]);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Audio and timing refs
  const audioRef = useRef<ReactAudioPlayer>(null);
  const metronomeRef = useRef<any>(null);
  const rhythmTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Piano configuration
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c5');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  useEffect(() => {
    loadMusicLessons();
    setupAudioContext();
    return () => {
      if (rhythmTimerRef.current) {
        clearInterval(rhythmTimerRef.current);
      }
    };
  }, [grade]);

  const setupAudioContext = async () => {
    try {
      await Tone.start();
      
      // Create metronome
      metronomeRef.current = new Tone.Player({
        url: "/audio/click.wav",
        loop: false
      }).toDestination();
      
    } catch (error) {
      console.error('Audio setup error:', error);
    }
  };

  const completeExercise = (exerciseId: string, userScore: number) => {
    setScore(prev => prev + userScore);
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    
    // Check if lesson is completed
    if (currentLesson) {
      const allExercisesCompleted = currentLesson.exercises.every(
        exercise => completedExercises.has(exercise.id) || exercise.id === exerciseId
      );
      
      if (allExercisesCompleted && onLessonComplete) {
        onLessonComplete(currentLesson.id, score + userScore);
      }
    }
  };

  const loadMusicLessons = async () => {
    setLoading(true);
    try {
      // Create enhanced music theory lessons with progression
      const enhancedLessons: MusicLesson[] = [
        {
          id: 'notes-basics',
          title: 'Musical Notes & Sounds',
          description: 'Learn about different musical notes and their sounds',
          grade: Math.min(grade, 6) as 3 | 4 | 5 | 6,
          category: 'notes' as 'beginner' | 'intermediate' | 'advanced',
          difficulty: 1,
          duration: 10,
          exercises: [
            {
              id: 'note-recognition-1',
              title: 'Note Name Game',
              type: 'listening',
              difficulty: 1,
              instructions: 'Listen to each note and select its name',
              data: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] }
            }
          ]
        },
        {
          id: 'rhythm-basics',
          title: 'Clap Along - Basic Rhythm',
          description: 'Feel the beat and clap simple rhythms',
          grade: Math.min(grade, 6) as 3 | 4 | 5 | 6,
          category: 'rhythm' as 'beginner' | 'intermediate' | 'advanced',
          difficulty: 1,
          duration: 15,
          exercises: [
            {
              id: 'clap-rhythm-1',
              title: 'Clap the Beat',
              type: 'rhythm',
              difficulty: 1,
              instructions: 'Clap along with the steady beat',
              data: { pattern: [true, false, true, false] }
            }
          ]
        },
        {
          id: 'piano-intro',
          title: 'Piano Keys Adventure',
          description: 'Explore the piano keyboard and play your first notes',
          grade: Math.min(grade, 6) as 3 | 4 | 5 | 6,
          category: 'piano' as 'beginner' | 'intermediate' | 'advanced',
          difficulty: 2,
          duration: 12,
          exercises: [
            {
              id: 'piano-play-1',
              title: 'Find Middle C',
              type: 'piano',
              difficulty: 1,
              instructions: 'Click on the middle C key',
              data: { targetNote: 'C4' }
            }
          ]
        },
        {
          id: 'scales-intro',
          title: 'Musical Scales',
          description: 'Learn about major and minor scales',
          grade: Math.min(grade, 6) as 3 | 4 | 5 | 6,
          category: 'scales' as 'beginner' | 'intermediate' | 'advanced',
          difficulty: 3,
          duration: 18,
          exercises: [
            {
              id: 'scale-play-1',
              title: 'Play C Major Scale',
              type: 'piano',
              difficulty: 2,
              instructions: 'Play each note of the C major scale in order',
              data: { scale: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'] }
            }
          ]
        }
      ];
      
      setLessons(enhancedLessons);
      if (enhancedLessons.length > 0) {
        setCurrentLesson(enhancedLessons[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load music lessons:', error);
      setLoading(false);
    }
  };

  const startMetronome = () => {
    if (metronomeActive) {
      Tone.Transport.stop();
      setMetronomeActive(false);
      return;
    }

    Tone.Transport.bpm.value = bpm;
    
    // Create a simple metronome click
    const metronome = new Tone.Loop((time) => {
      // Create a simple click sound
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease('C6', '32n', time);
    }, '4n');

    metronome.start(0);
    Tone.Transport.start();
    setMetronomeActive(true);
  };

  const playNote = (midiNumber: number) => {
    const frequency = Tone.Frequency(midiNumber, "midi").toFrequency();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(frequency, '8n');
  };

  const startRhythmGame = (exercise: MusicExercise) => {
    setCurrentExercise(exercise);
    setUserRhythmInput([]);
    
    // Generate a simple rhythm pattern for the exercise
    const pattern = generateRhythmPattern(exercise.difficulty);
    setRhythmPattern(pattern);
    
    // Play the pattern
    playRhythmPattern(pattern);
  };

  const generateRhythmPattern = (difficulty: number): boolean[] => {
    const patterns: { [key: number]: boolean[][] } = {
      1: [ // Easy patterns (4 beats)
        [true, false, true, false],
        [true, true, false, false],
        [true, false, false, true]
      ],
      2: [ // Medium patterns (8 beats)
        [true, false, true, false, true, false, true, false],
        [true, true, false, true, false, false, true, false]
      ],
      3: [ // Hard patterns (complex)
        [true, false, true, true, false, true, false, false]
      ]
    };
    
    const difficultyPatterns = patterns[difficulty] || patterns[1];
    return difficultyPatterns[Math.floor(Math.random() * difficultyPatterns.length)];
  };

  const playRhythmPattern = (pattern: boolean[]) => {
    const beatDuration = (60 / bpm) * 1000; // Convert BPM to milliseconds
    
    pattern.forEach((beat, index) => {
      setTimeout(() => {
        if (beat) {
          // Play beat sound
          const synth = new Tone.Synth().toDestination();
          synth.triggerAttackRelease('C4', '16n');
        }
      }, index * beatDuration);
    });
  };

  const handleRhythmInput = (beatIndex: number) => {
    const newInput = [...userRhythmInput];
    newInput[beatIndex] = true;
    setUserRhythmInput(newInput);
    
    // Play user input sound
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease('G4', '16n');
  };

  const checkRhythmAnswer = () => {
    if (!currentExercise) return;
    
    // Compare user input with correct pattern
    let correct = 0;
    const maxBeats = Math.max(rhythmPattern.length, userRhythmInput.length);
    
    for (let i = 0; i < maxBeats; i++) {
      if ((rhythmPattern[i] || false) === (userRhythmInput[i] || false)) {
        correct++;
      }
    }
    
    const accuracy = (correct / maxBeats) * 100;
    const exercisePoints = Math.round((accuracy / 100) * currentExercise.points);
    
    setExerciseScore(exercisePoints);
    setScore(prev => prev + exercisePoints);
    setCompletedExercises(prev => new Set([...Array.from(prev), currentExercise.id]));
    
    // Save progress
    if (currentLesson) {
      musicEducationService.saveUserProgress({
        lessonId: currentLesson.id,
        exercisesCompleted: Array.from(completedExercises),
        score: score + exercisePoints,
        timeSpent: 0, // TODO: Track actual time
        completedAt: new Date().toISOString(),
        attempts: 1
      });
    }
  };

  const resetRhythmGame = () => {
    setUserRhythmInput([]);
    setExerciseScore(0);
  };

  const renderPianoLesson = () => (
    <Card className="rounded-4 shadow-lg mb-4">
      <CardHeader>
        <CardTitle className="h4 fw-bold d-flex align-items-center">
          <Music className="me-2 text-primary" />
          Interactive Piano
        </CardTitle>
        <p className="text-muted">Click the keys to hear the notes! Try playing C-D-E-F-G-A-B-C</p>
      </CardHeader>
      <CardContent>
        <div className="piano-container bg-light rounded-3 p-4">
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={playNote}
            stopNote={() => {}} // Required prop for react-piano
            disabled={false}
            keyboardShortcuts={keyboardShortcuts}
            className="piano-component"
          />
          <div className="mt-3 text-center">
            <small className="text-muted">
              You can also use your computer keyboard: A S D F G H J keys!
            </small>
          </div>
        </div>
        
        {/* Note identification game */}
        <div className="mt-4">
          <h6 className="fw-bold">Note Challenge</h6>
          <p className="text-muted">Can you find these notes on the piano?</p>
          <div className="d-flex gap-2 flex-wrap">
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
              <BootstrapButton
                key={note}
                variant="outline-primary"
                size="sm"
                className="rounded-3"
                onClick={() => {
                  // Play the note and highlight it
                  const midiNote = MidiNumbers.fromNote(note.toLowerCase() + '4');
                  playNote(midiNote);
                }}
              >
                {note}
              </BootstrapButton>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRhythmGame = () => (
    <Card className="rounded-4 shadow-lg mb-4">
      <CardHeader>
        <CardTitle className="h4 fw-bold d-flex align-items-center">
          <Award className="me-2 text-warning" />
          Rhythm Challenge
        </CardTitle>
        <div className="d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0">Listen and repeat the rhythm pattern!</p>
          <Badge bg="info" className="rounded-pill">
            Score: {exerciseScore} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Metronome Controls */}
        <div className="metronome-section mb-4 p-3 bg-light rounded-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold mb-0">Metronome</h6>
            <div className="d-flex align-items-center gap-2">
              <label className="small">BPM:</label>
              <input 
                type="range" 
                min="60" 
                max="120" 
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="form-range"
                style={{width: '100px'}}
              />
              <span className="small fw-bold">{bpm}</span>
            </div>
          </div>
          <BootstrapButton
            variant={metronomeActive ? "danger" : "success"}
            onClick={startMetronome}
            className="w-100 rounded-3"
          >
            {metronomeActive ? <Pause size={16} /> : <Play size={16} />}
            {metronomeActive ? ' Stop Metronome' : ' Start Metronome'}
          </BootstrapButton>
        </div>

        {/* Rhythm Pattern Display */}
        {currentExercise && (
          <div className="rhythm-game-section">
            <Alert variant="info" className="rounded-3 mb-3">
              <Headphones className="me-2" size={16} />
              <strong>Instructions:</strong> {currentExercise.instructions}
            </Alert>
            
            {/* Pattern to learn */}
            <div className="mb-4">
              <h6 className="fw-bold">Listen to this pattern:</h6>
              <div className="rhythm-pattern d-flex gap-2 justify-content-center mb-3">
                {rhythmPattern.map((beat, index) => (
                  <div
                    key={index}
                    className={cn(
                      "beat-square rounded-3 d-flex align-items-center justify-content-center",
                      beat ? "bg-primary text-white" : "bg-light text-muted"
                    )}
                    style={{ width: '50px', height: '50px' }}
                  >
                    {beat ? '♪' : '—'}
                  </div>
                ))}
              </div>
              <BootstrapButton
                variant="outline-primary"
                size="sm"
                onClick={() => playRhythmPattern(rhythmPattern)}
                className="rounded-3"
              >
                <Play size={14} className="me-1" />
                Play Pattern
              </BootstrapButton>
            </div>

            {/* User input area */}
            <div className="mb-4">
              <h6 className="fw-bold">Now you try! Tap the beats:</h6>
              <div className="rhythm-input d-flex gap-2 justify-content-center mb-3">
                {Array.from({ length: rhythmPattern.length }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "beat-input rounded-3 d-flex align-items-center justify-content-center cursor-pointer kid-button",
                      userRhythmInput[index] ? "bg-success text-white" : "bg-white border-2 border-dashed border-primary"
                    )}
                    style={{ width: '50px', height: '50px' }}
                    onClick={() => handleRhythmInput(index)}
                  >
                    {userRhythmInput[index] ? '♪' : '?'}
                  </div>
                ))}
              </div>
              
              <div className="d-flex gap-2 justify-content-center">
                <BootstrapButton
                  variant="primary"
                  onClick={checkRhythmAnswer}
                  disabled={userRhythmInput.length === 0}
                  className="rounded-3"
                >
                  <CheckCircle size={16} className="me-1" />
                  Check Answer
                </BootstrapButton>
                <BootstrapButton
                  variant="outline-secondary"
                  onClick={resetRhythmGame}
                  className="rounded-3"
                >
                  <RotateCcw size={16} className="me-1" />
                  Try Again
                </BootstrapButton>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    return (
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <CardTitle className="h3 fw-bold text-primary">
                {currentLesson.title}
              </CardTitle>
              <SpeakableText text={currentLesson.description}>
                <p className="text-muted mb-2">{currentLesson.description}</p>
              </SpeakableText>
              <div className="d-flex gap-2 flex-wrap">
                <Badge bg="primary">Grade {currentLesson.grade}</Badge>
                <Badge bg="info">{currentLesson.category}</Badge>
                <Badge bg="success">Level {currentLesson.difficulty}</Badge>
                <Badge bg="warning">
                  <Clock size={12} className="me-1" />
                  {currentLesson.duration} min
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <Star className="text-warning mb-1" size={24} />
              <div className="fw-bold text-primary">{score}</div>
              <small className="text-muted">Points</small>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Lesson Description */}
          <Alert variant="info" className="rounded-3 mb-4">
            <div className="fw-bold mb-2">Lesson Overview:</div>
            <p className="mb-0">{currentLesson.description}</p>
          </Alert>

          {/* Exercise Section */}
          <div className="exercises-section">
            <h6 className="fw-bold mb-3">Interactive Exercises</h6>
            <Row className="g-3">
              {currentLesson.exercises.map((exercise) => (
                <Col key={exercise.id} md={6}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center p-3">
                      <div className="mb-2">
                        {exercise.type === 'piano' ? '🎹' : 
                         exercise.type === 'rhythm' ? '🥁' : 
                         exercise.type === 'listening' ? '👂' : '🎵'}
                      </div>
                      <h6 className="fw-bold">{exercise.title}</h6>
                      <p className="small text-muted">{exercise.instructions}</p>
                      <Badge bg="primary" className="mb-2">
                        Difficulty: {exercise.difficulty}/3
                      </Badge>
                      <div>
                        <Button 
                          size="sm" 
                          onClick={() => startRhythmGame(exercise)}
                          className="rounded-pill"
                        >
                          <Play size={14} className="me-1" />
                          Start Exercise
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="rounded-4 shadow-lg">
          <CardContent className="text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <h5 className="fw-bold">Loading Music Lessons...</h5>
            <p className="text-muted">Preparing your musical adventure!</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen">
      <AccessibilityToolbar />
      
      <Container className="py-4">
        <header className="text-center mb-4">
          <h1 className="display-4 fw-bold text-white mb-2">
            🎵 Music Theory for Grade {grade}
          </h1>
          <p className="text-white">
            Learn music the fun way with interactive lessons and games!
          </p>
        </header>

        {/* Progress Overview */}
        <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <Row className="text-center">
              <Col xs={3}>
                <div className="h4 fw-bold text-primary">{lessons.length}</div>
                <small className="text-muted">Lessons</small>
              </Col>
              <Col xs={3}>
                <div className="h4 fw-bold text-success">{completedExercises.size}</div>
                <small className="text-muted">Completed</small>
              </Col>
              <Col xs={3}>
                <div className="h4 fw-bold text-warning">{score}</div>
                <small className="text-muted">Total Score</small>
              </Col>
              <Col xs={3}>
                <div className="h4 fw-bold text-info">
                  {currentLesson?.difficulty || 'beginner'}
                </div>
                <small className="text-muted">Level</small>
              </Col>
            </Row>
          </CardContent>
        </Card>

        {/* Lesson Selection */}
        <Card className="rounded-4 shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="h5 fw-bold">Choose Your Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <Row className="g-3">
              {lessons.map((lesson) => (
                <Col key={lesson.id} md={6} lg={4}>
                  <BootstrapButton
                    variant={currentLesson?.id === lesson.id ? "primary" : "outline-primary"}
                    className="w-100 text-start p-3 rounded-3"
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <div className="fw-bold">{lesson.title}</div>
                    <small className="text-muted d-block">{lesson.category}</small>
                  </BootstrapButton>
                </Col>
              ))}
            </Row>
          </CardContent>
        </Card>

        {/* Main Content */}
        {currentLesson && (
          <>
            {renderLessonContent()}
            {renderPianoLesson()}
            
            {/* Exercises Section */}
            <Card className="rounded-4 shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="h4 fw-bold">Practice Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <Row className="g-3">
                  {currentLesson.exercises.map((exercise) => (
                    <Col key={exercise.id} md={6}>
                      <BootstrapButton
                        variant="success"
                        className="w-100 p-3 rounded-3 kid-button"
                        onClick={() => startRhythmGame(exercise)}
                      >
                        <div className="fw-bold">{exercise.title}</div>
                        <small className="d-block">
                          Difficulty: {exercise.difficulty}/5 • {exercise.points} points
                        </small>
                      </BootstrapButton>
                    </Col>
                  ))}
                </Row>
              </CardContent>
            </Card>

            {currentExercise && renderRhythmGame()}
          </>
        )}
      </Container>
    </div>
  );
};

export default MusicTheoryComponent;