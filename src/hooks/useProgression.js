import { useMemo, useState } from 'react';
import { STANDARDS } from '../constants/music';
import { createFifthsProgression, createHarmonyProgression, parseChordList } from '../lib/musicTheory';
import { fetchChordChart } from '../services/chartApi';

export function useProgression() {
  const [mode, setMode] = useState('harmony');
  const [keyName, setKeyName] = useState('C');
  const [difficulty, setDifficulty] = useState('Easy');
  const [fifthsQuality, setFifthsQuality] = useState('maj7');
  const [fifthsDirection, setFifthsDirection] = useState('resolving');
  const [spelling, setSpelling] = useState('auto');
  const [customText, setCustomText] = useState('Dm7, G7, Cmaj7, A7alt');
  const [standard, setStandard] = useState(Object.keys(STANDARDS)[0]);
  const [remoteChanges, setRemoteChanges] = useState([]);
  const [chartQuery, setChartQuery] = useState('Autumn Leaves');
  const [endpoint, setEndpoint] = useState('');
  const [apiStatus, setApiStatus] = useState('Local charts ready; optionally connect a JSON chart source.');

  const changes = useMemo(() => {
    if (mode === 'harmony') return createHarmonyProgression(keyName, difficulty, spelling);
    if (mode === 'fifths') return createFifthsProgression(keyName, fifthsQuality, fifthsDirection, spelling);
    if (mode === 'custom') return parseChordList(customText).length ? parseChordList(customText) : ['Cmaj7'];
    return remoteChanges.length ? remoteChanges : STANDARDS[standard];
  }, [mode, keyName, difficulty, fifthsQuality, fifthsDirection, spelling, customText, standard, remoteChanges]);

  async function loadChart() {
    if (!endpoint.trim()) {
      const localChart = Object.keys(STANDARDS).find(title => title.toLowerCase().includes(chartQuery.toLowerCase())) || Object.keys(STANDARDS)[0];
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
      setApiStatus(error.message);
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
