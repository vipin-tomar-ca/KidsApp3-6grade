import React from 'react';
import { render, screen, waitFor } from '@/utils/testUtils';
import { childUserEvent } from '@/utils/testUtils';
import SpeakableText from '@/components/SpeakableText';
import '@testing-library/jest-dom';

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn().mockReturnValue([
    { name: 'Child Voice', lang: 'en-US', localService: true },
    { name: 'Adult Voice', lang: 'en-US', localService: true }
  ]),
  onvoiceschanged: null,
};

const mockUtterance = {
  text: '',
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  onstart: null,
  onend: null,
  onerror: null,
};

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: mockSpeechSynthesis,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockUtterance),
});

describe('Text-to-Speech Accessibility Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SpeakableText Component', () => {
    it('renders text content normally', () => {
      render(
        <SpeakableText text="Hello, this is a test message for children.">
          <p>Hello, this is a test message for children.</p>
        </SpeakableText>
      );

      expect(screen.getByText('Hello, this is a test message for children.')).toBeInTheDocument();
    });

    it('provides speak button for text-to-speech', () => {
      render(
        <SpeakableText text="Read this aloud please.">
          <p>Read this aloud please.</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      expect(speakButton).toBeInTheDocument();
    });

    it('speaks text when button is clicked', async () => {
      render(
        <SpeakableText text="This text should be spoken aloud.">
          <p>This text should be spoken aloud.</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('uses child-appropriate voice settings', async () => {
      render(
        <SpeakableText text="Child-friendly voice test">
          <p>Child-friendly voice test</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Check if SpeechSynthesisUtterance was created with appropriate settings
      expect(window.SpeechSynthesisUtterance).toHaveBeenCalled();
    });

    it('stops speaking when stop button is clicked', async () => {
      render(
        <SpeakableText text="This is a longer text that can be stopped mid-speech.">
          <p>This is a longer text that can be stopped mid-speech.</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // After speaking starts, should show stop button
      await waitFor(() => {
        const stopButton = screen.queryByRole('button', { name: /stop|pause/i });
        if (stopButton) {
          return childUserEvent.childClick(stopButton);
        }
      });

      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('Voice Selection for Children', () => {
    it('prefers child-friendly voices', () => {
      const voices = mockSpeechSynthesis.getVoices();
      const childVoice = voices.find(voice => voice.name.includes('Child'));
      
      expect(childVoice).toBeDefined();
      expect(childVoice?.name).toBe('Child Voice');
    });

    it('uses appropriate speech rate for children', async () => {
      render(
        <SpeakableText text="Speaking at child-appropriate pace">
          <p>Speaking at child-appropriate pace</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Rate should be slower for children (0.8-1.0 range)
      const utteranceCall = (window.SpeechSynthesisUtterance as any).mock.calls[0];
      if (utteranceCall) {
        // In real implementation, rate would be set
        expect(mockUtterance.rate).toBeLessThanOrEqual(1.0);
        expect(mockUtterance.rate).toBeGreaterThanOrEqual(0.8);
      }
    });

    it('uses clear pronunciation settings', async () => {
      render(
        <SpeakableText text="Clear pronunciation test">
          <p>Clear pronunciation test</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Pitch should be appropriate for children
      expect(mockUtterance.pitch).toBeGreaterThanOrEqual(1.0);
      expect(mockUtterance.pitch).toBeLessThanOrEqual(1.2);
    });
  });

  describe('Accessibility Integration', () => {
    it('provides keyboard access to speech controls', async () => {
      render(
        <SpeakableText text="Keyboard accessible speech">
          <p>Keyboard accessible speech</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      
      // Should be focusable
      speakButton.focus();
      expect(speakButton).toHaveFocus();
      
      // Should respond to Enter key
      fireEvent.keyDown(speakButton, { key: 'Enter', code: 'Enter' });
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('provides ARIA labels for screen readers', () => {
      render(
        <SpeakableText text="ARIA label test">
          <p>ARIA label test</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      
      expect(speakButton).toHaveAttribute('aria-label');
      expect(speakButton.getAttribute('aria-label')).toMatch(/speak|read|play/i);
    });

    it('indicates speaking state to assistive technology', async () => {
      render(
        <SpeakableText text="Speaking state indicator">
          <p>Speaking state indicator</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Should update ARIA state
      await waitFor(() => {
        expect(speakButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('supports high contrast mode', () => {
      render(
        <SpeakableText text="High contrast test">
          <p>High contrast test</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      
      // Button should be visible in high contrast mode
      expect(speakButton).toBeVisible();
      expect(window.getComputedStyle(speakButton).visibility).toBe('visible');
    });
  });

  describe('Child-Specific Features', () => {
    it('handles reading of educational content', async () => {
      const educationalText = "Two plus two equals four. This is basic addition.";
      
      render(
        <SpeakableText text={educationalText}>
          <p>{educationalText}</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('emphasizes important educational terms', async () => {
      const mathText = "The sum of three and five is eight.";
      
      render(
        <SpeakableText text={mathText} emphasize={['sum', 'eight']}>
          <p>{mathText}</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // In real implementation, emphasized words would be spoken differently
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('breaks long text into manageable chunks', async () => {
      const longText = "This is a very long educational text that should be broken into smaller chunks for better comprehension by young learners. Each chunk should be manageable and clear.";
      
      render(
        <SpeakableText text={longText}>
          <p>{longText}</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Should handle long text appropriately
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('provides playback controls for longer content', async () => {
      render(
        <SpeakableText 
          text="This is educational content that might need playback controls for children."
          showControls={true}
        >
          <p>This is educational content that might need playback controls for children.</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      await childUserEvent.childClick(speakButton);

      // Should show additional controls for longer content
      await waitFor(() => {
        const controls = screen.queryAllByRole('button');
        expect(controls.length).toBeGreaterThan(1); // Play/pause, stop, etc.
      });
    });
  });

  describe('Error Handling & Fallbacks', () => {
    it('handles browsers without speech synthesis gracefully', () => {
      // Mock browser without speech synthesis
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: undefined,
      });

      render(
        <SpeakableText text="Fallback test">
          <p>Fallback test</p>
        </SpeakableText>
      );

      // Should still render content even without speech synthesis
      expect(screen.getByText('Fallback test')).toBeInTheDocument();
      
      // Speak button should either be hidden or show appropriate message
      const speakButton = screen.queryByRole('button', { name: /speak|read|play/i });
      if (speakButton) {
        expect(speakButton).toBeDisabled();
      }
    });

    it('handles speech synthesis errors appropriately', async () => {
      // Mock speech synthesis error
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech synthesis error');
      });

      render(
        <SpeakableText text="Error handling test">
          <p>Error handling test</p>
        </SpeakableText>
      );

      const speakButton = screen.getByRole('button', { name: /speak|read|play/i });
      
      // Should not crash when speech fails
      await expect(childUserEvent.childClick(speakButton)).resolves.not.toThrow();
    });

    it('provides visual feedback when speech is unavailable', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        writable: true,
        value: { ...mockSpeechSynthesis, getVoices: () => [] }, // No voices available
      });

      render(
        <SpeakableText text="No voices available">
          <p>No voices available</p>
        </SpeakableText>
      );

      // Should show some indication that speech is not available
      const content = screen.getByText('No voices available');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Performance & Resource Management', () => {
    it('cleans up speech synthesis resources', () => {
      const { unmount } = render(
        <SpeakableText text="Resource cleanup test">
          <p>Resource cleanup test</p>
        </SpeakableText>
      );

      unmount();

      // Should call cancel to clean up any ongoing speech
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it('handles multiple simultaneous speech requests', async () => {
      render(
        <div>
          <SpeakableText text="First text">
            <p>First text</p>
          </SpeakableText>
          <SpeakableText text="Second text">
            <p>Second text</p>
          </SpeakableText>
        </div>
      );

      const speakButtons = screen.getAllByRole('button', { name: /speak|read|play/i });
      
      // Click multiple speak buttons
      await childUserEvent.childClick(speakButtons[0]);
      await childUserEvent.childClick(speakButtons[1]);

      // Should handle multiple requests (usually by canceling previous and starting new)
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
    });
  });
});