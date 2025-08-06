import localforage from 'localforage';

// Academic Integrity Service for Grades 3-6
// Inspired by Personify AI with age-appropriate detection methods

export interface TypingPattern {
  keystrokeIntervals: number[]; // Time between keystrokes in ms
  averageSpeed: number; // WPM
  pausePattern: number[]; // Longer pauses between words/sentences
  backspaceFrequency: number; // Natural editing pattern
  timestamp: string;
}

export interface ActivitySession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  totalTimeSpent: number; // minutes
  subject: string;
  activityType: 'quiz' | 'writing' | 'worksheet' | 'creative';
  typingPatterns: TypingPattern[];
  suspiciousEvents: SuspiciousEvent[];
  integrityScore: number; // 1-100 (higher is better)
}

export interface SuspiciousEvent {
  id: string;
  timestamp: string;
  type: 'rapid_paste' | 'unusual_speed' | 'pattern_break' | 'time_gap' | 'mass_delete';
  severity: 'low' | 'medium' | 'high';
  description: string;
  context: string; // What was happening when detected
  falsePositive?: boolean; // Can be marked by parent/teacher
}

export interface QuizResponse {
  questionId: string;
  answer: string;
  timeSpent: number; // seconds on this question
  typingPattern: TypingPattern;
  revisionCount: number; // How many times answer was changed
  confidence: 'low' | 'medium' | 'high'; // Based on typing pattern
}

export interface QuizSession {
  id: string;
  userId: string;
  subject: string;
  grade: number;
  startTime: string;
  endTime?: string;
  responses: QuizResponse[];
  overallScore: number;
  integrityScore: number;
  feedback: AutomatedFeedback[];
  flaggedForReview: boolean;
}

export interface AutomatedFeedback {
  type: 'encouragement' | 'suggestion' | 'question' | 'concern';
  message: string;
  questionId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface IntegrityReport {
  userId: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  totalSessions: number;
  averageIntegrityScore: number;
  suspiciousEventsCount: number;
  flaggedSessions: ActivitySession[];
  recommendations: string[];
  falsePositiveRate: number;
}

// Storage instances
const integrityStorage = localforage.createInstance({
  name: 'AcademicIntegrity',
  version: 1.0,
  storeName: 'integrity_data',
  description: 'Academic integrity monitoring for educational activities'
});

const sessionStorage = localforage.createInstance({
  name: 'IntegritySessions',
  version: 1.0,
  storeName: 'sessions',
  description: 'Student activity sessions with integrity monitoring'
});

// Age-appropriate thresholds for grades 3-6
const GRADE_THRESHOLDS = {
  3: { minWPM: 5, maxWPM: 25, normalPauseMs: 2000 },
  4: { minWPM: 8, maxWPM: 35, normalPauseMs: 1800 },
  5: { minWPM: 12, maxWPM: 45, normalPauseMs: 1500 },
  6: { minWPM: 15, maxWPM: 55, normalPauseMs: 1200 }
};

class AcademicIntegrityService {
  private currentSession: ActivitySession | null = null;
  private typingBuffer: number[] = [];
  private lastKeystrokeTime = 0;

  // Start monitoring session
  async startSession(userId: string, subject: string, activityType: ActivitySession['activityType']): Promise<ActivitySession> {
    const session: ActivitySession = {
      id: `session_${userId}_${Date.now()}`,
      userId,
      startTime: new Date().toISOString(),
      totalTimeSpent: 0,
      subject,
      activityType,
      typingPatterns: [],
      suspiciousEvents: [],
      integrityScore: 100
    };

    this.currentSession = session;
    await sessionStorage.setItem(session.id, session);
    
    return session;
  }

  // Record keystroke for pattern analysis
  recordKeystroke(timestamp: number = Date.now()): void {
    if (!this.currentSession) return;

    if (this.lastKeystrokeTime > 0) {
      const interval = timestamp - this.lastKeystrokeTime;
      this.typingBuffer.push(interval);

      // Analyze pattern every 20 keystrokes
      if (this.typingBuffer.length >= 20) {
        this.analyzeTypingPattern();
        this.typingBuffer = this.typingBuffer.slice(-10); // Keep recent history
      }
    }

    this.lastKeystrokeTime = timestamp;
  }

