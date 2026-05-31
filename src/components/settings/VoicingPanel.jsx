import { VOICING_OPTIONS } from '../../constants/music';
import { Field, Select, TextInput } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { Toggle } from '../ui/Toggle';

const INV_OPTIONS = [
  { value: 0, label: 'Root' },
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
];

function InversionChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1.5 text-xs normal-case tracking-normal transition ${active ? 'border-parchment bg-parchment text-[#30251a]' : 'border-[#d2ba8a4c] text-[#ceb78f] hover:border-[#d2ba8a]'}`}
    >
      {label}
    </button>
  );
}

export function VoicingPanel({ voicing, setVoicing, spelling, setSpelling, customFormula, setCustomFormula, labels, setLabels, inversions, setInversions, inversionMode, setInversionMode }) {
  function toggleInversion(value) {
    const next = inversions.includes(value)
      ? inversions.filter(v => v !== value)
      : [...inversions, value].sort((a, b) => a - b);
    if (next.length > 0) setInversions(next);
  }

  const multipleInversions = inversions.length > 1;

  return <Panel title="Voicing Recipe">
    <Field label="Voicing"><Select value={voicing} onChange={event => setVoicing(event.target.value)}>{VOICING_OPTIONS.map(option => <option value={option.id} key={option.id}>{option.label}</option>)}</Select></Field>
    <Field label="Sharps / flats"><Select value={spelling} onChange={event => setSpelling(event.target.value)}><option value="auto">Auto by root</option><option value="flats">Prefer flats (♭)</option><option value="sharps">Prefer sharps (♯)</option></Select></Field>
    {voicing === 'custom' && <Field label="Intervals"><TextInput value={customFormula} onChange={event => setCustomFormula(event.target.value)} placeholder="1, 5, 13, 7, 3" /></Field>}
    <Field label="Inversions">
      <div className="flex gap-1.5">
        {INV_OPTIONS.map(opt => (
          <InversionChip
            key={opt.value}
            label={opt.label}
            active={inversions.includes(opt.value)}
            onClick={() => toggleInversion(opt.value)}
          />
        ))}
      </div>
    </Field>
    {multipleInversions && <Toggle label="Spread across changes" checked={inversionMode === 'across'} onChange={checked => setInversionMode(checked ? 'across' : 'per-chord')} />}
    <Toggle label="Label every written note" checked={labels} onChange={setLabels} />
  </Panel>;
}
