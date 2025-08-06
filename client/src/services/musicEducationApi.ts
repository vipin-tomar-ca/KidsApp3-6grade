import localforage from 'localforage';

// Music education interfaces based on Berklee College of Music curriculum
export interface MusicLesson {
  id: string;
  title: string;
  category: 'notes' | 'rhythm' | 'scales' | 'chords' | 'theory';
  grade: 3 | 4 | 5 | 6;
  description: string;
  content: string;
  objectives: string[];
  audioFiles: AudioResource[];
  exercises: MusicExercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  prerequisites: string[];
  standards: string[]; // National Core Arts Standards
  createdAt: string;
  source: 'berklee' | 'custom';
}

export interface AudioResource {
  id: string;
  title: string;
  url: string;
  type: 'example' | 'backing-track' | 'lesson' | 'exercise';
  duration: number;
  description?: string;
}

export interface MusicExercise {
  id: string;
  type: 'rhythm-game' | 'note-identification' | 'scale-practice' | 'listening';
  title: string;
  instructions: string;
  difficulty: number; // 1-5
  timeLimit?: number;
  correctAnswers: any[];
  points: number;
}

export interface UserProgress {
  lessonId: string;
  exercisesCompleted: string[];
  score: number;
  timeSpent: number;
  completedAt: string;
  attempts: number;
}

export interface UserCreation {
  id: string;
  type: 'rhythm-composition' | 'melody' | 'song';
  title: string;
  content: any; // Could be notation, audio data, etc.
  createdAt: string;
  grade: number;
  subject: 'music' | 'art';
  tags: string[];
}

// Storage configuration
const musicStorage = localforage.createInstance({
  name: 'MusicEducation',
  version: 1.0,
  storeName: 'lessons',
  description: 'Music education content and user progress'
});

const creationsStorage = localforage.createInstance({
  name: 'UserCreations',
  version: 1.0,
  storeName: 'creations',
  description: 'User creative works and compositions'
});

// Berklee-inspired music education content
class MusicEducationService {
  
