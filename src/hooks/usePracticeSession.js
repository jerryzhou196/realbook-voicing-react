import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { displayChordSymbol, isAcceptedVoicing, mod, parseChord, unique, voicedNotes } from '../lib/musicTheory';

export function usePracticeSession({ changes, spelling, voicing, customFormula, validation, autoAdvance, inversions, inversionMode }) {
  const invList = inversions?.length ? inversions : [0];
  const acrossChanges = inversionMode === 'across';
  const [stepIndex, setStepIndex] = useState(0);
  const [heldNotes, setHeldNotes] = useState([]);
  const [feedback, setFeedback] = useState('Connect a keyboard or turn pages to study.');
  const [correct, setCorrect] = useState(false);
  const acceptedRef = useRef('');
  const timerRef = useRef(null);

  const total = acrossChanges ? changes.length : changes.length * invList.length;
  const chordIndex = acrossChanges
    ? stepIndex % changes.length
    : Math.floor(stepIndex / invList.length) % changes.length;
  const inversionNumber = invList[stepIndex % invList.length];

  const changesKey = changes.join('|');
  const chord = useMemo(() => parseChord(changes[chordIndex]), [changesKey, chordIndex]);
  const notes = useMemo(() => voicedNotes(chord, voicing, customFormula, inversionNumber), [chord, voicing, customFormula, inversionNumber]);
  const targetNotes = notes.map(note => note.midi);

  const goToStep = useCallback((step) => {
    clearTimeout(timerRef.current);
    acceptedRef.current = '';
    setHeldNotes([]);
    setCorrect(false);
    setFeedback('Play the written voicing.');
    setStepIndex(((step % total) + total) % total);
  }, [total]);

  const goTo = useCallback((chordPosition) => {
    const pos = ((chordPosition % changes.length) + changes.length) % changes.length;
    goToStep(acrossChanges ? pos : pos * invList.length);
  }, [changes.length, invList.length, acrossChanges, goToStep]);

  const next = useCallback(() => goToStep(stepIndex + 1), [goToStep, stepIndex]);
  const previous = useCallback(() => goToStep(stepIndex - 1), [goToStep, stepIndex]);

  const inversionsKey = invList.join(',');
  useEffect(() => {
    goTo(0);
  }, [changesKey, voicing, customFormula, inversionsKey, inversionMode, goTo]);

  useEffect(() => {
    if (!heldNotes.length || !chord) return;
    if (!isAcceptedVoicing(heldNotes, targetNotes, validation)) {
      const playedPitchClasses = unique(heldNotes.map(mod));
      const expectedPitchClasses = unique(targetNotes.map(mod));
      const matched = playedPitchClasses.filter(pitchClass => expectedPitchClasses.includes(pitchClass)).length;
      setCorrect(false);
      setFeedback(matched ? `${matched}/${expectedPitchClasses.length} target colours found — keep shaping it.` : 'Those notes do not match yet.');
      return;
    }
    setCorrect(true);
    setFeedback(`Correct — ${displayChordSymbol(chord, spelling)} accepted.`);
    const signature = `${stepIndex}-${chord.symbol}`;
    if (autoAdvance && acceptedRef.current !== signature) {
      acceptedRef.current = signature;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(next, 650);
    }
  }, [heldNotes, targetNotes.join('-'), validation, autoAdvance, chord, spelling, stepIndex, next]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const noteOn = useCallback(midi => {
    setHeldNotes(previous => unique([...previous, midi]).sort((left, right) => left - right));
  }, []);
  const noteOff = useCallback(midi => {
    setHeldNotes(previous => previous.filter(note => note !== midi));
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
