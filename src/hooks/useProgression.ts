import { useMemo, useState } from 'react';
import { STANDARDS } from '../constants/music';
import { createFifthsProgression, createHarmonyProgression, parseChordList } from '../lib/musicTheory';
import { fetchChordChart } from '../services/chartApi';
import type { Difficulty, FifthsDirection, ProgressionMode, SpellingPreference } from '../types';

export interface ProgressionState {
  changes: string[];
  mode: ProgressionMode;
  setMode: (m: ProgressionMode) => void;
  keyName: string;
  setKeyName: (k: string) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  fifthsQuality: string;
  setFifthsQuality: (q: string) => void;
  fifthsDirection: FifthsDirection;
  setFifthsDirection: (d: FifthsDirection) => void;
  spelling: SpellingPreference;
  setSpelling: (s: SpellingPreference) => void;
  customText: string;
  setCustomText: (t: string) => void;
  standard: string;
  setStandard: (s: string) => void;
  clearRemoteChanges: () => void;
  chartQuery: string;
  setChartQuery: (q: string) => void;
  endpoint: string;
  setEndpoint: (e: string) => void;
  apiStatus: string;
  loadChart: () => Promise<void>;
}

export function useProgression(): ProgressionState {
  const [mode, setMode] = useState<ProgressionMode>('harmony');
  const [keyName, setKeyName] = useState('C');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [fifthsQuality, setFifthsQuality] = useState('maj7');
  const [fifthsDirection, setFifthsDirection] = useState<FifthsDirection>('resolving');
  const [spelling, setSpelling] = useState<SpellingPreference>('auto');
  const [customText, setCustomText] = useState('Dm7, G7, Cmaj7, A7alt');
  const [standard, setStandard] = useState(Object.keys(STANDARDS)[0]);
  const [remoteChanges, setRemoteChanges] = useState<string[]>([]);
  const [chartQuery, setChartQuery] = useState('Autumn Leaves');
  const [endpoint, setEndpoint] = useState('');
  const [apiStatus, setApiStatus] = useState('Local charts ready; optionally connect a JSON chart source.');

  const changes = useMemo(() => {
    if (mode === 'harmony') return createHarmonyProgression(keyName, difficulty, spelling);
    if (mode === 'fifths') return createFifthsProgression(keyName, fifthsQuality, fifthsDirection, spelling);
    if (mode === 'custom') return parseChordList(customText).length ? parseChordList(customText) : ['Cmaj7'];
    return remoteChanges.length ? remoteChanges : STANDARDS[standard];
  }, [mode, keyName, difficulty, fifthsQuality, fifthsDirection, spelling, customText, standard, remoteChanges]);

  async function loadChart(): Promise<void> {
    if (!endpoint.trim()) {
      const localChart = Object.keys(STANDARDS).find(t => t.toLowerCase().includes(chartQuery.toLowerCase())) ?? Object.keys(STANDARDS)[0];
      setStandard(localChart);
      setRemoteChanges([]);
      setApiStatus(`Loaded local study chart: ${localChart}`);
      return;
    }
    setApiStatus('Loading remote chart…');
    try {
      const downloadedChanges = await fetchChordChart(endpoint, chartQuery);
      setRemoteChanges(downloadedChanges);
      setApiStatus(`Fetched ${downloadedChanges.length} chord changes.`);
    } catch (error) {
      setApiStatus((error as Error).message);
    }
  }

  return {
    changes,
    mode, setMode,
    keyName, setKeyName,
    difficulty, setDifficulty,
    fifthsQuality, setFifthsQuality,
    fifthsDirection, setFifthsDirection,
    spelling, setSpelling,
    customText, setCustomText,
    standard, setStandard,
    clearRemoteChanges: () => setRemoteChanges([]),
    chartQuery, setChartQuery,
    endpoint, setEndpoint,
    apiStatus,
    loadChart,
  };
}
