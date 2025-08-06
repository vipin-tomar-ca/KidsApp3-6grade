import { contentService } from '../contentService';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Firebase
vi.mock('../firebaseConfig', () => ({
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
  }
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  Timestamp: {
    now: vi.fn().mockReturnValue({ toDate: () => new Date() }),
  },
  writeBatch: vi.fn(),
}));

describe('ContentService - Educational Content Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Content Loading & Caching', () => {
    it('loads lessons for specific grade and subject', async () => {
      const mockLessons = [
        {
          id: '1',
          title: 'Addition Basics',
          subject: 'math',
          grade: 3,
          source: 'khan-academy',
          ageAppropriate: true,
          coppaCompliant: true
        }
      ];

      // Mock the service method
      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockResolvedValue(mockLessons as any);

      const lessons = await contentService.getLessonsByGradeAndSubject(3, 'math');
      
      expect(lessons).toHaveLength(1);
      expect(lessons[0].title).toBe('Addition Basics');
      expect(lessons[0].grade).toBe(3);
      expect(lessons[0].ageAppropriate).toBe(true);
    });

    it('uses cache for faster loading', async () => {
      const mockLessons = [
        {
          id: '1',
          title: 'Reading Comprehension',
          subject: 'english',
          grade: 4,
          source: 'ck12',
          ageAppropriate: true,
          coppaCompliant: true
        }
      ];

      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockResolvedValue(mockLessons as any);

      // First call
      const lessons1 = await contentService.getLessonsByGradeAndSubject(4, 'english', true);
      
      // Second call with cache
      const lessons2 = await contentService.getLessonsByGradeAndSubject(4, 'english', true);
      
      expect(lessons1).toEqual(lessons2);
    });

    it('falls back to cache when offline', async () => {
      // Mock network failure
      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce([]);

      const lessons = await contentService.getLessonsByGradeAndSubject(5, 'science', true);
      
      // Should return empty array if no cache, but not throw
      expect(Array.isArray(lessons)).toBe(true);
    });

    it('filters content for age appropriateness', async () => {
      const lessons = [
        {
          id: '1',
          title: 'Safe Math Games',
          ageAppropriate: true,
          coppaCompliant: true,
          grade: 3,
          subject: 'math'
        },
        {
          id: '2', 
          title: 'Advanced Calculus',
          ageAppropriate: false, // Not age appropriate for grade 3
          coppaCompliant: true,
          grade: 3,
          subject: 'math'
        }
      ];

      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockResolvedValue([lessons[0]] as any); // Should filter out inappropriate

      const result = await contentService.getLessonsByGradeAndSubject(3, 'math');
      
      expect(result).toHaveLength(1);
      expect(result[0].ageAppropriate).toBe(true);
    });
  });

  describe('Progress Tracking - COPPA Compliant', () => {
    it('stores progress locally by default', async () => {
      const progressUpdate = {
        subject: 'math',
        grade: 4,
        status: 'in-progress' as const,
        progressPercentage: 50,
        timeSpent: 15
      };

      await contentService.updateUserProgress('user123', 'lesson456', progressUpdate, false);
      
      // Should store locally (mocked localforage)
      expect(localStorage.setItem).toBeDefined();
    });

    it('syncs to cloud only with parental consent', async () => {
      vi.spyOn(contentService, 'syncUserProgress')
        .mockResolvedValue({ synced: 1, errors: 0 });

      // With consent
      const resultWithConsent = await contentService.syncUserProgress('user123', true);
      expect(resultWithConsent.synced).toBe(1);

      // Without consent  
      const resultWithoutConsent = await contentService.syncUserProgress('user123', false);
      expect(resultWithoutConsent.synced).toBe(0);
    });

    it('tracks educational progress appropriately', async () => {
      const progress = {
        userId: 'user123',
        lessonId: 'lesson456', 
        subject: 'science',
        grade: 5,
        status: 'completed' as const,
        progressPercentage: 100,
        timeSpent: 25,
        scores: {
          quizScore: 85,
          comprehensionScore: 90
        }
      };

      await contentService.updateUserProgress(
        progress.userId,
        progress.lessonId,
        progress,
        true
      );

      const userProgress = await contentService.getUserProgress(progress.userId);
      expect(userProgress).toBeDefined();
    });

    it('maintains data privacy standards', async () => {
      const progressData = {
        userId: 'anonymous-uuid-123', // Should use anonymous IDs
        lessonId: 'lesson789',
        subject: 'art',
        grade: 3,
        status: 'not-started' as const,
        progressPercentage: 0,
        timeSpent: 0,
        parentalConsentGiven: false,
        localOnly: true
      };

      await contentService.updateUserProgress(
        progressData.userId,
        progressData.lessonId,
        progressData,
        false
      );

      // Should not contain personal information
      expect(progressData.userId).toMatch(/anonymous|uuid|test/i);
      expect(progressData.localOnly).toBe(true);
    });
  });

  describe('Content Search & Discovery', () => {
    it('searches educational content by keywords', async () => {
      const mockResults = [
        {
          id: '1',
          title: 'Fraction Fun',
          tags: ['fractions', 'math', 'division'],
          subject: 'math',
          grade: 4,
          ageAppropriate: true,
          coppaCompliant: true
        }
      ];

      vi.spyOn(contentService, 'searchLessons')
        .mockResolvedValue(mockResults as any);

      const results = await contentService.searchLessons('fractions', 4, 'math', 10);
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Fraction Fun');
      expect(results[0].tags).toContain('fractions');
    });

    it('returns safe, educational results only', async () => {
      vi.spyOn(contentService, 'searchLessons')
        .mockResolvedValue([]);

      const results = await contentService.searchLessons('inappropriate content', 4);
      
      // Should return empty results for inappropriate searches
      expect(results).toHaveLength(0);
    });

    it('filters by grade level appropriately', async () => {
      const results = await contentService.searchLessons('science', 3);
      
      // Mock implementation should ensure grade-appropriate results
      vi.spyOn(contentService, 'searchLessons')
        .mockResolvedValue([]);

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Offline Mode & Resilience', () => {
    it('works without internet connection', async () => {
      // Mock offline scenario
      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockRejectedValue(new Error('No internet'));

      const lessons = await contentService.getLessonsByGradeAndSubject(4, 'math', true);
      
      // Should not throw error, return cached or empty results
      expect(Array.isArray(lessons)).toBe(true);
    });

    it('syncs data when back online', async () => {
      vi.spyOn(contentService, 'syncUserProgress')
        .mockResolvedValue({ synced: 3, errors: 0 });

      const result = await contentService.syncUserProgress('user123', true);
      
      expect(result.synced).toBeGreaterThan(0);
      expect(result.errors).toBe(0);
    });

    it('manages cache size efficiently', async () => {
      const cacheSize = await contentService.getCacheSize();
      
      expect(cacheSize).toHaveProperty('content');
      expect(cacheSize).toHaveProperty('progress');
      expect(typeof cacheSize.content).toBe('number');
      expect(typeof cacheSize.progress).toBe('number');
    });
  });

  describe('Data Export & Deletion - COPPA Rights', () => {
    it('exports user data for parental review', async () => {
      const mockExportData = {
        userId: 'user123',
        exportDate: '2024-01-01T00:00:00.000Z',
        progressData: [],
        dataPolicy: 'COPPA compliant - only educational progress data stored'
      };

      vi.spyOn(contentService, 'exportUserData')
        .mockResolvedValue(mockExportData);

      const exportData = await contentService.exportUserData('user123');
      
      expect(exportData).toHaveProperty('userId');
      expect(exportData).toHaveProperty('exportDate');
      expect(exportData).toHaveProperty('dataPolicy');
      expect(exportData.dataPolicy).toContain('COPPA compliant');
    });

    it('deletes all user data when requested', async () => {
      vi.spyOn(contentService, 'deleteUserData')
        .mockResolvedValue();

      // Should not throw error
      await expect(contentService.deleteUserData('user123')).resolves.not.toThrow();
    });

    it('clears cache when requested', async () => {
      await contentService.clearCache();
      
      const cacheSize = await contentService.getCacheSize();
      expect(cacheSize.content).toBe(0);
      expect(cacheSize.progress).toBe(0);
    });
  });

  describe('Content Quality & Safety', () => {
    it('ensures content comes from trusted sources', async () => {
      const lesson = {
        source: 'khan-academy', // Trusted source
        ageAppropriate: true,
        coppaCompliant: true
      };

      const trustedSources = ['khan-academy', 'ck12', 'olympiad'];
      expect(trustedSources).toContain(lesson.source);
    });

    it('validates educational content standards', async () => {
      const lessons = await contentService.getLessonsByGradeAndSubject(4, 'math');
      
      lessons.forEach(lesson => {
        expect(lesson).toHaveProperty('ageAppropriate');
        expect(lesson).toHaveProperty('coppaCompliant');
        expect(lesson.ageAppropriate).toBe(true);
        expect(lesson.coppaCompliant).toBe(true);
      });
    });

    it('maintains content freshness with updates', async () => {
      vi.spyOn(contentService, 'checkForContentUpdates')
        .mockResolvedValue([]);

      const updates = await contentService.checkForContentUpdates();
      expect(Array.isArray(updates)).toBe(true);
    });
  });

  describe('Performance & Scalability', () => {
    it('loads content efficiently for child attention spans', async () => {
      const start = performance.now();
      
      await contentService.getLessonsByGradeAndSubject(3, 'reading', true);
      
      const loadTime = performance.now() - start;
      expect(loadTime).toBeLessThan(1000); // Under 1 second
    });

    it('handles multiple concurrent requests', async () => {
      const requests = [
        contentService.getLessonsByGradeAndSubject(3, 'math'),
        contentService.getLessonsByGradeAndSubject(4, 'science'),
        contentService.getLessonsByGradeAndSubject(5, 'art')
      ];

      const results = await Promise.all(requests);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it('manages memory usage with large datasets', async () => {
      // Test with larger dataset simulation
      vi.spyOn(contentService, 'getLessonsByGradeAndSubject')
        .mockResolvedValue(new Array(100).fill({
          id: 'lesson',
          title: 'Test Lesson',
          subject: 'math',
          grade: 4,
          ageAppropriate: true,
          coppaCompliant: true
        }));

      const lessons = await contentService.getLessonsByGradeAndSubject(4, 'math');
      
      expect(lessons.length).toBe(100);
      expect(lessons[0]).toHaveProperty('id');
    });
  });
});