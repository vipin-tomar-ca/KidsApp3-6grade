import axios from 'axios';
import localforage from 'localforage';

// Content types and interfaces
export interface LessonContent {
  id: string;
  title: string;
  subject: 'math' | 'english' | 'science' | 'social-studies';
  grade: 3 | 4 | 5 | 6;
  description: string;
  content: string;
  type: 'lesson' | 'exercise' | 'video' | 'interactive';
  difficulty: 'easy' | 'medium' | 'hard';
  standards: string[]; // Common Core standards
  duration: number; // in minutes
  prerequisites: string[];
  objectives: string[];
  keywords: string[];
  createdAt: string;
  lastUpdated: string;
  source: 'khan-academy' | 'ck12' | 'custom';
  quizzes?: Quiz[];
  activities?: Activity[];
}

export interface Quiz {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'fill-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  hints?: string[];
}

export interface Activity {
  id: string;
  type: 'drag-drop' | 'matching' | 'sorting' | 'interactive';
  title: string;
  instructions: string;
  items: ActivityItem[];
  correctOrder?: string[];
  correctPairs?: { [key: string]: string };
}

export interface ActivityItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'equation';
  category?: string;
}

export interface ContentFilter {
  grade?: number;
  subject?: string;
  difficulty?: string;
  standards?: string[];
  type?: string;
}

// Content storage configuration
const contentStorage = localforage.createInstance({
  name: 'EducationalContent',
  version: 1.0,
  storeName: 'lessons',
  description: 'Cached educational content for offline access'
});

const progressStorage = localforage.createInstance({
  name: 'LearningProgress',
  version: 1.0,
  storeName: 'progress',
  description: 'Student learning progress and quiz results'
});

// Khan Academy API integration (using their public content)
class KhanAcademyService {
  private baseURL = 'https://www.khanacademy.org/api/v1';
  
