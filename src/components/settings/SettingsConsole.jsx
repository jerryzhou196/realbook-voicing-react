import { ChangesPanel } from './ChangesPanel';
import { MidiPanel } from './MidiPanel';
import { RhythmPanel } from './RhythmPanel';
import { VoicingPanel } from './VoicingPanel';

const MODES = [
  { id: 'harmony', label: 'Harmony' },
  { id: 'fifths', label: 'Fifths' },
  { id: 'standard', label: 'Standard' },
  { id: 'custom', label: 'Custom' },
];

export function SettingsConsole({ progression, session, voicingConfig, midi, backing, validationConfig }) {
  return <aside className="rounded-xl bg-gradient-to-br from-[#49382b] to-[#2b2119] p-4 text-[#eadaba] shadow-[inset_0_0_0_3px_#604b39,inset_0_0_0_5px_#211a14,11px_16px_25px_rgba(0,0,0,.38)]">
    <header className="mb-3 border-b border-[#e7d2a72e] px-2 pb-3"><h2 className="text-xl tracking-[.06em]">SESSION SETUP</h2><p className="text-[10px] tracking-[.2em] opacity-60">REAL BOOK PRACTICE CONSOLE</p></header>
    <nav className="mb-3 grid max-w-[660px] grid-cols-4 gap-2 px-1">{MODES.map(mode => <button key={mode.id} onClick={() => progression.setMode(mode.id)} className={`rounded-md border px-3 py-2.5 text-xs ${progression.mode === mode.id ? 'border-parchment bg-parchment text-[#30251b]' : 'border-[#654f3c] bg-[#291f18] text-[#d4bd93]'}`}>{mode.label}</button>)}</nav>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <ChangesPanel progression={progression} session={session} />
      <VoicingPanel {...voicingConfig} />
      <MidiPanel midi={midi} {...validationConfig} />
      <RhythmPanel backing={backing} />
    </div>
  </aside>;
}
