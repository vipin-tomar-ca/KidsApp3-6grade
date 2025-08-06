import React from 'react';
import { render, screen, waitFor } from '@/utils/testUtils';
import { childUserEvent, accessibilityHelpers, usabilityTestSimulation } from '@/utils/testUtils';
import HomePage from '../home';
import '@testing-library/jest-dom';

describe('HomePage - Grades 3-6 Features', () => {
  beforeEach(() => {
    // Reset any global state
    localStorage.clear();
  });

  describe('Visual Design & Kid-Friendly Interface', () => {
    it('displays welcome message with student name', async () => {
      render(<HomePage />);
      
      expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
      expect(screen.getByText(/Hey there, Test Student!/i)).toBeInTheDocument();
    });

    it('shows colorful animated elements for engagement', async () => {
      render(<HomePage />);
      
      // Check for animated elements
      const animatedDots = screen.getAllByRole('generic').filter(el => 
        el.className.includes('animate-bounce')
      );
      expect(animatedDots.length).toBeGreaterThan(0);
    });

    it('displays point system and achievements', async () => {
      render(<HomePage />);
      
      expect(screen.getByText('150')).toBeInTheDocument(); // Points
      expect(screen.getByText(/points/i)).toBeInTheDocument();
    });

    it('uses readable fonts and colors for children', async () => {
      render(<HomePage />);
      
      const welcomeTitle = screen.getByText(/Welcome Back!/i);
      expect(accessibilityHelpers.hasReadableFontSize(welcomeTitle)).toBe(true);
      expect(accessibilityHelpers.hasGoodContrast(welcomeTitle)).toBe(true);
    });
  });

  describe('Subject Selection - Child Navigation', () => {
    it('displays all core subjects with icons', async () => {
      render(<HomePage />);
      
      expect(screen.getByText('Math')).toBeInTheDocument();
      expect(screen.getByText('Reading')).toBeInTheDocument(); 
      expect(screen.getByText('Science')).toBeInTheDocument();
      expect(screen.getByText('Art')).toBeInTheDocument();
    });

    it('shows descriptive text for each subject', async () => {
      render(<HomePage />);
      
      expect(screen.getByText('Numbers & Puzzles')).toBeInTheDocument();
      expect(screen.getByText('Stories & Words')).toBeInTheDocument();
      expect(screen.getByText('Experiments')).toBeInTheDocument();
      expect(screen.getByText('Create & Draw')).toBeInTheDocument();
    });

    it('allows children to click subject cards easily', async () => {
      render(<HomePage />);
      
      const mathCard = screen.getByText('Math').closest('[role="button"], button, a');
      expect(mathCard).toBeInTheDocument();
      
      if (mathCard) {
        await childUserEvent.childClick(mathCard as HTMLElement);
        // Verify click was registered (would navigate in real app)
      }
    });

    it('provides keyboard navigation for accessibility', async () => {
      render(<HomePage />);
      
      const subjectCards = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );
      
      subjectCards.forEach(card => {
        expect(accessibilityHelpers.isKeyboardAccessible(card)).toBe(true);
      });
    });
  });

  describe('Progress Display', () => {
    it('shows progress for completed subjects', async () => {
      render(<HomePage />);
      
      // Math progress should be visible (75% from mock)
      await waitFor(() => {
        expect(screen.getByText(/75%/)).toBeInTheDocument();
      });
    });

    it('displays learning statistics', async () => {
      render(<HomePage />);
      
      expect(screen.getByText('12')).toBeInTheDocument(); // Lessons completed
      expect(screen.getByText('45')).toBeInTheDocument(); // Time spent
      expect(screen.getByText('5')).toBeInTheDocument(); // Streak days
    });

    it('shows motivational messages', async () => {
      render(<HomePage />);
      
      expect(screen.getByText(/Ready to learn something amazing today?/i)).toBeInTheDocument();
    });
  });

  describe('Age-Appropriate Content', () => {
    it('uses child-friendly language throughout', async () => {
      render(<HomePage />);
      
      const allText = screen.getByText(/.*/).textContent || '';
      expect(allText).toMatch(/fun|amazing|great|awesome|cool/i);
      
      // No complex vocabulary
      expect(allText).not.toMatch(/sophisticated|complex|advanced/i);
    });

    it('includes encouraging emojis and visual elements', async () => {
      render(<HomePage />);
      
      // Check for emoji/visual elements in text
      expect(screen.getByText(/👋/)).toBeInTheDocument();
    });

    it('avoids overwhelming content density', async () => {
      render(<HomePage />);
      
      // Check that subjects are organized in a manageable grid
      const subjectButtons = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      ).filter(el => 
        ['Math', 'Reading', 'Science', 'Art'].some(subject =>
          el.textContent?.includes(subject)
        )
      );
      
      expect(subjectButtons.length).toBeLessThanOrEqual(6); // Not overwhelming
    });
  });

  describe('Accessibility Features', () => {
    it('provides screen reader support', async () => {
      render(<HomePage />);
      
      const interactiveElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );
      
      interactiveElements.forEach(element => {
        expect(accessibilityHelpers.hasScreenReaderText(element)).toBe(true);
      });
    });

    it('supports keyboard navigation', async () => {
      render(<HomePage />);
      
      const navigableElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );
      
      navigableElements.forEach(element => {
        expect(element).toHaveAttribute('tabindex', expect.not.stringMatching(/-1/));
      });
    });

    it('has proper color contrast for readability', async () => {
      render(<HomePage />);
      
      const textElements = [
        screen.getByText(/Welcome Back!/i),
        screen.getByText('Math'),
        screen.getByText('Reading')
      ];
      
      textElements.forEach(element => {
        expect(accessibilityHelpers.hasGoodContrast(element)).toBe(true);
      });
    });
  });

  describe('Usability Testing Simulation', () => {
    it('allows 3rd graders to navigate independently', async () => {
      render(<HomePage />);
      
      const homeElement = screen.getByText(/Welcome Back!/i);
      const mathElement = screen.getByText('Math');
      
      const canNavigate = await usabilityTestSimulation.testIndependentNavigation(
        homeElement,
        mathElement,
        3
      );
      
      expect(canNavigate).toBe(true);
    });

    it('allows 6th graders to navigate efficiently', async () => {
      render(<HomePage />);
      
      const homeElement = screen.getByText(/Ready to learn/i);
      const scienceElement = screen.getByText('Science');
      
      const canNavigate = await usabilityTestSimulation.testIndependentNavigation(
        homeElement,
        scienceElement,
        6
      );
      
      expect(canNavigate).toBe(true);
    });

    it('provides clear visual hierarchy for child comprehension', async () => {
      render(<HomePage />);
      
      // Main title should be largest
      const mainTitle = screen.getByText(/Welcome Back!/i);
      const subjectTitle = screen.getByText('Math');
      
      const mainTitleSize = parseFloat(getComputedStyle(mainTitle).fontSize);
      const subjectTitleSize = parseFloat(getComputedStyle(subjectTitle).fontSize);
      
      expect(mainTitleSize).toBeGreaterThan(subjectTitleSize);
    });
  });

  describe('Performance & Loading', () => {
    it('renders quickly for short child attention spans', async () => {
      const renderTime = await performanceHelpers.measureRenderTime(() => {
        render(<HomePage />);
      });
      
      expect(performanceHelpers.isRenderTimeAcceptable(renderTime)).toBe(true);
    });

    it('shows loading states appropriately', async () => {
      render(<HomePage />);
      
      // Component should render immediately with basic content
      expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    });
  });

  describe('Safety & COPPA Compliance', () => {
    it('displays only age-appropriate content', async () => {
      render(<HomePage />);
      
      const pageContent = document.body.textContent || '';
      expect(safetyTestHelpers.isAgeAppropriate(pageContent, 4)).toBe(true);
    });

    it('does not collect personal information', async () => {
      render(<HomePage />);
      
      // Should not have forms asking for personal info
      const inputs = screen.queryAllByRole('textbox');
      inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
        const label = input.getAttribute('aria-label')?.toLowerCase() || '';
        
        expect(placeholder).not.toMatch(/email|phone|address/);
        expect(label).not.toMatch(/email|phone|address/);
      });
    });
  });
});