  // Analyze typing patterns for suspicious behavior
  private async analyzeTypingPattern(): Promise<void> {
    if (!this.currentSession || this.typingBuffer.length < 10) return;

    const intervals = this.typingBuffer;
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const wordsPerMinute = Math.round(60000 / (avgInterval * 5)); // Rough WPM calculation

    // Create typing pattern record
    const pattern: TypingPattern = {
      keystrokeIntervals: [...intervals],
      averageSpeed: wordsPerMinute,
      pausePattern: intervals.filter(interval => interval > 1000),
      backspaceFrequency: 0, // Would be tracked separately
      timestamp: new Date().toISOString()
    };

    this.currentSession.typingPatterns.push(pattern);

    // Check for suspicious patterns
    await this.detectSuspiciousActivity(pattern);
    await this.updateSession();
  }

  // Detect suspicious typing activities
  private async detectSuspiciousActivity(pattern: TypingPattern): Promise<void> {
    if (!this.currentSession) return;

    const grade = await this.getUserGrade();
    const thresholds = GRADE_THRESHOLDS[grade] || GRADE_THRESHOLDS[4];

    // Check for unusually fast typing
    if (pattern.averageSpeed > thresholds.maxWPM * 1.5) {
      await this.flagSuspiciousEvent({
        type: 'unusual_speed',
        severity: 'high',
        description: `Typing speed (${pattern.averageSpeed} WPM) unusually high for grade ${grade}`,
        context: `Expected range: ${thresholds.minWPM}-${thresholds.maxWPM} WPM`
      });
    }

    // Check for very consistent intervals (possible auto-typing)
    const intervalVariance = this.calculateVariance(pattern.keystrokeIntervals);
    if (intervalVariance < 10 && pattern.averageSpeed > 20) {
      await this.flagSuspiciousEvent({
        type: 'pattern_break',
        severity: 'medium',
        description: 'Typing pattern unusually consistent (possible copy-paste or auto-typing)',
        context: `Interval variance: ${intervalVariance.toFixed(2)}ms`
      });
    }

    // Check for sudden pattern changes
    const recentPatterns = this.currentSession.typingPatterns.slice(-3);
    if (recentPatterns.length >= 3) {
      const speedDifference = Math.abs(recentPatterns[2].averageSpeed - recentPatterns[0].averageSpeed);
      if (speedDifference > thresholds.maxWPM * 0.8) {
        await this.flagSuspiciousEvent({
          type: 'pattern_break',
          severity: 'medium',
          description: 'Sudden change in typing speed pattern',
          context: `Speed changed from ${recentPatterns[0].averageSpeed} to ${recentPatterns[2].averageSpeed} WPM`
        });
      }
    }
  }

  // Handle paste events (potential copy-paste detection)
  async handlePasteEvent(pastedLength: number, timeSpent: number): Promise<void> {
    if (!this.currentSession) return;

    // Flag rapid paste of large content
    if (pastedLength > 50 && timeSpent < 2000) {
      await this.flagSuspiciousEvent({
        type: 'rapid_paste',
        severity: pastedLength > 200 ? 'high' : 'medium',
        description: `Large text pasted quickly (${pastedLength} characters in ${timeSpent}ms)`,
        context: 'Possible external source copying'
      });
    }

    // Reset typing pattern analysis after paste
    this.typingBuffer = [];
    this.lastKeystrokeTime = 0;
  }

  // Handle long inactivity periods
  async handleInactivityGap(gapDuration: number): Promise<void> {
    if (!this.currentSession) return;

    // Flag suspicious gaps (possible external research/help)
    if (gapDuration > 300000) { // 5 minutes
      await this.flagSuspiciousEvent({
        type: 'time_gap',
        severity: gapDuration > 900000 ? 'high' : 'medium', // 15 minutes = high
        description: `Extended inactivity period (${Math.round(gapDuration / 60000)} minutes)`,
        context: 'Possible external consultation or distraction'
      });
    }
  }

  // Flag suspicious events
  private async flagSuspiciousEvent(eventData: Omit<SuspiciousEvent, 'id' | 'timestamp'>): Promise<void> {
    if (!this.currentSession) return;

    const event: SuspiciousEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...eventData
    };

    this.currentSession.suspiciousEvents.push(event);

    // Adjust integrity score
    const scorePenalty = this.getScorePenalty(event.severity);
    this.currentSession.integrityScore = Math.max(0, this.currentSession.integrityScore - scorePenalty);

    await this.updateSession();
  }

  // End monitoring session
  async endSession(): Promise<ActivitySession | null> {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.totalTimeSpent = Math.floor(
      (new Date(this.currentSession.endTime).getTime() - new Date(this.currentSession.startTime).getTime()) / (1000 * 60)
    );

    // Final integrity assessment
    this.currentSession.integrityScore = this.calculateFinalIntegrityScore();

    await this.updateSession();
    
    const completedSession = { ...this.currentSession };
    this.currentSession = null;
    this.typingBuffer = [];
    this.lastKeystrokeTime = 0;

    return completedSession;
  }

