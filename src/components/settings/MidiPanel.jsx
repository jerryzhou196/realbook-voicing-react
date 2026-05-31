import { Field, Select } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { Toggle } from '../ui/Toggle';

export function MidiPanel({ midi, validation, setValidation, autoAdvance, setAutoAdvance }) {
  return <Panel title="MIDI Gate">
    <div className="mb-3 flex items-center gap-2 text-xs text-[#c9b18a]"><span className={`h-2.5 w-2.5 rounded-full ${midi.connected ? 'bg-[#80ab65] shadow-[0_0_8px_#80ab65]' : 'bg-[#90734e]'}`} />{midi.status}</div>
    <p className="mb-3 text-[10px] leading-relaxed text-[#ad9872]">Web MIDI usually requires Chrome or Edge on HTTPS or localhost.</p>
    <button onClick={midi.connect} className="mb-3 w-full rounded-md border border-[#bea371] bg-[#e6d1a3] px-3 py-2.5 text-xs text-[#31251a]">CONNECT MIDI KEYBOARD</button>
    {midi.inputs.length > 0 && <Field label="Input device"><Select value={midi.selectedInput} onChange={event => midi.setSelectedInput(event.target.value)}>{midi.inputs.map(input => <option value={input.id} key={input.id}>{input.name}</option>)}</Select></Field>}
    <Field label="Validation"><Select value={validation} onChange={event => setValidation(event.target.value)}><option value="exact">Exact voicing / register</option><option value="tones">Chord tones / any inversion</option></Select></Field>
    <Toggle label="Advance only on correct chord" checked={autoAdvance} onChange={setAutoAdvance} />
  </Panel>;
}
