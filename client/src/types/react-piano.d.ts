declare module 'react-piano' {
  import React from 'react';

  export interface MidiNumbers {
    fromNote(note: string): number;
  }

  export interface KeyboardShortcuts {
    create(config: {
      firstNote: number;
      lastNote: number;
      keyboardConfig: any;
    }): any;
    HOME_ROW: any;
  }

  export interface PianoProps {
    noteRange: {
      first: number;
      last: number;
    };
    playNote?: (midiNumber: number) => void;
    disabled?: boolean;
    keyboardShortcuts?: any;
    className?: string;
  }

  export const Piano: React.FC<PianoProps>;
  export const MidiNumbers: MidiNumbers;
  export const KeyboardShortcuts: KeyboardShortcuts;
}