  async searchContent(query: string, grade: number): Promise<LessonContent[]> {
    try {
      // Khan Academy's public API endpoints for educational content
      const gradeMapping = {
        3: 'early-math',
        4: 'arithmetic',
        5: 'basic-geometry',
        6: 'algebra-basics'
      };
      
      const subject = gradeMapping[grade as keyof typeof gradeMapping] || 'arithmetic';
      
      // Simulate Khan Academy content structure
      const mockKhanContent: LessonContent[] = [
        {
          id: `khan_${grade}_math_1`,
          title: `Grade ${grade} Addition and Subtraction`,
          subject: 'math',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn basic addition and subtraction with visual examples',
          content: `<h2>Addition and Subtraction for Grade ${grade}</h2>
                   <p>Addition means putting numbers together to get a bigger number.</p>
                   <div class="example">
                     <h3>Example 1: Simple Addition</h3>
                     <p>2 + 3 = 5</p>
                     <p>Think of it as: 🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎</p>
                   </div>
                   <div class="example">
                     <h3>Example 2: Subtraction</h3>
                     <p>5 - 2 = 3</p>
                     <p>Start with 5 apples, take away 2, you have 3 left!</p>
                   </div>`,
          type: 'lesson',
          difficulty: grade <= 4 ? 'easy' : 'medium',
          standards: ['CCSS.MATH.CONTENT.3.OA.A.1', 'CCSS.MATH.CONTENT.3.OA.A.2'],
          duration: 15,
          prerequisites: [],
          objectives: [
            'Understand addition as putting together',
            'Understand subtraction as taking apart',
            'Solve addition and subtraction word problems'
          ],
          keywords: ['addition', 'subtraction', 'basic math', 'arithmetic'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: 'khan-academy',
          quizzes: [
            {
              id: 'quiz_1',
              type: 'multiple-choice',
              question: 'What is 4 + 3?',
              options: ['6', '7', '8', '5'],
              correctAnswer: 1,
              explanation: '4 + 3 = 7. When you add 4 and 3 together, you get 7!',
              points: 10,
              hints: ['Try counting: 4, 5, 6, 7', 'You can use your fingers to count!']
            }
          ]
        },
        {
          id: `khan_${grade}_math_2`,
          title: `Grade ${grade} Multiplication Fun`,
          subject: 'math',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Discover multiplication through groups and patterns',
          content: `<h2>Multiplication for Grade ${grade}</h2>
                   <p>Multiplication is adding the same number multiple times!</p>
                   <div class="example">
                     <h3>Example: 3 × 4</h3>
                     <p>This means 3 groups of 4, or 4 + 4 + 4 = 12</p>
                     <p>Visual: 🟦🟦🟦🟦  🟦🟦🟦🟦  🟦🟦🟦🟦</p>
                   </div>`,
          type: 'lesson',
          difficulty: grade <= 4 ? 'medium' : 'easy',
          standards: ['CCSS.MATH.CONTENT.3.OA.A.3', 'CCSS.MATH.CONTENT.3.OA.A.4'],
          duration: 20,
          prerequisites: ['addition'],
          objectives: [
            'Understand multiplication as repeated addition',
            'Recognize multiplication patterns',
            'Solve basic multiplication problems'
          ],
          keywords: ['multiplication', 'groups', 'times tables', 'patterns'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: 'khan-academy',
          quizzes: [
            {
              id: 'quiz_2',
              type: 'multiple-choice',
              question: 'What is 3 × 5?',
              options: ['12', '15', '18', '20'],
              correctAnswer: 1,
              explanation: '3 × 5 = 15. Think of it as 5 + 5 + 5 = 15!',
              points: 15
            }
          ]
        }
      ];
      
      return mockKhanContent;
    } catch (error) {
      console.error('Khan Academy API error:', error);
      return [];
    }
  }

  async getTopicsByGrade(grade: number): Promise<LessonContent[]> {
    return this.searchContent('', grade);
  }
}

// CK-12 FlexBooks integration
class CK12Service {
  private baseURL = 'https://www.ck12.org/api';
  
  async getFlexBookContent(subject: string, grade: number): Promise<LessonContent[]> {
    try {
      // Simulate CK-12 FlexBooks content
      const ck12Content: LessonContent[] = [
        {
          id: `ck12_${grade}_${subject}_1`,
          title: `Grade ${grade} Reading Comprehension`,
          subject: 'english',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Improve reading skills with engaging stories and exercises',
          content: `<h2>Reading Comprehension Skills</h2>
                   <div class="story">
                     <h3>The Little Garden</h3>
                     <p>Maya loved spending time in her grandmother's garden. Every morning, she would water the colorful flowers and vegetables. The tomatoes were growing big and red, and the sunflowers reached toward the sky.</p>
                     <p>One day, Maya noticed tiny green shoots in a corner of the garden. "What are those?" she asked her grandmother.</p>
                     <p>"Those are surprise plants," her grandmother smiled. "Sometimes seeds blow in from other gardens and create beautiful surprises!"</p>
                   </div>
                   <div class="comprehension">
                     <h3>Understanding the Story</h3>
                     <p>Good readers think about what they read. They ask questions and make connections.</p>
                   </div>`,
          type: 'lesson',
          difficulty: 'medium',
          standards: ['CCSS.ELA-LITERACY.RL.3.1', 'CCSS.ELA-LITERACY.RL.3.2'],
          duration: 25,
          prerequisites: [],
          objectives: [
            'Read and understand short stories',
            'Answer questions about the text',
            'Make connections between story events'
          ],
          keywords: ['reading', 'comprehension', 'story', 'understanding'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: 'ck12',
          quizzes: [
            {
              id: 'reading_quiz_1',
              type: 'multiple-choice',
              question: 'What did Maya do every morning?',
              options: [
                'Played with friends',
                'Watered the flowers and vegetables',
                'Read books',
                'Drew pictures'
              ],
              correctAnswer: 1,
              explanation: 'The story says Maya watered the colorful flowers and vegetables every morning.',
              points: 10
            }
          ]
        },
        {
          id: `ck12_${grade}_science_1`,
          title: `Grade ${grade} Plant Life Cycle`,
          subject: 'science',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Explore how plants grow from seeds to full-grown plants',
          content: `<h2>The Amazing Plant Life Cycle</h2>
                   <p>Plants go through different stages as they grow, just like people do!</p>
                   <div class="lifecycle-stage">
                     <h3>1. Seed Stage 🌱</h3>
                     <p>Every plant starts as a seed. Seeds contain everything a plant needs to begin growing!</p>
                   </div>
                   <div class="lifecycle-stage">
                     <h3>2. Sprouting 🌱</h3>
                     <p>When seeds get water and warmth, they begin to sprout. The first roots and shoots appear.</p>
                   </div>
                   <div class="lifecycle-stage">
                     <h3>3. Growing 🌿</h3>
                     <p>The plant develops leaves and stems. Leaves use sunlight to make food for the plant!</p>
                   </div>
                   <div class="lifecycle-stage">
                     <h3>4. Flowering 🌸</h3>
                     <p>Many plants grow flowers. Flowers help plants make new seeds.</p>
                   </div>`,
          type: 'lesson',
          difficulty: 'easy',
          standards: ['NGSS.3-LS1-1', 'NGSS.5-LS1-1'],
          duration: 20,
          prerequisites: [],
          objectives: [
            'Identify stages of plant growth',
            'Understand what plants need to grow',
            'Explain the plant life cycle'
          ],
          keywords: ['plants', 'life cycle', 'seeds', 'growth', 'science'],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: 'ck12',
          activities: [
            {
              id: 'plant_ordering',
              type: 'drag-drop',
              title: 'Plant Life Cycle Order',
              instructions: 'Drag the stages into the correct order of plant growth',
              items: [
                { id: 'seed', content: '🌰 Seed', type: 'text' },
                { id: 'sprout', content: '🌱 Sprouting', type: 'text' },
                { id: 'growing', content: '🌿 Growing', type: 'text' },
                { id: 'flower', content: '🌸 Flowering', type: 'text' }
              ],
              correctOrder: ['seed', 'sprout', 'growing', 'flower']
            }
          ]
        }
      ];
      
      return ck12Content.filter(content => 
        content.subject === subject || subject === 'all'
      );
    } catch (error) {
      console.error('CK-12 API error:', error);
      return [];
    }
  }
}

// Main Content Service
export class ContentService {
  private khan = new KhanAcademyService();
  private ck12 = new CK12Service();
  
  async loadContentByGradeAndSubject(
    grade: number, 
    subject: string
  ): Promise<LessonContent[]> {
    const cacheKey = `content_${grade}_${subject}`;
    
    try {
      // Try to load from cache first
      const cachedContent = await contentStorage.getItem<LessonContent[]>(cacheKey);
      if (cachedContent && cachedContent.length > 0) {
        console.log(`Loaded ${cachedContent.length} cached lessons for grade ${grade} ${subject}`);
        return cachedContent;
      }
      
      // Fetch from APIs
      let content: LessonContent[] = [];
      
      if (subject === 'math' || subject === 'science') {
        const khanContent = await this.khan.getTopicsByGrade(grade);
        content = [...content, ...khanContent.filter(c => c.subject === subject)];
      }
      
      if (subject === 'english' || subject === 'social-studies' || subject === 'science') {
        const ck12Content = await this.ck12.getFlexBookContent(subject, grade);
        content = [...content, ...ck12Content];
      }
      
      // Cache the content
      if (content.length > 0) {
        await contentStorage.setItem(cacheKey, content);
        console.log(`Cached ${content.length} lessons for grade ${grade} ${subject}`);
      }
      
      return content;
    } catch (error) {
      console.error('Content loading error:', error);
      return [];
    }
  }
  
  async searchContent(filters: ContentFilter): Promise<LessonContent[]> {
    const { grade, subject, difficulty, type } = filters;
    
    let allContent: LessonContent[] = [];
    
    if (grade && subject) {
      allContent = await this.loadContentByGradeAndSubject(grade, subject);
    } else {
      // Load content for all subjects if no specific subject
      const subjects = ['math', 'english', 'science', 'social-studies'];
      for (const subj of subjects) {
        if (!subject || subject === subj) {
          const content = await this.loadContentByGradeAndSubject(grade || 3, subj);
          allContent = [...allContent, ...content];
        }
      }
    }
    
    // Apply filters
    return allContent.filter(content => {
      if (difficulty && content.difficulty !== difficulty) return false;
      if (type && content.type !== type) return false;
      return true;
    });
  }
  
  async getLessonById(id: string): Promise<LessonContent | null> {
    try {
      // Search through all cached content
      const grades = [3, 4, 5, 6];
      const subjects = ['math', 'english', 'science', 'social-studies'];
      
      for (const grade of grades) {
        for (const subject of subjects) {
          const content = await this.loadContentByGradeAndSubject(grade, subject);
          const lesson = content.find(c => c.id === id);
          if (lesson) return lesson;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting lesson by ID:', error);
      return null;
    }
  }
  
  async saveProgress(lessonId: string, score: number, timeSpent: number): Promise<void> {
    try {
      const progressKey = `progress_${lessonId}`;
      const progress = {
        lessonId,
        score,
        timeSpent,
        completedAt: new Date().toISOString(),
        attempts: 1
      };
      
      const existingProgress = await progressStorage.getItem(progressKey);
      if (existingProgress) {
        // @ts-ignore
        progress.attempts = existingProgress.attempts + 1;
      }
      
      await progressStorage.setItem(progressKey, progress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }
  
  async getProgress(lessonId: string): Promise<any> {
    try {
      return await progressStorage.getItem(`progress_${lessonId}`);
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }
  
  async clearCache(): Promise<void> {
    try {
      await contentStorage.clear();
      console.log('Content cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const contentService = new ContentService();