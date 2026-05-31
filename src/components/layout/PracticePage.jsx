import { VOICING_OPTIONS } from '../../constants/music';
import { glyphName, writtenNote } from '../../lib/musicTheory';
import { GrandStaff } from '../score/GrandStaff';
import { PianoKeyboard } from '../score/PianoKeyboard';

const INVERSION_NAMES = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];
function inversionName(n) {
  return INVERSION_NAMES[n] ?? `${n}th inversion`;
}

function Stamp({ index, total }) {
  return <div className="flex h-24 w-24 shrink-0 rotate-[8deg] flex-col items-center justify-center rounded-full border-[3px] border-[#874b39] text-[#874b39] opacity-80"><span className="text-[9px] tracking-[0.16em]">CHANGES</span><strong className="text-3xl leading-none">{String(index + 1).padStart(2, '0')}</strong><span className="text-[10px]">of {String(total).padStart(2, '0')}</span></div>;
}

export function PracticePage({ title, changes, session, voicing, spelling, labels, bpm, inversions, inversionMode }) {
  const voicingLabel = VOICING_OPTIONS.find(option => option.id === voicing)?.label;
  const showInversion = inversions?.length > 1;
  return <section className="relative min-h-[76vh] overflow-hidden rounded-[10px_18px_14px_10px] bg-paper px-4 py-5 shadow-[inset_0_0_72px_rgba(87,54,25,.17),5px_7px_0_#baa77d,14px_20px_28px_rgba(0,0,0,.38)] sm:px-7">
    <div className="paper-grain pointer-events-none absolute inset-0 opacity-[.17] mix-blend-multiply" />
    <div className="relative z-10">
      <header className="flex justify-between gap-5 border-b-2 border-leather pb-4">
        <div><p className="text-[10px] tracking-[.24em]">POCKET PRACTICE EDITION · VOL. 01</p><h1 className="font-display text-5xl font-bold leading-none sm:text-6xl">The Voicing Book</h1><p className="mt-1 text-[11px] tracking-[.28em]">PIANO CHANGES &amp; COMPING STUDIES</p></div>
        <Stamp index={session.index} total={changes.length} />
      </header>
      <div className="my-4 flex flex-wrap items-baseline justify-between gap-3 font-display text-3xl">
        <strong>{title}</strong>
        <div className="flex flex-col items-end gap-0.5">
          <span>{voicingLabel}</span>
          {showInversion && <span className="text-base opacity-60">{inversionName(session.inversionNumber)}</span>}
        </div>
      </div>
      <div className="h-[min(52vh,590px)] min-h-[395px]"><GrandStaff chord={session.chord} notes={session.notes} spelling={spelling} bpm={bpm} labels={labels} /></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><p className={`font-display text-3xl ${session.correct ? 'text-[#406038]' : ''}`}>{session.correct ? '✓ ' : ''}{session.feedback}</p><p className="mt-1 text-[11px] tracking-[.1em] opacity-70">TARGET NOTES &nbsp; {session.notes.map(note => writtenNote(note, session.chord, spelling).label).join(' · ')}</p></div>
        <div className="flex gap-2"><button onClick={session.previous} className="rounded-md border border-[#6f5940] bg-[#e8d8ad] px-4 py-2.5 text-xs">← PREV</button><button onClick={session.next} className="rounded-md border border-leather bg-leather px-4 py-2.5 text-xs text-[#f2e5c3]">NEXT →</button></div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div><div className="mb-2 flex justify-between text-[10px] uppercase tracking-[.16em] opacity-65"><span>Keyboard monitor</span><span>gold = target · green = played</span></div><PianoKeyboard held={session.heldNotes} target={session.targetNotes} /></div>
        <p className="border-t border-dashed border-[#2c211459] pt-3 text-[11px] leading-relaxed opacity-75">The staff separates chord tones in ascending order for readability; play them simultaneously to pass. Exact Voicing checks the displayed register and pitch set. Chord Tones accepts inversions and doubled notes containing all requested colours.</p>
      </div>
    </div>
  </section>;
}
