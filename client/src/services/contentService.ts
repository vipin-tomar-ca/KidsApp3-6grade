import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import localforage from 'localforage';

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'english' | 'science' | 'art' | 'music';
  grade: number;
  source: 'khan-academy' | 'ck12' | 'olympiad' | 'internal';
  contentType: 'video' | 'interactive' | 'quiz' | 'worksheet' | 'game';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  prerequisites: string[]; // lesson IDs
  learningObjectives: string[];
  content: {
    videoUrl?: string;
    interactiveUrl?: string;
    worksheetData?: any;
    quizQuestions?: any[];
    gameData?: any;
  };
  tags: string[];
  ageAppropriate: boolean;
  coppaCompliant: boolean;
  lastUpdated: Timestamp;
  version: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  subject: string;
  grade: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  progressPercentage: number;
  timeSpent: number; // in minutes
  attemptsCount: number;
  lastAccessed: Timestamp;
  scores: {
    quizScore?: number;
    comprehensionScore?: number;
    completionScore?: number;
  };
  parentalConsentGiven: boolean;
  canSyncToCloud: boolean;
  localOnly: boolean;
}

export interface ContentUpdate {
  id: string;
  lessonId: string;
  updateType: 'content' | 'metadata' | 'structure';
  changeDescription: string;
  previousVersion: string;
  newVersion: string;
  appliedAt: Timestamp;
  approvedBy: string; // educator/moderator ID
}

class ContentService {
  private offlineStorage = localforage.createInstance({
    name: 'ContentCache',
    version: 1.0,
    size: 50 * 1024 * 1024, // 50MB
    storeName: 'lessons',
    description: 'Offline lesson content cache'
  });

  private progressStorage = localforage.createInstance({
    name: 'ProgressCache', 
    version: 1.0,
    size: 10 * 1024 * 1024, // 10MB
    storeName: 'progress',
    description: 'User progress cache'
  });

  // Content Management Methods
  async getLessonsByGradeAndSubject(
    grade: number, 
    subject: string, 
    useCache: boolean = true
  ): Promise<LessonContent[]> {
    const cacheKey = `lessons_${grade}_${subject}`;
    
    // Try cache first if requested
    if (useCache) {
      try {
        const cached = await this.offlineStorage.getItem<LessonContent[]>(cacheKey);
        if (cached && cached.length > 0) {
          console.log(`Loaded ${cached.length} lessons from cache for grade ${grade} ${subject}`);
          return cached;
        }
      } catch (error) {
        console.log('Cache miss, fetching from Firebase:', error);
      }
    }

    try {
      // Fetch from Firebase
      const lessonsRef = collection(db, 'lessons');
      const q = query(
        lessonsRef,
        where('grade', '==', grade),
        where('subject', '==', subject),
        where('ageAppropriate', '==', true),
        where('coppaCompliant', '==', true),
        orderBy('difficulty'),
        orderBy('title')
      );

      const snapshot = await getDocs(q);
      const lessons: LessonContent[] = [];

      snapshot.forEach((doc) => {
        lessons.push({
          id: doc.id,
          ...doc.data()
        } as LessonContent);
      });

      // Cache the results
      await this.offlineStorage.setItem(cacheKey, lessons);
      console.log(`Fetched and cached ${lessons.length} lessons from Firebase`);
      
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons from Firebase:', error);
      
      // Fallback to cache if Firebase fails
      try {
        const cached = await this.offlineStorage.getItem<LessonContent[]>(cacheKey);
        if (cached) {
          console.log('Using cached lessons due to Firebase error');
          return cached;
        }
      } catch (cacheError) {
        console.error('Cache also failed:', cacheError);
      }
      
      return [];
    }
  }

  async getLessonById(lessonId: string, useCache: boolean = true): Promise<LessonContent | null> {
    const cacheKey = `lesson_${lessonId}`;
    
    // Try cache first
    if (useCache) {
      try {
        const cached = await this.offlineStorage.getItem<LessonContent>(cacheKey);
        if (cached) {
          return cached;
        }
      } catch (error) {
        console.log('Cache miss for lesson:', error);
      }
    }

    try {
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);
      
      if (lessonSnap.exists()) {
        const lesson = {
          id: lessonSnap.id,
          ...lessonSnap.data()
        } as LessonContent;
        
        // Cache the lesson
        await this.offlineStorage.setItem(cacheKey, lesson);
        return lesson;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      
      // Fallback to cache
      try {
        const cached = await this.offlineStorage.getItem<LessonContent>(cacheKey);
        return cached || null;
      } catch (cacheError) {
        return null;
      }
    }
  }

