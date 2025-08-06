import axios from 'axios';
import localforage from 'localforage';

// Olympiad problem interfaces based on AMC 8 and NSO formats
export interface OlympiadProblem {
  id: string;
  source: 'AMC8' | 'NSO' | 'MATHCOUNTS' | 'MOEMS';
  year: number;
  problemNumber: number;
  category: 'algebra' | 'geometry' | 'number-theory' | 'combinatorics' | 'physics' | 'chemistry' | 'biology' | 'earth-science';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easiest, 5=hardest
  grade: 3 | 4 | 5 | 6;
  title: string;
  statement: string;
  imageUrl?: string;
  type: 'multiple-choice' | 'short-answer' | 'numerical';
  choices?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  timeLimit: number; // seconds
  points: number;
  topics: string[];
  standards: string[]; // Common Core or NGSS standards
  createdAt: string;
}

export interface OlympiadSet {
  id: string;
  name: string;
  description: string;
  source: string;
  year: number;
  problems: OlympiadProblem[];
  timeLimit: number; // total time for the set
  totalPoints: number;
  grade: number;
  category: 'math' | 'science';
}

export interface OlympiadAttempt {
  id: string;
  setId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  timeSpent: number;
  answers: { [problemId: string]: string };
  score: number;
  totalPoints: number;
  accuracy: number;
  completed: boolean;
  grade: number;
}

export interface UserOlympiadProgress {
  userId: string;
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number;
  completedSets: string[];
  strengths: string[]; // topics where user performs well
  weaknesses: string[]; // topics needing improvement
  achievements: string[];
  lastActivity: string;
}

// Storage configuration
const olympiadStorage = localforage.createInstance({
  name: 'OlympiadPrep',
  version: 1.0,
  storeName: 'problems',
  description: 'Olympiad problems and user progress'
});

const progressStorage = localforage.createInstance({
  name: 'OlympiadProgress',
  version: 1.0,
  storeName: 'attempts',
  description: 'User olympiad attempts and progress tracking'
});

class OlympiadService {
  private baseUrl = 'https://artofproblemsolving.com/wiki'; // AoPS wiki has AMC problems
  private nsoApiUrl = 'https://www.nso-india.org'; // NSO materials

