import localforage from 'localforage';
import bcrypt from 'bcryptjs';

// Child Safety and COPPA/GDPR-K Compliance Service
export interface AnonymizedUser {
  id: string; // UUID v4, no PII
  grade: number;
  createdAt: string;
  lastActivity: string;
  preferences: {
    theme: 'light' | 'dark' | 'high-contrast';
    audioEnabled: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface SessionData {
  userId: string;
  sessionStart: string;
  sessionEnd?: string;
  totalTimeSpent: number; // minutes
  activitiesCompleted: string[];
  subjectsAccessed: string[];
}

export interface ParentalSettings {
  dailyTimeLimit: number; // minutes
  allowedSubjects: string[];
  contentApprovalRequired: boolean;
  restrictedHours: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  blockedTopics: string[];
  reportFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  source: string;
  grade: number;
  subject: string;
  topics: string[];
  approved: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  educationalValue: number; // 1-5 rating
}

export interface ParentalReport {
  userId: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  totalScreenTime: number;
  activitiesCompleted: number;
  subjectsExplored: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  safetyEvents: string[];
}

// Storage configuration for compliance
const parentalStorage = localforage.createInstance({
  name: 'ParentalControls',
  version: 1.0,
  storeName: 'settings',
  description: 'Parental dashboard settings and authentication'
});

const sessionStorage = localforage.createInstance({
  name: 'UserSessions',
  version: 1.0,
  storeName: 'sessions',
  description: 'Anonymous user session tracking'
});

const contentStorage = localforage.createInstance({
  name: 'ContentModeration',
  version: 1.0,
  storeName: 'content',
  description: 'Moderated educational content'
});

// Predefined educational topic whitelist for content moderation
const EDUCATIONAL_WHITELIST = {
  math: [
    'addition', 'subtraction', 'multiplication', 'division',
    'fractions', 'decimals', 'geometry', 'algebra basics',
    'number patterns', 'time and money', 'measurement',
    'data and graphs', 'problem solving', 'mental math'
  ],
  science: [
    'animals and plants', 'human body', 'weather and climate',
    'earth and space', 'matter and materials', 'forces and motion',
    'light and sound', 'simple machines', 'ecosystems',
    'scientific method', 'safety rules', 'environmental science'
  ],
  english: [
    'phonics', 'reading comprehension', 'vocabulary',
    'grammar basics', 'creative writing', 'poetry',
    'story elements', 'spelling', 'punctuation',
    'research skills', 'public speaking', 'literary devices'
  ],
  'social-studies': [
    'community helpers', 'geography basics', 'historical figures',
    'cultures and traditions', 'government basics', 'economics basics',
    'maps and globes', 'citizenship', 'holidays and celebrations',
    'family history', 'local history', 'world cultures'
  ],
  art: [
    'drawing techniques', 'color theory', 'art history basics',
    'craft projects', 'sculpture basics', 'digital art',
    'art appreciation', 'famous artists', 'art tools and materials',
    'creative expression', 'art styles', 'cultural art'
  ],
  music: [
    'rhythm and beat', 'musical instruments', 'singing',
    'music notation basics', 'composers and musicians',
    'musical styles', 'listening skills', 'music theory basics',
    'sound and pitch', 'music appreciation', 'cultural music',
    'music creation'
  ]
};

// Blocked content categories (COPPA compliance)
const BLOCKED_CATEGORIES = [
  'personal information collection',
  'social media integration',
  'chat features',
  'location services',
  'advertising content',
  'commercial transactions',
  'user-generated content sharing',
  'external links without approval',
  'mature themes',
  'violence or scary content'
];

class ChildSafetyService {
  private currentSessionId: string | null = null;

  // Parental Authentication
  async setupParentalPassword(password: string): Promise<boolean> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      await parentalStorage.setItem('parental_auth', {
        passwordHash: hashedPassword,
        setupDate: new Date().toISOString(),
        lastLogin: null
      });
      
      return true;
    } catch (error) {
      console.error('Error setting up parental password:', error);
      return false;
    }
  }

