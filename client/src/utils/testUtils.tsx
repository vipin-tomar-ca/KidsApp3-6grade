import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { MemoryRouter } from 'wouter';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock user for testing
export const mockUser = {
  id: 'test-user-123',
  name: 'Test Student',
  grade: 4,
  subject: 'math' as const,
  points: 150,
  level: 3,
  achievements: ['first-login', 'math-explorer'],
  progress: {
    math: 75,
    reading: 60,
    science: 45,
    art: 80,
    music: 30
  },
  timeSpent: 45,
  lessonsCompleted: 12,
  streakDays: 5
};

// Mock parental dashboard settings
export const mockParentalDashboard = {
  isParentalMode: false,
  parentalPassword: 'parent123',
  dataCollectionConsent: false,
  screenTimeLimit: 60,
  restrictedHours: {
    enabled: false,
    start: '20:00',
    end: '08:00'
  },
  allowedSubjects: ['math', 'reading', 'science', 'art', 'music'],
  safetyFiltering: true,
  progressReports: true,
  cloudSyncEnabled: false
};

// Mock child safety context
const mockChildSafetyContext = {
  currentUser: mockUser,
  parentalDashboard: mockParentalDashboard,
  timeRemaining: 30,
  isTimeUp: false,
  safetyViolations: [],
  updateUser: vi.fn(),
  updateParentalSettings: vi.fn(),
  addSafetyViolation: vi.fn(),
  resetTimer: vi.fn(),
};

// Mock React Query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialRoute?: string;
}

// Test wrapper with all providers
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  initialRoute = '/' 
}) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { 
    initialRoute?: string;
    mockUser?: typeof mockUser;
  }
): RenderResult => {
  const { initialRoute = '/', mockUser: customUser, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialRoute={initialRoute}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Child-friendly interaction helpers
export const childUserEvent = {
  // Simulate child clicking with some hesitation/multiple attempts
  async childClick(element: HTMLElement) {
    const user = userEvent.setup();
    await user.hover(element);
    await new Promise(resolve => setTimeout(resolve, 200)); // Child thinking time
    await user.click(element);
  },

  // Simulate child typing with hunt-and-peck style
  async childType(element: HTMLElement, text: string) {
    const user = userEvent.setup();
    await user.click(element);
    
    // Type character by character with varying delays
    for (let i = 0; i < text.length; i++) {
      await user.type(element, text[i]);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    }
  },

  // Simulate child dragging (often imprecise)
  async childDrag(element: HTMLElement, target: HTMLElement) {
    const user = userEvent.setup();
    await user.pointer([
      { keys: '[MouseLeft>]', target: element },
      { target, keys: '[/MouseLeft]' }
    ]);
  }
};

// Accessibility testing helpers
export const accessibilityHelpers = {
  // Check if text can be read by screen reader
  hasScreenReaderText: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-describedby') ||
      element.textContent
    );
  },

  // Check keyboard navigation
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute('tabindex');
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    
    return !!(
      tabIndex !== '-1' && 
      (
        ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
        ['button', 'link', 'tab', 'menuitem'].includes(role || '')
      )
    );
  },

  // Check color contrast (simplified)
  hasGoodContrast: (element: HTMLElement): boolean => {
    const styles = getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Simplified check - in real testing you'd use a proper contrast library
    return backgroundColor !== color;
  },

  // Check font size is readable for children
  hasReadableFontSize: (element: HTMLElement): boolean => {
    const styles = getComputedStyle(element);
    const fontSize = parseFloat(styles.fontSize);
    return fontSize >= 14; // Minimum 14px for children
  }
};

// Performance testing helpers
export const performanceHelpers = {
  // Measure component render time
  measureRenderTime: async (renderFn: () => void): Promise<number> => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  // Check if component renders within acceptable time for children (2 seconds)
  isRenderTimeAcceptable: (renderTime: number): boolean => {
    return renderTime < 2000;
  }
};

// Usability testing simulation
export const usabilityTestSimulation = {
  // Simulate a 3rd grader's interaction pattern
  grade3Behavior: {
    attentionSpan: 5000, // 5 seconds
    clickAccuracy: 0.7, // 70% accurate clicks
    readingSpeed: 50, // 50 words per minute
    comprehensionDelay: 3000 // 3 seconds to understand instructions
  },

  // Simulate a 6th grader's interaction pattern  
  grade6Behavior: {
    attentionSpan: 15000, // 15 seconds
    clickAccuracy: 0.9, // 90% accurate clicks
    readingSpeed: 120, // 120 words per minute
    comprehensionDelay: 1000 // 1 second to understand instructions
  },

  // Test if a user can complete a task independently
  async testIndependentNavigation(
    startElement: HTMLElement,
    targetElement: HTMLElement,
    gradeLevel: 3 | 4 | 5 | 6
  ): Promise<boolean> {
    const behavior = gradeLevel <= 4 ? 
      usabilityTestSimulation.grade3Behavior : 
      usabilityTestSimulation.grade6Behavior;

    try {
      await childUserEvent.childClick(startElement);
      await new Promise(resolve => setTimeout(resolve, behavior.comprehensionDelay));
      
      // Simulate looking for the target
      await new Promise(resolve => setTimeout(resolve, behavior.attentionSpan / 2));
      
      // Attempt to click target
      if (Math.random() < behavior.clickAccuracy) {
        await childUserEvent.childClick(targetElement);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
};

// Safety testing helpers
export const safetyTestHelpers = {
  // Check if content is age-appropriate
  isAgeAppropriate: (content: string, grade: number): boolean => {
    const inappropriateKeywords = [
      'violence', 'weapon', 'hurt', 'hate', 'stupid', 'dumb',
      'personal info', 'address', 'phone', 'email', 'password'
    ];
    
    const lowercaseContent = content.toLowerCase();
    return !inappropriateKeywords.some(keyword => 
      lowercaseContent.includes(keyword)
    );
  },

  // Check if external links are educational
  isEducationalLink: (url: string): boolean => {
    const educationalDomains = [
      'khanacademy.org',
      'ck12.org', 
      'education.com',
      'pbskids.org',
      'scholastic.com'
    ];
    
    return educationalDomains.some(domain => url.includes(domain));
  }
};

// Export everything including the custom render
export * from '@testing-library/react';
export { customRender as render };
export { userEvent } from '@testing-library/user-event';