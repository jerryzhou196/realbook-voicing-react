export type SpellingPreference = 'auto' | 'flats' | 'sharps';
export type SpellingStyle = 'flats' | 'sharps';
export type ValidationMode = 'exact' | 'tones';
export type InversionMode = 'per-chord' | 'across';
export type ProgressionMode = 'harmony' | 'fifths' | 'standard' | 'custom';
export type FifthsDirection = 'resolving' | 'clockwise';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type VoicingId = 'ascending' | 'shell' | 'rootlessA' | 'rootlessB' | 'kenny' | 'spread' | 'custom';

export interface Chord {
  root: string;
  pitchClass: number;
  suffix: string;
  symbol: string;
}

export interface Note {
  midi: number;
  degree: string;
  hand: 'LH' | 'RH';
}

export interface WrittenNote {
  name: string;
  accidental: string;
  label: string;
}