  // AMC 8 inspired problems (using authentic problem structures)
  async getAMC8Problems(grade: number, year?: number): Promise<OlympiadProblem[]> {
    const cacheKey = `amc8_problems_grade_${grade}_${year || 'all'}`;
    
    try {
      const cached = await olympiadStorage.getItem<OlympiadProblem[]>(cacheKey);
      if (cached) return cached;

      // Authentic AMC 8 problem structures adapted for elementary grades
      const problems: OlympiadProblem[] = [
        {
          id: 'amc8_2023_1',
          source: 'AMC8',
          year: 2023,
          problemNumber: 1,
          category: 'number-theory',
          difficulty: 1,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Basic Arithmetic Operations',
          statement: 'What is the value of 2 + 3 × 4 - 1?',
          type: 'multiple-choice',
          choices: ['12', '13', '19', '20', '21'],
          correctAnswer: '13',
          explanation: 'Following order of operations (PEMDAS): 2 + 3 × 4 - 1 = 2 + 12 - 1 = 13',
          timeLimit: 90,
          points: 1,
          topics: ['arithmetic', 'order-of-operations'],
          standards: ['3.OA.8', '4.OA.1'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'amc8_2023_2',
          source: 'AMC8',
          year: 2023,
          problemNumber: 2,
          category: 'geometry',
          difficulty: 2,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Area of Rectangle',
          statement: 'A rectangle has length 8 units and width 5 units. What is its area?',
          type: 'multiple-choice',
          choices: ['13 square units', '26 square units', '40 square units', '45 square units', '50 square units'],
          correctAnswer: '40 square units',
          explanation: 'Area of rectangle = length × width = 8 × 5 = 40 square units',
          timeLimit: 120,
          points: 1,
          topics: ['geometry', 'area', 'rectangles'],
          standards: ['3.MD.7', '4.MD.3'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'amc8_2023_3',
          source: 'AMC8',
          year: 2023,
          problemNumber: 3,
          category: 'algebra',
          difficulty: 2,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Simple Equations',
          statement: 'If x + 7 = 15, what is the value of x?',
          type: 'short-answer',
          correctAnswer: '8',
          explanation: 'Subtract 7 from both sides: x + 7 - 7 = 15 - 7, so x = 8',
          timeLimit: 150,
          points: 2,
          topics: ['algebra', 'equations', 'solving'],
          standards: ['4.OA.2', '5.OA.2'],
          createdAt: new Date().toISOString()
        }
      ];

      if (grade >= 4) {
        problems.push({
          id: 'amc8_2023_4',
          source: 'AMC8',
          year: 2023,
          problemNumber: 4,
          category: 'combinatorics',
          difficulty: 3,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Counting Arrangements',
          statement: 'How many different ways can you arrange the letters in the word "CAT"?',
          type: 'multiple-choice',
          choices: ['3', '4', '6', '8', '9'],
          correctAnswer: '6',
          explanation: 'The number of arrangements of 3 distinct letters is 3! = 3 × 2 × 1 = 6. The arrangements are: CAT, CTA, ACT, ATC, TCA, TAC.',
          timeLimit: 180,
          points: 3,
          topics: ['combinatorics', 'permutations', 'factorials'],
          standards: ['4.OA.5', '5.OA.2'],
          createdAt: new Date().toISOString()
        });
      }

      if (grade >= 5) {
        problems.push({
          id: 'amc8_2023_5',
          source: 'AMC8',
          year: 2023,
          problemNumber: 5,
          category: 'number-theory',
          difficulty: 3,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Prime Numbers',
          statement: 'What is the smallest prime number greater than 20?',
          type: 'numerical',
          correctAnswer: '23',
          explanation: 'Testing numbers: 21 = 3 × 7 (not prime), 22 = 2 × 11 (not prime), 23 has no factors other than 1 and 23, so 23 is prime.',
          timeLimit: 200,
          points: 3,
          topics: ['number-theory', 'primes', 'divisibility'],
          standards: ['5.OA.1', '6.NS.4'],
          createdAt: new Date().toISOString()
        });
      }

      await olympiadStorage.setItem(cacheKey, problems);
      return problems;

    } catch (error) {
      console.error('Error loading AMC 8 problems:', error);
      return [];
    }
  }

  // NSO (National Science Olympiad) inspired problems
  async getNSOProblems(grade: number, subject?: string): Promise<OlympiadProblem[]> {
    const cacheKey = `nso_problems_grade_${grade}_${subject || 'all'}`;
    
    try {
      const cached = await olympiadStorage.getItem<OlympiadProblem[]>(cacheKey);
      if (cached) return cached;

      const problems: OlympiadProblem[] = [
        {
          id: 'nso_2023_1',
          source: 'NSO',
          year: 2023,
          problemNumber: 1,
          category: 'physics',
          difficulty: 1,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'States of Matter',
          statement: 'Which of the following is an example of a liquid at room temperature?',
          type: 'multiple-choice',
          choices: ['Ice', 'Water', 'Steam', 'Wood', 'Rock'],
          correctAnswer: 'Water',
          explanation: 'At room temperature (around 20-25°C), water exists in liquid form. Ice is solid, steam is gas.',
          timeLimit: 60,
          points: 1,
          topics: ['states-of-matter', 'temperature', 'phase-changes'],
          standards: ['2-PS1-1', '5-PS1-2'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'nso_2023_2',
          source: 'NSO',
          year: 2023,
          problemNumber: 2,
          category: 'biology',
          difficulty: 2,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Plant Parts',
          statement: 'Which part of a plant is primarily responsible for making food through photosynthesis?',
          type: 'multiple-choice',
          choices: ['Roots', 'Stem', 'Leaves', 'Flowers', 'Seeds'],
          correctAnswer: 'Leaves',
          explanation: 'Leaves contain chlorophyll, which captures sunlight and converts it into food energy through photosynthesis.',
          timeLimit: 90,
          points: 1,
          topics: ['plants', 'photosynthesis', 'plant-parts'],
          standards: ['5-LS1-1', '5-PS3-1'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'nso_2023_3',
          source: 'NSO',
          year: 2023,
          problemNumber: 3,
          category: 'earth-science',
          difficulty: 2,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Weather Patterns',
          statement: 'What type of cloud is most likely to produce rain?',
          type: 'multiple-choice',
          choices: ['Cirrus', 'Cumulus', 'Cumulonimbus', 'Stratus', 'Contrails'],
          correctAnswer: 'Cumulonimbus',
          explanation: 'Cumulonimbus clouds are tall, dense clouds that often produce thunderstorms, heavy rain, and severe weather.',
          timeLimit: 120,
          points: 2,
          topics: ['weather', 'clouds', 'precipitation'],
          standards: ['2-ESS1-1', '5-ESS2-1'],
          createdAt: new Date().toISOString()
        }
      ];

      if (grade >= 4) {
        problems.push({
          id: 'nso_2023_4',
          source: 'NSO',
          year: 2023,
          problemNumber: 4,
          category: 'chemistry',
          difficulty: 3,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Chemical vs Physical Changes',
          statement: 'Which of the following is an example of a chemical change?',
          type: 'multiple-choice',
          choices: ['Melting ice', 'Cutting paper', 'Burning wood', 'Breaking glass', 'Dissolving salt'],
          correctAnswer: 'Burning wood',
          explanation: 'Burning wood creates new substances (ash, carbon dioxide, water vapor), making it a chemical change. The others are physical changes.',
          timeLimit: 150,
          points: 3,
          topics: ['chemical-changes', 'physical-changes', 'reactions'],
          standards: ['2-PS1-4', '5-PS1-4'],
          createdAt: new Date().toISOString()
        });
      }

      if (grade >= 5) {
        problems.push({
          id: 'nso_2023_5',
          source: 'NSO',
          year: 2023,
          problemNumber: 5,
          category: 'physics',
          difficulty: 4,
          grade: grade as 3 | 4 | 5 | 6,
          title: 'Simple Machines',
          statement: 'A lever has a fulcrum 2 meters from a 10 kg weight and 6 meters from where force is applied. How much force is needed to lift the weight? (Assume g = 10 m/s²)',
          type: 'numerical',
          correctAnswer: '33.3',
          explanation: 'Using the lever principle: Force × Distance = Weight × Distance. F × 6 = (10 × 10) × 2, so F = 200/6 = 33.3 N',
          timeLimit: 300,
          points: 4,
          topics: ['simple-machines', 'levers', 'force', 'physics-calculations'],
          standards: ['3-PS2-1', '5-PS2-1'],
          createdAt: new Date().toISOString()
        });
      }

      await olympiadStorage.setItem(cacheKey, problems);
      return problems;

    } catch (error) {
      console.error('Error loading NSO problems:', error);
      return [];
    }
  }

  // Create olympiad problem sets
  async createOlympiadSet(
    name: string, 
    category: 'math' | 'science', 
    grade: number, 
    problemCount: number = 10
  ): Promise<OlympiadSet> {
    let problems: OlympiadProblem[] = [];
    
    if (category === 'math') {
      problems = await this.getAMC8Problems(grade);
    } else {
      problems = await this.getNSOProblems(grade);
    }

    // Select problems based on grade and difficulty
    const selectedProblems = problems
      .filter(p => p.grade <= grade)
      .slice(0, problemCount);

    const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);
    const totalTime = selectedProblems.reduce((sum, p) => sum + p.timeLimit, 0);

    const olympiadSet: OlympiadSet = {
      id: `${category}_set_${grade}_${Date.now()}`,
      name,
      description: `${category === 'math' ? 'AMC 8' : 'NSO'} style problems for Grade ${grade}`,
      source: category === 'math' ? 'AMC8' : 'NSO',
      year: 2023,
      problems: selectedProblems,
      timeLimit: totalTime,
      totalPoints,
      grade,
      category
    };

    await olympiadStorage.setItem(olympiadSet.id, olympiadSet);
    return olympiadSet;
  }

  // Save user attempt
  async saveAttempt(attempt: OlympiadAttempt): Promise<void> {
    try {
      await progressStorage.setItem(attempt.id, attempt);
      
      // Update user progress
      await this.updateUserProgress(attempt);
    } catch (error) {
      console.error('Error saving olympiad attempt:', error);
    }
  }

  // Get user attempts
  async getUserAttempts(userId: string): Promise<OlympiadAttempt[]> {
    try {
      const allKeys = await progressStorage.keys();
      const attempts: OlympiadAttempt[] = [];
      
      for (const key of allKeys) {
        const attempt = await progressStorage.getItem<OlympiadAttempt>(key);
        if (attempt && attempt.userId === userId) {
          attempts.push(attempt);
        }
      }
      
      return attempts.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } catch (error) {
      console.error('Error getting user attempts:', error);
      return [];
    }
  }

  // Update user progress analytics
  private async updateUserProgress(attempt: OlympiadAttempt): Promise<void> {
    try {
      const progressKey = `progress_${attempt.userId}`;
      let progress = await progressStorage.getItem<UserOlympiadProgress>(progressKey) || {
        userId: attempt.userId,
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        completedSets: [],
        strengths: [],
        weaknesses: [],
        achievements: [],
        lastActivity: new Date().toISOString()
      };

      progress.totalAttempts++;
      progress.bestScore = Math.max(progress.bestScore, attempt.accuracy);
      progress.totalTimeSpent += attempt.timeSpent;
      progress.lastActivity = new Date().toISOString();

      if (attempt.completed && !progress.completedSets.includes(attempt.setId)) {
        progress.completedSets.push(attempt.setId);
      }

      // Calculate new average
      const allAttempts = await this.getUserAttempts(attempt.userId);
      const totalScore = allAttempts.reduce((sum, att) => sum + att.accuracy, 0);
      progress.averageScore = totalScore / allAttempts.length;

      await progressStorage.setItem(progressKey, progress);
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  // Get user progress
  async getUserProgress(userId: string): Promise<UserOlympiadProgress | null> {
    try {
      return await progressStorage.getItem(`progress_${userId}`);
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  // Get available olympiad sets
  async getAvailableSets(category?: 'math' | 'science', grade?: number): Promise<OlympiadSet[]> {
    try {
      const allKeys = await olympiadStorage.keys();
      const sets: OlympiadSet[] = [];
      
      for (const key of allKeys) {
        if (key.includes('_set_')) {
          const set = await olympiadStorage.getItem<OlympiadSet>(key);
          if (set && 
              (!category || set.category === category) && 
              (!grade || set.grade === grade)) {
            sets.push(set);
          }
        }
      }
      
      return sets;
    } catch (error) {
      console.error('Error getting available sets:', error);
      return [];
    }
  }
}

export const olympiadService = new OlympiadService();