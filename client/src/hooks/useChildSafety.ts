import { useState, useEffect } from 'react';
import { 
  childSafetyService, 
  AnonymizedUser, 
  ParentalSettings, 
  SessionData,
  ParentalReport 
} from '@/services/childSafetyApi';

export const useChildSafety = (grade: number = 4) => {
  const [currentUser, setCurrentUser] = useState<AnonymizedUser | null>(null);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [dailyTimeUsed, setDailyTimeUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeChildSafety();
  }, [grade]);

  const initializeChildSafety = async () => {
    try {
      setLoading(true);
      
      // Get or create anonymous user
      let user = await childSafetyService.getCurrentUser();
      
      if (!user || user.grade !== grade) {
        user = await childSafetyService.createAnonymizedUser(grade);
      }
      
      setCurrentUser(user);
      
      // Load parental settings
      const settings = await childSafetyService.getParentalSettings();
      setParentalSettings(settings);
      
      // Load daily time usage
      if (user) {
        const timeUsed = await childSafetyService.getTodaySessionTime(user.id);
        setDailyTimeUsed(timeUsed);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing child safety:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserActivity = async () => {
    if (currentUser) {
      await childSafetyService.updateUserActivity(currentUser.id);
    }
  };

  const startSession = async (): Promise<SessionData | null> => {
    if (!currentUser) return null;
    return await childSafetyService.startSession(currentUser.id);
  };

  const endSession = async (): Promise<SessionData | null> => {
    return await childSafetyService.endSession();
  };

  const getDailyTimeUsed = async (): Promise<number> => {
    if (!currentUser) return 0;
    const timeUsed = await childSafetyService.getTodaySessionTime(currentUser.id);
    setDailyTimeUsed(timeUsed);
    return timeUsed;
  };

  const generateReport = async (days: number = 7): Promise<ParentalReport | null> => {
    if (!currentUser) return null;
    return await childSafetyService.generateParentalReport(currentUser.id, days);
  };

  const checkTimeLimit = (): boolean => {
    if (!parentalSettings) return true;
    return dailyTimeUsed < parentalSettings.dailyTimeLimit;
  };

  const getRemainingTime = (): number => {
    if (!parentalSettings) return 60; // Default 1 hour
    return Math.max(0, parentalSettings.dailyTimeLimit - dailyTimeUsed);
  };

  const isSubjectAllowed = (subject: string): boolean => {
    if (!parentalSettings) return true;
    return parentalSettings.allowedSubjects.includes(subject);
  };

  const isInRestrictedHours = (): boolean => {
    if (!parentalSettings) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = parentalSettings.restrictedHours;
    
    if (start < end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Spans midnight
      return currentTime >= start || currentTime <= end;
    }
  };

  return {
    // State
    currentUser,
    parentalSettings,
    dailyTimeUsed,
    loading,
    initialized,
    
    // Actions
    updateUserActivity,
    startSession,
    endSession,
    getDailyTimeUsed,
    generateReport,
    
    // Checks
    checkTimeLimit,
    getRemainingTime,
    isSubjectAllowed,
    isInRestrictedHours,
    
    // Utils
    refresh: initializeChildSafety
  };
};

export default useChildSafety;