  async getBasicNotesLessons(grade: number): Promise<MusicLesson[]> {
    const cacheKey = `music_notes_grade_${grade}`;
    
    try {
      const cached = await musicStorage.getItem<MusicLesson[]>(cacheKey);
      if (cached) return cached;
      
      // Berklee-inspired content for elementary music education
      const lessons: MusicLesson[] = [
        {
          id: `berklee_notes_${grade}_1`,
          title: 'Musical Alphabet - The Seven Letter Names',
          category: 'notes',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn the seven letter names that make up all music: A, B, C, D, E, F, G',
          content: `
            <h2>The Musical Alphabet</h2>
            <p>Music uses only seven letter names, just like a short alphabet! These letters are:</p>
            <div class="music-letters">
              <div class="note-card">A</div>
              <div class="note-card">B</div>
              <div class="note-card">C</div>
              <div class="note-card">D</div>
              <div class="note-card">E</div>
              <div class="note-card">F</div>
              <div class="note-card">G</div>
            </div>
            <p>After G, we start over again with A! It's like counting, but with letters.</p>
            <h3>Fun Fact</h3>
            <p>These seven letters represent all the white keys on a piano! Every song you know uses these seven letters in different combinations.</p>
            <h3>Memory Trick</h3>
            <p>Remember: <strong>A</strong>ll <strong>B</strong>irds <strong>C</strong>an <strong>D</strong>ance, <strong>E</strong>ven <strong>F</strong>unny <strong>G</strong>eese!</p>
          `,
          objectives: [
            'Identify the seven letter names of music',
            'Understand that musical notes repeat in alphabetical order',
            'Connect letter names to piano keys'
          ],
          audioFiles: [
            {
              id: 'piano_scale_c',
              title: 'C Major Scale',
              url: '/audio/c-major-scale.mp3',
              type: 'example',
              duration: 15,
              description: 'Listen to the seven notes played in order'
            }
          ],
          exercises: [
            {
              id: 'note_sequence',
              type: 'note-identification',
              title: 'Complete the Musical Alphabet',
              instructions: 'Fill in the missing letters in the musical sequence',
              difficulty: 1,
              timeLimit: 60,
              correctAnswers: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
              points: 10
            }
          ],
          difficulty: 'beginner',
          duration: 15,
          prerequisites: [],
          standards: ['MU:Re7.1.Ka', 'MU:Pr4.2.Ka'],
          createdAt: new Date().toISOString(),
          source: 'berklee'
        },
        {
          id: `berklee_rhythm_${grade}_1`,
          title: 'Beat and Rhythm - Your Musical Heartbeat',
          category: 'rhythm',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Discover the steady beat that lives inside every song, just like your heartbeat!',
          content: `
            <h2>Finding the Beat</h2>
            <p>Every song has a <strong>beat</strong> - it's like the song's heartbeat! Put your hand on your heart and feel it beat: thump, thump, thump...</p>
            <p>Music has the same steady feeling. When you tap your foot to a song, you're feeling the beat!</p>
            
            <h3>Beat vs. Rhythm</h3>
            <div class="concept-comparison">
              <div class="beat-section">
                <h4>Beat</h4>
                <p>The steady pulse - like a clock ticking: tick, tick, tick, tick</p>
                <p>It never changes speed in a song</p>
              </div>
              <div class="rhythm-section">
                <h4>Rhythm</h4>
                <p>The pattern of long and short sounds over the beat</p>
                <p>This is what makes songs interesting and different!</p>
              </div>
            </div>
            
            <h3>Try This!</h3>
            <p>Clap along to your favorite song. Can you feel that steady beat underneath all the different sounds?</p>
          `,
          objectives: [
            'Feel and identify the steady beat in music',
            'Understand the difference between beat and rhythm',
            'Clap or move to a steady beat'
          ],
          audioFiles: [
            {
              id: 'metronome_60',
              title: 'Steady Beat at 60 BPM',
              url: '/audio/metronome-60.mp3',
              type: 'backing-track',
              duration: 30,
              description: 'A steady beat to practice with'
            },
            {
              id: 'rhythm_example',
              title: 'Simple Rhythm Pattern',
              url: '/audio/simple-rhythm.mp3',
              type: 'example',
              duration: 20
            }
          ],
          exercises: [
            {
              id: 'clap_along',
              type: 'rhythm-game',
              title: 'Clap Along Challenge',
              instructions: 'Listen to the beat and try to clap along. Keep the beat steady!',
              difficulty: 1,
              timeLimit: 30,
              correctAnswers: [1, 1, 1, 1], // Beat pattern
              points: 15
            }
          ],
          difficulty: 'beginner',
          duration: 20,
          prerequisites: [],
          standards: ['MU:Re7.1.Ka', 'MU:Pr4.1.Ka'],
          createdAt: new Date().toISOString(),
          source: 'berklee'
        }
      ];
      
      if (grade >= 4) {
        lessons.push({
          id: `berklee_scales_${grade}_1`,
          title: 'Major Scales - The Happy Sound',
          category: 'scales',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn about major scales and why they sound so happy and bright!',
          content: `
            <h2>What is a Scale?</h2>
            <p>A scale is like a musical ladder! Each note is a step higher than the last one.</p>
            <p>The <strong>major scale</strong> has a special pattern that makes it sound happy and bright.</p>
            
            <h3>The C Major Scale</h3>
            <p>The easiest major scale uses only the white keys on a piano:</p>
            <div class="scale-notes">C - D - E - F - G - A - B - C</div>
            <p>Try singing: "Do Re Mi Fa Sol La Ti Do" - that's the C major scale!</p>
            
            <h3>Why Does it Sound Happy?</h3>
            <p>The pattern of spaces between notes creates that cheerful, bright sound. Most happy songs use major scales!</p>
            
            <h4>Songs You Know in Major</h4>
            <ul>
              <li>"Twinkle, Twinkle, Little Star"</li>
              <li>"Happy Birthday"</li>
              <li>"Mary Had a Little Lamb"</li>
            </ul>
          `,
          objectives: [
            'Understand what a musical scale is',
            'Recognize the sound of a major scale',
            'Sing or play a simple major scale'
          ],
          audioFiles: [
            {
              id: 'c_major_scale_sung',
              title: 'C Major Scale - Do Re Mi',
              url: '/audio/do-re-mi-scale.mp3',
              type: 'example',
              duration: 25
            },
            {
              id: 'twinkle_c_major',
              title: 'Twinkle Twinkle in C Major',
              url: '/audio/twinkle-c-major.mp3',
              type: 'example',
              duration: 30
            }
          ],
          exercises: [
            {
              id: 'scale_singing',
              type: 'scale-practice',
              title: 'Sing the Scale',
              instructions: 'Listen and try to sing along with the Do Re Mi scale',
              difficulty: 2,
              correctAnswers: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
              points: 20
            }
          ],
          difficulty: 'beginner',
          duration: 25,
          prerequisites: ['berklee_notes_' + grade + '_1'],
          standards: ['MU:Re7.1.2a', 'MU:Pr4.2.2a'],
          createdAt: new Date().toISOString(),
          source: 'berklee'
        });
      }
      
      if (grade >= 5) {
        lessons.push({
          id: `berklee_chords_${grade}_1`,
          title: 'Basic Chords - When Notes Work Together',
          category: 'chords',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Discover how multiple notes can work together to create rich, full sounds!',
          content: `
            <h2>What is a Chord?</h2>
            <p>A chord is when you play <strong>three or more notes together</strong> at the same time. It's like musical teamwork!</p>
            
            <h3>The C Major Chord</h3>
            <p>The simplest chord uses three notes from the C major scale:</p>
            <div class="chord-notes">C + E + G = C Major Chord</div>
            <p>These three notes sound beautiful together because they're from the same musical family!</p>
            
            <h3>How Chords Help Songs</h3>
            <ul>
              <li><strong>Melody</strong> - The tune you sing along to</li>
              <li><strong>Chords</strong> - The background that supports the melody</li>
              <li><strong>Together</strong> - They make a complete song!</li>
            </ul>
            
            <h4>Try This</h4>
            <p>If you have a piano or keyboard, try pressing C, E, and G at the same time. Hear how they sound together!</p>
          `,
          objectives: [
            'Understand what a chord is',
            'Learn the notes in a C major chord',
            'Hear how chords support melodies'
          ],
          audioFiles: [
            {
              id: 'c_major_chord',
              title: 'C Major Chord',
              url: '/audio/c-major-chord.mp3',
              type: 'example',
              duration: 10
            },
            {
              id: 'melody_with_chords',
              title: 'Simple Melody with Chord Support',
              url: '/audio/melody-with-chords.mp3',
              type: 'example',
              duration: 45
            }
          ],
          exercises: [
            {
              id: 'chord_identification',
              type: 'listening',
              title: 'Find the Chord',
              instructions: 'Listen to the chord and identify which notes are being played together',
              difficulty: 3,
              correctAnswers: ['C', 'E', 'G'],
              points: 25
            }
          ],
          difficulty: 'intermediate',
          duration: 30,
          prerequisites: ['berklee_scales_' + grade + '_1'],
          standards: ['MU:Re7.1.3a', 'MU:Cr1.1.3a'],
          createdAt: new Date().toISOString(),
          source: 'berklee'
        });
      }
      
      await musicStorage.setItem(cacheKey, lessons);
      return lessons;
      
    } catch (error) {
      console.error('Error loading music lessons:', error);
      return [];
    }
  }
  
