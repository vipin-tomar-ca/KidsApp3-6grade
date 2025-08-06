# Component Reference Guide

## 📋 Table of Contents

1. [UI Components](#ui-components)
2. [Educational Components](#educational-components)
3. [Safety & Accessibility Components](#safety--accessibility-components)
4. [Data & Storage Components](#data--storage-components)
5. [Hooks and Utilities](#hooks-and-utilities)
6. [Testing Components](#testing-components)

## 🎨 UI Components

### Base UI Components (shadcn/ui)

Located in `client/src/components/ui/`

#### Button
```typescript
// Basic usage
import { Button } from "@/components/ui/button";

<Button variant="default" size="md" onClick={handleClick}>
  Click Me
</Button>

// Child-friendly large button
<Button 
  variant="outline" 
  size="lg" 
  className="text-lg font-bold bg-blue-500 hover:bg-blue-600"
>
  Start Learning!
</Button>

// Props
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

#### Card
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card className="rounded-xl shadow-lg">
  <CardHeader>
    <CardTitle className="text-2xl text-center">Math Adventure</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Explore numbers and solve fun problems!</p>
  </CardContent>
</Card>

// Educational subject card example
const SubjectCard: React.FC<{subject: string, description: string}> = ({
  subject, description
}) => (
  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
    <CardHeader className="text-center">
      <CardTitle className="text-xl font-bold text-primary">
        {subject}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 text-center">{description}</p>
    </CardContent>
  </Card>
);
```

#### Form Components
```typescript
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

// Child-friendly form with large inputs
const LearningForm = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="answer"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Your Answer:
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="text-xl p-4 text-center"
                placeholder="Type your answer here"
              />
            </FormControl>
            <FormDescription>
              Take your time and think it through!
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
```

### Custom UI Components

#### ProgressBar
```typescript
// client/src/components/ui/progress-bar.tsx
interface ProgressBarProps {
  value: number;        // 0-100
  max?: number;         // default 100
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

// Usage example
<ProgressBar 
  value={75} 
  label="Math Progress" 
  color="green"
  size="lg"
  showPercentage={true}
  animated={true}
  className="mb-4"
/>

// Implementation
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'blue',
  size = 'md',
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`progress-container ${className}`}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={`bg-gray-200 rounded-full ${
        size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'
      }`}>
        <div
          className={`bg-${color}-500 rounded-full transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
```

#### AchievementBadge
```typescript
// client/src/components/ui/achievement-badge.tsx
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  dateEarned?: Date;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDate?: boolean;
  onClick?: () => void;
  className?: string;
}

// Usage
<AchievementBadge 
  achievement={{
    id: 'math-star',
    name: 'Math Star',
    description: 'Completed 10 math lessons',
    icon: '⭐',
    type: 'gold',
    dateEarned: new Date()
  }}
  size="lg"
  showDate={true}
  onClick={() => console.log('Badge clicked')}
/>
```

#### LoadingScreen
```typescript
// client/src/components/ui/loading-screen.tsx
interface LoadingScreenProps {
  message?: string;
  showSpinner?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Child-friendly loading screen
<LoadingScreen 
  message="Loading your awesome math adventures..."
  showSpinner={true}
  className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500"
/>

// Implementation with fun animations
const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  showSpinner = true,
  children,
  className = ""
}) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    {showSpinner && (
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4" />
    )}
    <p className="text-white text-xl font-semibold text-center px-4">
      {message}
    </p>
    {children}
  </div>
);
```

## 🎓 Educational Components

### HintAssistant
```typescript
// client/src/components/HintAssistant.tsx
interface HintAssistantProps {
  problemContext: string;    // Current problem or question
  subject: string;          // math, reading, science, art
  grade: number;           // 3, 4, 5, or 6
  onHintGenerated?: (hint: string) => void;
  maxHints?: number;       // default 3
  disabled?: boolean;
  className?: string;
}

// Usage in math lesson
<HintAssistant
  problemContext="Sarah has 24 stickers. She wants to share them equally among 6 friends. How many stickers will each friend get?"
  subject="math"
  grade={4}
  onHintGenerated={(hint) => {
    console.log('AI generated hint:', hint);
    // Display hint to student
  }}
  maxHints={3}
  className="mt-4"
/>

// Key features:
// - Uses TensorFlow.js for educational content generation
// - Provides grade-appropriate language and explanations
// - Tracks hint usage for academic integrity monitoring
// - Offline-capable with template-based fallbacks
// - COPPA compliant (no data sent to external services)

// Implementation details
const HintAssistant: React.FC<HintAssistantProps> = ({
  problemContext,
  subject,
  grade,
  onHintGenerated,
  maxHints = 3,
  disabled = false,
  className = ""
}) => {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateHint = async () => {
    if (hintsUsed >= maxHints || disabled) return;
    
    setIsGenerating(true);
    try {
      const hint = await llmHintService.generateHint({
        problem: problemContext,
        subject,
        grade,
        previousHints: hintsUsed
      });
      
      setCurrentHint(hint);
      setHintsUsed(prev => prev + 1);
      onHintGenerated?.(hint);
      
      // Track usage for academic integrity
      await llmHintService.logHintUsage({
        problem: problemContext,
        hint,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Hint generation failed:', error);
      // Fallback to template-based hint
      setCurrentHint('Try breaking this problem into smaller steps!');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className={`hint-assistant bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-yellow-800 flex items-center">
          💡 Need a Hint?
        </h4>
        <span className="text-sm text-yellow-600">
          {hintsUsed}/{maxHints} hints used
        </span>
      </div>
      
      {currentHint && (
        <div className="mb-3 p-3 bg-white rounded border border-yellow-300">
          <p className="text-gray-800">{currentHint}</p>
        </div>
      )}
      
      <Button
        onClick={generateHint}
        disabled={disabled || hintsUsed >= maxHints || isGenerating}
        variant="outline"
        className="w-full bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
      >
        {isGenerating ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
          </>
        ) : (
          <>
            <Lightbulb className="mr-2 h-4 w-4" />
            {hintsUsed === 0 ? 'Get a Hint' : 'Get Another Hint'}
          </>
        )}
      </Button>
    </div>
  );
};
```

### WorkspaceComponent
```typescript
// client/src/pages/workspace.tsx - Student's personal learning space
interface WorkspaceProps {
  userId: string;
  subject?: string;
  className?: string;
}

// Features:
// - Personalized dashboard with current lessons
// - Progress tracking and goal setting
// - Achievement gallery and rewards
// - Creative project portfolio
// - AI learning assistant integration

// Key sections:
const Workspace: React.FC<WorkspaceProps> = ({ userId, subject, className }) => {
  return (
    <div className={`workspace-container ${className}`}>
      {/* Today's Learning Goals */}
      <DailyGoalsSection userId={userId} />
      
      {/* Continue Learning - Resume previous activities */}
      <ContinueLearningSection userId={userId} />
      
      {/* Subject Quick Access */}
      <SubjectNavigationGrid />
      
      {/* Recent Achievements */}
      <AchievementsShowcase userId={userId} />
      
      {/* Creative Projects Gallery */}
      <ProjectPortfolio userId={userId} />
      
      {/* AI Learning Assistant */}
      <HintAssistant 
        problemContext="Ready to learn something new?"
        subject={subject || 'general'}
        grade={getCurrentGrade(userId)}
      />
    </div>
  );
};
```

### SubjectModules
```typescript
// Math Module Example
// client/src/pages/math.tsx
const MathModule: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<MathLesson | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  
  return (
    <div className="math-module">
      {/* Grade-level topic selection */}
      <TopicSelector 
        grade={4}
        subject="math"
        onTopicSelect={setCurrentLesson}
      />
      
      {/* Interactive lesson content */}
      {currentLesson && (
        <LessonContent 
          lesson={currentLesson}
          onProgress={updateProgress}
          hintAssistant={true}
        />
      )}
      
      {/* Practice problems */}
      <PracticeSection 
        topic={currentLesson?.topic}
        difficulty={userProgress?.level || 'beginner'}
      />
      
      {/* Olympiad preparation (AMC 8) */}
      <OlympiadSection 
        competitionType="AMC8"
        grade={4}
        enabled={userProgress?.readyForOlympiad}
      />
    </div>
  );
};

// Reading Module Example  
const ReadingModule: React.FC = () => (
  <div className="reading-module">
    <BookLibrary grade={4} />
    <ComprehensionExercises />
    <VocabularyBuilder />
    <CreativeWriting />
  </div>
);

// Science Module Example
const ScienceModule: React.FC = () => (
  <div className="science-module">
    <VirtualLabs />
    <ExperimentGuides />
    <ScienceOlympiad />
    <InteractiveSimulations />
  </div>
);

// Art Module Example
const ArtModule: React.FC = () => (
  <div className="art-module">
    <DigitalCanvas />
    <ArtTutorials />
    <ProjectGallery />
    <ColorTheoryLessons />
  </div>
);
```

## 🛡️ Safety & Accessibility Components

### SpeakableText
```typescript
// client/src/components/SpeakableText.tsx
interface SpeakableTextProps {
  text: string;             // Text content to be read aloud
  children: React.ReactNode; // Visual content to display
  emphasize?: string[];     // Words to emphasize during speech
  showControls?: boolean;   // Show play/pause/stop buttons
  autoPlay?: boolean;       // Start reading automatically
  rate?: number;           // Speech rate (0.1 to 10, default 0.9)
  pitch?: number;          // Voice pitch (0 to 2, default 1.1)
  voice?: string;          // Preferred voice name
  className?: string;
}

// Usage examples
<SpeakableText 
  text="Welcome to your math adventure! Let's solve some fun problems together."
  showControls={true}
  emphasize={['math', 'adventure', 'fun']}
  className="text-center p-4"
>
  <h2 className="text-2xl font-bold text-blue-600">
    🔢 Math Adventure Time! 🎯
  </h2>
</SpeakableText>

// Reading lesson with text-to-speech
<SpeakableText
  text="The little red hen found some wheat seeds in the farmyard..."
  showControls={true}
  rate={0.8}  // Slower for beginning readers
  pitch={1.2} // Slightly higher pitch for story-telling
>
  <div className="story-content">
    <img src="/story-illustration.png" alt="Little Red Hen" />
    <p className="story-text text-lg leading-relaxed">
      The little red hen found some wheat seeds in the farmyard...
    </p>
  </div>
</SpeakableText>

// Math problem with speech support
<SpeakableText 
  text="Sarah has 15 apples. She gives 6 apples to her friend Tom. How many apples does Sarah have left?"
  emphasize={['15', '6', 'left']}
  showControls={true}
>
  <div className="math-problem bg-green-50 p-6 rounded-lg">
    <p className="text-lg">
      🍎 Sarah has <strong>15 apples</strong>. <br/>
      🤝 She gives <strong>6 apples</strong> to her friend Tom. <br/>
      ❓ How many apples does Sarah have left?
    </p>
  </div>
</SpeakableText>

// Implementation highlights:
// - Uses Web Speech API for cross-platform compatibility  
// - Child-friendly voice settings (slower rate, higher pitch)
// - Visual indicators during speech playback
// - Keyboard accessibility (spacebar to play/pause)
// - Graceful degradation if speech not supported
// - Emphasis through repetition and pause timing
```

### AccessibilityWrapper
```typescript
// client/src/components/AccessibilityWrapper.tsx
interface AccessibilityWrapperProps {
  children: React.ReactNode;
  skipToContent?: boolean;     // Add skip navigation link
  highContrast?: boolean;      // Apply high contrast theme
  largeText?: boolean;         // Increase all font sizes
  reducedMotion?: boolean;     // Disable animations
  keyboardOnly?: boolean;      // Optimize for keyboard navigation
  screenReader?: boolean;      // Enhanced screen reader support
  className?: string;
}

// Usage for entire page
<AccessibilityWrapper
  skipToContent={true}
  highContrast={userPreferences.highContrast}
  largeText={userPreferences.largeText}
  reducedMotion={userPreferences.reducedMotion}
>
  <MathModule />
</AccessibilityWrapper>

// Features provided:
// - Skip navigation links for screen readers
// - High contrast color scheme application
// - Font size scaling (1.2x to 2x)
// - Motion reduction (disable animations)
// - Enhanced keyboard focus indicators
// - ARIA labels and descriptions
// - Screen reader announcements for dynamic content
```

### ContentFilter
```typescript
// client/src/components/ContentFilter.tsx
interface ContentFilterProps {
  children: React.ReactNode;
  grade: number;              // Content grade level (3-6)
  subject: string;            // Subject area for context
  strictMode?: boolean;       // Extra strict filtering
  allowedSources?: string[];  // Whitelist of trusted sources
  onContentBlocked?: (reason: string) => void;
  className?: string;
}

// Usage
<ContentFilter
  grade={4}
  subject="science"
  strictMode={true}
  allowedSources={['khanacademy.org', 'ck12.org', 'pbskids.org']}
  onContentBlocked={(reason) => {
    console.log('Content blocked:', reason);
    // Log for parental review
  }}
>
  <LessonContent />
</ContentFilter>

// Safety features:
// - Real-time content scanning for inappropriate material
// - Age-appropriate language complexity checking
// - Educational source verification
// - Automatic replacement of blocked content with safe alternatives
// - Parental notification for any content concerns
// - Whitelist-based external link protection
```

## 💾 Data & Storage Components

### FirebaseSync
```typescript
// client/src/components/FirebaseSync.tsx
interface FirebaseSyncProps {
  userId: string;
  onSyncComplete?: (status: SyncStatus) => void;
  autoSync?: boolean;         // Automatic periodic sync
  parentalConsent?: boolean;  // COPPA compliance flag
  className?: string;
}

interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  pendingSync: number;        // Items waiting to sync
  errors: string[];
  cacheSize: {
    content: number;          // MB of cached content
    progress: number;         // Number of progress entries
  };
}

// Usage
<FirebaseSync
  userId="anonymous-user-123"
  onSyncComplete={(status) => {
    console.log(`Synced ${status.pendingSync} items`);
    updateParentalDashboard(status);
  }}
  autoSync={parentalSettings.cloudSyncEnabled}
  parentalConsent={parentalSettings.cloudSyncConsent}
  className="mb-4"
/>

// Features:
// - COPPA-compliant data synchronization
// - Offline-first design with local storage priority
// - Parental consent verification before any cloud sync
// - Encrypted data transmission and storage
// - Progress sync across devices (with permission)
// - Content caching for offline access
// - Data export and deletion tools
// - Sync conflict resolution
```

### LocalStorageManager
```typescript
// client/src/hooks/useLocalStorage.ts
interface LocalStorageManagerProps {
  prefix?: string;            // Storage key prefix (default: 'learning-app')
  encryption?: boolean;       // Encrypt sensitive data
  compression?: boolean;      // Compress large data
  expiration?: number;        // Auto-expire old data (days)
}

// Custom hook for educational data storage
const useEducationalStorage = () => {
  // Store learning progress
  const saveProgress = async (userId: string, progress: LearningProgress) => {
    await localforage.setItem(`progress_${userId}`, progress);
  };
  
  // Store creative projects
  const saveProject = async (userId: string, project: CreativeProject) => {
    await localforage.setItem(`project_${userId}_${project.id}`, project);
  };
  
  // Store AI hint usage (for academic integrity)
  const logHintUsage = async (userId: string, hintLog: HintUsageLog) => {
    const existing = await localforage.getItem(`hints_${userId}`) || [];
    existing.push(hintLog);
    await localforage.setItem(`hints_${userId}`, existing);
  };
  
  // Export all user data (COPPA requirement)
  const exportAllData = async (userId: string) => {
    const allData = {
      progress: await localforage.getItem(`progress_${userId}`),
      projects: await getAllProjects(userId),
      achievements: await localforage.getItem(`achievements_${userId}`),
      hints: await localforage.getItem(`hints_${userId}`),
      exportDate: new Date().toISOString()
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-data-${userId}-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  // Delete all user data (COPPA requirement)
  const deleteAllData = async (userId: string) => {
    const keys = await localforage.keys();
    const userKeys = keys.filter(key => key.includes(userId));
    
    await Promise.all(
      userKeys.map(key => localforage.removeItem(key))
    );
    
    console.log(`Deleted ${userKeys.length} data entries for user ${userId}`);
  };
  
  return {
    saveProgress,
    saveProject,
    logHintUsage,
    exportAllData,
    deleteAllData
  };
};
```

## 🎣 Hooks and Utilities

### useChildSafety
```typescript
// client/src/hooks/useChildSafety.ts
interface AnonymizedUser {
  id: string;                 // UUID, never real name
  grade: number;             // 3, 4, 5, or 6
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

interface ParentalSettings {
  dailyTimeLimit: number;     // Minutes per day
  allowedHours: {            // Time restrictions
    start: string;           // "15:00" format
    end: string;             // "18:00" format
  };
  subjectRestrictions: string[];  // Disabled subjects
  cloudSyncEnabled: boolean;
  cloudSyncConsent: boolean;
  contentMaturityLevel: 'strict' | 'moderate' | 'relaxed';
  progressReportsEnabled: boolean;
  weeklyEmailSummary: boolean;
}

const useChildSafety = () => {
  const [currentUser, setCurrentUser] = useState<AnonymizedUser | null>(null);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [dailyTimeUsed, setDailyTimeUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Initialize anonymous user (no personal info)
  const createAnonymousUser = async (grade: number) => {
    const newUser: AnonymizedUser = {
      id: crypto.randomUUID(),
      grade,
      preferences: getDefaultPreferences(),
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    await localforage.setItem('current_user', newUser);
    setCurrentUser(newUser);
    return newUser;
  };
  
  // Check if learning time limit reached
  const canContinueLearning = () => {
    if (!parentalSettings) return true;
    return dailyTimeUsed < parentalSettings.dailyTimeLimit;
  };
  
  // Check if current time is within allowed hours
  const isWithinAllowedHours = () => {
    if (!parentalSettings?.allowedHours) return true;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = parseTime(parentalSettings.allowedHours.start);
    const endTime = parseTime(parentalSettings.allowedHours.end);
    
    return currentTime >= startTime && currentTime <= endTime;
  };
  
  // Track learning session time
  const startLearningSession = () => {
    const sessionStart = Date.now();
    return () => {
      const sessionDuration = (Date.now() - sessionStart) / 60000; // minutes
      setDailyTimeUsed(prev => prev + sessionDuration);
    };
  };
  
  // Parental dashboard access
  const accessParentalDashboard = async (password: string) => {
    // Verify parental password
    const storedPasswordHash = await localforage.getItem('parental_password_hash');
    const isValid = await bcrypt.compare(password, storedPasswordHash);
    
    if (!isValid) {
      throw new Error('Invalid parental password');
    }
    
    // Return dashboard data
    return {
      user: currentUser,
      settings: parentalSettings,
      dailyUsage: dailyTimeUsed,
      weeklyProgress: await getWeeklyProgress(),
      achievements: await getUserAchievements(),
      contentLogs: await getContentAccessLogs()
    };
  };
  
  // Export user data (COPPA compliance)
  const exportUserData = async () => {
    if (!currentUser) return null;
    
    return {
      user: {
        id: currentUser.id,
        grade: currentUser.grade,
        createdAt: currentUser.createdAt
      },
      progress: await localforage.getItem(`progress_${currentUser.id}`),
      achievements: await localforage.getItem(`achievements_${currentUser.id}`),
      projects: await getAllUserProjects(currentUser.id),
      timeUsage: await getTimeUsageHistory(currentUser.id),
      exportedAt: new Date().toISOString()
    };
  };
  
  // Delete all user data (COPPA compliance)
  const deleteUserData = async () => {
    if (!currentUser) return;
    
    const keys = await localforage.keys();
    const userKeys = keys.filter(key => 
      key.includes(currentUser.id) || key === 'current_user'
    );
    
    await Promise.all(userKeys.map(key => localforage.removeItem(key)));
    setCurrentUser(null);
    setParentalSettings(null);
    setDailyTimeUsed(0);
  };
  
  return {
    currentUser,
    parentalSettings,
    dailyTimeUsed,
    loading,
    createAnonymousUser,
    canContinueLearning,
    isWithinAllowedHours,
    startLearningSession,
    accessParentalDashboard,
    exportUserData,
    deleteUserData,
    updateParentalSettings: setParentalSettings,
    refresh: loadUserData
  };
};

// Usage in components
const SomeComponent = () => {
  const { 
    currentUser, 
    canContinueLearning, 
    isWithinAllowedHours,
    startLearningSession 
  } = useChildSafety();
  
  const handleStartLesson = () => {
    if (!canContinueLearning()) {
      alert("You've reached your daily learning limit! Great job today!");
      return;
    }
    
    if (!isWithinAllowedHours()) {
      alert("Learning time is outside your allowed hours. Check with a parent!");
      return;
    }
    
    const endSession = startLearningSession();
    // Start lesson...
    // When lesson ends, call endSession()
  };
  
  return (
    <Button onClick={handleStartLesson}>
      Start Learning
    </Button>
  );
};
```

### useMobile
```typescript
// client/src/hooks/use-mobile.tsx
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchSupport, setTouchSupport] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
      setTouchSupport('ontouchstart' in window);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);
  
  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
    touchSupport,
    // Helper utilities
    getButtonSize: () => touchSupport ? 'lg' : 'md',
    getTextSize: () => isMobile ? 'text-lg' : 'text-base',
    getSpacing: () => isMobile ? 'p-6' : 'p-4'
  };
};

// Usage for responsive educational content
const ResponsiveLesson = () => {
  const { isMobile, getButtonSize, getTextSize } = useMobile();
  
  return (
    <div className={`lesson-container ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      <p className={`lesson-text ${getTextSize()}`}>
        Solve this math problem...
      </p>
      <Button size={getButtonSize()} className="mt-4">
        Submit Answer
      </Button>
    </div>
  );
};
```

## 🧪 Testing Components

### Child Behavior Simulation
```typescript
// client/src/__tests__/utils/childBehaviorSimulator.ts
interface ChildBehavior {
  grade: number;
  attentionSpan: number;      // seconds
  clickAccuracy: number;      // 0-1, lower for younger kids
  readingSpeed: number;       // words per minute
  taskSwitchingDelay: number; // milliseconds
  helpSeekingTendency: number; // 0-1, how often they ask for hints
}

const getChildBehaviorProfile = (grade: number): ChildBehavior => ({
  3: {
    grade: 3,
    attentionSpan: 300,        // 5 minutes
    clickAccuracy: 0.8,
    readingSpeed: 80,
    taskSwitchingDelay: 2000,
    helpSeekingTendency: 0.7
  },
  4: {
    grade: 4,
    attentionSpan: 420,        // 7 minutes
    clickAccuracy: 0.85,
    readingSpeed: 100,
    taskSwitchingDelay: 1500,
    helpSeekingTendency: 0.6
  },
  5: {
    grade: 5,
    attentionSpan: 600,        // 10 minutes
    clickAccuracy: 0.9,
    readingSpeed: 120,
    taskSwitchingDelay: 1200,
    helpSeekingTendency: 0.5
  },
  6: {
    grade: 6,
    attentionSpan: 900,        // 15 minutes
    clickAccuracy: 0.95,
    readingSpeed: 140,
    taskSwitchingDelay: 1000,
    helpSeekingTendency: 0.4
  }
}[grade] || getChildBehaviorProfile(4));

// Simulate child interactions in tests
export const simulateChildClick = async (
  element: HTMLElement, 
  childGrade: number,
  userEvent: any
) => {
  const behavior = getChildBehaviorProfile(childGrade);
  
  // Add realistic delay for task switching
  await new Promise(resolve => 
    setTimeout(resolve, behavior.taskSwitchingDelay * Math.random())
  );
  
  // Simulate click accuracy (sometimes miss the target)
  if (Math.random() < behavior.clickAccuracy) {
    await userEvent.click(element);
  } else {
    // Simulate missing the target and trying again
    await new Promise(resolve => setTimeout(resolve, 500));
    await userEvent.click(element);
  }
};

export const simulateChildReading = async (text: string, childGrade: number) => {
  const behavior = getChildBehaviorProfile(childGrade);
  const words = text.split(' ').length;
  const readingTime = (words / behavior.readingSpeed) * 60000; // ms
  
  return new Promise(resolve => setTimeout(resolve, readingTime));
};

export const shouldSeekHelp = (childGrade: number): boolean => {
  const behavior = getChildBehaviorProfile(childGrade);
  return Math.random() < behavior.helpSeekingTendency;
};
```

### Testing Utilities
```typescript
// client/src/__tests__/utils/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'wouter/memory';

// Create a test wrapper with all necessary providers
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper: createTestWrapper(),
    ...options,
  });
};

// Mock educational data for testing
export const mockEducationalData = {
  user: {
    id: 'test-user-123',
    grade: 4,
    preferences: {
      subject: 'math',
      difficulty: 'intermediate'
    }
  },
  lesson: {
    id: 'math-fractions-1',
    title: 'Introduction to Fractions',
    grade: 4,
    subject: 'math',
    content: 'A fraction represents part of a whole...'
  },
  progress: {
    lessonsCompleted: 5,
    currentStreak: 3,
    totalTimeMinutes: 120,
    lastAccessed: new Date()
  }
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    if (level > previousLevel + 1) {
      throw new Error(`Heading level ${level} follows level ${previousLevel} - skipped levels not allowed`);
    }
    previousLevel = level;
  });
  
  // Check for alt text on images
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt) {
      throw new Error(`Image missing alt text: ${img.src}`);
    }
  });
  
  // Check for form labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = container.querySelector(`label[for="${input.id}"]`) ||
                 input.closest('label') ||
                 container.querySelector(`[aria-labelledby="${input.id}"]`);
    
    if (!label && !input.getAttribute('aria-label')) {
      throw new Error(`Input missing accessible label: ${input.type}`);
    }
  });
  
  return true;
};

