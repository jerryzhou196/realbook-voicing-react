import { useEffect, useMemo, useState } from 'react';
import { PracticePage } from './components/layout/PracticePage';
import { SettingsConsole } from './components/settings/SettingsConsole';
import { glyphName } from './lib/musicTheory';
import { useBackingTrack } from './hooks/useBackingTrack';
import { useMidiInput } from './hooks/useMidiInput';
import { usePracticeSession } from './hooks/usePracticeSession';
import { useProgression } from './hooks/useProgression';
import type { InversionMode, VoicingId } from './types';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const progression = useProgression();
  const [voicing, setVoicing] = useState<VoicingId>('ascending');
  const [customFormula, setCustomFormula] = useState('1, 5, 13, 7, 3');
  const [labels, setLabels] = useState(true);
  const [inversions, setInversions] = useState<number[]>(() => loadStored('realbook-inversions', [0]));
  const [inversionMode, setInversionMode] = useState<InversionMode>(() => loadStored('realbook-inversion-mode', 'per-chord'));
  const [validation, setValidation] = useState<'exact' | 'tones'>('exact');
  const [autoAdvance, setAutoAdvance] = useState(true);

  const session = usePracticeSession({
    changes: progression.changes,
    spelling: progression.spelling,
    voicing,
    customFormula,
    validation,
    autoAdvance,
    inversions,
    inversionMode,
  });

  const noteCount = session.notes.length || 5;

  useEffect(() => {
    setInversions(prev => {
      const valid = prev.filter(i => i < noteCount);
      return valid.length ? valid : [0];
    });
  }, [noteCount]);

  useEffect(() => { localStorage.setItem('realbook-inversions', JSON.stringify(inversions)); }, [inversions]);
  useEffect(() => { localStorage.setItem('realbook-inversion-mode', inversionMode); }, [inversionMode]);

  const midi = useMidiInput({ onNoteOn: session.noteOn, onNoteOff: session.noteOff });
  const backing = useBackingTrack({ chord: session.chord, onMessage: session.notify });

  const title = useMemo(() => {
    if (progression.mode === 'harmony') return `${glyphName(progression.keyName)} harmonic study`;
    if (progression.mode === 'fifths') return `${glyphName(progression.keyName)} circle of fifths`;
    if (progression.mode === 'standard') return progression.standard;
    return 'written changes';
  }, [progression.mode, progression.keyName, progression.standard]);

  return (
    <main className="min-h-screen p-3 md:p-5">
      <div className="mx-auto grid max-w-[1480px] gap-5">
        <PracticePage
          title={title}
          changes={progression.changes}
          session={session}
          voicing={voicing}
          spelling={progression.spelling}
          labels={labels}
          bpm={backing.bpm}
          inversions={inversions}
          inversionMode={inversionMode}
        />
        <SettingsConsole
          progression={progression}
          session={session}
          midi={midi}
          backing={backing}
          voicingConfig={{
            voicing, setVoicing,
            spelling: progression.spelling, setSpelling: progression.setSpelling,
            customFormula, setCustomFormula,
            labels, setLabels,
            inversions, setInversions,
            inversionMode, setInversionMode,
            noteCount,
          }}
          validationConfig={{ validation, setValidation, autoAdvance, setAutoAdvance }}
        />
      </div>
    </main>
  );
}
