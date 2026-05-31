import type { VoicingId } from '../types';

export const FLAT_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const SHARP_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const KEY_OPTIONS = ['C', 'Db', 'C#', 'D', 'Eb', 'D#', 'E', 'F', 'Gb', 'F#', 'G', 'Ab', 'G#', 'A', 'Bb', 'A#', 'B'];

export const PITCH_CLASS: Record<string, number> = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4,
  F: 5, 'E#': 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10, B: 11,
};

export const NATURAL_PITCH_CLASS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const NATURAL_INDEX: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const INTERVALS: Record<string, number> = {
  '1': 0, b2: 1, '2': 2, b3: 3, '3': 4, '4': 5, b5: 6, '5': 7,
  '#5': 8, '6': 9, bb7: 9, b7: 10, '7': 11, b9: 13, '9': 14,
  '#9': 15, '11': 17, '#11': 18, b13: 20, '13': 21,
};

export interface VoicingOption {
  id: VoicingId;
  label: string;
}

export const VOICING_OPTIONS: VoicingOption[] = [
  { id: 'ascending', label: 'Ascending tertian split' },
  { id: 'shell', label: 'Shell + colour' },
  { id: 'rootlessA', label: 'Rootless A' },
  { id: 'rootlessB', label: 'Rootless B' },
  { id: 'kenny', label: 'Kenny Barron spread' },
  { id: 'spread', label: '1 · 5 · 13 · 7 · 3' },
  { id: 'custom', label: 'Custom formula' },
];

export const STANDARDS: Record<string, string[]> = {
  'Autumn Leaves — study form': ['Cm7', 'F7', 'Bbmaj7', 'Ebmaj7', 'Am7b5', 'D7alt', 'GmMaj7', 'Gm7'],
  'Blue Bossa — study form': ['Cm7', 'Fm7', 'Dm7b5', 'G7alt', 'Cm7', 'Ebm7', 'Ab7', 'Dbmaj7', 'Dm7b5', 'G7alt', 'Cm7'],
  'Rhythm changes — bridge': ['D7', 'D7', 'G7', 'G7', 'C7', 'C7', 'F7', 'F7'],
  'Jazz blues in F': ['F7', 'Bb7', 'F7', 'Cm7', 'F7', 'Bb7', 'Bdim7', 'F7', 'D7alt', 'Gm7', 'C7', 'F7'],
};
