import { useRef, useState } from 'react';
import { VOICING_OPTIONS } from '../../constants/music';
import { Field, Select, TextInput } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { Toggle } from '../ui/Toggle';

const INV_LABELS = ['Root', '1st', '2nd', '3rd', '4th', '5th'];

function InversionDndList({ inversions, setInversions, noteCount }) {
  const [dropTarget, setDropTarget] = useState(null);
  const dragFrom = useRef(null);

  const count = Math.max(noteCount, 1);
  const selectedSet = new Set(inversions);
  const available = Array.from({ length: count }, (_, i) => i).filter(i => !selectedSet.has(i));

  function onDragStart(e, listIndex) {
    dragFrom.current = listIndex;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, listIndex) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(listIndex);
  }

  function onDrop(e, listIndex) {
    e.preventDefault();
    const from = dragFrom.current;
    if (from !== null && from !== listIndex) {
      const next = [...inversions];
      const [item] = next.splice(from, 1);
      next.splice(listIndex, 0, item);
      setInversions(next);
    }
    dragFrom.current = null;
    setDropTarget(null);
  }

  function onDragEnd() {
    dragFrom.current = null;
    setDropTarget(null);
  }

  return (
    <div className="space-y-1.5">
      {/* Ordered drop zone */}
      <div
        className="flex min-h-[38px] flex-wrap gap-1.5 rounded-md border border-[#6b543f40] p-1.5"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          // Drop on empty area appends to end
          if (dragFrom.current !== null) {
            const from = dragFrom.current;
            const next = [...inversions];
            const [item] = next.splice(from, 1);
            next.push(item);
            setInversions(next);
            dragFrom.current = null;
            setDropTarget(null);
            e.stopPropagation();
          }
        }}
      >
        {inversions.length === 0 ? (
          <span className="self-center text-[10px] normal-case tracking-normal text-[#ceb78f] opacity-40">
            click below to add
          </span>
        ) : (
          inversions.map((inv, i) => (
            <div
              key={`sel-${inv}`}
              draggable
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => { e.stopPropagation(); onDrop(e, i); }}
              onDragEnd={onDragEnd}
              className={`flex cursor-grab select-none items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition active:cursor-grabbing ${
                dropTarget === i
                  ? 'border-[#d2ba8a] bg-[#d2ba8a20] text-[#d2ba8a]'
                  : 'border-parchment bg-parchment text-[#30251a]'
              }`}
            >
              <span className="pointer-events-none select-none text-[9px] opacity-40">⠿</span>
              {INV_LABELS[inv] ?? `${inv}th`}
              <button
                type="button"
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); setInversions(inversions.filter((_, idx) => idx !== i)); }}
                className="ml-0.5 text-[11px] font-bold leading-none opacity-40 hover:opacity-90"
                aria-label={`Remove ${INV_LABELS[inv] ?? inv}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Available (unselected) */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {available.map(inv => (
            <button
              key={`avail-${inv}`}
              type="button"
              onClick={() => setInversions([...inversions, inv])}
              className="rounded-full border border-[#d2ba8a4c] px-2.5 py-1 text-xs normal-case tracking-normal text-[#ceb78f] transition hover:border-[#d2ba8a]"
            >
              + {INV_LABELS[inv] ?? `${inv}th`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function VoicingPanel({ voicing, setVoicing, spelling, setSpelling, customFormula, setCustomFormula, labels, setLabels, inversions, setInversions, inversionMode, setInversionMode, noteCount }) {
  return <Panel title="Voicing Recipe">
    <Field label="Voicing"><Select value={voicing} onChange={e => setVoicing(e.target.value)}>{VOICING_OPTIONS.map(o => <option value={o.id} key={o.id}>{o.label}</option>)}</Select></Field>
    <Field label="Sharps / flats"><Select value={spelling} onChange={e => setSpelling(e.target.value)}><option value="auto">Auto by root</option><option value="flats">Prefer flats (♭)</option><option value="sharps">Prefer sharps (♯)</option></Select></Field>
    {voicing === 'custom' && <Field label="Intervals"><TextInput value={customFormula} onChange={e => setCustomFormula(e.target.value)} placeholder="1, 5, 13, 7, 3" /></Field>}
    <div className="mb-3">
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-[#cab38b]">Inversions</p>
      <InversionDndList inversions={inversions} setInversions={setInversions} noteCount={noteCount} />
    </div>
    {inversions.length > 1 && <Toggle label="Spread across changes" checked={inversionMode === 'across'} onChange={checked => setInversionMode(checked ? 'across' : 'per-chord')} />}
    <Toggle label="Label every written note" checked={labels} onChange={setLabels} />
  </Panel>;
}