  // Quiz-specific integrity monitoring
  async startQuizSession(userId: string, subject: string, grade: number): Promise<QuizSession> {
    const session: QuizSession = {
      id: `quiz_${userId}_${Date.now()}`,
      userId,
      subject,
      grade,
      startTime: new Date().toISOString(),
      responses: [],
      overallScore: 0,
      integrityScore: 100,
      feedback: [],
      flaggedForReview: false
    };

    await integrityStorage.setItem(session.id, session);
    return session;
  }

  // Record quiz response with integrity analysis
  async recordQuizResponse(
    sessionId: string, 
    questionId: string, 
    answer: string, 
    timeSpent: number,
    typingData: { intervals: number[], revisions: number }
  ): Promise<AutomatedFeedback[]> {
    try {
      const session = await integrityStorage.getItem<QuizSession>(sessionId);
      if (!session) return [];

      // Analyze typing confidence
      const confidence = this.analyzeResponseConfidence(typingData, timeSpent);
      
      const response: QuizResponse = {
        questionId,
        answer,
        timeSpent,
        typingPattern: {
          keystrokeIntervals: typingData.intervals,
          averageSpeed: this.calculateWPM(typingData.intervals),
          pausePattern: typingData.intervals.filter(i => i > 1000),
          backspaceFrequency: typingData.revisions,
          timestamp: new Date().toISOString()
        },
        revisionCount: typingData.revisions,
        confidence
      };

      session.responses.push(response);

      // Generate automated feedback
      const feedback = this.generateQuizFeedback(response, session.grade);
      session.feedback.push(...feedback);

      await integrityStorage.setItem(sessionId, session);
      return feedback;
    } catch (error) {
      console.error('Error recording quiz response:', error);
      return [];
    }
  }

  // Generate age-appropriate automated feedback
  private generateQuizFeedback(response: QuizResponse, grade: number): AutomatedFeedback[] {
    const feedback: AutomatedFeedback[] = [];

    // Time-based feedback
    if (response.timeSpent < 10) {
      feedback.push({
        type: 'suggestion',
        message: 'Take your time to think about your answer! Good thinking takes time. ⏰',
        questionId: response.questionId,
        priority: 'medium'
      });
    } else if (response.timeSpent > 300) {
      feedback.push({
        type: 'encouragement',
        message: 'Great job thinking carefully about this question! 🤔',
        questionId: response.questionId,
        priority: 'low'
      });
    }

    // Confidence-based feedback
    if (response.confidence === 'low') {
      feedback.push({
        type: 'question',
        message: 'Try explaining your answer! Can you tell me more about your thinking?',
        questionId: response.questionId,
        priority: 'medium'
      });
    }

    // Revision pattern feedback
    if (response.revisionCount > 5) {
      feedback.push({
        type: 'encouragement',
        message: 'I can see you\'re working hard to get the right answer! Keep thinking! 💪',
        questionId: response.questionId,
        priority: 'low'
      });
    } else if (response.revisionCount === 0 && response.answer.length > 20) {
      feedback.push({
        type: 'suggestion',
        message: 'You wrote that answer very quickly! Double-check that it shows your best thinking. ✨',
        questionId: response.questionId,
        priority: 'medium'
      });
    }

    return feedback;
  }

  // Analyze response confidence based on typing patterns
  private analyzeResponseConfidence(typingData: { intervals: number[], revisions: number }, timeSpent: number): 'low' | 'medium' | 'high' {
    const avgInterval = typingData.intervals.length > 0 
      ? typingData.intervals.reduce((sum, interval) => sum + interval, 0) / typingData.intervals.length 
      : 1000;
    
    const hasLongPauses = typingData.intervals.some(interval => interval > 3000);
    const manyRevisions = typingData.revisions > 3;
    const quickResponse = timeSpent < 15;

    if (quickResponse && typingData.revisions === 0 && !hasLongPauses) {
      return 'low'; // Too quick, might not be thoughtful
    }
    
    if (hasLongPauses || manyRevisions || timeSpent > 60) {
      return 'high'; // Shows thinking and consideration
    }
    
    return 'medium';
  }

  // Generate integrity report for parents/teachers
  async generateIntegrityReport(userId: string, days: number = 7): Promise<IntegrityReport> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const allKeys = await sessionStorage.keys();
      const userSessions: ActivitySession[] = [];
      
      for (const key of allKeys) {
        if (key.includes(userId)) {
          const session = await sessionStorage.getItem<ActivitySession>(key);
          if (session && 
              new Date(session.startTime) >= startDate && 
              new Date(session.startTime) <= endDate) {
            userSessions.push(session);
          }
        }
      }