// Child safety testing helpers  
export const validateChildSafeContent = (text: string): boolean => {
  const inappropriateWords = [
    'violence', 'weapon', 'hate', 'hurt', 'stupid', 'dumb',
    'kill', 'dead', 'blood', 'fight', 'war', 'gun', 'knife'
  ];
  
  const lowercaseText = text.toLowerCase();
  return !inappropriateWords.some(word => lowercaseText.includes(word));
};

export const validateAgeAppropriateness = (content: string, grade: number): boolean => {
  const maxComplexityScore = {
    3: 50,   // Simple sentences, basic vocabulary
    4: 70,   // Compound sentences, moderate vocabulary
    5: 85,   // Complex sentences, advanced vocabulary
    6: 100   // Full complexity appropriate for grade 6
  }[grade] || 70;
  
  // Simple complexity scoring (word length, sentence structure)
  const words = content.split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const sentences = content.split(/[.!?]+/).length;
  const avgSentenceLength = words.length / sentences;
  
  const complexityScore = (avgWordLength * 5) + (avgSentenceLength * 2);
  
  return complexityScore <= maxComplexityScore;
};
```

---

## 🔍 Component Usage Examples

### Complete Educational Page Example
```typescript
// Complete math lesson page combining multiple components
const MathLessonPage: React.FC = () => {
  const { currentUser, canContinueLearning, startLearningSession } = useChildSafety();
  const { isMobile, getButtonSize } = useMobile();
  const [currentProblem, setCurrentProblem] = useState(null);
  const [showHints, setShowHints] = useState(false);
  
  if (!canContinueLearning()) {
    return (
      <LoadingScreen 
        message="You've completed your learning time for today! Great job!"
        showSpinner={false}
      />
    );
  }
  
  return (
    <AccessibilityWrapper
      highContrast={currentUser?.preferences.highContrast}
      largeText={currentUser?.preferences.largeText}
    >
      <ContentFilter 
        grade={currentUser?.grade || 4}
        subject="math"
        strictMode={true}
      >
        <div className="math-lesson-page">
          {/* Progress indicator */}
          <ProgressBar 
            value={75}
            label="Lesson Progress"
            color="green"
            size="lg"
            className="mb-6"
          />
          
          {/* Main problem */}
          <SpeakableText
            text={currentProblem?.description || "Loading your next math problem..."}
            showControls={true}
            emphasize={['solve', 'answer', 'think']}
          >
            <Card className="problem-card mb-6">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  🧮 Problem #{currentProblem?.number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="problem-content text-xl text-center">
                  {currentProblem?.description}
                </div>
              </CardContent>
            </Card>
          </SpeakableText>
          
          {/* Answer input */}
          <Card className="answer-card mb-6">
            <CardContent className="pt-6">
              <Form>
                <FormField
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-center block">
                        Your Answer:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-2xl text-center p-4"
                          placeholder="Type your answer here"
                          autoFocus
                        />
                      </FormControl>
                      <FormDescription className="text-center">
                        Take your time and think it through!
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size={getButtonSize()}
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleSubmitAnswer}
            >
              ✓ Submit Answer
            </Button>
            
            <Button
              variant="outline"
              size={getButtonSize()}
              onClick={() => setShowHints(true)}
            >
              💡 Need Help?
            </Button>
          </div>
          
          {/* AI Hint Assistant */}
          {showHints && (
            <HintAssistant
              problemContext={currentProblem?.description}
              subject="math"
              grade={currentUser?.grade || 4}
              onHintGenerated={(hint) => {
                console.log('Hint provided:', hint);
                // Track for academic integrity
              }}
              className="mt-6"
            />
          )}
          
          {/* Achievement celebration */}
          {currentUser?.recentAchievement && (
            <AchievementBadge
              achievement={currentUser.recentAchievement}
              size="lg"
              className="mt-6 mx-auto"
              onClick={() => {
                // Show achievement details
              }}
            />
          )}
        </div>
      </ContentFilter>
    </AccessibilityWrapper>
  );
};
```

This comprehensive component guide provides developers with all the tools needed to build safe, accessible, and engaging educational experiences for children grades 3-6. Each component is designed with child safety, accessibility, and educational effectiveness as core principles.