  async verifyParentalPassword(password: string): Promise<boolean> {
    try {
      const authData = await parentalStorage.getItem<{
        passwordHash: string;
        setupDate: string;
        lastLogin: string | null;
      }>('parental_auth');
      
      if (!authData) return false;

      const isValid = await bcrypt.compare(password, authData.passwordHash);
      
      if (isValid) {
        await parentalStorage.setItem('parental_auth', {
          ...authData,
          lastLogin: new Date().toISOString()
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying parental password:', error);
      return false;
    }
  }

  async isParentalPasswordSet(): Promise<boolean> {
    try {
      const authData = await parentalStorage.getItem('parental_auth');
      return authData !== null;
    } catch (error) {
      console.error('Error checking parental password:', error);
      return false;
    }
  }

  // Anonymized User Management (GDPR-K Compliance)
  generateAnonymousUserId(): string {
    // Generate UUID v4 without any PII
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  async createAnonymizedUser(grade: number): Promise<AnonymizedUser> {
    const user: AnonymizedUser = {
      id: this.generateAnonymousUserId(),
      grade,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      preferences: {
        theme: 'light',
        audioEnabled: true,
        reducedMotion: false,
        fontSize: 'medium'
      }
    };

    await sessionStorage.setItem(`user_${user.id}`, user);
    await sessionStorage.setItem('current_user_id', user.id);
    
    return user;
  }

  async getCurrentUser(): Promise<AnonymizedUser | null> {
    try {
      const currentUserId = await sessionStorage.getItem<string>('current_user_id');
      if (!currentUserId) return null;
      
      return await sessionStorage.getItem<AnonymizedUser>(`user_${currentUserId}`);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async updateUserActivity(userId: string): Promise<void> {
    try {
      const user = await sessionStorage.getItem<AnonymizedUser>(`user_${userId}`);
      if (user) {
        user.lastActivity = new Date().toISOString();
        await sessionStorage.setItem(`user_${userId}`, user);
      }
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  }

  // Session Management with Time Limits
  async startSession(userId: string): Promise<SessionData> {
    const session: SessionData = {
      userId,
      sessionStart: new Date().toISOString(),
      totalTimeSpent: 0,
      activitiesCompleted: [],
      subjectsAccessed: []
    };

    this.currentSessionId = `session_${userId}_${Date.now()}`;
    await sessionStorage.setItem(this.currentSessionId, session);
    
    return session;
  }

  async endSession(): Promise<SessionData | null> {
    if (!this.currentSessionId) return null;

    try {
      const session = await sessionStorage.getItem<SessionData>(this.currentSessionId);
      if (session) {
        session.sessionEnd = new Date().toISOString();
        session.totalTimeSpent = Math.floor(
          (new Date(session.sessionEnd).getTime() - new Date(session.sessionStart).getTime()) / (1000 * 60)
        );
        
        await sessionStorage.setItem(this.currentSessionId, session);
        this.currentSessionId = null;
        
        return session;
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
    
    return null;
  }

  async getCurrentSession(): Promise<SessionData | null> {
    if (!this.currentSessionId) return null;
    
    try {
      return await sessionStorage.getItem<SessionData>(this.currentSessionId);
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  async getTodaySessionTime(userId: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const allKeys = await sessionStorage.keys();
      const userSessionKeys = allKeys.filter(key => 
        key.startsWith(`session_${userId}`) && 
        key.includes(today.replace(/-/g, ''))
      );
      
      let totalTime = 0;
      for (const key of userSessionKeys) {
        const session = await sessionStorage.getItem<SessionData>(key);
        if (session) {
          totalTime += session.totalTimeSpent;
        }
      }
      
      return totalTime;
    } catch (error) {
      console.error('Error calculating daily session time:', error);
      return 0;
    }
  }

  // Parental Settings Management
  async saveParentalSettings(settings: ParentalSettings): Promise<void> {
    try {
      await parentalStorage.setItem('parental_settings', {
        ...settings,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving parental settings:', error);
    }
  }

  async getParentalSettings(): Promise<ParentalSettings> {
    try {
      const settings = await parentalStorage.getItem<ParentalSettings & { updatedAt: string }>('parental_settings');
      
      if (settings) {
        return settings;
      }
      
      // Default safe settings
      const defaultSettings: ParentalSettings = {
        dailyTimeLimit: 60, // 1 hour
        allowedSubjects: ['math', 'english', 'science', 'art', 'music'],
        contentApprovalRequired: true,
        restrictedHours: {
          start: '22:00',
          end: '07:00'
        },
        blockedTopics: BLOCKED_CATEGORIES,
        reportFrequency: 'weekly'
      };
      
      await this.saveParentalSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error getting parental settings:', error);
      // Return safe defaults on error
      return {
        dailyTimeLimit: 60,
        allowedSubjects: ['math', 'english', 'science'],
        contentApprovalRequired: true,
        restrictedHours: {
          start: '22:00',
          end: '07:00'
        },
        blockedTopics: BLOCKED_CATEGORIES,
        reportFrequency: 'weekly'
      };
    }
  }

  // Content Moderation
  async moderateContent(content: Omit<ContentItem, 'approved' | 'moderationStatus'>): Promise<ContentItem> {
    const moderatedContent: ContentItem = {
      ...content,
      approved: false,
      moderationStatus: 'pending',
      educationalValue: this.calculateEducationalValue(content)
    };

    // Automatic approval for whitelisted topics
    const subjectWhitelist = EDUCATIONAL_WHITELIST[content.subject as keyof typeof EDUCATIONAL_WHITELIST] || [];
    const hasApprovedTopics = content.topics.some(topic => 
      subjectWhitelist.some(approved => 
        approved.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(approved.toLowerCase())
      )
    );

    // Check for blocked content
    const hasBlockedContent = content.topics.some(topic =>
      BLOCKED_CATEGORIES.some(blocked =>
        topic.toLowerCase().includes(blocked.toLowerCase())
      )
    ) || this.containsBlockedTerms(content.title + ' ' + content.description);

    if (hasBlockedContent) {
      moderatedContent.moderationStatus = 'rejected';
      moderatedContent.approved = false;
    } else if (hasApprovedTopics && moderatedContent.educationalValue >= 3) {
      moderatedContent.moderationStatus = 'approved';
      moderatedContent.approved = true;
    }

    // Store moderated content
    await contentStorage.setItem(content.id, moderatedContent);
    
    return moderatedContent;
  }

  private calculateEducationalValue(content: Omit<ContentItem, 'approved' | 'moderationStatus'>): number {
    let score = 3; // Base score
    
    // Boost for educational keywords
    const educationalKeywords = [
      'learn', 'practice', 'solve', 'understand', 'explore', 'discover',
      'tutorial', 'lesson', 'exercise', 'activity', 'interactive', 'educational'
    ];
    
    const contentText = (content.title + ' ' + content.description).toLowerCase();
    const keywordCount = educationalKeywords.filter(keyword => 
      contentText.includes(keyword)
    ).length;
    
    score += Math.min(keywordCount * 0.2, 1.5);
    
    // Boost for grade appropriateness
    if (content.grade >= 3 && content.grade <= 6) {
      score += 0.5;
    }
    
    return Math.min(Math.max(score, 1), 5);
  }

  private containsBlockedTerms(text: string): boolean {
    const blockedTerms = [
      'personal information', 'contact details', 'share your', 'tell us about yourself',
      'chat with', 'social media', 'advertisement', 'buy now', 'purchase',
      'violent', 'scary', 'frightening', 'mature content'
    ];
    
    const lowerText = text.toLowerCase();
    return blockedTerms.some(term => lowerText.includes(term));
  }

  async getApprovedContent(subject: string, grade: number): Promise<ContentItem[]> {
    try {
      const allKeys = await contentStorage.keys();
      const approvedContent: ContentItem[] = [];
      
      for (const key of allKeys) {
        const content = await contentStorage.getItem<ContentItem>(key);
        if (content && 
            content.approved && 
            content.subject === subject && 
            content.grade === grade) {
          approvedContent.push(content);
        }
      }
      
      return approvedContent.sort((a, b) => b.educationalValue - a.educationalValue);
    } catch (error) {
      console.error('Error getting approved content:', error);
      return [];
    }
  }

  // Compliance and Reporting
  async generateParentalReport(userId: string, days: number = 7): Promise<ParentalReport> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Get all user sessions in period
      const allKeys = await sessionStorage.keys();
      const userSessions: SessionData[] = [];
      
      for (const key of allKeys) {
        if (key.startsWith(`session_${userId}`)) {
          const session = await sessionStorage.getItem<SessionData>(key);
          if (session && 
              new Date(session.sessionStart) >= startDate && 
              new Date(session.sessionStart) <= endDate) {
            userSessions.push(session);
          }
        }
      }
      
      const totalScreenTime = userSessions.reduce((sum, session) => sum + session.totalTimeSpent, 0);
      const activitiesCompleted = userSessions.reduce((sum, session) => sum + session.activitiesCompleted.length, 0);
      const subjectsExplored = [...new Set(userSessions.flatMap(session => session.subjectsAccessed))];
      
      const report: ParentalReport = {
        userId,
        reportPeriod: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        totalScreenTime,
        activitiesCompleted,
        subjectsExplored,
        strengthAreas: this.identifyStrengthAreas(userSessions),
        improvementAreas: this.identifyImprovementAreas(userSessions),
        safetyEvents: [] // No safety events in offline-only app
      };
      
      return report;
    } catch (error) {
      console.error('Error generating parental report:', error);
      return {
        userId,
        reportPeriod: {
          start: new Date().toISOString(),
          end: new Date().toISOString()
        },
        totalScreenTime: 0,
        activitiesCompleted: 0,
        subjectsExplored: [],
        strengthAreas: [],
        improvementAreas: [],
        safetyEvents: []
      };
    }
  }

  private identifyStrengthAreas(sessions: SessionData[]): string[] {
    const subjectFrequency: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      session.subjectsAccessed.forEach(subject => {
        subjectFrequency[subject] = (subjectFrequency[subject] || 0) + 1;
      });
    });
    
    return Object.entries(subjectFrequency)
      .filter(([, count]) => count >= 3)
      .map(([subject]) => subject)
      .slice(0, 3);
  }

  private identifyImprovementAreas(sessions: SessionData[]): string[] {
    const allSubjects = ['math', 'english', 'science', 'social-studies', 'art', 'music'];
    const accessedSubjects = Array.from(new Set(sessions.flatMap(session => session.subjectsAccessed)));
    
    return allSubjects.filter(subject => !accessedSubjects.includes(subject));
  }

  // COPPA Compliance Utilities
  async clearAllUserData(): Promise<void> {
    try {
      // Clear all user data while preserving parental settings
      await sessionStorage.clear();
      
      // Clear content cache (will be re-moderated as needed)
      await contentStorage.clear();
      
      console.log('All user data cleared for COPPA compliance');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  async exportUserData(userId: string): Promise<{
    userData: AnonymizedUser | null;
    sessions: SessionData[];
    totalDataSize: string;
  }> {
    try {
      const user = await sessionStorage.getItem<AnonymizedUser>(`user_${userId}`);
      const allKeys = await sessionStorage.keys();
      const userSessionKeys = allKeys.filter(key => key.includes(userId));
      
      const sessions: SessionData[] = [];
      for (const key of userSessionKeys) {
        const session = await sessionStorage.getItem<SessionData>(key);
        if (session) sessions.push(session);
      }
      
      const dataSize = JSON.stringify({ user, sessions }).length;
      
      return {
        userData: user,
        sessions,
        totalDataSize: `${(dataSize / 1024).toFixed(2)} KB`
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return {
        userData: null,
        sessions: [],
        totalDataSize: '0 KB'
      };
    }
  }
}

export const childSafetyService = new ChildSafetyService();