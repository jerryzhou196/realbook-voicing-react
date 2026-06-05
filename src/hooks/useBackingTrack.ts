import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, RefObject } from 'react';
import { rootAt } from '../lib/musicTheory';
import { usePersistentState } from './usePersistentState';
import type { Chord } from '../types';

export interface BackingTrackState {
  drumsEnabled: boolean;
  setDrumsEnabled: (v: boolean) => void;
  bassEnabled: boolean;
  setBassEnabled: (v: boolean) => void;
  playing: boolean;
  bpm: number;
  setBpm: (v: number) => void;
  fileName: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  loadDrumLoop: (e: ChangeEvent<HTMLInputElement>) => void;
  togglePlayback: () => Promise<void>;
}

export function useBackingTrack({
  chord,
  onMessage,
}: {
  chord: Chord | null;
  onMessage: (msg: string) => void;
}): BackingTrackState {
  const [drumsEnabled, setDrumsEnabled] = useState(false);
  const [bassEnabled, setBassEnabled] = usePersistentState('realbook-bass-enabled', true);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = usePersistentState('realbook-bpm', 76);
  const [fileName, setFileName] = useState('No drum loop loaded');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef('');
  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function getContext(): Promise<AudioContext> {
    if (!contextRef.current) {
      const AC = window.AudioContext ?? window.webkitAudioContext!;
      contextRef.current = new AC();
    }
    await contextRef.current.resume();
    return contextRef.current;
  }

  async function pulseBass(): Promise<void> {
    if (!bassEnabled || !chord) return;
    const context = await getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const midi = rootAt(chord.pitchClass, 33);
    const now = context.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    filter.type = 'lowpass';
    filter.frequency.value = 430;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.32);
  }

  function loadDrumLoop(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = URL.createObjectURL(file);
    if (audioRef.current) audioRef.current.src = audioUrlRef.current;
    setFileName(file.name);
    setDrumsEnabled(true);
  }

  async function togglePlayback(): Promise<void> {
    if (playing) {
      setPlaying(false);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      audioRef.current?.pause();
      return;
    }
    await getContext();
    setPlaying(true);
    if (drumsEnabled && audioRef.current?.src) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => onMessage('Press PLAY again to allow loop audio.'));
    }
    void pulseBass();
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => void pulseBass(), 60000 / bpm);
  }

  useEffect(() => {
    if (!playing) return;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => void pulseBass(), 60000 / bpm);
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, bpm, bassEnabled, chord?.symbol]);

  useEffect(() => () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  return {
    drumsEnabled, setDrumsEnabled,
    bassEnabled, setBassEnabled,
    playing,
    bpm, setBpm,
    fileName,
    audioRef,
    loadDrumLoop,
    togglePlayback,
  };
}