      const flaggedSessions = userSessions.filter(session => 
        session.integrityScore < 80 || session.suspiciousEvents.length > 0
      );

      const totalSuspiciousEvents = userSessions.reduce((sum, session) => 
        sum + session.suspiciousEvents.length, 0
      );

      const averageIntegrityScore = userSessions.length > 0
        ? userSessions.reduce((sum, session) => sum + session.integrityScore, 0) / userSessions.length
        : 100;

      // Calculate false positive rate based on parent feedback
      const totalEvents = totalSuspiciousEvents;
      const markedFalsePositives = userSessions
        .flatMap(session => session.suspiciousEvents)
        .filter(event => event.falsePositive).length;
      
      const falsePositiveRate = totalEvents > 0 ? (markedFalsePositives / totalEvents) * 100 : 0;

      const report: IntegrityReport = {
        userId,
        reportPeriod: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        totalSessions: userSessions.length,
        averageIntegrityScore: Math.round(averageIntegrityScore),
        suspiciousEventsCount: totalSuspiciousEvents,
        flaggedSessions,
        recommendations: this.generateRecommendations(userSessions, averageIntegrityScore),
        falsePositiveRate
      };

      return report;
    } catch (error) {
      console.error('Error generating integrity report:', error);
      return {
        userId,
        reportPeriod: { start: new Date().toISOString(), end: new Date().toISOString() },
        totalSessions: 0,
        averageIntegrityScore: 100,
        suspiciousEventsCount: 0,
        flaggedSessions: [],
        recommendations: [],
        falsePositiveRate: 0
      };
    }
  }

  // Mark suspicious event as false positive
  async markFalsePositive(sessionId: string, eventId: string): Promise<void> {
    try {
      const session = await sessionStorage.getItem<ActivitySession>(sessionId);
      if (session) {
        const event = session.suspiciousEvents.find(e => e.id === eventId);
        if (event) {
          event.falsePositive = true;
          await sessionStorage.setItem(sessionId, session);
        }
      }
    } catch (error) {
      console.error('Error marking false positive:', error);
    }
  }

  // Helper methods
  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  private calculateWPM(intervals: number[]): number {
    if (intervals.length === 0) return 0;
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return Math.round(60000 / (avgInterval * 5)); // Approximate WPM
  }

  private getScorePenalty(severity: SuspiciousEvent['severity']): number {
    switch (severity) {
      case 'low': return 5;
      case 'medium': return 15;
      case 'high': return 30;
      default: return 10;
    }
  }

  private calculateFinalIntegrityScore(): number {
    if (!this.currentSession) return 100;

    let score = 100;
    
    // Penalize based on suspicious events
    this.currentSession.suspiciousEvents.forEach(event => {
      if (!event.falsePositive) {
        score -= this.getScorePenalty(event.severity);
      }
    });

    // Bonus for consistent, natural typing patterns
    const consistentPatterns = this.currentSession.typingPatterns.filter(pattern => 
      pattern.averageSpeed > 5 && pattern.averageSpeed < 60 && 
      this.calculateVariance(pattern.keystrokeIntervals) > 50
    ).length;

    const bonusPoints = Math.min(10, consistentPatterns * 2);
    score += bonusPoints;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private async getUserGrade(): Promise<keyof typeof GRADE_THRESHOLDS> {
    // This would get the grade from the current user context
    return 4; // Default to grade 4
  }

  private generateRecommendations(sessions: ActivitySession[], avgScore: number): string[] {
    const recommendations: string[] = [];

    if (avgScore < 70) {
      recommendations.push('Consider discussing academic honesty and the importance of doing their own work');
      recommendations.push('Review completed assignments together to understand their thought process');
    }

    if (avgScore < 85) {
      recommendations.push('Encourage taking time to think through problems carefully');
      recommendations.push('Practice typing skills to improve natural typing patterns');
    }

    const hasTimeGaps = sessions.some(session => 
      session.suspiciousEvents.some(event => event.type === 'time_gap')
    );
    if (hasTimeGaps) {
      recommendations.push('Create a distraction-free environment for schoolwork');
      recommendations.push('Consider shorter work sessions with planned breaks');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job maintaining academic integrity!');
      recommendations.push('Continue encouraging independent thinking and learning');
    }

    return recommendations;
  }

  private async updateSession(): Promise<void> {
    if (this.currentSession) {
      await sessionStorage.setItem(this.currentSession.id, this.currentSession);
    }
  }
}

export const academicIntegrityService = new AcademicIntegrityService();