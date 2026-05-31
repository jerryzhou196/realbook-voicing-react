import { useEffect, useRef, useState } from 'react';
import { rootAt } from '../lib/musicTheory';

export function useBackingTrack({ chord, onMessage }) {
  const [drumsEnabled, setDrumsEnabled] = useState(false);
  const [bassEnabled, setBassEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(76);
  const [fileName, setFileName] = useState('No drum loop loaded');
  const audioRef = useRef(null);
  const audioUrlRef = useRef('');
  const contextRef = useRef(null);
  const intervalRef = useRef(null);

  async function getContext() {
    if (!contextRef.current) contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    await contextRef.current.resume();
    return contextRef.current;
  }
  async function pulseBass() {
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
    oscillator.connect(filter).connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.32);
  }
  function loadDrumLoop(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = URL.createObjectURL(file);
    audioRef.current.src = audioUrlRef.current;
    setFileName(file.name);
    setDrumsEnabled(true);
  }
  async function togglePlayback() {
    if (playing) {
      setPlaying(false);
      clearInterval(intervalRef.current);
      audioRef.current?.pause();
      return;
    }
    await getContext();
    setPlaying(true);
    if (drumsEnabled && audioRef.current?.src) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => onMessage('Press PLAY again to allow loop audio.'));
    }
    pulseBass();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(pulseBass, 60000 / bpm);
  }

  useEffect(() => {
    if (!playing) return undefined;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(pulseBass, 60000 / bpm);
    return () => clearInterval(intervalRef.current);
  }, [playing, bpm, bassEnabled, chord?.symbol]);
  useEffect(() => () => {
    clearInterval(intervalRef.current);
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
