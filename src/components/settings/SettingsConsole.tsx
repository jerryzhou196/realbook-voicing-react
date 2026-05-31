import { ChangesPanel } from './ChangesPanel';
import { MidiPanel } from './MidiPanel';
import { RhythmPanel } from './RhythmPanel';
import { VoicingPanel } from './VoicingPanel';
import type { ProgressionState } from '../../hooks/useProgression';
import type { PracticeSession } from '../../hooks/usePracticeSession';
import type { MidiInputState } from '../../hooks/useMidiInput';
import type { BackingTrackState } from '../../hooks/useBackingTrack';
import type { InversionMode, SpellingPreference, ValidationMode, VoicingId } from '../../types';

interface VoicingConfig {
  voicing: VoicingId;
  setVoicing: (v: VoicingId) => void;
  spelling: SpellingPreference;
  setSpelling: (s: SpellingPreference) => void;
  customFormula: string;
  setCustomFormula: (f: string) => void;
  labels: boolean;
  setLabels: (v: boolean) => void;
  inversions: number[];
  setInversions: (v: number[]) => void;
  inversionMode: InversionMode;
  setInversionMode: (m: InversionMode) => void;
  noteCount: number;
}
interface ValidationConfig {
  validation: ValidationMode;
  setValidation: (v: ValidationMode) => void;
  autoAdvance: boolean;
  setAutoAdvance: (v: boolean) => void;
}
interface SettingsConsoleProps {
  progression: ProgressionState;
  session: PracticeSession;
  voicingConfig: VoicingConfig;
  midi: MidiInputState;
  backing: BackingTrackState;
  validationConfig: ValidationConfig;
}

const MODES: { id: ProgressionState['mode']; label: string }[] = [
  { id: 'harmony', label: 'Harmony' },
  { id: 'fifths', label: 'Fifths' },
  { id: 'standard', label: 'Standard' },
  { id: 'custom', label: 'Custom' },
];

export function SettingsConsole({ progression, session: _session, voicingConfig, midi, backing, validationConfig }: SettingsConsoleProps) {
  return (
    <aside className="rounded-xl bg-gradient-to-br from-[#49382b] to-[#2b2119] p-4 text-[#eadaba] shadow-[inset_0_0_0_3px_#604b39,inset_0_0_0_5px_#211a14,11px_16px_25px_rgba(0,0,0,.38)]">
      <header className="mb-3 border-b border-[#e7d2a72e] px-2 pb-3">
        <h2 className="text-xl tracking-[.06em]">SESSION SETUP</h2>
        <p className="text-[10px] tracking-[.2em] opacity-60">REAL BOOK PRACTICE CONSOLE</p>
      </header>
      <nav className="mb-3 grid max-w-[660px] grid-cols-4 gap-2 px-1">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => progression.setMode(mode.id)}
            className={`rounded-md border px-3 py-2.5 text-xs ${progression.mode === mode.id ? 'border-parchment bg-parchment text-[#30251b]' : 'border-[#654f3c] bg-[#291f18] text-[#d4bd93]'}`}
          >
            {mode.label}
          </button>
        ))}
      </nav>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ChangesPanel progression={progression} />
        <VoicingPanel {...voicingConfig} />
        <MidiPanel midi={midi} {...validationConfig} />
        <RhythmPanel backing={backing} />
      </div>
    </aside>
  );
}
