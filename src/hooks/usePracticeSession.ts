import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { displayChordSymbol, isAcceptedVoicing, mod, parseChord, unique, voicedNotes } from '../lib/musicTheory';
import type { Chord, Note, InversionMode, SpellingPreference, ValidationMode } from '../types';

interface PracticeSessionProps {
  changes: string[];
  spelling: SpellingPreference;
  voicing: string;
  customFormula: string;
  validation: ValidationMode;
  autoAdvance: boolean;
  inversions: number[];
  inversionMode: InversionMode;
}

export interface PracticeSession {
  index: number;
  inversionNumber: number;
  chord: Chord | null;
  notes: Note[];
  targetNotes: number[];
  heldNotes: number[];
  feedback: string;
  correct: boolean;
  goTo: (pos: number) => void;
  next: () => void;
  previous: () => void;
  noteOn: (midi: number) => void;
  noteOff: (midi: number) => void;
  notify: (msg: string) => void;
}

export function usePracticeSession({
  changes,
  spelling,
  voicing,
  customFormula,
  validation,
  autoAdvance,
  inversions,
  inversionMode,
}: PracticeSessionProps): PracticeSession {
  const invList = inversions?.length ? inversions : [0];
  const acrossChanges = inversionMode === 'across';
  const [stepIndex, setStepIndex] = useState(0);
  const [heldNotes, setHeldNotes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('Connect a keyboard or turn pages to study.');
  const [correct, setCorrect] = useState(false);
  const acceptedRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = acrossChanges ? changes.length : changes.length * invList.length;
  const chordIndex = acrossChanges
    ? stepIndex % changes.length
    : Math.floor(stepIndex / invList.length) % changes.length;
  const inversionNumber = invList[stepIndex % invList.length];

  const changesKey = changes.join('|');
  const chord = useMemo(
    () => parseChord(changes[chordIndex]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changesKey, chordIndex],
  );
  const notes = useMemo(
    () => (chord ? voicedNotes(chord, voicing as Parameters<typeof voicedNotes>[1], customFormula, inversionNumber) : []),
    [chord, voicing, customFormula, inversionNumber],
  );
  const targetNotes = notes.map(n => n.midi);

  const goToStep = useCallback((step: number) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    acceptedRef.current = '';
    setHeldNotes([]);
    setCorrect(false);
    setFeedback('Play the written voicing.');
    setStepIndex(((step % total) + total) % total);
  }, [total]);

  const goTo = useCallback((chordPosition: number) => {
    const pos = ((chordPosition % changes.length) + changes.length) % changes.length;
    goToStep(acrossChanges ? pos : pos * invList.length);
  }, [changes.length, invList.length, acrossChanges, goToStep]);

  const next = useCallback(() => goToStep(stepIndex + 1), [goToStep, stepIndex]);
  const previous = useCallback(() => goToStep(stepIndex - 1), [goToStep, stepIndex]);

  const inversionsKey = invList.join(',');
  useEffect(() => {
    goTo(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changesKey, voicing, customFormula, inversionsKey, inversionMode]);

  useEffect(() => {
    if (!heldNotes.length || !chord) return;
    if (!isAcceptedVoicing(heldNotes, targetNotes, validation)) {
      const playedPitchClasses = unique(heldNotes.map(mod));
      const expectedPitchClasses = unique(targetNotes.map(mod));
      const matched = playedPitchClasses.filter(pc => expectedPitchClasses.includes(pc)).length;
      setCorrect(false);
      setFeedback(matched ? `${matched}/${expectedPitchClasses.length} target colours found — keep shaping it.` : 'Those notes do not match yet.');
      return;
    }
    setCorrect(true);
    setFeedback(`Correct — ${displayChordSymbol(chord, spelling)} accepted.`);
    const signature = `${stepIndex}-${chord.symbol}`;
    if (autoAdvance && acceptedRef.current !== signature) {
      acceptedRef.current = signature;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(next, 650);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heldNotes, targetNotes.join('-'), validation, autoAdvance, chord, spelling, stepIndex, next]);

  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const noteOn = useCallback((midi: number) => {
    setHeldNotes(prev => unique([...prev, midi]).sort((a, b) => a - b));
  }, []);
  const noteOff = useCallback((midi: number) => {
    setHeldNotes(prev => prev.filter(n => n !== midi));
  }, []);

  return {
    index: chordIndex,
    inversionNumber,
    chord,
    notes,
    targetNotes,
    heldNotes,
    feedback,
    correct,
    goTo,
    next,
    previous,
    noteOn,
    noteOff,
    notify: setFeedback,
  };
}