  async searchLessons(
    searchQuery: string,
    grade?: number,
    subject?: string,
    limit_count: number = 20
  ): Promise<LessonContent[]> {
    try {
      let q = query(
        collection(db, 'lessons'),
        where('ageAppropriate', '==', true),
        where('coppaCompliant', '==', true)
      );

      if (grade) {
        q = query(q, where('grade', '==', grade));
      }
      
      if (subject) {
        q = query(q, where('subject', '==', subject));
      }

      // Add search by tags (Firestore array-contains for basic search)
      if (searchQuery) {
        q = query(q, where('tags', 'array-contains-any', [searchQuery.toLowerCase()]));
      }

      q = query(q, limit(limit_count));

      const snapshot = await getDocs(q);
      const results: LessonContent[] = [];

      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data()
        } as LessonContent);
      });

      return results;
    } catch (error) {
      console.error('Error searching lessons:', error);
      return [];
    }
  }

  // Progress Syncing Methods
  async syncUserProgress(
    userId: string, 
    parentalConsentGiven: boolean = false
  ): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;

    try {
      // Get all cached progress
      const keys = await this.progressStorage.keys();
      const userProgressKeys = keys.filter(key => key.startsWith(`progress_${userId}_`));

      for (const key of userProgressKeys) {
        try {
          const progress = await this.progressStorage.getItem<UserProgress>(key);
          
          if (!progress) continue;

          // Only sync if parental consent is given or data can be synced to cloud
          if (!parentalConsentGiven && !progress.canSyncToCloud) {
            console.log(`Skipping sync for ${key} - no parental consent`);
            continue;
          }

          // Update consent status
          progress.parentalConsentGiven = parentalConsentGiven;
          progress.canSyncToCloud = parentalConsentGiven;
          progress.localOnly = !parentalConsentGiven;

          // Sync to Firebase
          await this.saveProgressToFirebase(progress);
          synced++;
          
        } catch (error) {
          console.error(`Error syncing progress ${key}:`, error);
          errors++;
        }
      }

      console.log(`Progress sync completed: ${synced} synced, ${errors} errors`);
      return { synced, errors };
    } catch (error) {
      console.error('Error during progress sync:', error);
      return { synced: 0, errors: 1 };
    }
  }

  async updateUserProgress(
    userId: string,
    lessonId: string,
    progressUpdate: Partial<UserProgress>,
    parentalConsentGiven: boolean = false
  ): Promise<void> {
    const progressKey = `progress_${userId}_${lessonId}`;
    
    try {
      // Get existing progress or create new
      let existingProgress = await this.progressStorage.getItem<UserProgress>(progressKey);
      
      const updatedProgress: UserProgress = {
        id: existingProgress?.id || `${userId}_${lessonId}`,
        userId,
        lessonId,
        subject: progressUpdate.subject || existingProgress?.subject || 'unknown',
        grade: progressUpdate.grade || existingProgress?.grade || 3,
        status: progressUpdate.status || existingProgress?.status || 'not-started',
        progressPercentage: progressUpdate.progressPercentage || existingProgress?.progressPercentage || 0,
        timeSpent: (existingProgress?.timeSpent || 0) + (progressUpdate.timeSpent || 0),
        attemptsCount: (existingProgress?.attemptsCount || 0) + 1,
        lastAccessed: Timestamp.now(),
        scores: {
          ...existingProgress?.scores,
          ...progressUpdate.scores
        },
        parentalConsentGiven,
        canSyncToCloud: parentalConsentGiven,
        localOnly: !parentalConsentGiven
      };

      // Always save to local cache
      await this.progressStorage.setItem(progressKey, updatedProgress);

      // Sync to Firebase if consent given
      if (parentalConsentGiven) {
        await this.saveProgressToFirebase(updatedProgress);
      }

    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  private async saveProgressToFirebase(progress: UserProgress): Promise<void> {
    try {
      const progressRef = doc(db, 'userProgress', progress.id);
      await updateDoc(progressRef, {
        ...progress,
        lastSynced: Timestamp.now()
      });
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, 'userProgress'), {
          ...progress,
          lastSynced: Timestamp.now()
        });
      } catch (createError) {
        console.error('Error creating progress document:', createError);
        throw createError;
      }
    }
  }

  async getUserProgress(
    userId: string, 
    lessonId?: string
  ): Promise<UserProgress[]> {
    const results: UserProgress[] = [];

    try {
      // Get from local cache first
      const keys = await this.progressStorage.keys();
      const userKeys = lessonId 
        ? [`progress_${userId}_${lessonId}`]
        : keys.filter(key => key.startsWith(`progress_${userId}_`));

      for (const key of userKeys) {
        const progress = await this.progressStorage.getItem<UserProgress>(key);
        if (progress) {
          results.push(progress);
        }
      }

      // Try to get from Firebase if parental consent exists
      try {
        let q = query(
          collection(db, 'userProgress'),
          where('userId', '==', userId),
          where('parentalConsentGiven', '==', true)
        );

        if (lessonId) {
          q = query(q, where('lessonId', '==', lessonId));
        }

        const snapshot = await getDocs(q);
        
        snapshot.forEach((doc) => {
          const firebaseProgress = {
            id: doc.id,
            ...doc.data()
          } as UserProgress;

          // Update local cache with Firebase data
          const progressKey = `progress_${firebaseProgress.userId}_${firebaseProgress.lessonId}`;
          this.progressStorage.setItem(progressKey, firebaseProgress);

          // Add to results if not already present
          const exists = results.find(p => p.id === firebaseProgress.id);
          if (!exists) {
            results.push(firebaseProgress);
          }
        });
      } catch (firebaseError) {
        console.log('Could not fetch from Firebase (possibly no consent):', firebaseError);
      }

      return results;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return results;
    }
  }

  // Content Update Management
  async checkForContentUpdates(): Promise<ContentUpdate[]> {
    try {
      const updatesRef = collection(db, 'contentUpdates');
      const q = query(
        updatesRef,
        orderBy('appliedAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const updates: ContentUpdate[] = [];

      snapshot.forEach((doc) => {
        updates.push({
          id: doc.id,
          ...doc.data()
        } as ContentUpdate);
      });

      return updates;
    } catch (error) {
      console.error('Error checking for content updates:', error);
      return [];
    }
  }

  async applyContentUpdates(updates: ContentUpdate[]): Promise<void> {
    const batch = writeBatch(db);
    
    try {
      for (const update of updates) {
        // Clear relevant cache entries
        const cachePattern = update.lessonId;
        const keys = await this.offlineStorage.keys();
        
        for (const key of keys) {
          if (key.includes(cachePattern)) {
            await this.offlineStorage.removeItem(key);
          }
        }

        // Mark update as applied
        const updateRef = doc(db, 'contentUpdates', update.id);
        batch.update(updateRef, { applied: true, appliedAt: Timestamp.now() });
      }

      await batch.commit();
      console.log(`Applied ${updates.length} content updates`);
    } catch (error) {
      console.error('Error applying content updates:', error);
    }
  }

  // Cache Management
  async clearCache(): Promise<void> {
    try {
      await this.offlineStorage.clear();
      await this.progressStorage.clear();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getCacheSize(): Promise<{ content: number; progress: number }> {
    try {
      const contentKeys = await this.offlineStorage.keys();
      const progressKeys = await this.progressStorage.keys();
      
      return {
        content: contentKeys.length,
        progress: progressKeys.length
      };
    } catch (error) {
      console.error('Error getting cache size:', error);
      return { content: 0, progress: 0 };
    }
  }

  // COPPA Compliance Methods
  async deleteUserData(userId: string): Promise<void> {
    try {
      // Delete from local storage
      const keys = await this.progressStorage.keys();
      const userKeys = keys.filter(key => key.includes(userId));
      
      for (const key of userKeys) {
        await this.progressStorage.removeItem(key);
      }

      // Delete from Firebase if exists
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(progressQuery);
      const batch = writeBatch(db);
      
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted all data for user ${userId}`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }

  async exportUserData(userId: string): Promise<any> {
    try {
      const progress = await this.getUserProgress(userId);
      
      return {
        userId,
        exportDate: new Date().toISOString(),
        progressData: progress,
        dataPolicy: 'COPPA compliant - only educational progress data stored'
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }
}

export const contentService = new ContentService();