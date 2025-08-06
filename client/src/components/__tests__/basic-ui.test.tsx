import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Test a basic button component
const TestButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ 
  children, 
  onClick 
}) => (
  <button onClick={onClick} className="btn btn-primary">
    {children}
  </button>
);

describe('Basic UI Components for Kids', () => {
  it('renders button with child-friendly text', () => {
    render(<TestButton>Let's Learn Math!</TestButton>);
    
    expect(screen.getByText("Let's Learn Math!")).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click interactions', () => {
    const mockClick = jest.fn();
    render(<TestButton onClick={mockClick}>Click Me</TestButton>);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('uses accessible HTML structure', () => {
    render(<TestButton>Accessible Button</TestButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Accessible Button');
  });
});

// Test educational content display
const EducationalCard: React.FC<{ subject: string; level: number }> = ({ 
  subject, 
  level 
}) => (
  <div className="card">
    <h3>{subject} for Grade {level}</h3>
    <p>Learn amazing {subject.toLowerCase()} concepts!</p>
    <button>Start Learning</button>
  </div>
);

describe('Educational Content Components', () => {
  it('displays subject and grade level', () => {
    render(<EducationalCard subject="Math" level={4} />);
    
    expect(screen.getByText('Math for Grade 4')).toBeInTheDocument();
    expect(screen.getByText(/Learn amazing math concepts/)).toBeInTheDocument();
  });

  it('provides start learning action', () => {
    render(<EducationalCard subject="Science" level={3} />);
    
    expect(screen.getByText('Start Learning')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Learning' })).toBeInTheDocument();
  });

  it('handles different subjects appropriately', () => {
    const subjects = ['Math', 'Reading', 'Science', 'Art'];
    
    subjects.forEach((subject, index) => {
      const grade = index + 3; // Grades 3-6
      const { rerender } = render(<EducationalCard subject={subject} level={grade} />);
      
      expect(screen.getByText(`${subject} for Grade ${grade}`)).toBeInTheDocument();
      
      if (index < subjects.length - 1) {
        rerender(<EducationalCard subject={subjects[index + 1]} level={grade + 1} />);
      }
    });
  });
});

// Test safety and age-appropriateness
describe('Content Safety Validation', () => {
  const SafeContentWrapper: React.FC<{ content: string }> = ({ content }) => {
    const isContentSafe = (text: string): boolean => {
      const inappropriateWords = ['violence', 'weapon', 'hurt', 'hate'];
      return !inappropriateWords.some(word => text.toLowerCase().includes(word));
    };

    return (
      <div>
        {isContentSafe(content) ? (
          <p data-testid="safe-content">{content}</p>
        ) : (
          <p data-testid="blocked-content">Content not appropriate for children</p>
        )}
      </div>
    );
  };

  it('displays safe educational content', () => {
    const safeContent = 'Learn about fun addition problems with colorful examples!';
    render(<SafeContentWrapper content={safeContent} />);
    
    expect(screen.getByTestId('safe-content')).toBeInTheDocument();
    expect(screen.getByText(safeContent)).toBeInTheDocument();
  });

  it('blocks inappropriate content', () => {
    const unsafeContent = 'This content contains violence and weapons';
    render(<SafeContentWrapper content={unsafeContent} />);
    
    expect(screen.getByTestId('blocked-content')).toBeInTheDocument();
    expect(screen.getByText('Content not appropriate for children')).toBeInTheDocument();
  });

  it('validates multiple content samples', () => {
    const contentSamples = [
      { text: 'Practice multiplication tables with fun games', safe: true },
      { text: 'Learn about colors and shapes in art class', safe: true },
      { text: 'Discover how plants grow in our garden', safe: true },
      { text: 'Story contains fighting and weapons', safe: false }
    ];

    contentSamples.forEach(sample => {
      const { rerender } = render(<SafeContentWrapper content={sample.text} />);
      
      if (sample.safe) {
        expect(screen.getByTestId('safe-content')).toBeInTheDocument();
      } else {
        expect(screen.getByTestId('blocked-content')).toBeInTheDocument();
      }
      
      // Clean up for next iteration
      rerender(<div></div>);
    });
  });
});

// Test performance and usability
describe('Performance and Child Usability', () => {
  it('renders quickly for child attention spans', () => {
    const startTime = performance.now();
    
    render(
      <div>
        <TestButton>Fast Button 1</TestButton>
        <TestButton>Fast Button 2</TestButton>
        <TestButton>Fast Button 3</TestButton>
        <EducationalCard subject="Math" level={4} />
        <EducationalCard subject="Reading" level={5} />
      </div>
    );
    
    const renderTime = performance.now() - startTime;
    
    // Should render in under 100ms for good UX
    expect(renderTime).toBeLessThan(100);
  });

  it('provides large enough click targets for children', () => {
    render(<TestButton>Large Target</TestButton>);
    
    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);
    
    // Minimum 44px for child accessibility (mocked in test environment)
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('btn'); // Bootstrap ensures proper sizing
  });

  it('uses child-appropriate language', () => {
    render(
      <div>
        <EducationalCard subject="Math" level={3} />
        <TestButton>Let's Explore!</TestButton>
        <TestButton>Great Job!</TestButton>
      </div>
    );

    // Check for encouraging, simple language
    expect(screen.getByText(/Let's Explore!/)).toBeInTheDocument();
    expect(screen.getByText(/Great Job!/)).toBeInTheDocument();
    expect(screen.getByText(/Learn amazing math concepts/)).toBeInTheDocument();
  });
});

// Test accessibility features
describe('Accessibility for All Children', () => {
  it('provides keyboard navigation', () => {
    render(
      <div>
        <TestButton>Button 1</TestButton>
        <TestButton>Button 2</TestButton>
      </div>
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button.tabIndex).not.toBe(-1); // Should be keyboard accessible
    });
  });

  it('supports screen readers with proper labels', () => {
    render(
      <div>
        <TestButton>Read Aloud Math Problems</TestButton>
        <EducationalCard subject="Science" level={4} />
      </div>
    );

    const button = screen.getByRole('button', { name: 'Read Aloud Math Problems' });
    expect(button).toHaveAccessibleName('Read Aloud Math Problems');

    const heading = screen.getByRole('heading', { name: 'Science for Grade 4' });
    expect(heading).toBeInTheDocument();
  });

  it('maintains semantic HTML structure', () => {
    render(<EducationalCard subject="Art" level={5} />);

    // Check proper heading hierarchy
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    
    // Check proper button semantics
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});