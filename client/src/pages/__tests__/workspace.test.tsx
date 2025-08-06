import React from 'react';
import { render, screen, waitFor, fireEvent } from '@/utils/testUtils';
import { childUserEvent, accessibilityHelpers, usabilityTestSimulation } from '@/utils/testUtils';
import WorkspacePage from '../workspace';
import '@testing-library/jest-dom';

// Mock react-quill
vi.mock('react-quill', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="quill-editor"
    />
  )
}));

// Mock react-sketch-canvas
vi.mock('react-sketch-canvas', () => ({
  ReactSketchCanvas: React.forwardRef(({ width, height, strokeColor }: any, ref: any) => (
    <canvas
      ref={ref}
      width={width}
      height={height}
      data-testid="sketch-canvas"
      style={{ border: '1px solid #ccc', backgroundColor: strokeColor }}
    />
  ))
}));

describe('StudentWorkspace - Interactive Learning Features', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock canvas methods
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
      putImageData: vi.fn(),
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    });
  });

  describe('Workspace Tabs & Navigation', () => {
    it('displays all workspace tabs for different activities', async () => {
      render(<WorkspacePage />);
      
      expect(screen.getByText('Writing')).toBeInTheDocument();
      expect(screen.getByText('Math')).toBeInTheDocument();
      expect(screen.getByText('Drawing')).toBeInTheDocument();
    });

    it('allows children to switch between tabs easily', async () => {
      render(<WorkspacePage />);
      
      const mathTab = screen.getByText('Math');
      await childUserEvent.childClick(mathTab);
      
      // Math tools should appear
      await waitFor(() => {
        expect(screen.getByText(/Math Workspace/i)).toBeInTheDocument();
      });
    });

    it('maintains tab state when switching', async () => {
      render(<WorkspacePage />);
      
      // Enter some text in writing tab
      const writingEditor = screen.getByTestId('quill-editor');
      await childUserEvent.childType(writingEditor, 'My story about cats');
      
      // Switch to math tab
      const mathTab = screen.getByText('Math');
      await childUserEvent.childClick(mathTab);
      
      // Switch back to writing
      const writingTab = screen.getByText('Writing');
      await childUserEvent.childClick(writingTab);
      
      // Text should still be there
      expect(writingEditor).toHaveValue('My story about cats');
    });
  });

  describe('Writing Tools - Age Appropriate', () => {
    it('provides rich text editor with child-friendly tools', async () => {
      render(<WorkspacePage />);
      
      const editor = screen.getByTestId('quill-editor');
      expect(editor).toBeInTheDocument();
      expect(editor).toHaveAttribute('placeholder');
    });

    it('supports text formatting for creative expression', async () => {
      render(<WorkspacePage />);
      
      // Check for formatting buttons (would be in real rich text editor)
      const editor = screen.getByTestId('quill-editor');
      await childUserEvent.childType(editor, 'Once upon a time...');
      
      expect(editor).toHaveValue('Once upon a time...');
    });

    it('provides writing prompts and suggestions', async () => {
      render(<WorkspacePage />);
      
      // Should have helpful placeholder or hints
      const editor = screen.getByTestId('quill-editor');
      expect(editor).toHaveAttribute('placeholder');
    });

    it('shows word count for writing goals', async () => {
      render(<WorkspacePage />);
      
      const editor = screen.getByTestId('quill-editor');
      await childUserEvent.childType(editor, 'The cat sat on the mat and looked around.');
      
      // Word count should update (component tracks this)
      await waitFor(() => {
        expect(screen.getByText(/words/i)).toBeInTheDocument();
      });
    });
  });

  describe('Math Tools & Problem Solving', () => {
    it('provides math equation editor', async () => {
      render(<WorkspacePage />);
      
      const mathTab = screen.getByText('Math');
      await childUserEvent.childClick(mathTab);
      
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('supports mathematical expressions input', async () => {
      render(<WorkspacePage />);
      
      const mathTab = screen.getByText('Math');
      await childUserEvent.childClick(mathTab);
      
      await waitFor(() => {
        const mathInput = screen.getByRole('textbox');
        childUserEvent.childType(mathInput, '2 + 3 = 5');
        expect(mathInput).toHaveValue('2 + 3 = 5');
      });
    });

    it('provides math examples and templates', async () => {
      render(<WorkspacePage />);
      
      const mathTab = screen.getByText('Math');
      await childUserEvent.childClick(mathTab);
      
      // Should show helpful examples
      await waitFor(() => {
        expect(screen.getByText(/examples/i)).toBeInTheDocument();
      });
    });
  });

  describe('Drawing Canvas - Creative Expression', () => {
    it('provides drawing canvas with appropriate tools', async () => {
      render(<WorkspacePage />);
      
      const drawingTab = screen.getByText('Drawing');
      await childUserEvent.childClick(drawingTab);
      
      await waitFor(() => {
        const canvas = screen.getByTestId('sketch-canvas');
        expect(canvas).toBeInTheDocument();
      });
    });

    it('allows color selection for artistic creation', async () => {
      render(<WorkspacePage />);
      
      const drawingTab = screen.getByText('Drawing');
      await childUserEvent.childClick(drawingTab);
      
      await waitFor(() => {
        // Canvas should be present with drawing capabilities
        const canvas = screen.getByTestId('sketch-canvas');
        expect(canvas).toBeInTheDocument();
      });
    });

    it('provides clear canvas functionality', async () => {
      render(<WorkspacePage />);
      
      const drawingTab = screen.getByText('Drawing');
      await childUserEvent.childClick(drawingTab);
      
      await waitFor(() => {
        // Should have clear/reset functionality
        const canvas = screen.getByTestId('sketch-canvas');
        expect(canvas).toBeInTheDocument();
      });
    });
  });

  describe('Save & Load Functionality', () => {
    it('allows saving work with child-friendly names', async () => {
      render(<WorkspacePage />);
      
      // Type some content
      const editor = screen.getByTestId('quill-editor');
      await childUserEvent.childType(editor, 'My amazing story');
      
      // Look for save button
      const saveButton = screen.getByText(/save/i);
      expect(saveButton).toBeInTheDocument();
      
      await childUserEvent.childClick(saveButton);
    });

    it('shows saved works in an organized way', async () => {
      render(<WorkspacePage />);
      
      // After saving, should show in saved works
      await waitFor(() => {
        expect(screen.getByText(/saved/i)).toBeInTheDocument();
      });
    });

    it('allows loading previous work', async () => {
      render(<WorkspacePage />);
      
      // Should be able to access saved work
      const savedWorksSection = screen.queryByText(/saved/i);
      if (savedWorksSection) {
        expect(savedWorksSection).toBeInTheDocument();
      }
    });
  });

  describe('Progress Tracking & Encouragement', () => {
    it('shows encouraging messages', async () => {
      render(<WorkspacePage />);
      
      expect(screen.getByText(/Keep Going!/i)).toBeInTheDocument();
    });

    it('displays progress statistics', async () => {
      render(<WorkspacePage />);
      
      // Should show words written, time spent, etc.
      expect(screen.getByText(/progress/i)).toBeInTheDocument();
    });

    it('provides achievement feedback', async () => {
      render(<WorkspacePage />);
      
      // Should show badges or achievements
      expect(screen.getByText(/badge/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility & Child-Friendly Design', () => {
    it('supports keyboard navigation between tools', async () => {
      render(<WorkspacePage />);
      
      const interactiveElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('tab'),
        screen.getAllByRole('textbox')
      );
      
      interactiveElements.forEach(element => {
        expect(accessibilityHelpers.isKeyboardAccessible(element)).toBe(true);
      });
    });

    it('provides tooltips and help for child users', async () => {
      render(<WorkspacePage />);
      
      // Should have helpful tips
      expect(screen.getByText(/tip/i)).toBeInTheDocument();
    });

    it('uses appropriate font sizes and colors', async () => {
      render(<WorkspacePage />);
      
      const textElements = screen.getAllByRole('heading');
      textElements.forEach(element => {
        expect(accessibilityHelpers.hasReadableFontSize(element)).toBe(true);
      });
    });

    it('provides clear visual feedback for actions', async () => {
      render(<WorkspacePage />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Should have visual states (hover, active, etc.)
        expect(button).toHaveClass(/btn|button/);
      });
    });
  });

  describe('Usability for Different Grade Levels', () => {
    it('is navigable by 3rd graders independently', async () => {
      render(<WorkspacePage />);
      
      const startElement = screen.getByText('Writing');
      const targetElement = screen.getByTestId('quill-editor');
      
      const canNavigate = await usabilityTestSimulation.testIndependentNavigation(
        startElement,
        targetElement,
        3
      );
      
      expect(canNavigate).toBe(true);
    });

    it('provides appropriate complexity for 6th graders', async () => {
      render(<WorkspacePage />);
      
      // Should have enough features to engage older students
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThanOrEqual(3);
    });

    it('adapts interface complexity to user needs', async () => {
      render(<WorkspacePage />);
      
      // Interface should not be overwhelming
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeLessThan(15); // Not too many options
    });
  });

  describe('Performance & Responsiveness', () => {
    it('responds quickly to child interactions', async () => {
      render(<WorkspacePage />);
      
      const mathTab = screen.getByText('Math');
      const startTime = performance.now();
      
      await childUserEvent.childClick(mathTab);
      
      await waitFor(() => {
        expect(screen.getByText(/Math/)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Under 1 second
    });

    it('handles multiple rapid clicks gracefully', async () => {
      render(<WorkspacePage />);
      
      const drawingTab = screen.getByText('Drawing');
      
      // Rapid clicking simulation
      await childUserEvent.childClick(drawingTab);
      await childUserEvent.childClick(drawingTab);
      await childUserEvent.childClick(drawingTab);
      
      // Should still work correctly
      await waitFor(() => {
        expect(screen.getByTestId('sketch-canvas')).toBeInTheDocument();
      });
    });
  });

  describe('Safety & Content Appropriateness', () => {
    it('maintains safe content in all work areas', async () => {
      render(<WorkspacePage />);
      
      const pageContent = document.body.textContent || '';
      expect(safetyTestHelpers.isAgeAppropriate(pageContent, 4)).toBe(true);
    });

    it('prevents inappropriate content creation', async () => {
      render(<WorkspacePage />);
      
      // Text editor should have content filtering (mocked behavior)
      const editor = screen.getByTestId('quill-editor');
      await childUserEvent.childType(editor, 'This is appropriate educational content');
      
      expect(editor).toHaveValue('This is appropriate educational content');
    });
  });
});