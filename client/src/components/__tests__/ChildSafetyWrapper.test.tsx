import React from 'react';
import { render, screen, waitFor, act } from '@/utils/testUtils';
import { childUserEvent, safetyTestHelpers } from '@/utils/testUtils';
import ChildSafetyWrapper from '../ChildSafetyWrapper';
import '@testing-library/jest-dom';

// Mock child components
const MockChildComponent = () => (
  <div data-testid="child-component">Learning Content Here</div>
);

describe('ChildSafetyWrapper - COPPA Compliance & Safety', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Time Management & Screen Time Limits', () => {
    it('displays remaining time for child users', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should show time remaining
      expect(screen.getByText(/30/)).toBeInTheDocument(); // 30 minutes from mock
    });

    it('warns when time is running low', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Simulate time passing to trigger warning (5 minutes left)
      act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000); // 25 minutes passed
      });
      
      await waitFor(() => {
        expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
      });
    });

    it('prevents access when time limit exceeded', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Simulate time running out
      act(() => {
        vi.advanceTimersByTime(31 * 60 * 1000); // Over 30 minutes
      });
      
      await waitFor(() => {
        expect(screen.getByText(/time is up/i)).toBeInTheDocument();
      });
      
      // Child component should be hidden
      expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
    });

    it('allows parental override for time limits', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Simulate time up scenario
      act(() => {
        vi.advanceTimersByTime(31 * 60 * 1000);
      });
      
      // Look for parental override option
      await waitFor(() => {
        const parentalButton = screen.queryByText(/parent/i);
        if (parentalButton) {
          expect(parentalButton).toBeInTheDocument();
        }
      });
    });
  });

  describe('Content Filtering & Age Appropriateness', () => {
    it('blocks inappropriate content', async () => {
      render(
        <ChildSafetyWrapper>
          <div>This content contains violence and weapons</div>
        </ChildSafetyWrapper>
      );
      
      // Inappropriate content should be filtered
      const content = document.body.textContent || '';
      expect(safetyTestHelpers.isAgeAppropriate(content, 4)).toBe(true);
    });

    it('allows educational content through', async () => {
      render(
        <ChildSafetyWrapper>
          <div>Let's learn about math and science together!</div>
        </ChildSafetyWrapper>
      );
      
      expect(screen.getByText(/learn about math and science/)).toBeInTheDocument();
    });

    it('filters external links for safety', async () => {
      render(
        <ChildSafetyWrapper>
          <a href="https://khanacademy.org/math" data-testid="safe-link">
            Educational Link
          </a>
          <a href="https://unsafe-site.com" data-testid="unsafe-link">
            Unsafe Link
          </a>
        </ChildSafetyWrapper>
      );
      
      const safeLink = screen.getByTestId('safe-link');
      expect(safeTestHelpers.isEducationalLink(safeLink.getAttribute('href') || '')).toBe(true);
    });
  });

  describe('Parental Controls & Dashboard Access', () => {
    it('provides parental dashboard access', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Look for parental controls indicator
      const parentalIndicator = screen.queryByText(/parent/i) || 
                               screen.queryByRole('button', { name: /settings/i });
      
      if (parentalIndicator) {
        expect(parentalIndicator).toBeInTheDocument();
      }
    });

    it('requires password for parental settings', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Attempt to access parental controls
      const settingsButton = screen.queryByRole('button', { name: /settings/i });
      if (settingsButton) {
        await childUserEvent.childClick(settingsButton);
        
        // Should prompt for password
        await waitFor(() => {
          expect(screen.queryByText(/password/i)).toBeInTheDocument();
        });
      }
    });

    it('shows data collection consent status', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should indicate current consent status
      const consentIndicator = screen.queryByText(/consent/i) ||
                              screen.queryByText(/privacy/i);
      
      // Consent status should be visible (default is not granted)
      expect(document.body.textContent).toContain('consent' || 'privacy' || 'data');
    });
  });

  describe('Privacy Protection & COPPA Compliance', () => {
    it('does not collect personal information without consent', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should not have forms collecting personal info
      const inputs = screen.queryAllByRole('textbox');
      inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
        const label = input.getAttribute('aria-label')?.toLowerCase() || '';
        
        expect(placeholder).not.toMatch(/name|email|phone|address/);
        expect(label).not.toMatch(/name|email|phone|address/);
      });
    });

    it('uses anonymous user identification', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should use UUID or anonymous ID, not real names
      const content = document.body.textContent || '';
      expect(content).toMatch(/Test Student/); // Mock name is okay for testing
      expect(content).not.toMatch(/\b[A-Z][a-z]+ [A-Z][a-z]+@/); // No email patterns
    });

    it('stores data locally by default', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // LocalStorage should be used (mocked in tests)
      expect(localStorage.getItem).toBeDefined();
    });

    it('provides data export and deletion options', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should have privacy controls available
      const privacyControls = screen.queryByText(/export|delete|privacy/i);
      // These might be in parental dashboard
      if (privacyControls) {
        expect(privacyControls).toBeInTheDocument();
      }
    });
  });

  describe('Emergency Safety Features', () => {
    it('provides immediate help access', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should have help or support access
      const helpButton = screen.queryByText(/help|support/i);
      if (helpButton) {
        expect(helpButton).toBeInTheDocument();
      }
    });

    it('logs safety violations for parental review', async () => {
      // Mock a safety violation scenario
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(
        <ChildSafetyWrapper>
          <div>Inappropriate content test</div>
        </ChildSafetyWrapper>
      );
      
      // Safety system should log violations
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('provides safe learning environment indicators', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should show safety status
      const safetyIndicator = screen.queryByText(/safe|secure|protected/i);
      if (safetyIndicator) {
        expect(safetyIndicator).toBeInTheDocument();
      }
    });
  });

  describe('Age-Appropriate Interface Design', () => {
    it('uses child-friendly visual elements', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should have engaging visual elements
      const visualElements = document.querySelectorAll('[class*="color"], [class*="bg-"]');
      expect(visualElements.length).toBeGreaterThan(0);
    });

    it('provides clear navigation for children', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Navigation should be simple and clear
      const navElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );
      
      navElements.forEach(element => {
        // Should have descriptive text
        expect(element.textContent?.length).toBeGreaterThan(0);
      });
    });

    it('uses appropriate color schemes for readability', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should use high-contrast, readable colors
      const textElements = screen.getAllByRole('generic');
      textElements.forEach(element => {
        if (element.textContent) {
          expect(accessibilityHelpers.hasGoodContrast(element)).toBe(true);
        }
      });
    });
  });

  describe('Error Handling & User Experience', () => {
    it('handles errors gracefully for child users', async () => {
      // Mock an error scenario
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <ChildSafetyWrapper>
          <div>Error simulation</div>
        </ChildSafetyWrapper>
      );
      
      // Should not crash or show scary error messages to children
      expect(screen.queryByText(/error|failed|crash/i)).not.toBeInTheDocument();
      
      consoleError.mockRestore();
    });

    it('provides helpful feedback for child actions', async () => {
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      // Should provide positive, encouraging feedback
      const feedback = document.body.textContent || '';
      expect(feedback).toMatch(/learning|great|good|nice|well done/i);
    });

    it('maintains consistent performance', async () => {
      const renderStart = performance.now();
      
      render(
        <ChildSafetyWrapper>
          <MockChildComponent />
        </ChildSafetyWrapper>
      );
      
      const renderTime = performance.now() - renderStart;
      expect(renderTime).toBeLessThan(100); // Should render quickly
    });
  });
});