  async getRhythmGames(grade: number): Promise<MusicExercise[]> {
    return [
      {
        id: 'rhythm_clap_1',
        type: 'rhythm-game',
        title: 'Echo Clapping',
        instructions: 'Listen to the rhythm pattern, then clap it back exactly the same way!',
        difficulty: 1,
        timeLimit: 60,
        correctAnswers: [1, 0, 1, 1, 0, 1, 0, 1], // Rhythm pattern
        points: 20
      },
      {
        id: 'rhythm_clap_2',
        type: 'rhythm-game',
        title: 'Beat Detective',
        instructions: 'Which rhythm matches the song? Listen carefully and choose!',
        difficulty: 2,
        timeLimit: 45,
        correctAnswers: ['pattern_a'],
        points: 25
      },
      {
        id: 'rhythm_create',
        type: 'rhythm-game',
        title: 'Rhythm Creator',
        instructions: 'Create your own 4-beat rhythm pattern by tapping!',
        difficulty: 2,
        correctAnswers: [], // User creation, no specific correct answer
        points: 30
      }
    ];
  }
  
  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const progressKey = `progress_${progress.lessonId}`;
      await musicStorage.setItem(progressKey, progress);
    } catch (error) {
      console.error('Error saving music progress:', error);
    }
  }
  
  async getUserProgress(lessonId: string): Promise<UserProgress | null> {
    try {
      return await musicStorage.getItem(`progress_${lessonId}`);
    } catch (error) {
      console.error('Error getting music progress:', error);
      return null;
    }
  }
  
  async saveUserCreation(creation: UserCreation): Promise<void> {
    try {
      await creationsStorage.setItem(creation.id, creation);
      
      // Also save to a list for easy retrieval
      const creationsList = await this.getUserCreations() || [];
      creationsList.push(creation);
      await creationsStorage.setItem('user_creations_list', creationsList);
    } catch (error) {
      console.error('Error saving user creation:', error);
    }
  }
  
  async getUserCreations(): Promise<UserCreation[]> {
    try {
      return await creationsStorage.getItem('user_creations_list') || [];
    } catch (error) {
      console.error('Error getting user creations:', error);
      return [];
    }
  }
}

export const musicEducationService = new MusicEducationService();