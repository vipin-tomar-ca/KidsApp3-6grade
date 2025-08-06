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
import { cn } from "@/lib/utils";
import * as Tone from 'tone';

interface MusicTheoryProps {
  grade: number;
  onLessonComplete?: (lessonId: string, score: number) => void;
}

interface MusicLesson {
  id: string;
  title: string;
  description: string;
  grade: 3 | 4 | 5 | 6;
  category: 'notes' | 'rhythm' | 'scales' | 'chords' | 'theory';
  difficulty: 1 | 2 | 3;
  duration: number;
  exercises: MusicExercise[];
}

interface MusicExercise {
  id: string;
  title: string;
  type: 'listening' | 'rhythm-game' | 'note-identification' | 'scale-practice';
  difficulty: 1 | 2 | 3;
  instructions: string;
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
      // Note: Tone.js will be started on first user interaction
      console.log('Audio context setup ready');
    } catch (error) {
      console.error('Audio setup error:', error);
    }
  };

  const completeExercise = (exerciseId: string, userScore: number) => {
    setScore(prev => prev + userScore);
    setCompletedExercises(prev => new Set([...Array.from(prev), exerciseId]));
    
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
      // Comprehensive music theory curriculum based on ICSE, CBSE, IB and Kodaly/Orff methods
      const gradeLevel = Math.min(grade, 6) as 3 | 4 | 5 | 6;
      const enhancedLessons: MusicLesson[] = [
        // FOUNDATION LEVEL - Musical Notes & Pitch Recognition
        {
          id: 'musical-sounds',
          title: 'Musical Sounds Around Us',
          description: 'Discover different types of sounds and learn to identify musical vs non-musical sounds',
          grade: gradeLevel,
          category: 'notes',
          difficulty: 1,
          duration: 15,
          exercises: [
            {
              id: 'sound-identification',
              title: 'Musical or Not?',
              type: 'listening',
              difficulty: 1,
              instructions: 'Listen to each sound and decide if it is musical or not musical'
            },
            {
              id: 'pitch-high-low',
              title: 'High and Low Sounds',
              type: 'listening',
              difficulty: 1,
              instructions: 'Listen to pairs of sounds and identify which is higher or lower'
            }
          ]
        },
        {
          id: 'note-names-staff',
          title: 'Musical Alphabet & Staff Notation',
          description: 'Learn the seven letter names of music (A-G) and introduction to the staff',
          grade: gradeLevel,
          category: 'notes',
          difficulty: 1,
          duration: 20,
          exercises: [
            {
              id: 'letter-names',
              title: 'Musical Alphabet Game',
              type: 'note-identification',
              difficulty: 1,
              instructions: 'Match the musical letters A through G in the correct order'
            },
            {
              id: 'staff-lines-spaces',
              title: 'Lines and Spaces',
              type: 'note-identification',
              difficulty: 2,
              instructions: 'Identify notes on the lines and spaces of the treble clef staff'
            }
          ]
        },
        {
          id: 'solfege-basics',
          title: 'Do-Re-Mi Solfege System',
          description: 'Learn the Kodaly solfege system starting with Do-Mi-So-La',
          grade: gradeLevel,
          category: 'notes',
          difficulty: 2,
          duration: 25,
          exercises: [
            {
              id: 'do-mi-so',
              title: 'Three Note Songs',
              type: 'listening',
              difficulty: 1,
              instructions: 'Sing along with simple Do-Mi-So patterns using hand signs'
            },
            {
              id: 'solfege-echo',
              title: 'Solfege Echo Game',
              type: 'listening',
              difficulty: 2,
              instructions: 'Listen to solfege patterns and echo them back with correct hand signs'
            }
          ]
        },

        // RHYTHM & METER SECTION
        {
          id: 'steady-beat',
          title: 'Finding the Steady Beat',
          description: 'Learn to feel and maintain a steady beat through movement and clapping',
          grade: gradeLevel,
          category: 'rhythm',
          difficulty: 1,
          duration: 15,
          exercises: [
            {
              id: 'beat-walk',
              title: 'Walking to the Beat',
              type: 'rhythm-game',
              difficulty: 1,
              instructions: 'March in place keeping a steady beat with the music'
            },
            {
              id: 'clap-patterns',
              title: 'Clap the Beat',
              type: 'rhythm-game',
              difficulty: 1,
              instructions: 'Clap along with simple rhythm patterns'
            }
          ]
        },
        {
          id: 'note-values',
          title: 'Note Values: Quarter, Half, and Whole Notes',
          description: 'Learn about different note lengths and how they relate to the beat',
          grade: gradeLevel,
          category: 'rhythm',
          difficulty: 2,
          duration: 20,
          exercises: [
            {
              id: 'note-matching',
              title: 'Match the Note Values',
              type: 'rhythm-game',
              difficulty: 2,
              instructions: 'Match rhythm patterns to their corresponding note values'
            },
            {
              id: 'clap-rhythms',
              title: 'Clap Different Rhythms',
              type: 'rhythm-game',
              difficulty: 2,
              instructions: 'Clap patterns using quarter notes, half notes, and whole notes'
            }
          ]
        },
        {
          id: 'time-signatures',
          title: 'Time Signatures: 2/4, 3/4, and 4/4',
          description: 'Understanding how beats are grouped in measures',
          grade: gradeLevel,
          category: 'rhythm',
          difficulty: 3,
          duration: 25,
          exercises: [
            {
              id: 'count-beats',
              title: 'Counting in Different Meters',
              type: 'rhythm-game',
              difficulty: 2,
              instructions: 'Count "1-2" for 2/4, "1-2-3" for 3/4, and "1-2-3-4" for 4/4 time'
            },
            {
              id: 'conduct-patterns',
              title: 'Conducting Patterns',
              type: 'rhythm-game',
              difficulty: 3,
              instructions: 'Practice conducting patterns for 2/4, 3/4, and 4/4 time signatures'
            }
          ]
        },

        // PIANO & KEYBOARD EXPLORATION
        {
          id: 'keyboard-layout',
          title: 'Piano Keyboard Layout',
          description: 'Explore the piano keyboard and learn about white and black keys',
          grade: gradeLevel,
          category: 'theory',
          difficulty: 1,
          duration: 18,
          exercises: [
            {
              id: 'black-white-keys',
              title: 'Black and White Key Patterns',
              type: 'note-identification',
              difficulty: 1,
              instructions: 'Identify the pattern of black key groups (2s and 3s) on the keyboard'
            },
            {
              id: 'find-middle-c',
              title: 'Finding Middle C',
              type: 'note-identification',
              difficulty: 1,
              instructions: 'Locate Middle C using the group of two black keys'
            }
          ]
        },
        {
          id: 'five-finger-patterns',
          title: 'Five-Finger Patterns',
          description: 'Learn basic five-finger patterns starting from different notes',
          grade: gradeLevel,
          category: 'theory',
          difficulty: 2,
          duration: 22,
          exercises: [
            {
              id: 'c-position',
              title: 'C Position Playing',
              type: 'note-identification',
              difficulty: 2,
              instructions: 'Play simple melodies using C-D-E-F-G (thumb to pinky)'
            },
            {
              id: 'finger-numbers',
              title: 'Finger Number Game',
              type: 'note-identification',
              difficulty: 1,
              instructions: 'Match finger numbers (1-5) to the correct keys in C position'
            }
          ]
        },

        // SCALES AND MODES
        {
          id: 'major-scale-introduction',
          title: 'The Major Scale',
          description: 'Learn the pattern of whole and half steps that make a major scale',
          grade: gradeLevel,
          category: 'scales',
          difficulty: 2,
          duration: 25,
          exercises: [
            {
              id: 'c-major-scale',
              title: 'C Major Scale Practice',
              type: 'scale-practice',
              difficulty: 2,
              instructions: 'Play the C major scale using the correct fingering'
            },
            {
              id: 'scale-degrees',
              title: 'Scale Degree Numbers',
              type: 'scale-practice',
              difficulty: 2,
              instructions: 'Learn the numbers 1-8 for each note of the major scale'
            }
          ]
        },
        {
          id: 'pentatonic-scales',
          title: 'Pentatonic Scales',
          description: 'Explore the five-note pentatonic scale used in many world music traditions',
          grade: gradeLevel,
          category: 'scales',
          difficulty: 2,
          duration: 20,
          exercises: [
            {
              id: 'black-key-pentatonic',
              title: 'Black Key Pentatonic',
              type: 'scale-practice',
              difficulty: 2,
              instructions: 'Play melodies using only the black keys on the piano'
            },
            {
              id: 'world-music-scales',
              title: 'Music from Around the World',
              type: 'listening',
              difficulty: 1,
              instructions: 'Listen to pentatonic melodies from different cultures'
            }
          ]
        },

        // CHORDS AND HARMONY
        {
          id: 'simple-chords',
          title: 'Introduction to Chords',
          description: 'Learn what chords are and practice playing simple three-note chords',
          grade: gradeLevel,
          category: 'chords',
          difficulty: 3,
          duration: 20,
          exercises: [
            {
              id: 'c-major-chord',
              title: 'C Major Chord',
              type: 'note-identification',
              difficulty: 2,
              instructions: 'Learn to play the C major chord (C-E-G)'
            },
            {
              id: 'chord-progressions',
              title: 'Simple Chord Changes',
              type: 'listening',
              difficulty: 3,
              instructions: 'Listen to simple I-V chord progressions'
            }
          ]
        },

        // MUSICAL EXPRESSION & DYNAMICS
        {
          id: 'dynamics-tempo',
          title: 'Musical Expression: Loud, Soft, Fast, Slow',
          description: 'Learn about dynamics (volume) and tempo (speed) in music',
          grade: gradeLevel,
          category: 'theory',
          difficulty: 1,
          duration: 15,
          exercises: [
            {
              id: 'dynamic-levels',
              title: 'Forte and Piano',
              type: 'listening',
              difficulty: 1,
              instructions: 'Identify loud (forte) and soft (piano) sections in music'
            },
            {
              id: 'tempo-changes',
              title: 'Fast and Slow Music',
              type: 'listening',
              difficulty: 1,
              instructions: 'Move to music and show tempo changes with your body'
            }
          ]
        },

        // MUSICAL FORMS & STRUCTURE
        {
          id: 'musical-forms',
          title: 'Musical Forms: AB and ABA',
          description: 'Learn about how music is organized into sections and patterns',
          grade: gradeLevel,
          category: 'theory',
          difficulty: 2,
          duration: 18,
          exercises: [
            {
              id: 'ab-form',
              title: 'Two Section Songs (AB Form)',
              type: 'listening',
              difficulty: 2,
              instructions: 'Listen to songs and identify when section A changes to section B'
            },
            {
              id: 'aba-form',
              title: 'Three Section Songs (ABA Form)',
              type: 'listening',
              difficulty: 2,
              instructions: 'Identify ABA form where the first section returns at the end'
            }
          ]
        },

        // WORLD MUSIC & CULTURAL APPRECIATION
        {
          id: 'world-music-traditions',
          title: 'Music from Around the World',
          description: 'Explore musical traditions from different cultures and countries',
          grade: gradeLevel,
          category: 'theory',
          difficulty: 1,
          duration: 25,
          exercises: [
            {
              id: 'cultural-instruments',
              title: 'Instruments of the World',
              type: 'listening',
              difficulty: 1,
              instructions: 'Listen to and identify instruments from different cultures'
            },
            {
              id: 'folk-songs',
              title: 'Folk Songs from Many Lands',
              type: 'listening',
              difficulty: 1,
              instructions: 'Learn simple folk songs from various countries'
            }
          ]
        },

        // ADVANCED CONCEPTS FOR HIGHER GRADES
        ...(gradeLevel >= 5 ? [
          {
            id: 'intervals-introduction',
            title: 'Musical Intervals',
            description: 'Learn about the distance between notes and basic interval recognition',
            grade: gradeLevel,
            category: 'theory' as const,
            difficulty: 3,
            duration: 22,
            exercises: [
              {
                id: 'step-skip-jump',
                title: 'Steps, Skips, and Jumps',
                type: 'listening' as const,
                difficulty: 2,
                instructions: 'Identify melodic motion as steps, skips, or jumps'
              },
              {
                id: 'octave-recognition',
                title: 'The Octave',
                type: 'listening' as const,
                difficulty: 3,
                instructions: 'Recognize when two notes are an octave apart'
              }
            ]
          },
          {
            id: 'minor-scales',
            title: 'Major and Minor Scales',
            description: 'Compare and contrast major and minor scales and their emotional qualities',
            grade: gradeLevel,
            category: 'scales' as const,
            difficulty: 3,
            duration: 25,
            exercises: [
              {
                id: 'major-minor-listening',
                title: 'Happy or Sad?',
                type: 'listening' as const,
                difficulty: 2,
                instructions: 'Listen to scales and melodies and identify major (happy) vs minor (sad)'
              },
              {
                id: 'natural-minor-scale',
                title: 'A Minor Scale',
                type: 'scale-practice' as const,
                difficulty: 3,
                instructions: 'Learn to play the A natural minor scale'
              }
            ]
          }
        ] : [])
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

  const startMetronome = async () => {
    try {
      // Start Tone.js context if not already started
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

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
    } catch (error) {
      console.error('Error starting metronome:', error);
    }
  };

  const playNote = async (midiNumber: number) => {
    try {
      // Start Tone.js context if not already started
      if (Tone.context.state !== 'running') {
        await Tone.start();
        console.log('Tone.js started!');
      }
      
      // Create a new synth with piano-like sound
      const synth = new Tone.Synth({
        oscillator: {
          type: 'triangle'
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toDestination();
      
      const frequency = Tone.Frequency(midiNumber, "midi").toFrequency();
      synth.triggerAttackRelease(frequency, '1');
      
      console.log(`Playing note: MIDI ${midiNumber}, Frequency: ${frequency}Hz`);
      
      // Dispose of synth after playing to prevent memory leaks
      setTimeout(() => {
        synth.dispose();
      }, 1000);
      
    } catch (error) {
      console.error('Error playing note:', error);
    }
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
          <div className="mb-3">
            <Button 
              onClick={async () => {
                try {
                  await Tone.start();
                  console.log('Audio context manually started');
                  playNote(60); // Play middle C as test
                } catch (error) {
                  console.error('Manual audio start failed:', error);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🔊 Enable Sound (Click First!)
            </Button>
          </div>
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
                  <div className="h-100 p-3 border-0 shadow-sm bg-white rounded">
                    <div className="text-center">
                      <div className="mb-2">
                        {exercise.type === 'note-identification' ? '🎹' : 
                         exercise.type === 'rhythm-game' ? '🥁' : 
                         exercise.type === 'listening' ? '👂' : 
                         exercise.type === 'scale-practice' ? '🎵' : '🎼'}
                      </div>
                      <h6 className="fw-bold">{exercise.title}</h6>
                      <p className="small text-muted">{exercise.instructions}</p>
                      <Badge bg="primary" className="mb-2">
                        Difficulty: {exercise.difficulty}/3
                      </Badge>
                      <div>
                        <BootstrapButton 
                          size="sm" 
                          onClick={() => startRhythmGame(exercise)}
                          className="rounded-pill"
                        >
                          <Play size={14} className="me-1" />
                          Start Exercise
                        </BootstrapButton>
                      </div>
                    </div>
                  </div>
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